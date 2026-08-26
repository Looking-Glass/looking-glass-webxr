import { LookingGlassConfig } from "./LookingGlassConfig"

export const MAX_SUBPIXEL_CELLS = 16

function glslFloat(value: number) {
	if (!Number.isFinite(value)) {
		return "0.0"
	}

	const result = value.toPrecision(10)
	return result.includes(".") || result.includes("e") ? result : `${result}.0`
}

function glslInt(value: number) {
	if (!Number.isFinite(value)) {
		return "0"
	}

	return Math.round(value).toString()
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}

export function createLenticularShaderSource(cfg: LookingGlassConfig) {
	const tileCount = cfg.numViews
	const tileWidth = Math.floor(cfg.framebufferWidth / cfg.quiltWidth)
	const tileHeight = Math.floor(cfg.framebufferHeight / cfg.quiltHeight)
	const viewPortionX = (cfg.quiltWidth * tileWidth) / cfg.framebufferWidth
	const viewPortionY = (cfg.quiltHeight * tileHeight) / cfg.framebufferHeight
	const subpixelCellCount = Math.min(cfg.calibration.subpixelCells.length, MAX_SUBPIXEL_CELLS)
	const safeSubpixelCellCount = Math.max(subpixelCellCount, 1)
	const filterMode = clamp(Math.round(cfg.filterMode), 0, 3)
	const centerViewIndex = Math.floor(tileCount / 2)
	const rawFilterEnd = Number.isFinite(cfg.filterEnd) ? cfg.filterEnd : 0.05
	const filterEnd = clamp(rawFilterEnd, 0, 0.499999)
	const rawFilterSize = Number.isFinite(cfg.filterSize) ? cfg.filterSize : 0.15
	const filterSize = clamp(rawFilterSize, 0.000001, Math.max(0.000001, 0.5 - filterEnd))
	const rawGaussianSigma = Number.isFinite(cfg.gaussianSigma) ? cfg.gaussianSigma : 0.01
	const gaussianSigma = Math.max(Math.abs(rawGaussianSigma), 0.000001)
	const rawEdgeThreshold = Number.isFinite(cfg.edgeThreshold) ? cfg.edgeThreshold : 0.01
	const edgeThreshold = Math.max(rawEdgeThreshold, 0.000001)

	return `#version 300 es
precision highp float;

uniform int u_viewType;
uniform sampler2D u_texture;
in vec2 v_texcoord;
out vec4 color;

const int MAX_SUBPIXEL_CELLS = ${MAX_SUBPIXEL_CELLS};
uniform float subpixelData[6 * MAX_SUBPIXEL_CELLS];

const float pitch = ${glslFloat(cfg.pitch)};
const float slope = ${glslFloat(cfg.tilt)};
const float center = ${glslFloat(cfg.center)};
const float subpixelSize = ${glslFloat(cfg.subp)};
const float screenW = ${glslFloat(cfg.calibration.screenW.value)};
const float screenH = ${glslFloat(cfg.calibration.screenH.value)};
const float tileCount = ${glslFloat(tileCount)};
const vec2 viewPortion = vec2(${glslFloat(viewPortionX)}, ${glslFloat(viewPortionY)});
const vec4 tile = vec4(${glslFloat(cfg.quiltWidth)}, ${glslFloat(cfg.quiltHeight)}, ${glslFloat(tileCount)}, 0.0);
const float focus = ${glslFloat(cfg.focus * cfg.quiltWidth)};
const int subpixelCellCount = ${glslInt(subpixelCellCount)};
const int safeSubpixelCellCount = ${glslInt(safeSubpixelCellCount)};
const int filter_mode = ${glslInt(filterMode)};
const int cellPatternType = ${glslInt(cfg.subpixelMode)};
const int filter_edge = ${cfg.viewDimming ? 1 : 0};
const float filter_end = ${glslFloat(filterEnd)};
const float filter_size = ${glslFloat(filterSize)};
const float gaussian_sigma = ${glslFloat(gaussianSigma)};
const float edgeThreshold = ${glslFloat(edgeThreshold)};

int GetCellForPixel(vec2 screen_uv)
{
	// Keep these modes synchronized with LookingGlassBridge's
	// tools/glsl_converter/lent_lent.glsl cell-pattern mappings.
	int xPos = int(screen_uv.x * screenW);
	int yPos = int(screen_uv.y * screenH);
	int cell = 0;

	if(cellPatternType == 1)
	{
		if ((yPos % 2 == 0 && xPos % 2 == 0) || (yPos % 2 != 0 && xPos % 2 != 0)) {
			cell = 0;
		} else {
			cell = 1;
		}
	}
	else if(cellPatternType == 2)
	{
		cell = yPos % 4;
	}
	else if(cellPatternType == 3)
	{
		int offset = (xPos % 2) * 2;
		cell = (yPos + offset) % 4;
	}
	else if(cellPatternType == 4)
	{
		cell = xPos % 2;
	}

	return cell % safeSubpixelCellCount;
}

float GetPixelShift(float val, int subp, int axis, int cell)
{
	int index = cell * 6 + subp * 2 + axis;
	float offset = subpixelData[index];
	return val + offset;
}

vec3 GetSubpixelViews(vec2 screen_uv)
{
	vec3 views = vec3(0.0);

	if(subpixelCellCount <= 0)
	{
		views[0] = screen_uv.x + subpixelSize * 0.0;
		views[1] = screen_uv.x + subpixelSize * 1.0;
		views[2] = screen_uv.x + subpixelSize * 2.0;

		views[0] += screen_uv.y * slope;
		views[1] += screen_uv.y * slope;
		views[2] += screen_uv.y * slope;
	}
	else
	{
		int cell = GetCellForPixel(screen_uv);

		views[0] = GetPixelShift(screen_uv.x, 0, 0, cell);
		views[1] = GetPixelShift(screen_uv.x, 1, 0, cell);
		views[2] = GetPixelShift(screen_uv.x, 2, 0, cell);

		views[0] += GetPixelShift(screen_uv.y, 0, 1, cell) * slope;
		views[1] += GetPixelShift(screen_uv.y, 1, 1, cell) * slope;
		views[2] += GetPixelShift(screen_uv.y, 2, 1, cell) * slope;
	}

	views *= vec3(pitch);
	views -= vec3(center);
	views = vec3(1.0) - fract(views);
	views = clamp(views, vec3(0.00001), vec3(0.999999));

	return views;
}

vec2 GetQuiltCoordinates(vec2 tile_uv, int viewIndex)
{
	float view = clamp(float(viewIndex), 0.0, max(tileCount - 1.0, 0.0));
	float tx = tile.x - 0.00001;
	float tileXIndex = mod(view, tx);
	float tileYIndex = floor(view / tx);

	float quiltCoordU = ((tileXIndex + tile_uv.x) / tx) * viewPortion.x;
	float quiltCoordV = ((tileYIndex + tile_uv.y) / tile.y) * viewPortion.y;
	// The WebXR quilt is rendered into a WebGL framebuffer, so its texture
	// coordinates already use the bottom-left origin expected by sampling.
	return vec2(quiltCoordU, quiltCoordV);
}

vec4 GetViewsColors(vec2 tile_uv, vec3 views)
{
	vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

	for(int channel = 0; channel < 3; channel++)
	{
		int viewIndex = int(clamp(views[channel] * tileCount, 0.0, max(tileCount - 1.0, 0.0)));
		float viewDir = views[channel] * 2.0 - 1.0;
		vec2 focused_uv = tile_uv;
		focused_uv.x += viewDir * focus;

		vec2 quilt_uv = GetQuiltCoordinates(focused_uv, viewIndex);
		color[channel] = texture(u_texture, quilt_uv)[channel];
	}

	return color;
}

vec4 OldViewFiltering(vec2 tile_uv, vec3 views)
{
	vec3 viewIndicies = views * tileCount;
	float viewSpaceTileSize = 1.0 / tileCount;
	vec3 leftViews = views;
	vec3 rightViews = leftViews + viewSpaceTileSize;

	vec4 leftColor = GetViewsColors(tile_uv, leftViews);
	vec4 rightColor = GetViewsColors(tile_uv, rightViews);
	vec3 leftRightLerp = viewIndicies - floor(viewIndicies);

	return vec4(
		mix(leftColor.x, rightColor.x, leftRightLerp.x),
		mix(leftColor.y, rightColor.y, leftRightLerp.y),
		mix(leftColor.z, rightColor.z, leftRightLerp.z),
		1.0
	);
}

vec4 GaussianViewFiltering(vec2 tile_uv, vec3 views)
{
	float viewSpaceTileSize = 1.0 / tileCount;
	vec3 centerViews = views;
	vec3 leftViews = centerViews - viewSpaceTileSize;
	vec3 rightViews = centerViews + viewSpaceTileSize;

	vec4 centerColor = GetViewsColors(tile_uv, centerViews);
	vec4 leftColor = GetViewsColors(tile_uv, leftViews);
	vec4 rightColor = GetViewsColors(tile_uv, rightViews);

	vec3 centerSnappedViews = floor(centerViews * tileCount) / tileCount;
	vec3 leftSnappedViews = floor(leftViews * tileCount) / tileCount;
	vec3 rightSnappedViews = floor(rightViews * tileCount) / tileCount;

	float multiplier = 2.0 * gaussian_sigma * gaussian_sigma;
	vec3 centerDiff = views - centerSnappedViews;
	vec3 leftDiff = views - leftSnappedViews;
	vec3 rightDiff = views - rightSnappedViews;

	vec3 centerWeight = exp(-centerDiff * centerDiff / multiplier);
	vec3 leftWeight = exp(-leftDiff * leftDiff / multiplier);
	vec3 rightWeight = exp(-rightDiff * rightDiff / multiplier);
	vec3 totalWeight = centerWeight + leftWeight + rightWeight;
	const vec3 minWeight = vec3(1e-20);
	vec3 validWeight = step(minWeight, totalWeight);
	vec3 weightedColor = vec3(
		centerColor.r * centerWeight.x + leftColor.r * leftWeight.x + rightColor.r * rightWeight.x,
		centerColor.g * centerWeight.y + leftColor.g * leftWeight.y + rightColor.g * rightWeight.y,
		centerColor.b * centerWeight.z + leftColor.b * leftWeight.z + rightColor.b * rightWeight.z
	);
	vec3 blendedColor = weightedColor / max(totalWeight, minWeight);

	return vec4(mix(centerColor.rgb, blendedColor, validWeight), 1.0);
}

vec3 ComputeGaussianWeight(vec3 targetViews, vec3 sampledViews)
{
	float multiplier = 2.0 * gaussian_sigma * gaussian_sigma;
	vec3 diff = targetViews - sampledViews;
	return exp(-diff * diff / multiplier);
}

vec4 NRISViewFiltering(vec2 tile_uv, vec3 views, int n)
{
	float viewSpaceTileSize = 1.0 / tileCount;
	vec4 outputColor = vec4(0.0);
	vec3 totalWeight = vec3(0.0);
	vec3 nearestColor = vec3(0.0);

	for(int i = -n; i <= n; i++)
	{
		float offset = float(i) * viewSpaceTileSize;
		vec3 offsetViews = views + offset;
		vec4 sampleColor = GetViewsColors(tile_uv, offsetViews);
		vec3 snappedViews = floor(offsetViews * tileCount) / tileCount;
		vec3 weight = ComputeGaussianWeight(views, snappedViews);

		outputColor.rgb += sampleColor.rgb * weight;
		totalWeight += weight;
		if(i == 0)
		{
			nearestColor = sampleColor.rgb;
		}
	}

	const vec3 minWeight = vec3(1e-20);
	vec3 validWeight = step(minWeight, totalWeight);
	outputColor.rgb = mix(nearestColor, outputColor.rgb / max(totalWeight, minWeight), validWeight);
	outputColor.a = 1.0;

	return outputColor;
}

vec3 ViewDimming(vec3 views)
{
	float fadeEnd1 = filter_end + filter_size;
	float fullColorEnd = 1.0 - fadeEnd1;
	float fadeEnd2 = 1.0 - filter_end;

	vec3 lowerFade = smoothstep(filter_end, fadeEnd1, views);
	vec3 upperFade = vec3(1.0) - smoothstep(fullColorEnd, fadeEnd2, views);
	return min(lowerFade, upperFade);
}

float CalculateEdgeFade(vec2 tile_uv)
{
	float fade = min(smoothstep(0.0, edgeThreshold, tile_uv.x),
		smoothstep(0.0, edgeThreshold, 1.0 - tile_uv.x));
	fade *= min(smoothstep(0.0, edgeThreshold, tile_uv.y),
		smoothstep(0.0, edgeThreshold, 1.0 - tile_uv.y));
	return fade;
}

void main()
{
	if (u_viewType == 2) {
		color = texture(u_texture, v_texcoord);
		return;
	}

	if (u_viewType == 1) {
		color = texture(u_texture, GetQuiltCoordinates(v_texcoord, ${centerViewIndex}));
		return;
	}

	vec2 screen_uv = v_texcoord;
	vec2 tile_uv = v_texcoord;
	vec3 views = GetSubpixelViews(screen_uv);
	vec4 outputColor = vec4(0.0, 0.0, 0.0, 1.0);

	if(filter_mode == 0 || tileCount == 1.0)
	{
		outputColor = GetViewsColors(tile_uv, views);
	}
	else if(filter_mode == 1)
	{
		outputColor = OldViewFiltering(tile_uv, views);
	}
	else if(filter_mode == 2)
	{
		outputColor = GaussianViewFiltering(tile_uv, views);
	}
	else if(filter_mode == 3)
	{
		outputColor = NRISViewFiltering(tile_uv, views, 10);
	}

	if (filter_edge == 1)
	{
		outputColor.rgb *= ViewDimming(views);
	}

	float fade = CalculateEdgeFade(tile_uv);
	color = mix(vec4(0.0, 0.0, 0.0, 1.0), outputColor, fade);
}
`
}
