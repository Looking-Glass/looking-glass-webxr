import { getLookingGlassConfig } from './LookingGlassConfig';

export async function LookingGlassMediaController() {

	const cfg = getLookingGlassConfig();

	if (cfg.appCanvas == null) {
		console.warn('Media Capture initialized while canvas is null!')
		return
	}
	else {
	const screenshotbutton = document.getElementById("screenshotbutton") as HTMLButtonElement | null
	screenshotbutton?.addEventListener("click", waitforDownload)

	async function waitforDownload() {
		await resolveWhenIdle.promise( 50 ).finally(downloadImage)
	}

	function downloadImage() {
		// capturing must be set to true before downloading an image in order to capture a high quality quilt. TODO: manually grab XRsession framebuffer instead
		    if (cfg.appCanvas != null) {
			console.time("capture")
			let url = cfg.appCanvas.toDataURL('image/jpeg')
			console.timeLog("capture")
			console.timeEnd("capture")
			const a = document.createElement("a")
			a.style.display = "none"
			a.href = url
			  a.download = `hologram_qs${cfg.quiltWidth}x${cfg.quiltHeight}a${cfg.aspect}.jpeg`;
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
			}
		}
	}
}

// make request and cancel generic to support most browsers
const idleOptions = { timeout: 500 };
const request = window.requestIdleCallback || window.requestAnimationFrame;
const cancel = window.cancelIdleCallback || window.cancelAnimationFrame;


// controllable promise
const resolveWhenIdle = {
  request: request,
  cancel: cancel,
  promise: (num) => new Promise((resolve) => request(resolve, Object.assign({}, idleOptions, num))),
};

export { resolveWhenIdle };

