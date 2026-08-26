import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import ts from "typescript"

async function loadTypeScriptModule(relativePath, transform = (output) => output) {
	const sourceUrl = new URL(`../${relativePath}`, import.meta.url)
	const source = await readFile(sourceUrl, "utf8")
	const { outputText } = ts.transpileModule(source, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.ESNext,
		},
		fileName: sourceUrl.pathname,
	})
	const transformed = transform(outputText)
	return import(`data:text/javascript;base64,${Buffer.from(transformed).toString("base64")}`)
}

const shaderModule = await loadTypeScriptModule("src/LenticularShader.ts")
const configModule = await loadTypeScriptModule("src/LookingGlassConfig.ts", (output) =>
	output.replace('import * as HoloPlayCore from "holoplay-core";', "const HoloPlayCore = { Client: class Client {} };"),
)

const { createLenticularShaderSource, MAX_SUBPIXEL_CELLS } = shaderModule
const { LookingGlassConfig } = configModule

function shaderConfig(overrides = {}) {
	return {
		numViews: 48,
		framebufferWidth: 4096,
		framebufferHeight: 4096,
		quiltWidth: 8,
		quiltHeight: 6,
		calibration: {
			screenW: { value: 3840 },
			screenH: { value: 2160 },
			subpixelCells: [],
		},
		filterMode: 2,
		pitch: 45,
		tilt: -0.2,
		center: 0.5,
		subp: 0.0001,
		focus: 0,
		viewDimming: false,
		filterEnd: 0.05,
		filterSize: 0.15,
		gaussianSigma: 0.01,
		edgeThreshold: 0.01,
		subpixelMode: 0,
		...overrides,
	}
}

test("shader preserves Bridge cell mappings and WebGL framebuffer orientation", () => {
	const sources = Array.from({ length: 5 }, (_, mode) => createLenticularShaderSource(shaderConfig({ subpixelMode: mode })))
	const source = sources[0]

	sources.forEach((modeSource, mode) => assert.match(modeSource, new RegExp(`const int cellPatternType = ${mode};`)))
	assert.match(source, /cell = yPos % 4;/)
	assert.match(source, /cell = \(yPos \+ offset\) % 4;/)
	assert.match(source, /cell = xPos % 2;/)
	assert.match(source, /return cell % safeSubpixelCellCount;/)
	assert.doesNotMatch(source, /quilt_uv\.y = 1\.0 - quilt_uv\.y/)
})

test("shader sanitizes filters and prevents zero-weight division", () => {
	const source = createLenticularShaderSource(
		shaderConfig({ gaussianSigma: -0.5, filterEnd: 2, filterSize: -3, edgeThreshold: Number.NaN }),
	)

	assert.match(source, /const float gaussian_sigma = 0\.5000000000;/)
	assert.match(source, /const float filter_end = 0\.4999990000;/)
	assert.match(source, /const float filter_size = 0\.000001000000000;/)
	assert.match(source, /const float edgeThreshold = 0\.01000000000;/)
	assert.match(source, /vec3 validWeight = step\(minWeight, totalWeight\);/)
	assert.match(source, /mix\(centerColor\.rgb, blendedColor, validWeight\)/)
	assert.match(source, /mix\(nearestColor, outputColor\.rgb \/ max\(totalWeight, minWeight\), validWeight\)/)
})

test("view dimming uses ordered, symmetric fade ramps", () => {
	const source = createLenticularShaderSource(shaderConfig({ viewDimming: true }))

	assert.match(source, /lowerFade = smoothstep\(filter_end, fadeEnd1, views\)/)
	assert.match(source, /upperFade = vec3\(1\.0\) - smoothstep\(fullColorEnd, fadeEnd2, views\)/)
	assert.match(source, /return min\(lowerFade, upperFade\)/)
	assert.doesNotMatch(source, /smoothstep\(1\.0, fadeEnd2, views\)/)
})

test("shader caps calibration cells at the uniform array capacity", () => {
	const cells = Array.from({ length: MAX_SUBPIXEL_CELLS + 5 }, () => ({}))
	const source = createLenticularShaderSource(
		shaderConfig({ calibration: { screenW: { value: 3840 }, screenH: { value: 2160 }, subpixelCells: cells } }),
	)

	assert.match(source, new RegExp(`const int subpixelCellCount = ${MAX_SUBPIXEL_CELLS};`))
})

