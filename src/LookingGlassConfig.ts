/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as HoloPlayCore from "holoplay-core"

export const DefaultEyeHeight: number = 1.6

type Value = {
	value: number
}

type SubpixelCell = {
	BOffsetX: number
	BOffsetY: number
	GOffsetX: number
	GOffsetY: number
	ROffsetX: number
	ROffsetY: number
}

export type CalibrationArgs = {
	configVersion: string
	pitch: Value
	slope: Value
	center: Value
	viewCone: Value
	invView: Value
	verticalAngle: Value
	DPI: Value
	screenW: Value
	screenH: Value
	flipImageX: Value
	flipImageY: Value
	flipSubp: Value
	serial: string
	subpixelCells: SubpixelCell[]
	CellPatternMode: Value
}

export enum InlineView {
	/** Show the encoded subpixel matrix */
	Swizzled = 0,
	/** A single centered view */
	Center = 1,
	/** The quilt view */
	Quilt = 2,
}

export type ViewControlArgs = {
	/**
	 * @Deprecated: since 0.4.0 use `quiltResolution` instead
	 * Defines the height of the individual quilt view, the width is then set based on the aspect ratio of the connected device.
	 * @default 512
	 */
	tileHeight: number
	/**
	 * Defines the number of views to be rendered
	 * @default 45
	 */
	numViews: number
	/**
	 * Defines the rotation of the camera on the X-axis
	 * @default 0
	 */
	trackballX: number
	/**
	 * Defines the rotation of the camera on the Y-axis
	 * @default 0
	 */
	trackballY: number
	/**
	 * Defines the position of the camera on the x-axis
	 * @default 0
	 */
	targetX: number
	/**
	 * Defines the position of the camera on the Y-axis
	 * @default 1.6 (or `DefaultEyeHeight`)
	 */
	targetY: number
	/**
	 * Defines the position of the camera on the Z-axis
	 * @default -0.5
	 */
	targetZ: number
	/**
	 * Defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
	 * @default 2.0
	 */
	targetDiam: number
	/**
	 * Defines the vertical FOV of your camera (defined in radians)
	 * @default (13.0 / 180) * Math.PI
	 */
	fovy: number
	/**
	 * Modifies to the view frustum to increase or decrease the perceived depth of the scene.
	 * @default 1.25
	 */
	depthiness: number
	/**
	 * Changes how the original canvas on your main web page is displayed, can show the encoded subpixel matrix, a single centered view, or a quilt view.
	 * @default InlineView.Center
	 */
	inlineView: InlineView
	/**
	 * A reference to the popup window, this will only exist once the window is opened. Calling before the window is open will fail.
	 * @default Window
	 */
	popup: Window | null
	/**
	 * The current capture state, when capturing is set to true the device width and height is overridden for higher quality capture
	 * @default false
	 */
	capturing: boolean
	/**
	 * A reference to the current XRSession, giving access to the WebXR rendering context, this should be read only unless you like living dangerously
	 */
	XRSession: any
	/**
	 * The current quilt resolution, this is a read only value that is set based on the connected device
	 * @default 3840
	 *
	 */
	quiltResolution: { width: number; height: number } | null
	/**
	 * The Canvas on the Looking Glass
	 * @default null
	 */
	/**
	 * manual override for number of quilt columns
	 * @default null
	 */
	columns: number | null

	/**
	 * @default null
	 * manual override for number of quilt rows
	 */
	rows: number | null

	lkgCanvas: HTMLCanvasElement | null
	/**
	 * The main webgl context
	 * @default null
	 */
	appCanvas: HTMLCanvasElement | null
	/**subpixelMode */
	subpixelMode: number
	/**filterMode */
	filterMode: number
	/**gaussian sigma */
	gaussianSigma: number
}

type LookingGlassConfigEvent = "on-config-changed"

export class LookingGlassConfig extends EventTarget {
	// Calibration defaults
	private _calibration: CalibrationArgs = {
		configVersion: "1.0",
		pitch: { value: 45 },
		slope: { value: -5 },
		center: { value: -0.5 },
		viewCone: { value: 40 },
		invView: { value: 1 },
		verticalAngle: { value: 0 },
		DPI: { value: 338 },
		screenW: { value: 3840 },
		screenH: { value: 2160 },
		flipImageX: { value: 0 },
		flipImageY: { value: 0 },
		flipSubp: { value: 0 },
		serial: "",
		subpixelCells: [],
		CellPatternMode: { value: 0 },
	}

