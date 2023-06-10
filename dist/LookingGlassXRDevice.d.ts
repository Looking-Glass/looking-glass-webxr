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
import XRDevice from '@lookingglass/webxr-polyfill/src/devices/XRDevice';
export default class LookingGlassXRDevice extends XRDevice {
    static instance: LookingGlassXRDevice | null;
    constructor(global: any);
    static getInstance(): LookingGlassXRDevice | null;
    onBaseLayerSet(sessionId: any, layer: any): void;
    isSessionSupported(mode: any): boolean;
    isFeatureSupported(featureDescriptor: any): boolean;
    requestSession(mode: any, enabledFeatures: any): Promise<any>;
    requestAnimationFrame(callback: any): any;
    cancelAnimationFrame(handle: any): void;
    onFrameStart(sessionId: any, renderState: any): void;
    onFrameEnd(sessionId: any): void;
    requestFrameOfReferenceTransform(type: any, options: any): Promise<any>;
    endSession(sessionId: any): void;
    doesSessionSupportReferenceSpace(sessionId: any, type: any): any;
    getViewSpaces(mode: any): any;
    getViewport(sessionId: any, eye: any, layer: any, target: any, viewIndex: any): boolean;
    getProjectionMatrix(eye: any, viewIndex: any): any;
    getBasePoseMatrix(): any;
    getBaseViewMatrix(): any;
    _getViewMatrixByIndex(viewIndex: any): any;
    getInputSources(): never[];
    getInputPose(inputSource: any, coordinateSystem: any, poseType: any): null;
    onWindowResize(): void;
}