test("shader handles every filter mode, empty cells, a single tile, and non-finite optics", () => {
	for (let mode = 0; mode <= 3; mode += 1) {
		assert.match(createLenticularShaderSource(shaderConfig({ filterMode: mode })), new RegExp(`const int filter_mode = ${mode};`))
	}

	const source = createLenticularShaderSource(
		shaderConfig({
			numViews: 1,
			quiltWidth: 1,
			quiltHeight: 1,
			pitch: Number.POSITIVE_INFINITY,
			tilt: Number.NaN,
		}),
	)
	assert.match(source, /const float tileCount = 1\.000000000;/)
	assert.match(source, /const int subpixelCellCount = 0;/)
	assert.match(source, /const float pitch = 0\.0;/)
	assert.match(source, /const float slope = 0\.0;/)
})

test("layer refreshes subpixel uniforms even when shader text is unchanged", async () => {
	const source = await readFile(new URL("../src/LookingGlassXRWebGLLayer.ts", import.meta.url), "utf8")

	assert.match(source, /gl\.texParameteri\(gl\.TEXTURE_2D, gl\.TEXTURE_WRAP_S, gl\.CLAMP_TO_EDGE\)/)
	assert.match(source, /gl\.texParameteri\(gl\.TEXTURE_2D, gl\.TEXTURE_WRAP_T, gl\.CLAMP_TO_EDGE\)/)
	assert.doesNotMatch(source, /if \(fsSource === lastGeneratedFSSource\) return/)
	assert.match(
		source,
		/if \(fsSource !== lastGeneratedFSSource\) \{[\s\S]*?lastGeneratedFSSource = fsSource[\s\S]*?\}[\s\S]*?gl\.uniform1fv\(u_subpixelCells, subpixelUniformData\)/,
	)
})

test("subpixel offsets are normalized without mutating calibration", () => {
	const config = new LookingGlassConfig()
	const cell = { ROffsetX: 384, ROffsetY: 216, GOffsetX: 192, GOffsetY: 108, BOffsetX: 96, BOffsetY: 54 }
	config.calibration = {
		screenW: { value: 3840 },
		screenH: { value: 2160 },
		subpixelCells: [cell],
	}

	const expected = Array.from(new Float32Array([0.1, 0.1, 0.05, 0.05, 0.025, 0.025]))
	assert.deepEqual(Array.from(config.subpixelCells), expected)
	assert.deepEqual(Array.from(config.subpixelCells), expected)
	assert.deepEqual(cell, { ROffsetX: 384, ROffsetY: 216, GOffsetX: 192, GOffsetY: 108, BOffsetX: 96, BOffsetY: 54 })
})

test("center phase matches Bridge for portrait devices and horizontal flips", () => {
	const legacyPortrait = new LookingGlassConfig()
	legacyPortrait.calibration = {
		serial: "LKG-P-test",
		screenW: { value: 1536 },
		screenH: { value: 2048 },
		center: { value: 0.25 },
	}
	assert.equal(legacyPortrait.center, 0.25)

	const oledPortrait = new LookingGlassConfig()
	oledPortrait.calibration = {
		serial: "LKG-H-test",
		screenW: { value: 1536 },
		screenH: { value: 2048 },
		center: { value: 0.25 },
	}
	assert.equal(oledPortrait.center, 0.25)

	oledPortrait.calibration = { flipImageX: { value: 1 } }
	assert.equal(oledPortrait.center, 0.75)

	const spatialPortrait = new LookingGlassConfig()
	spatialPortrait.calibration = {
		serial: "LKG-K-test",
		screenW: { value: 4320 },
		screenH: { value: 7680 },
		center: { value: 0.25 },
	}
	assert.equal(spatialPortrait.center, 0.25)
})

test("an explicit subpixel mode is not overwritten by calibration", () => {
	const automatic = new LookingGlassConfig()
	automatic.calibration = { CellPatternMode: { value: 3 } }
	assert.equal(automatic.subpixelMode, 3)

	const overridden = new LookingGlassConfig({ subpixelMode: 4 })
	overridden.calibration = { CellPatternMode: { value: 2 } }
	assert.equal(overridden.subpixelMode, 4)

	automatic.updateViewControls({ subpixelMode: 1 })
	automatic.calibration = { CellPatternMode: { value: 4 } }
	assert.equal(automatic.subpixelMode, 1)

	const constructorUndefined = new LookingGlassConfig({ subpixelMode: undefined })
	assert.equal(constructorUndefined.subpixelMode, 0)
	constructorUndefined.updateViewControls({ subpixelMode: undefined })
	constructorUndefined.calibration = { CellPatternMode: { value: 2 } }
	assert.equal(constructorUndefined.subpixelMode, 2)
})
