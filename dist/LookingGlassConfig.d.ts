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
export declare const DefaultEyeHeight: number;
declare type Value = {
    value: number;
};
export declare type CalibrationArgs = {
    configVersion: string;
    pitch: Value;
    slope: Value;
    center: Value;
    viewCone: Value;
    invView: Value;
    verticalAngle: Value;
    DPI: Value;
    screenW: Value;
    screenH: Value;
    flipImageX: Value;
    flipImageY: Value;
    flipSubp: Value;
    serial: string;
};
export declare enum InlineView {
    /** Show the encoded subpixel matrix */
    Swizzled = 0,
    /** A single centered view */
    Center = 1,
    /** The quilt view */
    Quilt = 2
}
export declare type ViewControlArgs = {
    /**
     * @Deprecated: since 0.4.0 use `quiltResolution` instead
     * Defines the height of the individual quilt view, the width is then set based on the aspect ratio of the connected device.
     * @default 512
     */
    tileHeight: number;
    /**
     * Defines the number of views to be rendered
     * @default 45
     */
    numViews: number;
    /**
     * Defines the rotation of the camera on the X-axis
     * @default 0
     */
    trackballX: number;
    /**
     * Defines the rotation of the camera on the Y-axis
     * @default 0
     */
    trackballY: number;
    /**
     * Defines the position of the camera on the x-axis
     * @default 0
     */
    targetX: number;
    /**
     * Defines the position of the camera on the Y-axis
     * @default 1.6 (or `DefaultEyeHeight`)
     */
    targetY: number;
    /**
     * Defines the position of the camera on the Z-axis
     * @default -0.5
     */
    targetZ: number;
    /**
     * Defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
     * @default 2.0
     */
    targetDiam: number;
    /**
     * Defines the vertical FOV of your camera (defined in radians)
     * @default (13.0 / 180) * Math.PI
     */
    fovy: number;
    /**
     * Modifies to the view frustum to increase or decrease the perceived depth of the scene.
     * @default 1.25
     */
    depthiness: number;
    /**
     * Changes how the original canvas on your main web page is displayed, can show the encoded subpixel matrix, a single centered view, or a quilt view.
     * @default InlineView.Center
     */
    inlineView: InlineView;
    /**
     * A reference to the popup window, this will only exist once the window is opened. Calling before the window is open will fail.
     * @default Window
     */
    popup: Window | null;
    /**
     * The current capture state, when capturing is set to true the device width and height is overridden for higher quality capture
     * @default false
     */
    capturing: boolean;
    /**
     * A reference to the current XRSession, giving access to the WebXR rendering context, this should be read only unless you like living dangerously
     */
    XRSession: any;
    /**
     * The current quilt resolution, this is a read only value that is set based on the connected device
     * @default 3840
     *
     */
    quiltResolution: number;
    /**
     * The Canvas on the Looking Glass
     * @default null
     */
    lkgCanvas: HTMLCanvasElement | null;
    /**
     * The main webgl context
     * @default null
     */
    appCanvas: HTMLCanvasElement | null;
};
declare type LookingGlassConfigEvent = "on-config-changed";
export declare class LookingGlassConfig extends EventTarget {
    private _calibration;
    private _viewControls;
    LookingGlassDetected: any;
    constructor(cfg?: Partial<ViewControlArgs>);
    private syncCalibration;
    addEventListener(type: LookingGlassConfigEvent, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void;
    private onConfigChange;
    get calibration(): CalibrationArgs;
    set calibration(value: Partial<CalibrationArgs>);
    updateViewControls(value: Partial<ViewControlArgs> | undefined): void;
    /**
     * @deprecated defines the height of the individual quilt view, the width is then set based on the aspect ratio of the connected device.
     */
    get tileHeight(): number;
    /**
     * defines the quilt resolution, only change this at start, do not change this after an XRSession has started
     */
    get quiltResolution(): number;
    set quiltResolution(v: number);
    /**
     * defines the number of views to be rendered
     */
    get numViews(): number;
    /**
     * defines the position of the camera on the X-axis
     */
    get targetX(): number;
    set targetX(v: number);
    /**
     * defines the position of the camera on the Y-axis
     */
    get targetY(): number;
    set targetY(v: number);
    /**
     * defines the position of the camera on the X-axis
     */
    get targetZ(): number;
    set targetZ(v: number);
    /**
     * defines the rotation of the camera on the X-axis
     */
    get trackballX(): number;
    set trackballX(v: number);
    /**
     * defines the rotation of the camera on the Y-axis
     */
    get trackballY(): number;
    set trackballY(v: number);
    /**
     * defines the size of the camera, this makes your scene bigger or smaller without changing the focus.
     */
    get targetDiam(): number;
    set targetDiam(v: number);
    /**
     * defines the vertical FOV of your camera (defined in radians)
     */
    get fovy(): number;
    set fovy(v: number);
    /**
     * modifies to the view frustum to increase or decrease the perceived depth of the scene.
     */
    get depthiness(): number;
    set depthiness(v: number);
    /**
     * changes how the original canvas on your main web page is displayed, can show the encoded subpixel matrix, a single centered view, or a quilt view.
     */
    get inlineView(): InlineView;
    set inlineView(v: InlineView);
    get capturing(): boolean;
    set capturing(v: boolean);
    get popup(): Window | null;
    set popup(v: Window | null);
    get XRSession(): any;
    set XRSession(v: any);
    get lkgCanvas(): HTMLCanvasElement | null;
    set lkgCanvas(v: HTMLCanvasElement | null);
    get appCanvas(): HTMLCanvasElement | null;
    set appCanvas(v: HTMLCanvasElement | null);
    get aspect(): number;
    get tileWidth(): number;
    get framebufferWidth(): number;
    get quiltWidth(): 5 | 8;
    get quiltHeight(): 6 | 9;
    get framebufferHeight(): number;
    get viewCone(): number;
    get tilt(): number;
    set tilt(windowHeight: number);
    get subp(): number;
    get pitch(): number;
}
/** The global LookingGlassConfig */
export declare function getLookingGlassConfig(): LookingGlassConfig;
/** Update the global LookingGlassConfig's viewControls */
export declare function updateLookingGlassConfig(viewControls: Partial<ViewControlArgs> | undefined): void;
export {};
