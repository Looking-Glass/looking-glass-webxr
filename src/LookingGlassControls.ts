import { getLookingGlassConfig } from "./LookingGlassConfig"
import { LookingGlassMediaController } from "./LookingGlassMediaController"
import { containerRoot, setStyle, button, controlsContainer, heading, heading6, sliderContainer, slider, castIcon, FOVindicators, DepthinessIndicators, tab_active, tab_inactive, tab_container } from './LookingGlassStyles';

//lkgCanvas is stored in the Looking Glass config after being created.
export function initLookingGlassControlGUI() {
	const cfg = getLookingGlassConfig()
	console.log(cfg, "for debugging purposes")
	if (cfg.lkgCanvas == null) {
		console.warn("window placement called without a valid XR Session!")
	} else {
		const styleElement = document.createElement("style")
		document.head.appendChild(styleElement)
		styleElement.sheet?.insertRule("#LookingGlassWebXRControls * { font-family: sans-serif }")

		const c = document.createElement("div")
		c.id = "LookingGlassWebXRControls"
		c.className = "controlsBackground"
		setStyle(c, containerRoot)
		const container = document.createElement("div")
		c.appendChild(container)
		setStyle(container, controlsContainer)

		const title = document.createElement("div")
		setStyle(title, heading)
		container.appendChild(title)
		const text = document.createElement("span")
		text.innerText = "Casting to Looking Glass"
		title.appendChild(castIcon())
		title.appendChild(text)

		const screenshotbutton = document.createElement("button")
		setStyle(screenshotbutton, button)
		screenshotbutton.id = "screenshotbutton"
		screenshotbutton.innerText = "Save Hologram"

		const copybutton = document.createElement("button")
		copybutton.id = "copybutton"
		setStyle(copybutton, button)
		copybutton.innerText = "Copy Config"
		copybutton.addEventListener("click", () => {
			copyConfigToClipboard(cfg)
		})

		// const help = document.createElement("div")
		// container.appendChild(help)
		// help.style.width = "290px"
		// help.style.whiteSpace = "normal"
		// help.style.color = "rgba(255,255,255,0.7)"
		// help.style.fontSize = "14px"
		// help.style.margin = "5px 0"
		// help.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll."

		const controlListDiv = document.createElement("div")
		controlListDiv.style.display = "inline-flex"
		controlListDiv.style.flexDirection = "column"
		controlListDiv.style.gap = "16px"
		controlListDiv.style.alignContent = "start"
		container.appendChild(controlListDiv)


		const addControl = (name: string, attrs: any, opts) => {
			
			const controlLineDiv = document.createElement("div")
			controlLineDiv.style.marginBottom = "8px"
			controlListDiv.appendChild(controlLineDiv)
			setStyle(controlLineDiv, sliderContainer)

			const controlID = name
			const initialValue = cfg[name]

			const label = document.createElement("label")
			controlLineDiv.appendChild(label)
			label.innerText = opts.label
			label.setAttribute("for", controlID)
			setStyle(label, heading6)
			label.title = opts.title

			if (controlID === "fovy") {
				FOVindicators(controlLineDiv)
			}
			else if (controlID === "depthiness") {
				DepthinessIndicators(controlLineDiv)
			}

			const control = document.createElement("input")
			controlLineDiv.appendChild(control)
			Object.assign(control, attrs)
			control.id = controlID
			control.className = "looking-glass-input"
			control.title = opts.title
			control.value = attrs.value !== undefined ? attrs.value : initialValue
			if (attrs.type === "range") {
			// update initial value
			const newPercentage = ((parseFloat(control.value) - parseFloat(control.min)) / (parseFloat(control.max) - parseFloat(control.min))) * 100;
			const backgroundImage = `linear-gradient(90deg, #ffffff ${newPercentage}%, rgba(255, 255, 255, 0.20) ${newPercentage}%)`
			control.style.backgroundImage = backgroundImage
			}

			// The source of truth for the control value is in cfg, not the element's
			// 'value' field. The text next to the control shows the real value.
			const updateValue = (newValue) => {
				cfg[name] = newValue
			}

			control.oninput = () => {
				// Only in oninput do we actually read the control's value.
				
				if (attrs.type === "range") {
				const newPercentage = ((parseFloat(control.value) - parseFloat(control.min)) / (parseFloat(control.max) - parseFloat(control.min))) * 100;
				const backgroundImage = `linear-gradient(90deg, #ffffff ${newPercentage}%, rgba(255, 255, 255, 0.08) ${newPercentage}%)`
				control.style.backgroundImage = backgroundImage
				const newValue = attrs.type === "range" ? parseFloat(control.value) : attrs.type === "checkbox" ? control.checked : control.value
				updateValue(newValue)
				}
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
				control.onwheel = (ev) => {
					updateExternally((oldValue) => oldValue + Math.sign(ev.deltaX - ev.deltaY) * attrs.step)
				}
			}

			return controlLineDiv
		}

		function addTabs(name: string) {
			// Create a container for the tabs
			const tabsContainer = document.createElement("div");
			tabsContainer.style.marginBottom = "8px";
			setStyle(tabsContainer, tab_container)
			controlListDiv.appendChild(tabsContainer);
		
			// Create and append tab for "Quilt"
			const quiltTab = document.createElement("button");
			quiltTab.innerText = "Quilt";
			setStyle(quiltTab, tab_active)
			tabsContainer.appendChild(quiltTab);
		
			// Create and append tab for "Center"
			const centerTab = document.createElement("button");
			centerTab.innerText = "Center";
			setStyle(centerTab, tab_inactive)
			tabsContainer.appendChild(centerTab);

			const updateValue = (newValue) => {
				cfg[name] = newValue
			}
		
			// Function to update the value in cfg
			const updateExternally = (callback) => {
				let newValue = callback(cfg[name])
				
				updateValue(newValue)
			}
		
			// Event listeners for tabs
			quiltTab.onclick = () => {
				quiltTab.classList.add('active');
				centerTab.classList.remove('active');
				updateValue('2');
			};
		
			centerTab.onclick = () => {
				centerTab.classList.add('active');
				quiltTab.classList.remove('active');
				updateValue('1');
			};
		
			// Return the tabs container in case further modifications are needed
			return tabsContainer;
		}

		addTabs("inlineView")

		const FOVSlider = addControl(
			"fovy",
			{
				type: "range",
				min: (1.0 / 180) * Math.PI,
				max: (120.1 / 180) * Math.PI,
				step: (1.0 / 180) * Math.PI,
			},
			{
				label: "Field of view",
				title: "perspective fov (degrades stereo effect)",
				fixRange: (v) => Math.max((1.0 / 180) * Math.PI, Math.min(v, (120.1 / 180) * Math.PI)),
			}
		)

		const depthinessSlider = addControl(
			"depthiness",
			{ type: "range", min: 0, max: 2, step: 0.01 },
			{
				label: "Depthiness",
				title:
					'exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov. 1.25 seems to be most physically accurate on Looking Glass 8.9".',
				fixRange: (v) => Math.max(0, v),
				stringify: (v) => `${v.toFixed(2)}x`,
			}
		)
		
		container.appendChild(screenshotbutton)
		container.appendChild(copybutton)

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

function copyConfigToClipboard(cfg) {
	let targetX = cfg.targetX
	let targetY = cfg.targetY
	let targetZ = cfg.targetZ
	let fovy = `${Math.round((cfg.fovy / Math.PI) * 180)} * Math.PI / 180`
	let targetDiam = cfg.targetDiam
	let trackballX = cfg.trackballX
	let trackballY = cfg.trackballY
	let depthiness = cfg.depthiness
	const camera = {
		targetX,
		targetY,
		targetZ,
		fovy,
		targetDiam,
		trackballX,
		trackballY,
		depthiness,
	}

	let config = JSON.stringify(camera, null, 4)
	navigator.clipboard.writeText(config)
}