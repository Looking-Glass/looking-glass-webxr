import { getLookingGlassConfig, LookingGlassConfig } from './LookingGlassConfig';
import { initLookingGlassControlGUI } from "./LookingGlassControls"

let controls

// this is the function responsible for opening the Looking Glass window and initializing the controls
export const moveCanvasToWindow = (enabled: boolean, onbeforeunload) => {
	const cfg = getLookingGlassConfig()

	if (cfg.lkgCanvas == null) {
		console.warn('window placement called without a valid XR Session!')
		return
	}
	else if(enabled == false) {
	 closeWindow(cfg, controls)
	}
	else {

	// initialize the Looking Glass Controls, pass references to both Canvas elements
	if (controls == null) {
		controls = initLookingGlassControlGUI() as Node
	}

	cfg.lkgCanvas.style.position = "fixed"
	cfg.lkgCanvas.style.bottom = "0"
	cfg.lkgCanvas.style.left = "0"

	cfg.lkgCanvas.width = cfg.calibration.screenW.value
	cfg.lkgCanvas.height = cfg.calibration.screenH.value

	document.body.appendChild(controls)
	//wrap screen placement api in try catch to handle browsers that don't support it
	try {
		const screenPlacement = "getScreenDetails" in window
		console.log(screenPlacement, 'Screen placement API exists')

		if (!screenPlacement) throw new Error("Screen Placement API not supported")
			// use chrome's screen placement to automatically position the window.
		placeWindow(cfg.lkgCanvas, cfg, onbeforeunload)
		} 
	// if browser doesn't support screen placement api, use a normal popup
	catch {
		console.log("user did not allow window placement, using normal popup instead")
		openPopup(cfg, cfg.lkgCanvas, onbeforeunload)
	}
	}
}
	// if chromium, use the Screen Placement API to automatically place the window in the correct location, compensate for address bar
	async function placeWindow(lkgCanvas: HTMLCanvasElement, config: LookingGlassConfig, onbeforeunload: any) {
		const screenDetails = await (window as any).getScreenDetails() 
		console.log(screenDetails)
		//temporary, grab the first monitor ID with "LKG" Todo: make more robust
		const LKG = screenDetails.screens.filter((screen) => screen.label.includes("LKG"))[0]
		console.log(LKG, 'monitors')
		if (LKG === undefined) {
			console.log("no Looking Glass monitor detected - manually opening popup window")
			openPopup(config, lkgCanvas, onbeforeunload)
			return
		}
		else {
		console.log("monitor ID", LKG.label, "serial number", config.calibration)
		const features = [
			`left=${LKG.left}`,
			`top=${LKG.top}`,
			`width=${LKG.width}`,
			`height=${LKG.height}`,
			`menubar=no`,
			`toolbar=no`,
			`location=no`,
			`status=no`,
			`resizable=yes`,
			`scrollbars=no`,
			`fullscreenEnabled=true`,
		].join(",")
		config.popup = window.open("", "new", features)
		if (config.popup) {
			config.popup.document.body.style.background = "black"
			config.popup.document.body.appendChild(lkgCanvas)
			console.assert(onbeforeunload)
			config.popup.onbeforeunload = onbeforeunload
		}
	}
	}

    // open a normal popup

function openPopup(cfg: LookingGlassConfig, lkgCanvas: HTMLCanvasElement, onbeforeunload: any) {
	cfg.popup = window.open("", undefined, "width=640,height=360")
		if (cfg.popup) {
			cfg.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)"
			cfg.popup.document.body.style.background = "black"
			cfg.popup.document.body.appendChild(lkgCanvas)
			console.assert(onbeforeunload)
			cfg.popup.onbeforeunload = onbeforeunload
		}
	}

	// close the window and remove the controls

	function closeWindow(cfg: LookingGlassConfig, controls: any) {
		controls.parentElement?.removeChild(controls)
		// restore the original canvas size once an XR session has been exited
		// cfg.appCanvas.width = origWidth
		// cfg.appCanvas.height = origHeight
		if (cfg.popup) {
			cfg.popup.onbeforeunload = null
			cfg.popup.close()
			cfg.popup = null
		}
	}