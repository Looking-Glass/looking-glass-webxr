import { getLookingGlassConfig } from './LookingGlassConfig';

export async function LookingGlassMediaController(screenshotbutton: HTMLButtonElement) {

	const cfg = getLookingGlassConfig();

	if (cfg.appCanvas == null) {
		console.warn('Media Capture initialized while canvas is null!')
		return
	}
	else {
		console.log('Media Capture initialized')
		screenshotbutton.onclick = async () => (await waitforDownload())
	}

	async function waitforDownload() {
		await resolveWhenIdle.promise( 50 ).finally(downloadImage)
	}

	function downloadImage() {
		// capturing must be set to true before downloading an image in order to capture a high quality quilt. TODO: manually grab XRsession framebuffer instead
		    if (cfg.appCanvas != null) {
			console.time("capture")
			console.log("capture started")
			setTimeout(() => (screenshotbutton.textContent = "Capturing..."), 0);

			let url = cfg.appCanvas.toDataURL('image/jpeg')
			console.timeLog("capture")
			console.timeEnd("capture")

			console.log("saving capture")
			setTimeout(() => (screenshotbutton.textContent = "Saving..."), 0);

			const a = document.createElement("a")
			a.style.display = "none"
			a.href = url
			  a.download = `hologram_qs${cfg.quiltWidth}x${cfg.quiltHeight}a${cfg.aspect}.jpeg`;
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			window.URL.revokeObjectURL(url)
			console.log("capture saved")

			setTimeout(() => (screenshotbutton.textContent = "Save Hologram"), 125);
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

