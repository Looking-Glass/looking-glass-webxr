import { getLookingGlassConfig } from "./LookingGlassConfig"
import LookingGlassXRDevice from "./LookingGlassXRDevice"

export async function LookingGlassMediaController() {
	const cfg = getLookingGlassConfig()
	let currentInlineView = 2 // we change this value later when the screenshot capture starts.

	// the function to download the image from the canvas
	function downloadImage() {
		if (cfg.appCanvas != null) {
			try {
				let url = cfg.appCanvas.toDataURL()
				const a = document.createElement("a")
				a.style.display = "none"
				a.href = url
				a.download = `hologram_qs${cfg.quiltWidth}x${cfg.quiltHeight}a${cfg.aspect}.png`
				document.body.appendChild(a)
				a.click()
				document.body.removeChild(a)
				window.URL.revokeObjectURL(url)
			} catch (error) {
				console.error("Error while capturing canvas data:", error)
			} finally {
				// Reset inlineView value to its initial value
				cfg.inlineView = currentInlineView
			}
		}
	}

	const screenshotButton = document.getElementById("screenshotbutton") as HTMLButtonElement | null
	// add screenshot button listener, this calls the downloadImage function only at the end of the frame loop
	if (screenshotButton) {
		screenshotButton.addEventListener("click", () => {
			currentInlineView = cfg.inlineView
			const xrDevice = LookingGlassXRDevice.getInstance()
			if (!xrDevice) {
				console.warn("LookingGlassXRDevice not initialized")
				return
			}

			// set inlineView to quilt before capturing the screenshot
			cfg.inlineView = 2
			xrDevice.captureScreenshot = true

			// set the screenshotCallback to downloadImage after the next frame is rendered
			setTimeout(() => {
				xrDevice.screenshotCallback = downloadImage
			}, 100)
		})
	}
}