	// Config defaults
	private _viewControls: ViewControlArgs = {
		tileHeight: 512,
		numViews: 48,
		trackballX: 0,
		trackballY: 0,
		targetX: 0,
		targetY: DefaultEyeHeight,
		targetZ: -0.5,
		targetDiam: 2.0,
		fovy: (14.0 / 180) * Math.PI,
		depthiness: 1.25,
		inlineView: InlineView.Center,
		capturing: false,
		quiltResolution: null,
		columns: null,
		rows: null,
		popup: null,
		XRSession: null,
		lkgCanvas: null,
		appCanvas: null,
		subpixelMode: 1.0,
		filterMode: 1,
		gaussianSigma: 0.01,
	}
	LookingGlassDetected: any

	constructor(cfg?: Partial<ViewControlArgs>) {
		super()
		this._viewControls = { ...this._viewControls, ...cfg }
		this.syncCalibration()
	}

	private syncCalibration() {
		const client = new HoloPlayCore.Client((msg) => {
			if (msg.devices.length < 1) {
				console.log("No Looking Glass devices found")
				return
			}
			if (msg.devices.length > 1) {
				console.log("More than one Looking Glass device found... using the first one")
			}
			this.calibration = msg.devices[0].calibration
		})
	}

	public addEventListener(
		type: LookingGlassConfigEvent,
		callback: EventListenerOrEventListenerObject | null,
		options?: boolean | AddEventListenerOptions | undefined,
	): void {
		super.addEventListener(type, callback, options)
	}

	private onConfigChange() {
		this.dispatchEvent(new Event("on-config-changed"))
	}

	public get calibration(): CalibrationArgs {
		return this._calibration
	}

	public set calibration(value: Partial<CalibrationArgs>) {
		this._calibration = {
			...this._calibration,
			...value,
		}
		this.onConfigChange()
	}

	public updateViewControls(value: Partial<ViewControlArgs> | undefined) {
		if (value != undefined) {
			this._viewControls = {
				...this._viewControls,
				...value,
			}
			this.onConfigChange()
		}
	}

	// configurable

	/**
	 * @deprecated defines the height of the individual quilt view, the width is then set based on the aspect ratio of the connected device.
	 */
	public get tileHeight(): number {
		return Math.round(this.framebufferHeight / this.quiltHeight)
	}

	/**
	 * defines the quilt resolution, if null, it will be set based on the connected device
	 */

	public get quiltResolution(): { width: number; height: number } {
		if (this._viewControls.quiltResolution != null) {
			return { width: this._viewControls.quiltResolution.width, height: this._viewControls.quiltResolution.height }
		} else {
			const serial = this._calibration.serial
			switch (true) {
				case serial.startsWith("LKG-2K"): // Looking Glass 8.9"
					return { width: 4096, height: 4096 }
				case serial.startsWith("LKG-4K"): // Looking Glass 15.6"
					return { width: 4096, height: 4096 }
				case serial.startsWith("LKG-8K"): // Looking Glass 32"
					return { width: 8192, height: 8192 }
				case serial.startsWith("LKG-P"): // Looking Glass Portrait
					return { width: 3360, height: 3360 }
				case serial.startsWith("LKG-A"): // Looking Glass 16" Gen 2
					return { width: 4096, height: 4096 }
				case serial.startsWith("LKG-B"): // Looking Glass 32" Gen 2
					return { width: 8192, height: 8192 }
				case serial.startsWith("LKG-D"): // Looking Glass 65"
					return { width: 8192, height: 8192 }
				case serial.startsWith("LKG-F"): // Looking Glass Kiosk
					return { width: 3360, height: 3360 }
				case serial.startsWith("LKG-E"): // Looking Glass Go
					return { width: 4092, height: 4092 }
				case serial.startsWith("LKG-H"): // Looking Glass 16" Spatial OLED (Portrait)
					return { width: 5995, height: 6000 }
				case serial.startsWith("LKG-J"): // Looking Glass 16" Spatial OLED (Landscape)
					return { width: 5999, height: 5999 }
				case serial.startsWith("LKG-K"): // Looking Glass 32" Spatial Display (Portrait)
					return { width: 8184, height: 8184 }
				case serial.startsWith("LKG-L"): // Looking Glass 32" Spatial Display (Landscape)
					return { width: 8190, height: 8190 }
				default:
					return { width: 4096, height: 4096 }
			}
		}
	}

	set quiltResolution(v: { width: number; height: number }) {
		this.updateViewControls({ quiltResolution: v })
	}

	/**
	 * defines the number of views to be rendered
	 */
	get numViews() {
		return this.quiltWidth * this.quiltHeight
	}

	/**
	 * defines the position of the camera on the X-axis
	 */
	get targetX() {
		return this._viewControls.targetX
	}

