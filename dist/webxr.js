var fe = Object.defineProperty;
var pe = (t, i, e) => i in t ? fe(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var _ = (t, i, e) => (pe(t, typeof i != "symbol" ? i + "" : i, e), e);
import J from "@lookingglass/webxr-polyfill/src/api/index";
import ve from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import me from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as we from "holoplay-core";
import be from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import ge from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as g } from "gl-matrix";
import Ce, { PRIVATE as xe } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const j = 1.6;
var Z;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(Z || (Z = {}));
class ye extends EventTarget {
  constructor(e) {
    super();
    _(this, "_subpixelModeOverridden", !1);
    _(this, "_calibration", {
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
      CellPatternMode: { value: 0 }
    });
    _(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: j,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 14 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: Z.Center,
      capturing: !1,
      quiltResolution: null,
      columns: null,
      rows: null,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null,
      subpixelMode: 0,
      filterMode: 2,
      gaussianSigma: 0.01,
      focus: 0,
      viewDimming: !1,
      filterEnd: 0.05,
      filterSize: 0.15,
      edgeThreshold: 0.01
    });
    _(this, "LookingGlassDetected");
    this._subpixelModeOverridden = (e == null ? void 0 : e.subpixelMode) !== void 0;
    const n = { ...e };
    n.subpixelMode === void 0 && delete n.subpixelMode, this._viewControls = { ...this._viewControls, ...n }, this.syncCalibration();
  }
  syncCalibration() {
    new we.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, n, s) {
    super.addEventListener(e, n, s);
  }
  onConfigChange() {
    this.dispatchEvent(new Event("on-config-changed"));
  }
  get calibration() {
    return this._calibration;
  }
  set calibration(e) {
    var s;
    this._calibration = {
      ...this._calibration,
      ...e
    };
    const n = (s = this._calibration.CellPatternMode) == null ? void 0 : s.value;
    !this._subpixelModeOverridden && typeof n == "number" && Number.isFinite(n) && (this._viewControls.subpixelMode = Math.round(n)), this.onConfigChange();
  }
  updateViewControls(e) {
    if (e != null) {
      const n = { ...e };
      e.subpixelMode !== void 0 ? this._subpixelModeOverridden = !0 : delete n.subpixelMode, this._viewControls = {
        ...this._viewControls,
        ...n
      }, this.onConfigChange();
    }
  }
  get tileHeight() {
    return Math.round(this.framebufferHeight / this.quiltHeight);
  }
  get quiltResolution() {
    if (this._viewControls.quiltResolution != null)
      return { width: this._viewControls.quiltResolution.width, height: this._viewControls.quiltResolution.height };
    {
      const e = this._calibration.serial;
      switch (!0) {
        case e.startsWith("LKG-2K"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-4K"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-8K"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-P"):
          return { width: 3360, height: 3360 };
        case e.startsWith("LKG-A"):
          return { width: 4096, height: 4096 };
        case e.startsWith("LKG-B"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-D"):
          return { width: 8192, height: 8192 };
        case e.startsWith("LKG-F"):
          return { width: 3360, height: 3360 };
        case e.startsWith("LKG-E"):
          return { width: 4092, height: 4092 };
        case e.startsWith("LKG-H"):
          return { width: 5995, height: 6e3 };
        case e.startsWith("LKG-J"):
          return { width: 5999, height: 5999 };
        case e.startsWith("LKG-K"):
          return { width: 8184, height: 8184 };
        case e.startsWith("LKG-L"):
          return { width: 8190, height: 8190 };
        default:
          return { width: 4096, height: 4096 };
      }
    }
  }
  set quiltResolution(e) {
    this.updateViewControls({ quiltResolution: e });
  }
  get numViews() {
    return this.quiltWidth * this.quiltHeight;
  }
  get targetX() {
    return this._viewControls.targetX;
  }
  set targetX(e) {
    this.updateViewControls({ targetX: e });
  }
  get targetY() {
    return this._viewControls.targetY;
  }
  set targetY(e) {
    this.updateViewControls({ targetY: e });
  }
  get targetZ() {
    return this._viewControls.targetZ;
  }
  set targetZ(e) {
    this.updateViewControls({ targetZ: e });
  }
  get trackballX() {
    return this._viewControls.trackballX;
  }
  set trackballX(e) {
    this.updateViewControls({ trackballX: e });
  }
  get trackballY() {
    return this._viewControls.trackballY;
  }
  set trackballY(e) {
    this.updateViewControls({ trackballY: e });
  }
  get targetDiam() {
    return this._viewControls.targetDiam;
  }
  set targetDiam(e) {
    this.updateViewControls({ targetDiam: e });
  }
  get fovy() {
    return this._viewControls.fovy;
  }
  set fovy(e) {
    this.updateViewControls({ fovy: e });
  }
  get depthiness() {
    return this._viewControls.depthiness;
  }
  set depthiness(e) {
    this.updateViewControls({ depthiness: e });
  }
  get inlineView() {
    return this._viewControls.inlineView;
  }
  set inlineView(e) {
    this.updateViewControls({ inlineView: e });
  }
  get capturing() {
    return this._viewControls.capturing;
  }
  set capturing(e) {
    this.updateViewControls({ capturing: e });
  }
  get subpixelMode() {
    return this._viewControls.subpixelMode;
  }
  set subpixelMode(e) {
    this.updateViewControls({ subpixelMode: e });
  }
  get filterMode() {
    return this._viewControls.filterMode;
  }
  set filterMode(e) {
    this.updateViewControls({ filterMode: e });
  }
  get gaussianSigma() {
    return this._viewControls.gaussianSigma;
  }
  set gaussianSigma(e) {
    this.updateViewControls({ gaussianSigma: e });
  }
  get focus() {
    return this._viewControls.focus;
  }
  set focus(e) {
    this.updateViewControls({ focus: e });
  }
  get viewDimming() {
    return this._viewControls.viewDimming;
  }
  set viewDimming(e) {
    this.updateViewControls({ viewDimming: e });
  }
  get filterEnd() {
    return this._viewControls.filterEnd;
  }
  set filterEnd(e) {
    this.updateViewControls({ filterEnd: e });
  }
  get filterSize() {
    return this._viewControls.filterSize;
  }
  set filterSize(e) {
    this.updateViewControls({ filterSize: e });
  }
  get edgeThreshold() {
    return this._viewControls.edgeThreshold;
  }
  set edgeThreshold(e) {
    this.updateViewControls({ edgeThreshold: e });
  }
  get popup() {
    return this._viewControls.popup;
  }
  set popup(e) {
    this.updateViewControls({ popup: e });
  }
  get XRSession() {
    return this._viewControls.XRSession;
  }
  set XRSession(e) {
    this.updateViewControls({ XRSession: e });
  }
  get lkgCanvas() {
    return this._viewControls.lkgCanvas;
  }
  set lkgCanvas(e) {
    this.updateViewControls({ lkgCanvas: e });
  }
  get appCanvas() {
    return this._viewControls.appCanvas;
  }
  set appCanvas(e) {
    this.updateViewControls({ appCanvas: e });
  }
  get columns() {
    return this._viewControls.columns;
  }
  set columns(e) {
    this.updateViewControls({ columns: e });
  }
  get rows() {
    return this._viewControls.rows;
  }
  set rows(e) {
    this.updateViewControls({ rows: e });
  }
  get aspect() {
    return this._calibration.screenW.value / this._calibration.screenH.value;
  }
  get tileWidth() {
    return Math.round(this.framebufferWidth / this.quiltWidth);
  }
  get framebufferWidth() {
    return this.quiltResolution.width;
  }
  get quiltWidth() {
    if (this._viewControls.columns != null)
      return this._viewControls.columns;
    const e = this._calibration.serial;
    switch (!0) {
      case e.startsWith("LKG-2K"):
        return 5;
      case e.startsWith("LKG-4K"):
        return 5;
      case e.startsWith("LKG-8K"):
        return 5;
      case e.startsWith("LKG-P"):
        return 8;
      case e.startsWith("LKG-A"):
        return 5;
      case e.startsWith("LKG-B"):
        return 5;
      case e.startsWith("LKG-D"):
        return 8;
      case e.startsWith("LKG-F"):
        return 8;
      case e.startsWith("LKG-E"):
        return 11;
      case e.startsWith("LKG-H"):
        return 11;
      case e.startsWith("LKG-J"):
        return 7;
      case e.startsWith("LKG-K"):
        return 11;
      case e.startsWith("LKG-L"):
        return 7;
      default:
        return 1;
    }
  }
  get quiltHeight() {
    if (this._viewControls.rows != null)
      return this._viewControls.rows;
    const e = this._calibration.serial;
    switch (!0) {
      case e.startsWith("LKG-2K"):
        return 9;
      case e.startsWith("LKG-4K"):
        return 9;
      case e.startsWith("LKG-8K"):
        return 9;
      case e.startsWith("LKG-P"):
        return 6;
      case e.startsWith("LKG-A"):
        return 9;
      case e.startsWith("LKG-B"):
        return 9;
      case e.startsWith("LKG-D"):
        return 9;
      case e.startsWith("LKG-F"):
        return 6;
      case e.startsWith("LKG-E"):
        return 6;
      case e.startsWith("LKG-H"):
        return 6;
      case e.startsWith("LKG-J"):
        return 7;
      case e.startsWith("LKG-K"):
        return 6;
      case e.startsWith("LKG-L"):
        return 7;
      default:
        return 1;
    }
  }
  get framebufferHeight() {
    return this.quiltResolution.height;
  }
  get viewCone() {
    return this._calibration.viewCone.value * this.depthiness / 180 * Math.PI;
  }
  get tilt() {
    return this._calibration.screenH.value / (this._calibration.screenW.value * this._calibration.slope.value) * (this._calibration.flipImageX.value ? -1 : 1);
  }
  get subp() {
    return 1 / (this._calibration.screenW.value * 3) * (this._calibration.flipImageX.value ? -1 : 1);
  }
  get pitch() {
    return this._calibration.pitch.value * this._calibration.screenW.value / this._calibration.DPI.value * Math.cos(Math.atan(1 / this._calibration.slope.value));
  }
  get center() {
    const e = this._calibration.flipImageX.value ? 0.5 : 0;
    return this._calibration.center.value + e;
  }
  get subpixelCells() {
    const e = new Float32Array(6 * this._calibration.subpixelCells.length);
    return this._calibration.subpixelCells.forEach((n, s) => {
      e[s * 6 + 0] = n.ROffsetX / this.calibration.screenW.value, e[s * 6 + 1] = n.ROffsetY / this.calibration.screenH.value, e[s * 6 + 2] = n.GOffsetX / this.calibration.screenW.value, e[s * 6 + 3] = n.GOffsetY / this.calibration.screenH.value, e[s * 6 + 4] = n.BOffsetX / this.calibration.screenW.value, e[s * 6 + 5] = n.BOffsetY / this.calibration.screenH.value;
    }), e;
  }
}
let Y = null;
function V() {
  return Y == null && (Y = new ye()), Y;
}
function ee(t) {
  const i = V();
  t != null && i.updateViewControls(t);
}
const Q = 16;
function L(t) {
  if (!Number.isFinite(t))
    return "0.0";
  const i = t.toPrecision(10);
  return i.includes(".") || i.includes("e") ? i : `${i}.0`;
}
function O(t) {
  return Number.isFinite(t) ? Math.round(t).toString() : "0";
}
function $(t, i, e) {
  return Math.min(Math.max(t, i), e);
}
function Ee(t) {
  const i = t.numViews, e = Math.floor(t.framebufferWidth / t.quiltWidth), n = Math.floor(t.framebufferHeight / t.quiltHeight), s = t.quiltWidth * e / t.framebufferWidth, o = t.quiltHeight * n / t.framebufferHeight, u = Math.min(t.calibration.subpixelCells.length, Q), x = Math.max(u, 1), c = $(Math.round(t.filterMode), 0, 3), p = Math.floor(i / 2), f = Number.isFinite(t.filterEnd) ? t.filterEnd : 0.05, W = $(f, 0, 0.499999), m = Number.isFinite(t.filterSize) ? t.filterSize : 0.15, b = $(m, 1e-6, Math.max(1e-6, 0.5 - W)), T = Number.isFinite(t.gaussianSigma) ? t.gaussianSigma : 0.01, y = Math.max(Math.abs(T), 1e-6), d = Number.isFinite(t.edgeThreshold) ? t.edgeThreshold : 0.01, r = Math.max(d, 1e-6);
  return `#version 300 es
precision highp float;

uniform int u_viewType;
uniform sampler2D u_texture;
in vec2 v_texcoord;
out vec4 color;

const int MAX_SUBPIXEL_CELLS = ${Q};
uniform float subpixelData[6 * MAX_SUBPIXEL_CELLS];

const float pitch = ${L(t.pitch)};
const float slope = ${L(t.tilt)};
const float center = ${L(t.center)};
const float subpixelSize = ${L(t.subp)};
const float screenW = ${L(t.calibration.screenW.value)};
const float screenH = ${L(t.calibration.screenH.value)};
const float tileCount = ${L(i)};
const vec2 viewPortion = vec2(${L(s)}, ${L(o)});
const vec4 tile = vec4(${L(t.quiltWidth)}, ${L(t.quiltHeight)}, ${L(i)}, 0.0);
const float focus = ${L(t.focus * t.quiltWidth)};
const int subpixelCellCount = ${O(u)};
const int safeSubpixelCellCount = ${O(x)};
const int filter_mode = ${O(c)};
const int cellPatternType = ${O(t.subpixelMode)};
const int filter_edge = ${t.viewDimming ? 1 : 0};
const float filter_end = ${L(W)};
const float filter_size = ${L(b)};
const float gaussian_sigma = ${L(y)};
const float edgeThreshold = ${L(r)};

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
		color = texture(u_texture, GetQuiltCoordinates(v_texcoord, ${p}));
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
`;
}
async function _e() {
  const t = V();
  let i = 2;
  async function e() {
    if (t.appCanvas != null)
      try {
        t.capturing = !0, await new Promise((u) => {
          requestAnimationFrame(u);
        }), t.appCanvas.width = t.quiltResolution.width, t.appCanvas.height = t.quiltResolution.height;
        let s = t.appCanvas.toDataURL();
        const o = document.createElement("a");
        o.style.display = "none", o.href = s, o.download = `hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`, document.body.appendChild(o), o.click(), document.body.removeChild(o), window.URL.revokeObjectURL(s);
      } catch (s) {
        console.error("Error while capturing canvas data:", s), t.capturing = !1;
      } finally {
        t.inlineView = i, t.capturing = !1, t.appCanvas.width = t.calibration.screenW.value, t.appCanvas.height = t.calibration.screenH.value;
      }
  }
  const n = document.getElementById("screenshotbutton");
  n && n.addEventListener("click", () => {
    i = t.inlineView;
    const s = N.getInstance();
    if (!s) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    t.inlineView = 2, s.captureScreenshot = !0, setTimeout(() => {
      s.screenshotCallback = e;
    }, 100);
  });
}
function Le() {
  var i, e, n, s, o;
  const t = V();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let u = function() {
      let r = d.d - d.a, a = d.w - d.s;
      r && a && (r *= Math.sqrt(0.5), a *= Math.sqrt(0.5));
      const l = t.trackballX, h = t.trackballY, v = Math.cos(l) * r - Math.sin(l) * Math.cos(h) * a, R = -Math.sin(h) * a, S = -Math.sin(l) * r - Math.cos(l) * Math.cos(h) * a;
      t.targetX = t.targetX + v * t.targetDiam * 0.03, t.targetY = t.targetY + R * t.targetDiam * 0.03, t.targetZ = t.targetZ + S * t.targetDiam * 0.03, requestAnimationFrame(u);
    };
    const x = document.createElement("style");
    document.head.appendChild(x), (i = x.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const c = document.createElement("div");
    c.id = "LookingGlassWebXRControls", c.style.position = "fixed", c.style.zIndex = "1000", c.style.padding = "15px", c.style.width = "320px", c.style.maxWidth = "calc(100vw - 18px)", c.style.maxHeight = "calc(100vh - 18px)", c.style.whiteSpace = "nowrap", c.style.background = "rgba(0, 0, 0, 0.6)", c.style.color = "white", c.style.borderRadius = "10px", c.style.right = "15px", c.style.bottom = "15px", c.style.flex = "row";
    const p = document.createElement("div");
    c.appendChild(p), p.style.width = "100%", p.style.textAlign = "center", p.style.fontWeight = "bold", p.style.marginBottom = "8px", p.innerText = "Looking Glass Controls";
    const f = document.createElement("button");
    f.style.display = "block", f.style.margin = "auto", f.style.width = "100%", f.style.height = "35px", f.style.padding = "4px", f.style.marginBottom = "8px", f.style.borderRadius = "8px", f.id = "screenshotbutton", c.appendChild(f), f.innerText = "Save Hologram", t.quiltResolution.height * t.quiltResolution.width > 33177600 ? (f.style.backgroundColor = "#ccc", f.style.color = "#999", f.style.cursor = "not-allowed", f.title = "Button is disabled because the quilt resolution is too large.") : (f.style.backgroundColor = "", f.style.color = "", f.style.cursor = "", f.title = "");
    const m = document.createElement("button");
    m.style.display = "block", m.style.margin = "auto", m.style.width = "100%", m.style.height = "35px", m.style.padding = "4px", m.style.marginBottom = "8px", m.style.borderRadius = "8px", m.id = "copybutton", c.appendChild(m), m.innerText = "Copy Config", m.addEventListener("click", () => {
      Te(t);
    });
    const b = document.createElement("div");
    c.appendChild(b), b.style.width = "290px", b.style.whiteSpace = "normal", b.style.color = "rgba(255,255,255,0.7)", b.style.fontSize = "14px", b.style.margin = "5px 0", b.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const T = document.createElement("div");
    c.appendChild(T);
    const y = (r, a, l) => {
      const h = l.stringify, v = document.createElement("div");
      v.style.marginBottom = "8px", T.appendChild(v);
      const R = r, S = t[r], E = document.createElement("label");
      v.appendChild(E), E.innerText = l.label, E.setAttribute("for", R), E.style.width = "100px", E.style.display = "inline-block", E.style.textDecoration = "dotted underline 1px", E.style.fontFamily = '"Courier New"', E.style.fontSize = "13px", E.style.fontWeight = "bold", E.title = l.title;
      const w = document.createElement("input");
      v.appendChild(w), Object.assign(w, a), w.id = R, w.title = l.title, w.value = a.value !== void 0 ? a.value : S;
      const I = (C) => {
        t[r] = C, B(C);
      };
      w.oninput = () => {
        const C = a.type === "range" ? parseFloat(w.value) : a.type === "checkbox" ? w.checked : w.value;
        I(C);
      };
      const A = (C) => {
        let F = C(t[r]);
        l.fixRange && (F = l.fixRange(F), w.max = Math.max(parseFloat(w.max), F).toString(), w.min = Math.min(parseFloat(w.min), F).toString()), w.value = F, I(F);
      };
      a.type === "range" && (w.style.width = "110px", w.style.height = "8px", w.onwheel = (C) => {
        A((F) => F + Math.sign(C.deltaX - C.deltaY) * a.step);
      });
      let B = (C) => {
      };
      if (h) {
        const C = document.createElement("span");
        C.style.fontFamily = '"Courier New"', C.style.fontSize = "13px", C.style.marginLeft = "3px", v.appendChild(C), B = (F) => {
          C.innerHTML = h(F);
        }, B(S);
      }
      return A;
    };
    y("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (r) => Math.max(1 / 180 * Math.PI, Math.min(r, 120.1 / 180 * Math.PI)),
      stringify: (r) => {
        const a = r / Math.PI * 180, l = Math.atan(Math.tan(r / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${a.toFixed()}&deg;&times;${l.toFixed()}&deg;`;
      }
    }), y("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (r) => Math.max(0, r),
      stringify: (r) => `${r.toFixed(2)}x`
    }), y("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (r) => Math.max(0, Math.min(r, 2)),
      stringify: (r) => r === 0 ? "swizzled" : r === 1 ? "center" : r === 2 ? "quilt" : "?"
    }), y("filterMode", { type: "range", min: 0, max: 3, step: 1 }, {
      label: "view filtering mode",
      title: "controls the method used for view blending",
      fixRange: (r) => Math.max(0, Math.min(r, 3)),
      stringify: (r) => r === 0 ? "old, studio style" : r === 1 ? "2 view" : r === 2 ? "gaussian" : r === 3 ? "21-view gaussian (expensive)" : "?"
    }), y("gaussianSigma", { type: "range", min: 1e-3, max: 1, step: 0.01 }, {
      label: "gaussian sigma",
      title: "control view blending",
      fixRange: (r) => Math.max(1e-3, Math.min(r, 1)),
      stringify: (r) => r
    }), t.lkgCanvas.oncontextmenu = (r) => {
      r.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (r) => {
      const a = t.targetDiam, l = 1.1, h = Math.log(a) / Math.log(l);
      return t.targetDiam = Math.pow(l, h + r.deltaY * 0.01);
    }, { passive: !1 }), t.lkgCanvas.addEventListener("mousemove", (r) => {
      const a = r.movementX, l = -r.movementY;
      if (r.buttons & 2 || r.buttons & 1 && (r.shiftKey || r.ctrlKey)) {
        const h = t.trackballX, v = t.trackballY, R = -Math.cos(h) * a + Math.sin(h) * Math.sin(v) * l, S = -Math.cos(v) * l, E = Math.sin(h) * a + Math.cos(h) * Math.sin(v) * l;
        t.targetX = t.targetX + R * t.targetDiam * 1e-3, t.targetY = t.targetY + S * t.targetDiam * 1e-3, t.targetZ = t.targetZ + E * t.targetDiam * 1e-3;
      } else
        r.buttons & 1 && (t.trackballX = t.trackballX - a * 0.01, t.trackballY = t.trackballY - l * 0.01);
    });
    const d = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (r) => {
      switch (r.code) {
        case "KeyW":
          d.w = 1;
          break;
        case "KeyA":
          d.a = 1;
          break;
        case "KeyS":
          d.s = 1;
          break;
        case "KeyD":
          d.d = 1;
          break;
      }
    }), t.lkgCanvas.addEventListener("keyup", (r) => {
      switch (r.code) {
        case "KeyW":
          d.w = 0;
          break;
        case "KeyA":
          d.a = 0;
          break;
        case "KeyS":
          d.s = 0;
          break;
        case "KeyD":
          d.d = 0;
          break;
      }
    }), (e = t.appCanvas) == null || e.addEventListener("wheel", (r) => {
      const a = t.targetDiam, l = 1.1, h = Math.log(a) / Math.log(l);
      return t.targetDiam = Math.pow(l, h + r.deltaY * 0.01);
    }, { passive: !1 }), (n = t.appCanvas) == null || n.addEventListener("mousemove", (r) => {
      const a = r.movementX, l = -r.movementY;
      if (r.buttons & 2 || r.buttons & 1 && (r.shiftKey || r.ctrlKey)) {
        const h = t.trackballX, v = t.trackballY, R = -Math.cos(h) * a + Math.sin(h) * Math.sin(v) * l, S = -Math.cos(v) * l, E = Math.sin(h) * a + Math.cos(h) * Math.sin(v) * l;
        t.targetX = t.targetX + R * t.targetDiam * 1e-3, t.targetY = t.targetY + S * t.targetDiam * 1e-3, t.targetZ = t.targetZ + E * t.targetDiam * 1e-3;
      } else
        r.buttons & 1 && (t.trackballX = t.trackballX - a * 0.01, t.trackballY = t.trackballY - l * 0.01);
    }), (s = t.appCanvas) == null || s.addEventListener("keydown", (r) => {
      switch (r.code) {
        case "KeyW":
          d.w = 1;
          break;
        case "KeyA":
          d.a = 1;
          break;
        case "KeyS":
          d.s = 1;
          break;
        case "KeyD":
          d.d = 1;
          break;
      }
    }), (o = t.appCanvas) == null || o.addEventListener("keyup", (r) => {
      switch (r.code) {
        case "KeyW":
          d.w = 0;
          break;
        case "KeyA":
          d.a = 0;
          break;
        case "KeyS":
          d.s = 0;
          break;
        case "KeyD":
          d.d = 0;
          break;
      }
    }), requestAnimationFrame(u), setTimeout(() => {
      _e();
    }, 1e3), c;
  }
}
function Te(t) {
  const i = {
    targetX: t.targetX,
    targetY: t.targetY,
    targetZ: t.targetZ,
    fovy: `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: t.targetDiam,
    trackballX: t.trackballX,
    trackballY: t.trackballY,
    depthiness: t.depthiness
  };
  let e = JSON.stringify(i, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let q;
const Re = (t, i) => {
  const e = V();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else
    t == !1 ? Me(e, q) : (q == null && (q = Le()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(q), "getScreenDetails" in window ? Se(e.lkgCanvas, e, i) : te(e, e.lkgCanvas, i));
};
async function Se(t, i, e) {
  const s = (await window.getScreenDetails()).screens.filter((o) => o.label.includes("LKG"))[0];
  if (s === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), te(i, t, e);
    return;
  } else {
    const o = [
      `left=${s.left}`,
      `top=${s.top}`,
      `width=${s.width}`,
      `height=${s.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    i.popup = window.open("", "new", o), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.style.transform = "1.0", ie(i), i.popup.document.body.appendChild(t), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function te(t, i, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.style.transform = "1.0", ie(t), t.popup.document.body.appendChild(i), console.assert(e), t.popup.onbeforeunload = e);
}
function Me(t, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
function ie(t) {
  t.popup && t.popup.document.addEventListener("keydown", (i) => {
    i.ctrlKey && (i.key === "=" || i.key === "-" || i.key === "+") && i.preventDefault();
  });
}
const G = Symbol("LookingGlassXRWebGLLayer");
class Pe extends Ce {
  constructor(i, e, n) {
    super(i, e, n);
    const s = V();
    s.appCanvas = e.canvas, s.lkgCanvas = document.createElement("canvas"), s.lkgCanvas.tabIndex = 0;
    const o = s.lkgCanvas.getContext("2d", { alpha: !1 });
    s.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const u = this[xe].config, x = e.createTexture();
    let c, p;
    const f = e.createFramebuffer(), W = e.enable.bind(e), m = e.disable.bind(e), b = e.getExtension("OES_vertex_array_object"), T = 34229, y = b ? b.bindVertexArrayOES.bind(b) : e.bindVertexArray.bind(e), d = () => {
      const M = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, x), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, s.framebufferWidth, s.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_BASE_LEVEL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, 0), e.bindTexture(e.TEXTURE_2D, M), c) {
        const k = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, c), e.renderbufferStorage(e.RENDERBUFFER, p.format, s.framebufferWidth, s.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, k);
      }
    };
    (u.depth || u.stencil) && (u.depth && u.stencil ? p = { format: e.DEPTH_STENCIL, attachment: e.DEPTH_STENCIL_ATTACHMENT } : u.depth ? p = { format: e.DEPTH_COMPONENT16, attachment: e.DEPTH_ATTACHMENT } : u.stencil && (p = { format: e.STENCIL_INDEX8, attachment: e.STENCIL_ATTACHMENT }), c = e.createRenderbuffer()), d(), s.addEventListener("on-config-changed", d);
    const r = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, f), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, x, 0), (u.depth || u.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, p.attachment, e.RENDERBUFFER, c), e.bindFramebuffer(e.FRAMEBUFFER, r);
    const a = e.createProgram();
    if (!a)
      return;
    const l = e.createShader(e.VERTEX_SHADER);
    if (!l)
      return;
    e.attachShader(a, l);
    const h = e.createShader(e.FRAGMENT_SHADER);
    if (!h)
      return;
    e.attachShader(a, h);
    {
      const M = `#version 300 es
			layout(location = 0) in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;
      e.shaderSource(l, M), e.compileShader(l), e.getShaderParameter(l, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(l));
    }
    let v, R = 0, S, E = null, w = null;
    const I = () => {
      const M = Ee(s);
      if (M !== v) {
        if (e.shaderSource(h, M), e.compileShader(h), !e.getShaderParameter(h, e.COMPILE_STATUS)) {
          console.warn(e.getShaderInfoLog(h));
          return;
        }
        if (e.linkProgram(a), !e.getProgramParameter(a, e.LINK_STATUS)) {
          console.warn(e.getProgramInfoLog(a));
          return;
        }
        v = M, R = e.getAttribLocation(a, "a_position"), S = e.getUniformLocation(a, "u_viewType"), E = e.getUniformLocation(a, "u_texture"), w = e.getUniformLocation(a, "subpixelData");
      }
      const k = s.subpixelCells, D = Q * 6, H = new Float32Array(D);
      H.set(k.length > D ? k.slice(0, D) : k);
      const z = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(a), e.uniform1i(E, 0), e.uniform1fv(w, H), e.useProgram(z);
    };
    s.addEventListener("on-config-changed", I), I();
    const A = b ? b.createVertexArrayOES() : e.createVertexArray(), B = e.createBuffer(), C = e.getParameter(e.ARRAY_BUFFER_BINDING), F = e.getParameter(T);
    y(A), e.bindBuffer(e.ARRAY_BUFFER, B), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(R), e.vertexAttribPointer(R, 2, e.FLOAT, !1, 0, 0), y(F), e.bindBuffer(e.ARRAY_BUFFER, C);
    const re = () => {
      console.assert(this[G].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, f);
      const M = e.getParameter(e.COLOR_CLEAR_VALUE), k = e.getParameter(e.DEPTH_CLEAR_VALUE), D = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(M[0], M[1], M[2], M[3]), e.clearDepth(k), e.clearStencil(D);
    }, P = e.canvas;
    let X, K;
    const ne = () => {
      if (!this[G].LookingGlassEnabled)
        return;
      (P.width !== s.calibration.screenW.value || P.height !== s.calibration.screenH.value) && s.capturing === !1 ? (X = P.width, K = P.height, P.width = s.calibration.screenW.value, P.height = s.calibration.screenH.value) : s.capturing === !0 && (X = P.width, K = P.height, P.width = s.framebufferWidth, P.height = s.framebufferHeight);
      const M = e.getParameter(T), k = e.getParameter(e.CULL_FACE), D = e.getParameter(e.BLEND), H = e.getParameter(e.DEPTH_TEST), z = e.getParameter(e.STENCIL_TEST), ae = e.getParameter(e.SCISSOR_TEST), oe = e.getParameter(e.VIEWPORT), le = e.getParameter(e.FRAMEBUFFER_BINDING), ce = e.getParameter(e.RENDERBUFFER_BINDING), ue = e.getParameter(e.CURRENT_PROGRAM), he = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const de = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(a), y(A), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, x), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(S, 0), e.drawArrays(e.TRIANGLES, 0, 6), o == null || o.clearRect(0, 0, s.calibration.screenW.value, s.calibration.screenH.value), o == null || o.drawImage(P, 0, 0), s.inlineView !== 0 && (e.uniform1i(S, s.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, de);
      }
      e.activeTexture(he), e.useProgram(ue), e.bindRenderbuffer(e.RENDERBUFFER, ce), e.bindFramebuffer(e.FRAMEBUFFER, le), e.viewport(...oe), (ae ? W : m)(e.SCISSOR_TEST), (z ? W : m)(e.STENCIL_TEST), (H ? W : m)(e.DEPTH_TEST), (D ? W : m)(e.BLEND), (k ? W : m)(e.CULL_FACE), y(M);
    };
    this[G] = {
      LookingGlassEnabled: !1,
      framebuffer: f,
      clearFramebuffer: re,
      blitTextureToDefaultFramebufferIfNeeded: ne,
      moveCanvasToWindow: Re,
      restoreOriginalCanvasDimensions: () => {
        X && K && (P.width = X, P.height = K, X = K = void 0);
      }
    };
  }
  get framebuffer() {
    return this[G].LookingGlassEnabled ? this[G].framebuffer : null;
  }
  get framebufferWidth() {
    return V().framebufferWidth;
  }
  get framebufferHeight() {
    return V().framebufferHeight;
  }
}
const U = class extends be {
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = g.create(), this.inlineProjectionMatrix = g.create(), this.inlineInverseViewMatrix = g.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, U.instance || (U.instance = this);
  }
  static getInstance() {
    return U.instance;
  }
  onBaseLayerSet(i, e) {
    const n = this.sessions.get(i);
    n.baseLayer = e;
    const s = V(), o = e[G];
    o.LookingGlassEnabled = n.immersive, n.immersive && (s.XRSession = this.sessions.get(i), s.popup == null ? o.moveCanvasToWindow(!0, () => {
      this.endSession(i);
    }) : console.warn("attempted to assign baselayer twice?"));
  }
  isSessionSupported(i) {
    return i === "inline" || i === "immersive-vr";
  }
  isFeatureSupported(i) {
    switch (i) {
      case "viewer":
        return !0;
      case "local":
        return !0;
      case "local-floor":
        return !0;
      case "bounded-floor":
        return !1;
      case "unbounded":
        return !1;
      default:
        return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", i), !1;
    }
  }
  async requestSession(i, e) {
    if (!this.isSessionSupported(i))
      return Promise.reject();
    const n = i !== "inline", s = new We(i, e), o = V();
    return this.sessions.set(s.id, s), n && (this.dispatchEvent("@@webxr-polyfill/vr-present-start", s.id), window.addEventListener("unload", () => {
      o.popup && o.popup.close(), o.popup = null;
    })), Promise.resolve(s.id);
  }
  requestAnimationFrame(i) {
    return this.global.requestAnimationFrame(i);
  }
  cancelAnimationFrame(i) {
    this.global.cancelAnimationFrame(i);
  }
  onFrameStart(i, e) {
    const n = this.sessions.get(i), s = V();
    if (n.immersive) {
      const o = Math.tan(0.5 * s.fovy), u = 0.5 * s.targetDiam / o, x = u - s.targetDiam, c = this.basePoseMatrix;
      g.fromTranslation(c, [s.targetX, s.targetY, s.targetZ]), g.rotate(c, c, s.trackballX, [0, 1, 0]), g.rotate(c, c, -s.trackballY, [1, 0, 0]), g.translate(c, c, [0, 0, u]);
      for (let p = 0; p < s.numViews; ++p) {
        const f = (p + 0.5) / s.numViews - 0.5, W = Math.tan(s.viewCone * f), m = u * W, b = this.LookingGlassInverseViewMatrices[p] = this.LookingGlassInverseViewMatrices[p] || g.create();
        g.translate(b, c, [m, 0, 0]), g.invert(b, b);
        const T = Math.max(x + e.depthNear, 0.01), y = x + e.depthFar, d = T * o, r = d, a = -d, l = T * -W, h = s.aspect * d, v = l + h, R = l - h, S = this.LookingGlassProjectionMatrices[p] = this.LookingGlassProjectionMatrices[p] || g.create();
        g.set(S, 2 * T / (v - R), 0, 0, 0, 0, 2 * T / (r - a), 0, 0, (v + R) / (v - R), (r + a) / (r - a), -(y + T) / (y - T), -1, 0, 0, -2 * y * T / (y - T), 0);
      }
    } else {
      const o = n.baseLayer.context, u = o.drawingBufferWidth / o.drawingBufferHeight;
      g.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, u, e.depthNear, e.depthFar), g.fromTranslation(this.basePoseMatrix, [0, j, 0]), g.invert(this.inlineInverseViewMatrix, this.basePoseMatrix), n.baseLayer[G].clearFramebuffer();
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[G].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(i, e) {
    const n = g.create();
    switch (i) {
      case "viewer":
      case "local":
        return g.fromTranslation(n, [0, -j, 0]), n;
      case "local-floor":
        return n;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[G].moveCanvasToWindow(!1), e.baseLayer[G].LookingGlassEnabled = !1, e.baseLayer[G].restoreOriginalCanvasDimensions(), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const n = this.sessions.get(i);
    return n.ended ? !1 : n.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = V();
      for (let n = this.viewSpaces.length; n < e.numViews; ++n)
        this.viewSpaces[n] = new Fe(n);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, n, s, o) {
    if (o === void 0) {
      const x = this.sessions.get(i).baseLayer.context;
      s.x = 0, s.y = 0, s.width = x.drawingBufferWidth, s.height = x.drawingBufferHeight;
    } else {
      const u = V(), x = o % u.quiltWidth, c = Math.floor(o / u.quiltWidth);
      s.x = u.framebufferWidth / u.quiltWidth * x, s.y = u.framebufferHeight / u.quiltHeight * c, s.width = u.framebufferWidth / u.quiltWidth, s.height = u.framebufferHeight / u.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(i, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || g.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(i) {
    return this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || g.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(i, e, n) {
    return null;
  }
  onWindowResize() {
  }
};
let N = U;
_(N, "instance", null);
let Ve = 0;
class We {
  constructor(i, e) {
    _(this, "mode");
    _(this, "immersive");
    _(this, "id");
    _(this, "baseLayer");
    _(this, "inlineVerticalFieldOfView");
    _(this, "ended");
    _(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++Ve, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class Fe extends ge {
  constructor(e) {
    super();
    _(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class se extends me {
  constructor(e) {
    super();
    _(this, "vrButton");
    _(this, "device");
    _(this, "isPresenting", !1);
    ee(e), this.loadPolyfill();
  }
  static async init(e) {
    new se(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in J)
      this.global[e] = J[e];
    this.global.XRWebGLLayer = Pe, this.injected = !0, this.device = new N(this.global), this.xr = new ve(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await Ge("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await ke(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    ee(e);
  }
}
async function Ge(t) {
  return new Promise((i) => {
    const e = new MutationObserver(function(n) {
      n.forEach(function(s) {
        s.addedNodes.forEach(function(o) {
          const u = o;
          u.id === t && (i(u), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), i(null);
    }, 5e3);
  });
}
function ke(t) {
  return new Promise((i) => setTimeout(i, t));
}
const He = V();
export {
  He as LookingGlassConfig,
  se as LookingGlassWebXRPolyfill
};
