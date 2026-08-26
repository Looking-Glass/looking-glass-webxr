(function(m,M){typeof exports=="object"&&typeof module<"u"?M(exports,require("@lookingglass/webxr-polyfill/src/api/index"),require("@lookingglass/webxr-polyfill/src/api/XRSystem"),require("@lookingglass/webxr-polyfill/src/WebXRPolyfill"),require("holoplay-core"),require("@lookingglass/webxr-polyfill/src/devices/XRDevice"),require("@lookingglass/webxr-polyfill/src/api/XRSpace"),require("gl-matrix"),require("@lookingglass/webxr-polyfill/src/api/XRWebGLLayer")):typeof define=="function"&&define.amd?define(["exports","@lookingglass/webxr-polyfill/src/api/index","@lookingglass/webxr-polyfill/src/api/XRSystem","@lookingglass/webxr-polyfill/src/WebXRPolyfill","holoplay-core","@lookingglass/webxr-polyfill/src/devices/XRDevice","@lookingglass/webxr-polyfill/src/api/XRSpace","gl-matrix","@lookingglass/webxr-polyfill/src/api/XRWebGLLayer"],M):(m=typeof globalThis<"u"?globalThis:m||self,M(m["Looking Glass WebXR"]={},m["@lookingglass/webxr-polyfill/src/api/index"],m["@lookingglass/webxr-polyfill/src/api/XRSystem"],m["@lookingglass/webxr-polyfill/src/WebXRPolyfill"],m.holoPlayCore,m["@lookingglass/webxr-polyfill/src/devices/XRDevice"],m["@lookingglass/webxr-polyfill/src/api/XRSpace"],m.glMatrix,m["@lookingglass/webxr-polyfill/src/api/XRWebGLLayer"]))})(this,function(m,M,X,ce,ue,de,he,g,ne){"use strict";var He=Object.defineProperty;var qe=(m,M,X)=>M in m?He(m,M,{enumerable:!0,configurable:!0,writable:!0,value:X}):m[M]=X;var R=(m,M,X)=>(qe(m,typeof M!="symbol"?M+"":M,X),X);const B=t=>t&&typeof t=="object"&&"default"in t?t:{default:t};function fe(t){if(t&&t.__esModule)return t;const i=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t){for(const e in t)if(e!=="default"){const r=Object.getOwnPropertyDescriptor(t,e);Object.defineProperty(i,e,r.get?r:{enumerable:!0,get:()=>t[e]})}}return i.default=t,Object.freeze(i)}const re=B(M),pe=B(X),ve=B(ce),me=fe(ue),we=B(de),be=B(he),ge=B(ne),Z=1.6;var Q;(function(t){t[t.Swizzled=0]="Swizzled",t[t.Center=1]="Center",t[t.Quilt=2]="Quilt"})(Q||(Q={}));class Ce extends EventTarget{constructor(e){super();R(this,"_subpixelModeOverridden",!1);R(this,"_calibration",{configVersion:"1.0",pitch:{value:45},slope:{value:-5},center:{value:-.5},viewCone:{value:40},invView:{value:1},verticalAngle:{value:0},DPI:{value:338},screenW:{value:3840},screenH:{value:2160},flipImageX:{value:0},flipImageY:{value:0},flipSubp:{value:0},serial:"",subpixelCells:[],CellPatternMode:{value:0}});R(this,"_viewControls",{tileHeight:512,numViews:48,trackballX:0,trackballY:0,targetX:0,targetY:Z,targetZ:-.5,targetDiam:2,fovy:14/180*Math.PI,depthiness:1.25,inlineView:Q.Center,capturing:!1,quiltResolution:null,columns:null,rows:null,popup:null,XRSession:null,lkgCanvas:null,appCanvas:null,subpixelMode:0,filterMode:2,gaussianSigma:.01,focus:0,viewDimming:!1,filterEnd:.05,filterSize:.15,edgeThreshold:.01});R(this,"LookingGlassDetected");this._subpixelModeOverridden=(e==null?void 0:e.subpixelMode)!==void 0;const r={...e};r.subpixelMode===void 0&&delete r.subpixelMode,this._viewControls={...this._viewControls,...r},this.syncCalibration()}syncCalibration(){new me.Client(e=>{if(e.devices.length<1){console.log("No Looking Glass devices found");return}e.devices.length>1&&console.log("More than one Looking Glass device found... using the first one"),this.calibration=e.devices[0].calibration})}addEventListener(e,r,s){super.addEventListener(e,r,s)}onConfigChange(){this.dispatchEvent(new Event("on-config-changed"))}get calibration(){return this._calibration}set calibration(e){var s;this._calibration={...this._calibration,...e};const r=(s=this._calibration.CellPatternMode)==null?void 0:s.value;!this._subpixelModeOverridden&&typeof r=="number"&&Number.isFinite(r)&&(this._viewControls.subpixelMode=Math.round(r)),this.onConfigChange()}updateViewControls(e){if(e!=null){const r={...e};e.subpixelMode!==void 0?this._subpixelModeOverridden=!0:delete r.subpixelMode,this._viewControls={...this._viewControls,...r},this.onConfigChange()}}get tileHeight(){return Math.round(this.framebufferHeight/this.quiltHeight)}get quiltResolution(){if(this._viewControls.quiltResolution!=null)return{width:this._viewControls.quiltResolution.width,height:this._viewControls.quiltResolution.height};{const e=this._calibration.serial;switch(!0){case e.startsWith("LKG-2K"):return{width:4096,height:4096};case e.startsWith("LKG-4K"):return{width:4096,height:4096};case e.startsWith("LKG-8K"):return{width:8192,height:8192};case e.startsWith("LKG-P"):return{width:3360,height:3360};case e.startsWith("LKG-A"):return{width:4096,height:4096};case e.startsWith("LKG-B"):return{width:8192,height:8192};case e.startsWith("LKG-D"):return{width:8192,height:8192};case e.startsWith("LKG-F"):return{width:3360,height:3360};case e.startsWith("LKG-E"):return{width:4092,height:4092};case e.startsWith("LKG-H"):return{width:5995,height:6e3};case e.startsWith("LKG-J"):return{width:5999,height:5999};case e.startsWith("LKG-K"):return{width:8184,height:8184};case e.startsWith("LKG-L"):return{width:8190,height:8190};default:return{width:4096,height:4096}}}}set quiltResolution(e){this.updateViewControls({quiltResolution:e})}get numViews(){return this.quiltWidth*this.quiltHeight}get targetX(){return this._viewControls.targetX}set targetX(e){this.updateViewControls({targetX:e})}get targetY(){return this._viewControls.targetY}set targetY(e){this.updateViewControls({targetY:e})}get targetZ(){return this._viewControls.targetZ}set targetZ(e){this.updateViewControls({targetZ:e})}get trackballX(){return this._viewControls.trackballX}set trackballX(e){this.updateViewControls({trackballX:e})}get trackballY(){return this._viewControls.trackballY}set trackballY(e){this.updateViewControls({trackballY:e})}get targetDiam(){return this._viewControls.targetDiam}set targetDiam(e){this.updateViewControls({targetDiam:e})}get fovy(){return this._viewControls.fovy}set fovy(e){this.updateViewControls({fovy:e})}get depthiness(){return this._viewControls.depthiness}set depthiness(e){this.updateViewControls({depthiness:e})}get inlineView(){return this._viewControls.inlineView}set inlineView(e){this.updateViewControls({inlineView:e})}get capturing(){return this._viewControls.capturing}set capturing(e){this.updateViewControls({capturing:e})}get subpixelMode(){return this._viewControls.subpixelMode}set subpixelMode(e){this.updateViewControls({subpixelMode:e})}get filterMode(){return this._viewControls.filterMode}set filterMode(e){this.updateViewControls({filterMode:e})}get gaussianSigma(){return this._viewControls.gaussianSigma}set gaussianSigma(e){this.updateViewControls({gaussianSigma:e})}get focus(){return this._viewControls.focus}set focus(e){this.updateViewControls({focus:e})}get viewDimming(){return this._viewControls.viewDimming}set viewDimming(e){this.updateViewControls({viewDimming:e})}get filterEnd(){return this._viewControls.filterEnd}set filterEnd(e){this.updateViewControls({filterEnd:e})}get filterSize(){return this._viewControls.filterSize}set filterSize(e){this.updateViewControls({filterSize:e})}get edgeThreshold(){return this._viewControls.edgeThreshold}set edgeThreshold(e){this.updateViewControls({edgeThreshold:e})}get popup(){return this._viewControls.popup}set popup(e){this.updateViewControls({popup:e})}get XRSession(){return this._viewControls.XRSession}set XRSession(e){this.updateViewControls({XRSession:e})}get lkgCanvas(){return this._viewControls.lkgCanvas}set lkgCanvas(e){this.updateViewControls({lkgCanvas:e})}get appCanvas(){return this._viewControls.appCanvas}set appCanvas(e){this.updateViewControls({appCanvas:e})}get columns(){return this._viewControls.columns}set columns(e){this.updateViewControls({columns:e})}get rows(){return this._viewControls.rows}set rows(e){this.updateViewControls({rows:e})}get aspect(){return this._calibration.screenW.value/this._calibration.screenH.value}get tileWidth(){return Math.round(this.framebufferWidth/this.quiltWidth)}get framebufferWidth(){return this.quiltResolution.width}get quiltWidth(){if(this._viewControls.columns!=null)return this._viewControls.columns;const e=this._calibration.serial;switch(!0){case e.startsWith("LKG-2K"):return 5;case e.startsWith("LKG-4K"):return 5;case e.startsWith("LKG-8K"):return 5;case e.startsWith("LKG-P"):return 8;case e.startsWith("LKG-A"):return 5;case e.startsWith("LKG-B"):return 5;case e.startsWith("LKG-D"):return 8;case e.startsWith("LKG-F"):return 8;case e.startsWith("LKG-E"):return 11;case e.startsWith("LKG-H"):return 11;case e.startsWith("LKG-J"):return 7;case e.startsWith("LKG-K"):return 11;case e.startsWith("LKG-L"):return 7;default:return 1}}get quiltHeight(){if(this._viewControls.rows!=null)return this._viewControls.rows;const e=this._calibration.serial;switch(!0){case e.startsWith("LKG-2K"):return 9;case e.startsWith("LKG-4K"):return 9;case e.startsWith("LKG-8K"):return 9;case e.startsWith("LKG-P"):return 6;case e.startsWith("LKG-A"):return 9;case e.startsWith("LKG-B"):return 9;case e.startsWith("LKG-D"):return 9;case e.startsWith("LKG-F"):return 6;case e.startsWith("LKG-E"):return 6;case e.startsWith("LKG-H"):return 6;case e.startsWith("LKG-J"):return 7;case e.startsWith("LKG-K"):return 6;case e.startsWith("LKG-L"):return 7;default:return 1}}get framebufferHeight(){return this.quiltResolution.height}get viewCone(){return this._calibration.viewCone.value*this.depthiness/180*Math.PI}get tilt(){return this._calibration.screenH.value/(this._calibration.screenW.value*this._calibration.slope.value)*(this._calibration.flipImageX.value?-1:1)}get subp(){return 1/(this._calibration.screenW.value*3)*(this._calibration.flipImageX.value?-1:1)}get pitch(){return this._calibration.pitch.value*this._calibration.screenW.value/this._calibration.DPI.value*Math.cos(Math.atan(1/this._calibration.slope.value))}get center(){const e=this._calibration.flipImageX.value?.5:0;return this._calibration.center.value+e}get subpixelCells(){const e=new Float32Array(6*this._calibration.subpixelCells.length);return this._calibration.subpixelCells.forEach((r,s)=>{e[s*6+0]=r.ROffsetX/this.calibration.screenW.value,e[s*6+1]=r.ROffsetY/this.calibration.screenH.value,e[s*6+2]=r.GOffsetX/this.calibration.screenW.value,e[s*6+3]=r.GOffsetY/this.calibration.screenH.value,e[s*6+4]=r.BOffsetX/this.calibration.screenW.value,e[s*6+5]=r.BOffsetY/this.calibration.screenH.value}),e}}let J=null;function W(){return J==null&&(J=new Ce),J}function ae(t){const i=W();t!=null&&i.updateViewControls(t)}const ee=16;function x(t){if(!Number.isFinite(t))return"0.0";const i=t.toPrecision(10);return i.includes(".")||i.includes("e")?i:`${i}.0`}function Y(t){return Number.isFinite(t)?Math.round(t).toString():"0"}function te(t,i,e){return Math.min(Math.max(t,i),e)}function ye(t){const i=t.numViews,e=Math.floor(t.framebufferWidth/t.quiltWidth),r=Math.floor(t.framebufferHeight/t.quiltHeight),s=t.quiltWidth*e/t.framebufferWidth,o=t.quiltHeight*r/t.framebufferHeight,u=Math.min(t.calibration.subpixelCells.length,ee),_=Math.max(u,1),c=te(Math.round(t.filterMode),0,3),p=Math.floor(i/2),f=Number.isFinite(t.filterEnd)?t.filterEnd:.05,G=te(f,0,.499999),w=Number.isFinite(t.filterSize)?t.filterSize:.15,C=te(w,1e-6,Math.max(1e-6,.5-G)),S=Number.isFinite(t.gaussianSigma)?t.gaussianSigma:.01,E=Math.max(Math.abs(S),1e-6),h=Number.isFinite(t.edgeThreshold)?t.edgeThreshold:.01,n=Math.max(h,1e-6);return`#version 300 es
precision highp float;

uniform int u_viewType;
uniform sampler2D u_texture;
in vec2 v_texcoord;
out vec4 color;

const int MAX_SUBPIXEL_CELLS = ${ee};
uniform float subpixelData[6 * MAX_SUBPIXEL_CELLS];

const float pitch = ${x(t.pitch)};
const float slope = ${x(t.tilt)};
const float center = ${x(t.center)};
const float subpixelSize = ${x(t.subp)};
const float screenW = ${x(t.calibration.screenW.value)};
const float screenH = ${x(t.calibration.screenH.value)};
const float tileCount = ${x(i)};
const vec2 viewPortion = vec2(${x(s)}, ${x(o)});
const vec4 tile = vec4(${x(t.quiltWidth)}, ${x(t.quiltHeight)}, ${x(i)}, 0.0);
const float focus = ${x(t.focus*t.quiltWidth)};
const int subpixelCellCount = ${Y(u)};
const int safeSubpixelCellCount = ${Y(_)};
const int filter_mode = ${Y(c)};
const int cellPatternType = ${Y(t.subpixelMode)};
const int filter_edge = ${t.viewDimming?1:0};
const float filter_end = ${x(G)};
const float filter_size = ${x(C)};
const float gaussian_sigma = ${x(E)};
const float edgeThreshold = ${x(n)};

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
`}async function xe(){const t=W();let i=2;async function e(){if(t.appCanvas!=null)try{t.capturing=!0,await new Promise(u=>{requestAnimationFrame(u)}),t.appCanvas.width=t.quiltResolution.width,t.appCanvas.height=t.quiltResolution.height;let s=t.appCanvas.toDataURL();const o=document.createElement("a");o.style.display="none",o.href=s,o.download=`hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`,document.body.appendChild(o),o.click(),document.body.removeChild(o),window.URL.revokeObjectURL(s)}catch(s){console.error("Error while capturing canvas data:",s),t.capturing=!1}finally{t.inlineView=i,t.capturing=!1,t.appCanvas.width=t.calibration.screenW.value,t.appCanvas.height=t.calibration.screenH.value}}const r=document.getElementById("screenshotbutton");r&&r.addEventListener("click",()=>{i=t.inlineView;const s=K.getInstance();if(!s){console.warn("LookingGlassXRDevice not initialized");return}t.inlineView=2,s.captureScreenshot=!0,setTimeout(()=>{s.screenshotCallback=e},100)})}function _e(){var i,e,r,s,o;const t=W();if(t.lkgCanvas==null)console.warn("window placement called without a valid XR Session!");else{let u=function(){let n=h.d-h.a,a=h.w-h.s;n&&a&&(n*=Math.sqrt(.5),a*=Math.sqrt(.5));const l=t.trackballX,d=t.trackballY,v=Math.cos(l)*n-Math.sin(l)*Math.cos(d)*a,T=-Math.sin(d)*a,P=-Math.sin(l)*n-Math.cos(l)*Math.cos(d)*a;t.targetX=t.targetX+v*t.targetDiam*.03,t.targetY=t.targetY+T*t.targetDiam*.03,t.targetZ=t.targetZ+P*t.targetDiam*.03,requestAnimationFrame(u)};const _=document.createElement("style");document.head.appendChild(_),(i=_.sheet)==null||i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");const c=document.createElement("div");c.id="LookingGlassWebXRControls",c.style.position="fixed",c.style.zIndex="1000",c.style.padding="15px",c.style.width="320px",c.style.maxWidth="calc(100vw - 18px)",c.style.maxHeight="calc(100vh - 18px)",c.style.whiteSpace="nowrap",c.style.background="rgba(0, 0, 0, 0.6)",c.style.color="white",c.style.borderRadius="10px",c.style.right="15px",c.style.bottom="15px",c.style.flex="row";const p=document.createElement("div");c.appendChild(p),p.style.width="100%",p.style.textAlign="center",p.style.fontWeight="bold",p.style.marginBottom="8px",p.innerText="Looking Glass Controls";const f=document.createElement("button");f.style.display="block",f.style.margin="auto",f.style.width="100%",f.style.height="35px",f.style.padding="4px",f.style.marginBottom="8px",f.style.borderRadius="8px",f.id="screenshotbutton",c.appendChild(f),f.innerText="Save Hologram",t.quiltResolution.height*t.quiltResolution.width>33177600?(f.style.backgroundColor="#ccc",f.style.color="#999",f.style.cursor="not-allowed",f.title="Button is disabled because the quilt resolution is too large."):(f.style.backgroundColor="",f.style.color="",f.style.cursor="",f.title="");const w=document.createElement("button");w.style.display="block",w.style.margin="auto",w.style.width="100%",w.style.height="35px",w.style.padding="4px",w.style.marginBottom="8px",w.style.borderRadius="8px",w.id="copybutton",c.appendChild(w),w.innerText="Copy Config",w.addEventListener("click",()=>{Ee(t)});const C=document.createElement("div");c.appendChild(C),C.style.width="290px",C.style.whiteSpace="normal",C.style.color="rgba(255,255,255,0.7)",C.style.fontSize="14px",C.style.margin="5px 0",C.innerHTML="Click the popup and use WASD, mouse left/right drag, and scroll.";const S=document.createElement("div");c.appendChild(S);const E=(n,a,l)=>{const d=l.stringify,v=document.createElement("div");v.style.marginBottom="8px",S.appendChild(v);const T=n,P=t[n],L=document.createElement("label");v.appendChild(L),L.innerText=l.label,L.setAttribute("for",T),L.style.width="100px",L.style.display="inline-block",L.style.textDecoration="dotted underline 1px",L.style.fontFamily='"Courier New"',L.style.fontSize="13px",L.style.fontWeight="bold",L.title=l.title;const b=document.createElement("input");v.appendChild(b),Object.assign(b,a),b.id=T,b.title=l.title,b.value=a.value!==void 0?a.value:P;const U=y=>{t[n]=y,q(y)};b.oninput=()=>{const y=a.type==="range"?parseFloat(b.value):a.type==="checkbox"?b.checked:b.value;U(y)};const H=y=>{let D=y(t[n]);l.fixRange&&(D=l.fixRange(D),b.max=Math.max(parseFloat(b.max),D).toString(),b.min=Math.min(parseFloat(b.min),D).toString()),b.value=D,U(D)};a.type==="range"&&(b.style.width="110px",b.style.height="8px",b.onwheel=y=>{H(D=>D+Math.sign(y.deltaX-y.deltaY)*a.step)});let q=y=>{};if(d){const y=document.createElement("span");y.style.fontFamily='"Courier New"',y.style.fontSize="13px",y.style.marginLeft="3px",v.appendChild(y),q=D=>{y.innerHTML=d(D)},q(P)}return H};E("fovy",{type:"range",min:1/180*Math.PI,max:120.1/180*Math.PI,step:1/180*Math.PI},{label:"fov",title:"perspective fov (degrades stereo effect)",fixRange:n=>Math.max(1/180*Math.PI,Math.min(n,120.1/180*Math.PI)),stringify:n=>{const a=n/Math.PI*180,l=Math.atan(Math.tan(n/2)*t.aspect)*2/Math.PI*180;return`${a.toFixed()}&deg;&times;${l.toFixed()}&deg;`}}),E("depthiness",{type:"range",min:0,max:2,step:.01},{label:"depthiness",title:"exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",fixRange:n=>Math.max(0,n),stringify:n=>`${n.toFixed(2)}x`}),E("inlineView",{type:"range",min:0,max:2,step:1},{label:"inline view",title:"what to show inline on the original canvas (swizzled = no overwrite)",fixRange:n=>Math.max(0,Math.min(n,2)),stringify:n=>n===0?"swizzled":n===1?"center":n===2?"quilt":"?"}),E("filterMode",{type:"range",min:0,max:3,step:1},{label:"view filtering mode",title:"controls the method used for view blending",fixRange:n=>Math.max(0,Math.min(n,3)),stringify:n=>n===0?"old, studio style":n===1?"2 view":n===2?"gaussian":n===3?"21-view gaussian (expensive)":"?"}),E("gaussianSigma",{type:"range",min:.001,max:1,step:.01},{label:"gaussian sigma",title:"control view blending",fixRange:n=>Math.max(.001,Math.min(n,1)),stringify:n=>n}),t.lkgCanvas.oncontextmenu=n=>{n.preventDefault()},t.lkgCanvas.addEventListener("wheel",n=>{const a=t.targetDiam,l=1.1,d=Math.log(a)/Math.log(l);return t.targetDiam=Math.pow(l,d+n.deltaY*.01)},{passive:!1}),t.lkgCanvas.addEventListener("mousemove",n=>{const a=n.movementX,l=-n.movementY;if(n.buttons&2||n.buttons&1&&(n.shiftKey||n.ctrlKey)){const d=t.trackballX,v=t.trackballY,T=-Math.cos(d)*a+Math.sin(d)*Math.sin(v)*l,P=-Math.cos(v)*l,L=Math.sin(d)*a+Math.cos(d)*Math.sin(v)*l;t.targetX=t.targetX+T*t.targetDiam*.001,t.targetY=t.targetY+P*t.targetDiam*.001,t.targetZ=t.targetZ+L*t.targetDiam*.001}else n.buttons&1&&(t.trackballX=t.trackballX-a*.01,t.trackballY=t.trackballY-l*.01)});const h={w:0,a:0,s:0,d:0};return t.lkgCanvas.addEventListener("keydown",n=>{switch(n.code){case"KeyW":h.w=1;break;case"KeyA":h.a=1;break;case"KeyS":h.s=1;break;case"KeyD":h.d=1;break}}),t.lkgCanvas.addEventListener("keyup",n=>{switch(n.code){case"KeyW":h.w=0;break;case"KeyA":h.a=0;break;case"KeyS":h.s=0;break;case"KeyD":h.d=0;break}}),(e=t.appCanvas)==null||e.addEventListener("wheel",n=>{const a=t.targetDiam,l=1.1,d=Math.log(a)/Math.log(l);return t.targetDiam=Math.pow(l,d+n.deltaY*.01)},{passive:!1}),(r=t.appCanvas)==null||r.addEventListener("mousemove",n=>{const a=n.movementX,l=-n.movementY;if(n.buttons&2||n.buttons&1&&(n.shiftKey||n.ctrlKey)){const d=t.trackballX,v=t.trackballY,T=-Math.cos(d)*a+Math.sin(d)*Math.sin(v)*l,P=-Math.cos(v)*l,L=Math.sin(d)*a+Math.cos(d)*Math.sin(v)*l;t.targetX=t.targetX+T*t.targetDiam*.001,t.targetY=t.targetY+P*t.targetDiam*.001,t.targetZ=t.targetZ+L*t.targetDiam*.001}else n.buttons&1&&(t.trackballX=t.trackballX-a*.01,t.trackballY=t.trackballY-l*.01)}),(s=t.appCanvas)==null||s.addEventListener("keydown",n=>{switch(n.code){case"KeyW":h.w=1;break;case"KeyA":h.a=1;break;case"KeyS":h.s=1;break;case"KeyD":h.d=1;break}}),(o=t.appCanvas)==null||o.addEventListener("keyup",n=>{switch(n.code){case"KeyW":h.w=0;break;case"KeyA":h.a=0;break;case"KeyS":h.s=0;break;case"KeyD":h.d=0;break}}),requestAnimationFrame(u),setTimeout(()=>{xe()},1e3),c}}function Ee(t){const i={targetX:t.targetX,targetY:t.targetY,targetZ:t.targetZ,fovy:`${Math.round(t.fovy/Math.PI*180)} * Math.PI / 180`,targetDiam:t.targetDiam,trackballX:t.trackballX,trackballY:t.trackballY,depthiness:t.depthiness};let e=JSON.stringify(i,null,4).replace(/"/g,"").replace(/{/g,"").replace(/}/g,"");navigator.clipboard.writeText(e)}let $;const Le=(t,i)=>{const e=W();if(e.lkgCanvas==null){console.warn("window placement called without a valid XR Session!");return}else t==!1?Se(e,$):($==null&&($=_e()),e.lkgCanvas.style.position="fixed",e.lkgCanvas.style.bottom="0",e.lkgCanvas.style.left="0",e.lkgCanvas.width=e.calibration.screenW.value,e.lkgCanvas.height=e.calibration.screenH.value,document.body.appendChild($),"getScreenDetails"in window?Re(e.lkgCanvas,e,i):oe(e,e.lkgCanvas,i))};async function Re(t,i,e){const s=(await window.getScreenDetails()).screens.filter(o=>o.label.includes("LKG"))[0];if(s===void 0){console.log("no Looking Glass monitor detected - manually opening popup window"),oe(i,t,e);return}else{const o=[`left=${s.left}`,`top=${s.top}`,`width=${s.width}`,`height=${s.height}`,"menubar=no","toolbar=no","location=no","status=no","resizable=yes","scrollbars=no","fullscreenEnabled=true"].join(",");i.popup=window.open("","new",o),i.popup&&(i.popup.document.body.style.background="black",i.popup.document.body.style.transform="1.0",le(i),i.popup.document.body.appendChild(t),console.assert(e),i.popup.onbeforeunload=e)}}function oe(t,i,e){t.popup=window.open("",void 0,"width=640,height=360"),t.popup&&(t.popup.document.title="Looking Glass Window (fullscreen me on Looking Glass!)",t.popup.document.body.style.background="black",t.popup.document.body.style.transform="1.0",le(t),t.popup.document.body.appendChild(i),console.assert(e),t.popup.onbeforeunload=e)}function Se(t,i){var e;(e=i.parentElement)==null||e.removeChild(i),t.popup&&(t.popup.onbeforeunload=null,t.popup.close(),t.popup=null)}function le(t){t.popup&&t.popup.document.addEventListener("keydown",i=>{i.ctrlKey&&(i.key==="="||i.key==="-"||i.key==="+")&&i.preventDefault()})}const F=Symbol("LookingGlassXRWebGLLayer");class Te extends ge.default{constructor(i,e,r){super(i,e,r);const s=W();s.appCanvas=e.canvas,s.lkgCanvas=document.createElement("canvas"),s.lkgCanvas.tabIndex=0;const o=s.lkgCanvas.getContext("2d",{alpha:!1});s.lkgCanvas.addEventListener("dblclick",function(){this.requestFullscreen()});const u=this[ne.PRIVATE].config,_=e.createTexture();let c,p;const f=e.createFramebuffer(),G=e.enable.bind(e),w=e.disable.bind(e),C=e.getExtension("OES_vertex_array_object"),S=34229,E=C?C.bindVertexArrayOES.bind(C):e.bindVertexArray.bind(e),h=()=>{const k=e.getParameter(e.TEXTURE_BINDING_2D);if(e.bindTexture(e.TEXTURE_2D,_),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,s.framebufferWidth,s.framebufferHeight,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_BASE_LEVEL,0),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAX_LEVEL,0),e.bindTexture(e.TEXTURE_2D,k),c){const I=e.getParameter(e.RENDERBUFFER_BINDING);e.bindRenderbuffer(e.RENDERBUFFER,c),e.renderbufferStorage(e.RENDERBUFFER,p.format,s.framebufferWidth,s.framebufferHeight),e.bindRenderbuffer(e.RENDERBUFFER,I)}};(u.depth||u.stencil)&&(u.depth&&u.stencil?p={format:e.DEPTH_STENCIL,attachment:e.DEPTH_STENCIL_ATTACHMENT}:u.depth?p={format:e.DEPTH_COMPONENT16,attachment:e.DEPTH_ATTACHMENT}:u.stencil&&(p={format:e.STENCIL_INDEX8,attachment:e.STENCIL_ATTACHMENT}),c=e.createRenderbuffer()),h(),s.addEventListener("on-config-changed",h);const n=e.getParameter(e.FRAMEBUFFER_BINDING);e.bindFramebuffer(e.FRAMEBUFFER,f),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,_,0),(u.depth||u.stencil)&&e.framebufferRenderbuffer(e.FRAMEBUFFER,p.attachment,e.RENDERBUFFER,c),e.bindFramebuffer(e.FRAMEBUFFER,n);const a=e.createProgram();if(!a)return;const l=e.createShader(e.VERTEX_SHADER);if(!l)return;e.attachShader(a,l);const d=e.createShader(e.FRAGMENT_SHADER);if(!d)return;e.attachShader(a,d);{const k=`#version 300 es
			layout(location = 0) in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;e.shaderSource(l,k),e.compileShader(l),e.getShaderParameter(l,e.COMPILE_STATUS)||console.warn(e.getShaderInfoLog(l))}let v,T=0,P,L=null,b=null;const U=()=>{const k=ye(s);if(k!==v){if(e.shaderSource(d,k),e.compileShader(d),!e.getShaderParameter(d,e.COMPILE_STATUS)){console.warn(e.getShaderInfoLog(d));return}if(e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS)){console.warn(e.getProgramInfoLog(a));return}v=k,T=e.getAttribLocation(a,"a_position"),P=e.getUniformLocation(a,"u_viewType"),L=e.getUniformLocation(a,"u_texture"),b=e.getUniformLocation(a,"subpixelData")}const I=s.subpixelCells,A=ee*6,j=new Float32Array(A);j.set(I.length>A?I.slice(0,A):I);const se=e.getParameter(e.CURRENT_PROGRAM);e.useProgram(a),e.uniform1i(L,0),e.uniform1fv(b,j),e.useProgram(se)};s.addEventListener("on-config-changed",U),U();const H=C?C.createVertexArrayOES():e.createVertexArray(),q=e.createBuffer(),y=e.getParameter(e.ARRAY_BUFFER_BINDING),D=e.getParameter(S);E(H),e.bindBuffer(e.ARRAY_BUFFER,q),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,0,1,1,0,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(T),e.vertexAttribPointer(T,2,e.FLOAT,!1,0,0),E(D),e.bindBuffer(e.ARRAY_BUFFER,y);const De=()=>{console.assert(this[F].LookingGlassEnabled),e.bindFramebuffer(e.FRAMEBUFFER,f);const k=e.getParameter(e.COLOR_CLEAR_VALUE),I=e.getParameter(e.DEPTH_CLEAR_VALUE),A=e.getParameter(e.STENCIL_CLEAR_VALUE);e.clearColor(0,0,0,0),e.clearDepth(1),e.clearStencil(0),e.clear(e.DEPTH_BUFFER_BIT|e.COLOR_BUFFER_BIT|e.STENCIL_BUFFER_BIT),e.clearColor(k[0],k[1],k[2],k[3]),e.clearDepth(I),e.clearStencil(A)},V=e.canvas;let O,z;const Fe=()=>{if(!this[F].LookingGlassEnabled)return;(V.width!==s.calibration.screenW.value||V.height!==s.calibration.screenH.value)&&s.capturing===!1?(O=V.width,z=V.height,V.width=s.calibration.screenW.value,V.height=s.calibration.screenH.value):s.capturing===!0&&(O=V.width,z=V.height,V.width=s.framebufferWidth,V.height=s.framebufferHeight);const k=e.getParameter(S),I=e.getParameter(e.CULL_FACE),A=e.getParameter(e.BLEND),j=e.getParameter(e.DEPTH_TEST),se=e.getParameter(e.STENCIL_TEST),Ie=e.getParameter(e.SCISSOR_TEST),Xe=e.getParameter(e.VIEWPORT),Ae=e.getParameter(e.FRAMEBUFFER_BINDING),Be=e.getParameter(e.RENDERBUFFER_BINDING),Ke=e.getParameter(e.CURRENT_PROGRAM),Ne=e.getParameter(e.ACTIVE_TEXTURE);{const Ue=e.getParameter(e.TEXTURE_BINDING_2D);e.bindFramebuffer(e.FRAMEBUFFER,null),e.useProgram(a),E(H),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,_),e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.STENCIL_TEST),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),e.uniform1i(P,0),e.drawArrays(e.TRIANGLES,0,6),o==null||o.clearRect(0,0,s.calibration.screenW.value,s.calibration.screenH.value),o==null||o.drawImage(V,0,0),s.inlineView!==0&&(e.uniform1i(P,s.inlineView),e.drawArrays(e.TRIANGLES,0,6)),e.bindTexture(e.TEXTURE_2D,Ue)}e.activeTexture(Ne),e.useProgram(Ke),e.bindRenderbuffer(e.RENDERBUFFER,Be),e.bindFramebuffer(e.FRAMEBUFFER,Ae),e.viewport(...Xe),(Ie?G:w)(e.SCISSOR_TEST),(se?G:w)(e.STENCIL_TEST),(j?G:w)(e.DEPTH_TEST),(A?G:w)(e.BLEND),(I?G:w)(e.CULL_FACE),E(k)};this[F]={LookingGlassEnabled:!1,framebuffer:f,clearFramebuffer:De,blitTextureToDefaultFramebufferIfNeeded:Fe,moveCanvasToWindow:Le,restoreOriginalCanvasDimensions:()=>{O&&z&&(V.width=O,V.height=z,O=z=void 0)}}}get framebuffer(){return this[F].LookingGlassEnabled?this[F].framebuffer:null}get framebufferWidth(){return W().framebufferWidth}get framebufferHeight(){return W().framebufferHeight}}const N=class extends we.default{constructor(i){super(i),this.sessions=new Map,this.viewSpaces=[],this.basePoseMatrix=g.mat4.create(),this.inlineProjectionMatrix=g.mat4.create(),this.inlineInverseViewMatrix=g.mat4.create(),this.LookingGlassProjectionMatrices=[],this.LookingGlassInverseViewMatrices=[],this.captureScreenshot=!1,this.screenshotCallback=null,N.instance||(N.instance=this)}static getInstance(){return N.instance}onBaseLayerSet(i,e){const r=this.sessions.get(i);r.baseLayer=e;const s=W(),o=e[F];o.LookingGlassEnabled=r.immersive,r.immersive&&(s.XRSession=this.sessions.get(i),s.popup==null?o.moveCanvasToWindow(!0,()=>{this.endSession(i)}):console.warn("attempted to assign baselayer twice?"))}isSessionSupported(i){return i==="inline"||i==="immersive-vr"}isFeatureSupported(i){switch(i){case"viewer":return!0;case"local":return!0;case"local-floor":return!0;case"bounded-floor":return!1;case"unbounded":return!1;default:return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:",i),!1}}async requestSession(i,e){if(!this.isSessionSupported(i))return Promise.reject();const r=i!=="inline",s=new ke(i,e),o=W();return this.sessions.set(s.id,s),r&&(this.dispatchEvent("@@webxr-polyfill/vr-present-start",s.id),window.addEventListener("unload",()=>{o.popup&&o.popup.close(),o.popup=null})),Promise.resolve(s.id)}requestAnimationFrame(i){return this.global.requestAnimationFrame(i)}cancelAnimationFrame(i){this.global.cancelAnimationFrame(i)}onFrameStart(i,e){const r=this.sessions.get(i),s=W();if(r.immersive){const o=Math.tan(.5*s.fovy),u=.5*s.targetDiam/o,_=u-s.targetDiam,c=this.basePoseMatrix;g.mat4.fromTranslation(c,[s.targetX,s.targetY,s.targetZ]),g.mat4.rotate(c,c,s.trackballX,[0,1,0]),g.mat4.rotate(c,c,-s.trackballY,[1,0,0]),g.mat4.translate(c,c,[0,0,u]);for(let p=0;p<s.numViews;++p){const f=(p+.5)/s.numViews-.5,G=Math.tan(s.viewCone*f),w=u*G,C=this.LookingGlassInverseViewMatrices[p]=this.LookingGlassInverseViewMatrices[p]||g.mat4.create();g.mat4.translate(C,c,[w,0,0]),g.mat4.invert(C,C);const S=Math.max(_+e.depthNear,.01),E=_+e.depthFar,h=S*o,n=h,a=-h,l=S*-G,d=s.aspect*h,v=l+d,T=l-d,P=this.LookingGlassProjectionMatrices[p]=this.LookingGlassProjectionMatrices[p]||g.mat4.create();g.mat4.set(P,2*S/(v-T),0,0,0,0,2*S/(n-a),0,0,(v+T)/(v-T),(n+a)/(n-a),-(E+S)/(E-S),-1,0,0,-2*E*S/(E-S),0)}}else{const o=r.baseLayer.context,u=o.drawingBufferWidth/o.drawingBufferHeight;g.mat4.perspective(this.inlineProjectionMatrix,e.inlineVerticalFieldOfView,u,e.depthNear,e.depthFar),g.mat4.fromTranslation(this.basePoseMatrix,[0,Z,0]),g.mat4.invert(this.inlineInverseViewMatrix,this.basePoseMatrix),r.baseLayer[F].clearFramebuffer()}}onFrameEnd(i){this.sessions.get(i).baseLayer[F].blitTextureToDefaultFramebufferIfNeeded(),this.captureScreenshot&&this.screenshotCallback&&(this.screenshotCallback(),this.captureScreenshot=!1)}async requestFrameOfReferenceTransform(i,e){const r=g.mat4.create();switch(i){case"viewer":case"local":return g.mat4.fromTranslation(r,[0,-Z,0]),r;case"local-floor":return r;default:throw new Error("XRReferenceSpaceType not understood")}}endSession(i){const e=this.sessions.get(i);e.immersive&&e.baseLayer&&(e.baseLayer[F].moveCanvasToWindow(!1),e.baseLayer[F].LookingGlassEnabled=!1,e.baseLayer[F].restoreOriginalCanvasDimensions(),this.dispatchEvent("@@webxr-polyfill/vr-present-end",i)),e.ended=!0}doesSessionSupportReferenceSpace(i,e){const r=this.sessions.get(i);return r.ended?!1:r.enabledFeatures.has(e)}getViewSpaces(i){if(i==="immersive-vr"){const e=W();for(let r=this.viewSpaces.length;r<e.numViews;++r)this.viewSpaces[r]=new Me(r);return this.viewSpaces.length=e.numViews,this.viewSpaces}}getViewport(i,e,r,s,o){if(o===void 0){const _=this.sessions.get(i).baseLayer.context;s.x=0,s.y=0,s.width=_.drawingBufferWidth,s.height=_.drawingBufferHeight}else{const u=W(),_=o%u.quiltWidth,c=Math.floor(o/u.quiltWidth);s.x=u.framebufferWidth/u.quiltWidth*_,s.y=u.framebufferHeight/u.quiltHeight*c,s.width=u.framebufferWidth/u.quiltWidth,s.height=u.framebufferHeight/u.quiltHeight}return!0}getProjectionMatrix(i,e){return e===void 0?this.inlineProjectionMatrix:this.LookingGlassProjectionMatrices[e]||g.mat4.create()}getBasePoseMatrix(){return this.basePoseMatrix}getBaseViewMatrix(){return this.inlineInverseViewMatrix}_getViewMatrixByIndex(i){return this.LookingGlassInverseViewMatrices[i]=this.LookingGlassInverseViewMatrices[i]||g.mat4.create()}getInputSources(){return[]}getInputPose(i,e,r){return null}onWindowResize(){}};let K=N;R(K,"instance",null);let Pe=0;class ke{constructor(i,e){R(this,"mode");R(this,"immersive");R(this,"id");R(this,"baseLayer");R(this,"inlineVerticalFieldOfView");R(this,"ended");R(this,"enabledFeatures");this.mode=i,this.immersive=i==="immersive-vr"||i==="immersive-ar",this.id=++Pe,this.baseLayer=null,this.inlineVerticalFieldOfView=Math.PI*.5,this.ended=!1,this.enabledFeatures=e}}class Me extends be.default{constructor(e){super();R(this,"viewIndex");this.viewIndex=e}get eye(){return"none"}_onPoseUpdate(e){this._inverseBaseMatrix=e._getViewMatrixByIndex(this.viewIndex)}}class ie extends ve.default{constructor(e){super();R(this,"vrButton");R(this,"device");R(this,"isPresenting",!1);ae(e),this.loadPolyfill()}static async init(e){new ie(e)}async loadPolyfill(){this.overrideDefaultVRButton(),console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');for(const e in re.default)this.global[e]=re.default[e];this.global.XRWebGLLayer=Te,this.injected=!0,this.device=new K(this.global),this.xr=new pe.default(Promise.resolve(this.device)),Object.defineProperty(this.global.navigator,"xr",{value:this.xr,configurable:!0})}async overrideDefaultVRButton(){this.vrButton=await We("VRButton"),this.vrButton&&this.device?(this.device.addEventListener("@@webxr-polyfill/vr-present-start",()=>{this.isPresenting=!0,this.updateVRButtonUI()}),this.device.addEventListener("@@webxr-polyfill/vr-present-end",()=>{this.isPresenting=!1,this.updateVRButtonUI()}),this.vrButton.addEventListener("click",e=>{this.updateVRButtonUI()}),this.updateVRButtonUI()):console.warn("Unable to find VRButton")}async updateVRButtonUI(){if(this.vrButton){await Ve(100),this.isPresenting?this.vrButton.innerHTML="EXIT LOOKING GLASS":this.vrButton.innerHTML="ENTER LOOKING GLASS";const e=220;this.vrButton.style.width=`${e}px`,this.vrButton.style.left=`calc(50% - ${e/2}px)`}}update(e){ae(e)}}async function We(t){return new Promise(i=>{const e=new MutationObserver(function(r){r.forEach(function(s){s.addedNodes.forEach(function(o){const u=o;u.id===t&&(i(u),e.disconnect())})})});e.observe(document.body,{subtree:!1,childList:!0}),setTimeout(()=>{e.disconnect(),i(null)},5e3)})}function Ve(t){return new Promise(i=>setTimeout(i,t))}const Ge=W();m.LookingGlassConfig=Ge,m.LookingGlassWebXRPolyfill=ie,Object.defineProperties(m,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