	set targetX(v) {
		this.updateViewControls({ targetX: v })
	}

	/**
	 * defines the position of the camera on the Y-axis
	 */
	get targetY() {
		return this._viewControls.targetY
	}

	set targetY(v) {
		this.updateViewControls({ targetY: v })
	}

	/**
	 * defines the position of the camera on the X-axis
	 */
	get targetZ() {
		return this._viewControls.targetZ
	}

	set targetZ(v) {
		this.updateViewControls({ targetZ: v })
	}

	/**
	 * defines the rotation of the camera on the X-axis
	 */
	get trackballX() {
		return this._viewControls.trackballX
	}

	set trackballX(v) {
		this.updateViewControls({ trackballX: v })
	}

	/**
	 * defines the rotation of the camera on the Y-axis
	 */
	get trackballY() {
		return this._viewControls.trackballY
	}

	set trackballY(v) {
		this.updateViewControls({ trackballY: v })
	}

	/**
	 * defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
	 */
	get targetDiam() {
		return this._viewControls.targetDiam
	}

	set targetDiam(v) {
		this.updateViewControls({ targetDiam: v })
	}

	/**
	 * defines the vertical FOV of your camera (defined in radians)
	 */
	get fovy() {
		return this._viewControls.fovy
	}

	set fovy(v) {
		this.updateViewControls({ fovy: v })
	}

	/**
	 * modifies to the view frustum to increase or decrease the perceived depth of the scene.
	 */
	get depthiness() {
		return this._viewControls.depthiness
	}

	set depthiness(v) {
		this.updateViewControls({ depthiness: v })
	}

	/**
	 * changes how the original canvas on your main web page is displayed, can show the encoded subpixel matrix, a single centered view, or a quilt view.
	 */
	get inlineView() {
		return this._viewControls.inlineView
	}

	set inlineView(v) {
		this.updateViewControls({ inlineView: v })
	}

	get capturing() {
		return this._viewControls.capturing
	}

	set capturing(v: boolean) {
		this.updateViewControls({ capturing: v })
	}

	get subpixelMode() {
		return this._viewControls.subpixelMode
	}

	set subpixelMode(v) {
		this.updateViewControls({ subpixelMode: v })
	}

	get filterMode() {
		return this._viewControls.filterMode
	}

	set filterMode(v) {
		this.updateViewControls({ filterMode: v })
	}

	get gaussianSigma() {
		return this._viewControls.gaussianSigma
	}

	set gaussianSigma(v) {
		this.updateViewControls({ gaussianSigma: v })
	}

	get popup() {
		return this._viewControls.popup
	}

	set popup(v: Window | null) {
		this.updateViewControls({ popup: v })
	}

	get XRSession() {
		return this._viewControls.XRSession
	}

	set XRSession(v) {
		this.updateViewControls({ XRSession: v })
	}

	get lkgCanvas() {
		return this._viewControls.lkgCanvas
	}

	set lkgCanvas(v) {
		this.updateViewControls({ lkgCanvas: v })
	}

	get appCanvas() {
		return this._viewControls.appCanvas
	}

	set appCanvas(v) {
		this.updateViewControls({ appCanvas: v })
	}

	get columns() {
		return this._viewControls.columns
	}

	set columns(v: number | null) {
		this.updateViewControls({ columns: v })
	}

	get rows() {
		return this._viewControls.rows
	}

	set rows(v: number | null) {
		this.updateViewControls({ rows: v })
	}

	// Computed

	public get aspect() {
		return this._calibration.screenW.value / this._calibration.screenH.value
	}

	public get tileWidth() {
		return Math.round(this.framebufferWidth / this.quiltWidth)
	}

	public get framebufferWidth() {
		return this.quiltResolution.width
	}

	// number of columns
	public get quiltWidth() {
		if (this._viewControls.columns != null) {
			return this._viewControls.columns
		}

		const serial = this._calibration.serial
		switch (true) {
			case serial.startsWith("LKG-2K"): // Looking Glass 8.9"
				return 5
			case serial.startsWith("LKG-4K"): // Looking Glass 15.6"
				return 5
			case serial.startsWith("LKG-8K"): // Looking Glass 32"
				return 5
			case serial.startsWith("LKG-P"): // Looking Glass Portrait
				return 8
			case serial.startsWith("LKG-A"): // Looking Glass 16" Gen 2
				return 5
			case serial.startsWith("LKG-B"): // Looking Glass 32" Gen 2
				return 5
			case serial.startsWith("LKG-D"): // Looking Glass 65"
				return 8
			case serial.startsWith("LKG-F"): // Looking Glass Kiosk
				return 8
			case serial.startsWith("LKG-E"): // Looking Glass Go
				return 11
			case serial.startsWith("LKG-H"): // Looking Glass 16" Spatial OLED (Portrait)
				return 11
			case serial.startsWith("LKG-J"): // Looking Glass 16" Spatial OLED (Landscape)
				return 7
			case serial.startsWith("LKG-K"): // Looking Glass 32" Spatial Display (Portrait)
				return 11
			case serial.startsWith("LKG-L"): // Looking Glass 32" Spatial Display (Landscape)
				return 7
			default:
				return 1
		}
	}

