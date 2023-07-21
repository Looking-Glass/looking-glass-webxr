import { getLookingGlassConfig } from "./LookingGlassConfig"
import { LookingGlassMediaController } from "./LookingGlassMediaController"

//lkgCanvas is stored in the Looking Glass config after being created. 
export function initLookingGlassControlGUI() {
	const cfg = getLookingGlassConfig()
	console.log(cfg, 'for debugging purposes')
	if (cfg.lkgCanvas == null) {
	console.warn('window placement called without a valid XR Session!')
	}
	else {
		const styleElement = document.createElement("style")
		document.head.appendChild(styleElement)
		styleElement.sheet?.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }")
	
		const c = document.createElement("div")
		c.id = "LookingGlassWebXRControls"
		c.style.position = "fixed"
		c.style.zIndex = "1000"
		c.style.padding = "15px"
		c.style.width = "320px"
		c.style.maxWidth = "calc(100vw - 18px)"
		c.style.maxHeight = "calc(100vh - 18px)"
		c.style.whiteSpace = "nowrap"
		c.style.background = "rgba(0, 0, 0, 0.6)"
		c.style.color = "white"
		c.style.borderRadius = "10px"
		c.style.right = "15px"
		c.style.bottom = "15px"
		c.style.flex = "row"
	
		const title = document.createElement("div")
		c.appendChild(title)
		title.style.width = "100%"
		title.style.textAlign = "center"
		title.style.fontWeight = "bold"
		title.style.marginBottom = "8px"
		title.innerText = "Looking Glass Controls"
	
		const screenshotbutton = document.createElement("button")
		screenshotbutton.style.display = "block"
		screenshotbutton.style.margin = "auto"
		screenshotbutton.style.width = "100%"
		screenshotbutton.style.height = "35px"
		screenshotbutton.style.padding = "4px"
		screenshotbutton.style.marginBottom = "8px"
		screenshotbutton.style.borderRadius = "8px"
		screenshotbutton.id = "screenshotbutton"
		c.appendChild(screenshotbutton)
		screenshotbutton.innerText = "Save Hologram"

		const copybutton = document.createElement("button")
		copybutton.style.display = "block"
		copybutton.style.margin = "auto"
		copybutton.style.width = "100%"
		copybutton.style.height = "35px"
		copybutton.style.padding = "4px"
		copybutton.style.marginBottom = "8px"
		copybutton.style.borderRadius = "8px"
		copybutton.id = "copybutton"
		c.appendChild(copybutton)
		copybutton.innerText = "Copy Config"
		copybutton.addEventListener("click", () => {
		copyConfigToClipboard(cfg)})
	
		const help = document.createElement("div")
		c.appendChild(help)
		help.style.width = "290px"
		help.style.whiteSpace = "normal"
		help.style.color = "rgba(255,255,255,0.7)"
		help.style.fontSize = "14px"
		help.style.margin = "5px 0"
		help.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll."
	
		const controlListDiv = document.createElement("div")
		c.appendChild(controlListDiv)
	
		const addControl = (name: string, attrs: any, opts) => {
			const stringify = opts.stringify
	
			const controlLineDiv = document.createElement("div")
			controlLineDiv.style.marginBottom = "8px"
			controlListDiv.appendChild(controlLineDiv)
	
			const controlID = name
			const initialValue = cfg[name]
	
			const label = document.createElement("label")
			controlLineDiv.appendChild(label)
			label.innerText = opts.label
			label.setAttribute("for", controlID)
			label.style.width = "100px"
			label.style.display = "inline-block"
			label.style.textDecoration = "dotted underline 1px"
			label.style.fontFamily = `"Courier New"`
			label.style.fontSize = "13px"
			label.style.fontWeight = "bold"
			label.title = opts.title
	
			const control = document.createElement("input")
			controlLineDiv.appendChild(control)
			Object.assign(control, attrs)
			control.id = controlID
			control.title = opts.title
			control.value = attrs.value !== undefined ? attrs.value : initialValue
	
			// The source of truth for the control value is in cfg, not the element's
			// 'value' field. The text next to the control shows the real value.
			const updateValue = (newValue) => {
				cfg[name] = newValue
				updateNumberText(newValue)
			}
			control.oninput = () => {
				// Only in oninput do we actually read the control's value.
				const newValue = attrs.type === "range" ? parseFloat(control.value) : attrs.type === "checkbox" ? control.checked : control.value
				updateValue(newValue)
			}
	
			const updateExternally = (callback) => {
				let newValue = callback(cfg[name])
				if (opts.fixRange) {
					newValue = opts.fixRange(newValue)
					control.max = Math.max(parseFloat(control.max), newValue).toString()
					control.min = Math.min(parseFloat(control.min), newValue).toString()
				}
				control.value = newValue
				updateValue(newValue)
			}
	
			if (attrs.type === "range") {
				control.style.width = "110px"
				control.style.height = "8px"
				control.onwheel = (ev) => {
					updateExternally((oldValue) => oldValue + Math.sign(ev.deltaX - ev.deltaY) * attrs.step)
				}
			}
	
			let updateNumberText = (value) => {}
	
			if (stringify) {
				const numberText = document.createElement("span")
				numberText.style.fontFamily = `"Courier New"`
				numberText.style.fontSize = "13px"
				numberText.style.marginLeft = "3px"
				controlLineDiv.appendChild(numberText)
				updateNumberText = (v) => {
					numberText.innerHTML = stringify(v)
				}
				updateNumberText(initialValue)
			}
	
			return updateExternally
		}
	
		addControl(
			"fovy",
			{
				type: "range",
				min: (1.0 / 180) * Math.PI,
				max: (120.1 / 180) * Math.PI,
				step: (1.0 / 180) * Math.PI,
			},
			{
				label: "fov",
				title: "perspective fov (degrades stereo effect)",
				fixRange: (v) => Math.max((1.0 / 180) * Math.PI, Math.min(v, (120.1 / 180) * Math.PI)),
				stringify: (v) => {
					const xdeg = (v / Math.PI) * 180
					const ydeg = ((Math.atan(Math.tan(v / 2) * cfg.aspect) * 2) / Math.PI) * 180
					return `${xdeg.toFixed()}&deg;&times;${ydeg.toFixed()}&deg;`
				},
			}
		)
	
		addControl(
			"depthiness",
			{ type: "range", min: 0, max: 2, step: 0.01 },
			{
				label: "depthiness",
				title:
					'exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.',
				fixRange: (v) => Math.max(0, v),
				stringify: (v) => `${v.toFixed(2)}x`,
			}
		)
	
		addControl(
			"inlineView",
			{ type: "range", min: 0, max: 2, step: 1 },
			{
				label: "inline view",
				title: "what to show inline on the original canvas (swizzled = no overwrite)",
				fixRange: (v) => Math.max(0, Math.min(v, 2)),
				stringify: (v) => (v === 0 ? "swizzled" : v === 1 ? "center" : v === 2 ? "quilt" : "?"),
			}
		)
	
		cfg.lkgCanvas.oncontextmenu = (ev) => {
			ev.preventDefault()
		}
	
		cfg.lkgCanvas.addEventListener("wheel", (ev) => {
			const old = cfg.targetDiam
			const GAMMA = 1.1
			const logOld = Math.log(old) / Math.log(GAMMA)
			return (cfg.targetDiam = Math.pow(GAMMA, logOld + ev.deltaY * 0.01))
		})
	
		cfg.lkgCanvas.addEventListener("mousemove", (ev) => {
			const mx = ev.movementX,
				my = -ev.movementY
			if (ev.buttons & 2 || (ev.buttons & 1 && (ev.shiftKey || ev.ctrlKey))) {
				const tx = cfg.trackballX,
					ty = cfg.trackballY
				const dx = -Math.cos(tx) * mx + Math.sin(tx) * Math.sin(ty) * my
				const dy = -Math.cos(ty) * my
				const dz = Math.sin(tx) * mx + Math.cos(tx) * Math.sin(ty) * my
				cfg.targetX = cfg.targetX + dx * cfg.targetDiam * 0.001
				cfg.targetY = cfg.targetY + dy * cfg.targetDiam * 0.001
				cfg.targetZ = cfg.targetZ + dz * cfg.targetDiam * 0.001
			} else if (ev.buttons & 1) {
				cfg.trackballX = cfg.trackballX - mx * 0.01
				cfg.trackballY = cfg.trackballY - my * 0.01
			}
		})
	
		const keys = { w: 0, a: 0, s: 0, d: 0 }
		cfg.lkgCanvas.addEventListener("keydown", (ev) => {
			switch (ev.code) {
				case "KeyW":
					keys.w = 1
					break
				case "KeyA":
					keys.a = 1
					break
				case "KeyS":
					keys.s = 1
					break
				case "KeyD":
					keys.d = 1
					break
			}
		})
		cfg.lkgCanvas.addEventListener("keyup", (ev) => {
			switch (ev.code) {
				case "KeyW":
					keys.w = 0
					break
				case "KeyA":
					keys.a = 0
					break
				case "KeyS":
					keys.s = 0
					break
				case "KeyD":
					keys.d = 0
					break
			}
		})
	
		requestAnimationFrame(flyCamera)
		function flyCamera() {
			let kx = keys.d - keys.a
			let ky = keys.w - keys.s
			if (kx && ky) {
				kx *= Math.sqrt(0.5)
				ky *= Math.sqrt(0.5)
			}
			const tx = cfg.trackballX,
				ty = cfg.trackballY
			const dx = Math.cos(tx) * kx - Math.sin(tx) * Math.cos(ty) * ky
			const dy = -Math.sin(ty) * ky
			const dz = -Math.sin(tx) * kx - Math.cos(tx) * Math.cos(ty) * ky
			cfg.targetX = cfg.targetX + dx * cfg.targetDiam * 0.03
			cfg.targetY = cfg.targetY + dy * cfg.targetDiam * 0.03
			cfg.targetZ = cfg.targetZ + dz * cfg.targetDiam * 0.03
			requestAnimationFrame(flyCamera)
		}
	
		// start the media controller after the buttons have been initialized
		setTimeout(() => {
			LookingGlassMediaController()
		}, 1000)
	
		return c
	}
}
/**
 * copy the current configuration values to the clipboard
 * @param cfg 
 */
function copyConfigToClipboard(cfg) {
    const camera = {
        targetX: cfg.targetX,
        targetY: cfg.targetY,
        targetZ: cfg.targetZ,
        fovy: `${Math.round((cfg.fovy / Math.PI) * 180)} * Math.PI / 180`,
        targetDiam: cfg.targetDiam,
        trackballX: cfg.trackballX,
        trackballY: cfg.trackballY,
        depthiness: cfg.depthiness,
    }
    
    let config = JSON.stringify(camera, null, 4)
        .replace(/"/g, '')
        .replace(/{/g, '')
        .replace(/}/g, '');
    
    navigator.clipboard.writeText(config);
}