	// number of rows
	public get quiltHeight() {
		if (this._viewControls.rows != null) {
			return this._viewControls.rows
		}
		const serial = this._calibration.serial
		switch (true) {
			case serial.startsWith("LKG-2K"): // Looking Glass 8.9"
				return 9
			case serial.startsWith("LKG-4K"): // Looking Glass 15.6"
				return 9
			case serial.startsWith("LKG-8K"): // Looking Glass 32"
				return 9
			case serial.startsWith("LKG-P"): // Looking Glass Portrait
				return 6
			case serial.startsWith("LKG-A"): // Looking Glass 16" Gen 2
				return 9
			case serial.startsWith("LKG-B"): // Looking Glass 32" Gen 2
				return 9
			case serial.startsWith("LKG-D"): // Looking Glass 65"
				return 9
			case serial.startsWith("LKG-F"): // Looking Glass Kiosk
				return 6
			case serial.startsWith("LKG-E"): // Looking Glass Go
				return 6
			case serial.startsWith("LKG-H"): // Looking Glass 16" Spatial OLED (Portrait)
				return 6
			case serial.startsWith("LKG-J"): // Looking Glass 16" Spatial OLED (Landscape)
				return 7
			case serial.startsWith("LKG-K"): // Looking Glass 32" Spatial Display (Portrait)
				return 6
			case serial.startsWith("LKG-L"): // Looking Glass 32" Spatial Display (Landscape)
				return 7
			default:
				return 1
		}
	}

	public get framebufferHeight() {
		return this.quiltResolution.height
	}

	public get viewCone() {
		return ((this._calibration.viewCone.value * this.depthiness) / 180) * Math.PI
	}

	public get tilt() {
		return (
			(this._calibration.screenH.value / (this._calibration.screenW.value * this._calibration.slope.value)) *
			(this._calibration.flipImageX.value ? -1 : 1)
		)
	}

	public get subp() {
		return (1 / (this._calibration.screenW.value * 3)) * (this._calibration.flipImageX.value ? -1 : 1)
	}

	public get pitch() {
		return (
			((this._calibration.pitch.value * this._calibration.screenW.value) / this._calibration.DPI.value) *
			Math.cos(Math.atan(1.0 / this._calibration.slope.value))
		)
	}

	public get subpixelCells() {
		const subPixelCells = new Float32Array(6 * this._calibration.subpixelCells.length)

		this._calibration.subpixelCells.forEach((cell, index) => {
			cell.ROffsetX /= this.calibration.screenW.value
			cell.ROffsetY /= this.calibration.screenH.value
			cell.GOffsetX /= this.calibration.screenW.value
			cell.GOffsetY /= this.calibration.screenH.value
			cell.BOffsetX /= this.calibration.screenW.value
			cell.BOffsetY /= this.calibration.screenH.value

			// Populate the subPixelCells Float32Array
			subPixelCells[index * 6 + 0] = cell.ROffsetX
			subPixelCells[index * 6 + 1] = cell.ROffsetY
			subPixelCells[index * 6 + 2] = cell.GOffsetX
			subPixelCells[index * 6 + 3] = cell.GOffsetY
			subPixelCells[index * 6 + 4] = cell.BOffsetX
			subPixelCells[index * 6 + 5] = cell.BOffsetY
		})

		return subPixelCells
	}
}

let globalLkgConfig: LookingGlassConfig | null = null

/** The global LookingGlassConfig */
export function getLookingGlassConfig() {
	if (globalLkgConfig == null) {
		globalLkgConfig = new LookingGlassConfig()
	}
	return globalLkgConfig
}

/** Update the global LookingGlassConfig's viewControls */
export function updateLookingGlassConfig(viewControls: Partial<ViewControlArgs> | undefined) {
	const lkgConfig = getLookingGlassConfig()
	if (viewControls != undefined) {
		lkgConfig.updateViewControls(viewControls)
	}
}

export function updateLookingGlassCalibration(calibration: CalibrationArgs) {
	const lkgConfig = getLookingGlassConfig()
	lkgConfig.calibration = calibration
}