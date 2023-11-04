var ce = Object.defineProperty;
var de = (t, n, e) => n in t ? ce(t, n, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[n] = e;
var E = (t, n, e) => (de(t, typeof n != "symbol" ? n + "" : n, e), e);
import O from "@lookingglass/webxr-polyfill/src/api/index";
import ue from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import pe from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as he from "holoplay-core";
import { Shader as fe } from "holoplay-core";
import me from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import be from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as b } from "gl-matrix";
import ge, { PRIVATE as ve } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const H = 1.6;
var U;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(U || (U = {}));
class we extends EventTarget {
  constructor(e) {
    super();
    E(this, "_calibration", {
      configVersion: "1.0",
      pitch: { value: 45 },
      slope: { value: -5 },
      center: { value: -0.5 },
      viewCone: { value: 40 },
      invView: { value: 1 },
      verticalAngle: { value: 0 },
      DPI: { value: 338 },
      screenW: { value: 250 },
      screenH: { value: 250 },
      flipImageX: { value: 0 },
      flipImageY: { value: 0 },
      flipSubp: { value: 0 },
      serial: "LKG-DEFAULT-#####"
    });
    E(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: H,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 13 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: U.Center,
      capturing: !1,
      quiltResolution: 3840,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null
    });
    E(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new he.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, a, i) {
    super.addEventListener(e, a, i);
  }
  onConfigChange() {
    this.dispatchEvent(new Event("on-config-changed"));
  }
  get calibration() {
    return this._calibration;
  }
  set calibration(e) {
    this._calibration = {
      ...this._calibration,
      ...e
    }, this.onConfigChange();
  }
  updateViewControls(e) {
    e != null && (this._viewControls = {
      ...this._viewControls,
      ...e
    }, this.onConfigChange());
  }
  get tileHeight() {
    return Math.round(this.framebufferHeight / this.quiltHeight);
  }
  get quiltResolution() {
    return this._viewControls.quiltResolution;
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
  get aspect() {
    return this._calibration.screenW.value / this._calibration.screenH.value;
  }
  get tileWidth() {
    return Math.round(this.framebufferWidth / this.quiltWidth);
  }
  get framebufferWidth() {
    return this._calibration.screenW.value < 7e3 ? this._viewControls.quiltResolution : 7680;
  }
  get quiltWidth() {
    return this.calibration.screenW.value == 1536 ? 8 : this.calibration.screenW.value == 3840 || this.calibration.screenW.value > 7e3 ? 5 : 8;
  }
  get quiltHeight() {
    return this.calibration.screenW.value == 1536 ? 6 : this.calibration.screenW.value == 3840 || this.calibration.screenW.value > 7e3 ? 9 : 6;
  }
  get framebufferHeight() {
    return this._calibration.screenW.value < 7e3 ? this._viewControls.quiltResolution : 4320;
  }
  get viewCone() {
    return this._calibration.viewCone.value * this.depthiness / 180 * Math.PI;
  }
  get tilt() {
    return this._calibration.screenH.value / (this._calibration.screenW.value * this._calibration.slope.value) * (this._calibration.flipImageX.value ? -1 : 1);
  }
  set tilt(e) {
  }
  get subp() {
    return 1 / (this._calibration.screenW.value * 3);
  }
  get pitch() {
    const e = this._calibration.screenW.value / this._calibration.DPI.value;
    return this._calibration.pitch.value * e * Math.cos(Math.atan(1 / this._calibration.slope.value));
  }
}
let W = null;
function k() {
  return W == null && (W = new we()), W;
}
function q(t) {
  const n = k();
  t != null && n.updateViewControls(t);
}
async function Ce(t) {
  const n = k();
  if (n.appCanvas == null) {
    console.warn("Media Capture initialized while canvas is null!");
    return;
  } else
    console.log("Media Capture initialized"), t.onclick = async () => await e();
  async function e() {
    await ye.promise(50).finally(a);
  }
  function a() {
    if (n.appCanvas != null) {
      console.time("capture"), console.log("capture started"), setTimeout(() => t.textContent = "Capturing...", 0);
      let i = n.appCanvas.toDataURL("image/jpeg");
      console.timeLog("capture"), console.timeEnd("capture"), console.log("saving capture"), setTimeout(() => t.textContent = "Saving...", 0);
      const s = document.createElement("a");
      s.style.display = "none", s.href = i, s.download = `hologram_qs${n.quiltWidth}x${n.quiltHeight}a${n.aspect}.jpeg`, document.body.appendChild(s), s.click(), document.body.removeChild(s), window.URL.revokeObjectURL(i), console.log("capture saved"), setTimeout(() => t.textContent = "Save Hologram", 125);
    }
  }
}
const xe = { timeout: 500 }, Y = window.requestIdleCallback || window.requestAnimationFrame, Ee = window.cancelIdleCallback || window.cancelAnimationFrame, ye = {
  request: Y,
  cancel: Ee,
  promise: (t) => new Promise((n) => Y(n, Object.assign({}, xe, t)))
};
function Re() {
  let t = document.createElement("style");
  document.head.appendChild(t);
  let n = `
	/* Basic thumb styling for WebKit browsers */
	.looking-glass-input::-webkit-slider-thumb {
		background: radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%);
		border: 2px solid #FFFFFF;
		border-radius: 22px;
		-webkit-appearance: none; /* This is important to override browser defaults */
		width: 24px; /* Set a width and height for the thumb */
		height: 24px;
		cursor: pointer;
		box-shadow: -6px 8px 8px -4.5px rgba(0, 0, 0, 0.16), 0px 0px 12px 1px rgba(0, 0, 0, 0.14);
        border-radius: 22px;
	}
	
	.looking-glass-input::-moz-range-thumb {
		background: radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%);
		border: 2px solid #FFFFFF;
		border-radius: 22px;
		-webkit-appearance: none; /* This is important to override browser defaults */
		width: 20px; /* Set a width and height for the thumb */
		height: 20px;
		cursor: pointer;
		box-shadow: -6px 8px 8px -4.5px rgba(0, 0, 0, 0.16), 0px 0px 12px 1px rgba(0, 0, 0, 0.14);
        border-radius: 22px;
	}
	
	/* Override the default appearance of the range input */
	input[type="range"].looking-glass-input {
		-webkit-appearance: none;
		width: 100%;
		height: 8px;
		margin-top: 16px;
		background: rgba(255, 255, 255, 0.40);
		outline: none;
		opacity: 1;
		border-radius: 8px;
		-webkit-transition: 0.2s;
		transition: opacity 0.2s;
	}
    `;
  t.appendChild(document.createTextNode(n));
}
const Te = {
  backgroundColor: "rgba(40, 39, 63, 0.90)",
  borderColor: "#FFFFFF1A",
  borderWidth: 1,
  position: "fixed",
  zIndex: "1000",
  paddingRight: "24px",
  paddingLeft: "24px",
  padding: "15px",
  width: "360px",
  height: "504px",
  maxWidth: "calc(100vw - 18px)",
  whiteSpace: "nowrap",
  color: "white",
  borderRadius: "10px",
  right: "15px",
  bottom: "15px",
  flex: "row"
}, z = {
  width: "100%",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  textAlign: "left",
  fontWeight: "bold",
  marginBottom: "8px"
}, Le = {
  display: "block",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  alignItems: "center",
  letterSpacing: "-0.2px"
}, Fe = {
  display: "flex",
  flexDirection: "column",
  alignItems: "left",
  padding: "0px",
  gap: "16px",
  paddingRight: "16px",
  paddingLeft: "16px"
}, ke = {
  order: 2,
  flexGrow: 0,
  width: "100%",
  height: "91px"
}, Z = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%"
}, Se = {
  border: "none",
  background: "none",
  cursor: "pointer",
  opacity: "40%"
}, j = {
  border: "none",
  cursor: "pointer",
  background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)",
  width: "100%",
  height: "48px",
  left: "0px",
  top: "308px",
  borderRadius: "8px",
  color: "white",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "18px",
  lineHeight: "24px",
  outline: "none",
  boxShadow: "none"
}, _e = {
  display: "flex",
  flexDirection: "row",
  background: "#28273F",
  padding: "4px",
  borderRadius: "8px"
}, X = {
  border: "none",
  cursor: "pointer",
  background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #A055FA 0%, #5F15E8 100%)",
  flexGrow: 1,
  height: "48px",
  borderRadius: "8px",
  color: "white",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "18px",
  lineHeight: "24px",
  outline: "none",
  boxShadow: "none"
}, G = {
  border: "none",
  cursor: "pointer",
  background: "rgba(40, 39, 63, 0.90)",
  height: "48px",
  flexGrow: 1,
  borderRadius: "8px",
  color: "white",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "18px",
  lineHeight: "24px",
  outline: "none",
  boxShadow: "none"
}, Ae = {
  cursor: "pointer",
  left: "calc(50% - 50px)",
  width: "280px",
  background: "radial-gradient(76.09% 1304.32% at 87.24% 100%, #403E6C 0%, #1F1E37 100%)",
  borderRadius: "8px",
  position: "absolute",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "18px",
  lineHeight: "24px",
  bottom: "20px",
  padding: "12px 6px",
  color: "#fff",
  textAlign: "center",
  outline: "none",
  zIndex: "9999"
};
function g(t, n) {
  Object.assign(t.style, n);
}
function $(t, n, e) {
  const a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return a.setAttribute("width", t.width), a.setAttribute("height", t.height), a.setAttribute("viewBox", `0 0 ${t.width} ${t.height}`), a.setAttribute("fill", "none"), a.setAttribute("xmlns", "http://www.w3.org/2000/svg"), Pe(a, n), a;
}
function Pe(t, n, e) {
  for (let a = 0; a < n.length; a++) {
    const i = document.createElementNS("http://www.w3.org/2000/svg", "path");
    i.setAttribute("fill-rule", "evenodd"), i.setAttribute("clip-rule", "evenodd"), i.setAttribute("d", n[a]), i.setAttribute("fill", "white"), t.appendChild(i);
  }
}
const Ie = [
  "M29 16.2743V23.6543C29 24.58 28.5114 25.4286 27.7143 25.8786L21.2857 29.5814C20.8871 29.8129 20.45 29.9286 20 29.9286C19.55 29.9286 19.1129 29.8129 18.7143 29.5814L18.0018 29.171C18.0022 29.0134 17.9894 28.8522 17.9624 28.6882C17.801 27.6951 17.4588 26.7641 16.9708 25.9295L19.11 27.21V20.6971L13.17 17.3V22.5773C12.5794 22.3251 11.9526 22.1412 11.2996 22.0352L11.2879 22.0333L11.2761 22.0316C11.1832 22.0176 11.0911 22.0082 11 22.0032V16.2743C11 15.3486 11.4886 14.5 12.2857 14.0371L18.7143 10.3471C19.1129 10.1157 19.55 10 20 10C20.45 10 20.8871 10.1157 21.2857 10.3471L27.7143 14.05C28.5114 14.5 29 15.3486 29 16.2743ZM15.6704 27.8281L12.2857 25.8786C11.5941 25.4881 11.1347 24.7977 11.0253 24.0171L11.0323 24.0183C11.2863 24.0618 11.5349 24.121 11.7771 24.195C13.5676 24.7418 15.0071 26.0923 15.6704 27.8281ZM14.31 15.5029L20 18.87L25.69 15.5029L20 12.07L14.31 15.5029ZM20.89 27.21L26.83 23.6543V17.3L20.89 20.6971V27.21Z",
  "M10 30L10 27.3992C11.4387 27.3992 12.6 28.5609 12.6 30L10 30ZM15.122 30C14.6974 30 14.342 29.6879 14.2727 29.2631C13.9607 27.4599 12.5394 26.0381 10.7367 25.726C10.312 25.6566 10 25.3012 10 24.8764C10 24.3475 10.4593 23.9314 10.9793 24.0094C13.5447 24.4256 15.5727 26.4455 15.9887 29.0117C16.0754 29.5319 15.6507 30 15.122 30Z"
], Me = [
  "M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM11.94 18.43C12.6138 18.43 13.16 17.8838 13.16 17.21C13.16 16.5362 12.6138 15.99 11.94 15.99C11.2662 15.99 10.72 16.5362 10.72 17.21C10.72 17.8838 11.2662 18.43 11.94 18.43ZM13.3319 13.415C13.342 13.3946 13.3522 13.3742 13.3624 13.364C13.6395 12.9577 14.0255 12.6192 14.4168 12.2761C15.3197 11.4846 16.2508 10.6682 15.9383 8.93513C15.643 7.21448 14.2685 5.79926 12.5479 5.54472C10.4505 5.23928 8.5975 6.53232 8.03752 8.38534C7.86444 8.97586 8.31242 9.57656 8.92331 9.57656H9.12693C9.54437 9.57656 9.88036 9.2813 10.0229 8.91477C10.3487 8.00863 11.3058 7.38756 12.3646 7.61155C13.342 7.81518 14.0547 8.78241 13.9631 9.78019C13.8941 10.5576 13.3388 10.9875 12.7225 11.4647C12.3379 11.7624 11.9296 12.0785 11.601 12.5088L11.5908 12.4986C11.5732 12.5163 11.5589 12.5407 11.5442 12.5661C11.5334 12.5846 11.5223 12.6036 11.5094 12.6208C11.4941 12.6463 11.4763 12.6717 11.4585 12.6972C11.4407 12.7226 11.4228 12.7481 11.4076 12.7735C11.3159 12.9161 11.2447 13.0586 11.1836 13.2215C11.1785 13.2419 11.1683 13.2571 11.1581 13.2724C11.1479 13.2877 11.1378 13.303 11.1327 13.3233C11.1225 13.3335 11.1225 13.3437 11.1225 13.3539C11.0003 13.7204 10.9189 14.1582 10.9189 14.6775H12.9653C12.9653 14.4229 12.9959 14.1989 13.0671 13.9851C13.0875 13.9138 13.118 13.8426 13.1486 13.7713C13.1588 13.7306 13.169 13.6899 13.1893 13.6593C13.23 13.5779 13.2809 13.4964 13.3318 13.415L13.3319 13.415Z"
], De = {
  width: "24px",
  height: "24px",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, Be = {
  width: "40px",
  height: "40px",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Ve() {
  return $(De, Me);
}
function Ne() {
  return $(Be, Ie);
}
function We() {
  const t = [];
  for (let n = 0; n <= 10 * 12; n += 12)
    t.push(`${n + "\xB0"}`);
  return t;
}
function Xe(t) {
  const n = document.createElement("div");
  g(n, Z), t.appendChild(n);
  const e = We();
  return e.forEach((a) => {
    const i = document.createElement("p");
    i.style.fontSize = "12px", i.style.lineHeight = "16px", i.style.color = "rgba(255, 255, 255, 0.40)", i.textContent = a, n.appendChild(i);
  }), e;
}
function Ge() {
  const t = [];
  for (let n = 0; n <= 10 * 0.2; n += 0.2) {
    const e = n.toFixed(1);
    t.push(e);
  }
  return t;
}
function He(t) {
  const n = document.createElement("div");
  g(n, Z), t.appendChild(n);
  const e = Ge();
  return e.forEach((a) => {
    const i = document.createElement("p");
    i.style.fontSize = "12px", i.style.lineHeight = "16px", i.style.color = "rgba(255, 255, 255, 0.40)", i.textContent = a, n.appendChild(i);
  }), e;
}
function Ue() {
  var n;
  const t = k();
  if (console.log(t, "for debugging purposes"), t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let e = function(r) {
      const u = document.createElement("div");
      u.style.marginBottom = "8px", g(u, _e), x.appendChild(u);
      const o = document.createElement("button");
      o.innerText = "Center", g(o, G), u.appendChild(o);
      const l = document.createElement("button");
      l.innerText = "Quilt", g(l, X), u.appendChild(l);
      const h = (F) => {
        t[r] = F;
      };
      return l.onclick = () => {
        console.log("quilt tab clicked"), l.classList.add("active"), g(l, X), o.classList.remove("active"), g(o, G), h("2");
      }, o.onclick = () => {
        console.log("center tab clicked"), o.classList.add("active"), g(o, X), l.classList.remove("active"), g(l, G), h("1");
      }, u;
    }, a = function() {
      let r = p.d - p.a, u = p.w - p.s;
      r && u && (r *= Math.sqrt(0.5), u *= Math.sqrt(0.5));
      const o = t.trackballX, l = t.trackballY, h = Math.cos(o) * r - Math.sin(o) * Math.cos(l) * u, F = -Math.sin(l) * u, w = -Math.sin(o) * r - Math.cos(o) * Math.cos(l) * u;
      t.targetX = t.targetX + h * t.targetDiam * 0.03, t.targetY = t.targetY + F * t.targetDiam * 0.03, t.targetZ = t.targetZ + w * t.targetDiam * 0.03, requestAnimationFrame(a);
    };
    const i = document.createElement("style");
    document.head.appendChild(i), (n = i.sheet) == null || n.insertRule("#LookingGlassWebXRControls * { font-family: sans-serif }");
    const s = document.createElement("div");
    s.id = "LookingGlassWebXRControls", s.className = "controlsBackground", g(s, Te);
    const c = document.createElement("div");
    s.appendChild(c), g(c, Fe);
    const m = document.createElement("div");
    g(m, z), c.appendChild(m);
    const f = document.createElement("div");
    g(f, z), m.appendChild(f);
    const S = document.createElement("span");
    S.innerText = "Casting to Looking Glass", f.appendChild(Ne()), f.appendChild(S);
    const v = document.createElement("button");
    m.appendChild(v), g(v, Se), v.appendChild(Ve()), v.onclick = () => {
      window.open("https://docs.lookingglassfactory.com/developer-tools/webxr", "_blank");
    };
    const L = document.createElement("button");
    g(L, j), L.id = "screenshotbutton", L.innerText = "Save Hologram";
    const C = document.createElement("button");
    C.id = "copybutton", g(C, j), C.innerText = "Copy Config", C.addEventListener("click", () => {
      C.innerText = "Copied!", Oe(t), setTimeout(() => {
        C.innerText = "Copy Config";
      }, 300);
    });
    const x = document.createElement("div");
    x.style.display = "inline-flex", x.style.flexDirection = "column", x.style.gap = "16px", x.style.alignContent = "start", c.appendChild(x);
    const _ = (r, u, o) => {
      const l = document.createElement("div");
      l.style.marginBottom = "8px", x.appendChild(l), g(l, ke);
      const h = r, F = t[r], w = document.createElement("label");
      l.appendChild(w), w.innerText = o.label, w.setAttribute("for", h), g(w, Le), w.title = o.title, h === "fovy" ? Xe(l) : h === "depthiness" && He(l);
      const d = document.createElement("input");
      if (l.appendChild(d), Object.assign(d, u), d.id = h, d.className = "looking-glass-input", d.title = o.title, d.value = u.value !== void 0 ? u.value : F, u.type === "range") {
        const y = (parseFloat(d.value) - parseFloat(d.min)) / (parseFloat(d.max) - parseFloat(d.min)) * 100, R = `linear-gradient(90deg, #ffffff ${y}%, rgba(255, 255, 255, 0.20) ${y}%)`;
        d.style.backgroundImage = R;
      }
      const P = (y) => {
        t[r] = y;
      };
      d.oninput = () => {
        if (u.type === "range") {
          const y = (parseFloat(d.value) - parseFloat(d.min)) / (parseFloat(d.max) - parseFloat(d.min)) * 100, R = `linear-gradient(90deg, #ffffff ${y}%, rgba(255, 255, 255, 0.08) ${y}%)`;
          d.style.backgroundImage = R;
          const N = u.type === "range" ? parseFloat(d.value) : u.type === "checkbox" ? d.checked : d.value;
          P(N);
        }
      };
      const D = (y) => {
        let R = y(t[r]);
        o.fixRange && (R = o.fixRange(R), d.max = Math.max(parseFloat(d.max), R).toString(), d.min = Math.min(parseFloat(d.min), R).toString()), d.value = R, P(R);
      };
      return u.type === "range" && (d.onwheel = (y) => {
        D((R) => R + Math.sign(y.deltaX - y.deltaY) * u.step);
      }), l;
    };
    e("inlineView"), _("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "Field of view",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (r) => Math.max(1 / 180 * Math.PI, Math.min(r, 120.1 / 180 * Math.PI))
    }), _("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "Depthiness",
      title: "exaggerates depth by multiplying the width of the view cone",
      fixRange: (r) => Math.max(0, r),
      stringify: (r) => `${r.toFixed(2)}x`
    }), c.appendChild(L), c.appendChild(C), t.lkgCanvas.oncontextmenu = (r) => {
      r.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (r) => {
      const u = t.targetDiam, o = 1.1, l = Math.log(u) / Math.log(o);
      return t.targetDiam = Math.pow(o, l + r.deltaY * 0.01);
    }), t.lkgCanvas.addEventListener("mousemove", (r) => {
      const u = r.movementX, o = -r.movementY;
      if (r.buttons & 2 || r.buttons & 1 && (r.shiftKey || r.ctrlKey)) {
        const l = t.trackballX, h = t.trackballY, F = -Math.cos(l) * u + Math.sin(l) * Math.sin(h) * o, w = -Math.cos(h) * o, d = Math.sin(l) * u + Math.cos(l) * Math.sin(h) * o;
        t.targetX = t.targetX + F * t.targetDiam * 1e-3, t.targetY = t.targetY + w * t.targetDiam * 1e-3, t.targetZ = t.targetZ + d * t.targetDiam * 1e-3;
      } else
        r.buttons & 1 && (t.trackballX = t.trackballX - u * 0.01, t.trackballY = t.trackballY - o * 0.01);
    });
    const p = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (r) => {
      switch (r.code) {
        case "KeyW":
          p.w = 1;
          break;
        case "KeyA":
          p.a = 1;
          break;
        case "KeyS":
          p.s = 1;
          break;
        case "KeyD":
          p.d = 1;
          break;
      }
    }), t.lkgCanvas.addEventListener("keyup", (r) => {
      switch (r.code) {
        case "KeyW":
          p.w = 0;
          break;
        case "KeyA":
          p.a = 0;
          break;
        case "KeyS":
          p.s = 0;
          break;
        case "KeyD":
          p.d = 0;
          break;
      }
    }), requestAnimationFrame(a), setTimeout(() => {
      Ce(L);
    }, 1e3), s;
  }
}
function Oe(t) {
  let n = t.targetX, e = t.targetY, a = t.targetZ, i = `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`, s = t.targetDiam, c = t.trackballX, m = t.trackballY, f = t.depthiness;
  const S = {
    targetX: n,
    targetY: e,
    targetZ: a,
    fovy: i,
    targetDiam: s,
    trackballX: c,
    trackballY: m,
    depthiness: f
  };
  let v = JSON.stringify(S, null, 4);
  navigator.clipboard.writeText(v);
}
let V;
const qe = (t, n) => {
  const e = k();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (t == !1)
    ze(e, V);
  else {
    V == null && (V = Ue()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(V);
    const a = "getScreenDetails" in window;
    console.log(a, "Screen placement API exists"), a ? Ye(e.lkgCanvas, e, n) : K(e, e.lkgCanvas, n);
  }
};
async function Ye(t, n, e) {
  const a = await window.getScreenDetails();
  console.log(a);
  const i = a.screens.filter((s) => s.label.includes("LKG"))[0];
  if (console.log(i, "monitors"), i === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), K(n, t, e);
    return;
  } else {
    console.log("monitor ID", i.label, "serial number", n.calibration);
    const s = [
      `left=${i.left}`,
      `top=${i.top}`,
      `width=${i.width}`,
      `height=${i.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    n.popup = window.open("", "new", s), n.popup && (n.popup.document.body.style.background = "black", n.popup.document.body.appendChild(t), console.assert(e), n.popup.onbeforeunload = e);
  }
}
function K(t, n, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.appendChild(n), console.assert(e), t.popup.onbeforeunload = e);
}
function ze(t, n) {
  var e;
  (e = n.parentElement) == null || e.removeChild(n), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
const A = Symbol("LookingGlassXRWebGLLayer");
class je extends ge {
  constructor(n, e, a) {
    super(n, e, a);
    const i = k();
    i.appCanvas = e.canvas, i.lkgCanvas = document.createElement("canvas"), i.lkgCanvas.tabIndex = 0;
    const s = i.lkgCanvas.getContext("2d", { alpha: !1 });
    i.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const c = this[ve].config, m = e.createTexture();
    let f, S;
    const v = e.createFramebuffer(), L = e.enable.bind(e), C = e.disable.bind(e), x = e.getExtension("OES_vertex_array_object"), _ = 34229, p = x ? x.bindVertexArrayOES.bind(x) : e.bindVertexArray.bind(e);
    (c.depth || c.stencil) && (c.depth && c.stencil ? S = {
      format: e.DEPTH_STENCIL,
      attachment: e.DEPTH_STENCIL_ATTACHMENT
    } : c.depth ? S = {
      format: e.DEPTH_COMPONENT16,
      attachment: e.DEPTH_ATTACHMENT
    } : c.stencil && (S = {
      format: e.STENCIL_INDEX8,
      attachment: e.STENCIL_ATTACHMENT
    }), f = e.createRenderbuffer());
    const r = () => {
      const T = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, m), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, i.framebufferWidth, i.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.bindTexture(e.TEXTURE_2D, T), f) {
        const I = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, f), e.renderbufferStorage(e.RENDERBUFFER, S.format, i.framebufferWidth, i.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, I);
      }
    };
    r(), i.addEventListener("on-config-changed", r);
    const u = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, v), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, m, 0), (c.depth || c.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, S.attachment, e.RENDERBUFFER, f), e.bindFramebuffer(e.FRAMEBUFFER, u);
    const o = e.createProgram(), l = e.createShader(e.VERTEX_SHADER), h = e.createShader(e.FRAGMENT_SHADER);
    if (o === null || l === null || h === null) {
      console.error("there was a problem with shader construction");
      return;
    }
    e.attachShader(o, l), e.attachShader(o, h);
    {
      const T = `
       attribute vec2 a_position;
       varying vec2 v_texcoord;
       void main() {
         gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
         v_texcoord = a_position;
       }
     `;
      e.shaderSource(l, T), e.compileShader(l), e.getShaderParameter(l, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(l));
    }
    let F, w, d;
    const P = () => {
      const T = fe(i);
      if (T === F)
        return;
      if (F = T, e.shaderSource(h, T), e.compileShader(h), !e.getShaderParameter(h, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(h));
        return;
      }
      if (e.linkProgram(o), !e.getProgramParameter(o, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(o));
        return;
      }
      w = e.getAttribLocation(o, "a_position"), d = e.getUniformLocation(o, "u_viewType");
      const I = e.getUniformLocation(o, "u_texture"), M = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(o), e.uniform1i(I, 0), e.useProgram(M);
    };
    i.addEventListener("on-config-changed", P);
    const D = x ? x.createVertexArrayOES() : e.createVertexArray(), y = e.createBuffer(), R = e.getParameter(e.ARRAY_BUFFER_BINDING), N = e.getParameter(_);
    p(D), e.bindBuffer(e.ARRAY_BUFFER, y), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(w), e.vertexAttribPointer(w, 2, e.FLOAT, !1, 0, 0), p(N), e.bindBuffer(e.ARRAY_BUFFER, R);
    const J = () => {
      console.assert(this[A].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
      const T = e.getParameter(e.COLOR_CLEAR_VALUE), I = e.getParameter(e.DEPTH_CLEAR_VALUE), M = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(T[0], T[1], T[2], T[3]), e.clearDepth(I), e.clearStencil(M);
    }, ee = () => {
      if (!this[A].LookingGlassEnabled || i.appCanvas == null || i.lkgCanvas == null)
        return;
      (i.appCanvas.width !== i.framebufferWidth || i.appCanvas.height !== i.framebufferHeight) && (i.appCanvas.width, i.appCanvas.height, i.appCanvas.width = i.framebufferWidth, i.appCanvas.height = i.framebufferHeight);
      const T = e.getParameter(_), I = e.getParameter(e.CULL_FACE), M = e.getParameter(e.BLEND), te = e.getParameter(e.DEPTH_TEST), ne = e.getParameter(e.STENCIL_TEST), ie = e.getParameter(e.SCISSOR_TEST), B = e.getParameter(e.VIEWPORT), ae = e.getParameter(e.FRAMEBUFFER_BINDING), oe = e.getParameter(e.RENDERBUFFER_BINDING), re = e.getParameter(e.CURRENT_PROGRAM), se = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const le = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(o), p(D), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, m), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(d, 0), e.drawArrays(e.TRIANGLES, 0, 6), s == null || s.clearRect(0, 0, i.lkgCanvas.width, i.lkgCanvas.height), s == null || s.drawImage(i.appCanvas, 0, 0, i.framebufferWidth, i.framebufferHeight, 0, 0, i.calibration.screenW.value, i.calibration.screenH.value), i.inlineView !== 0 && (i.capturing && i.appCanvas.width !== i.framebufferWidth && (i.appCanvas.width = i.framebufferWidth, i.appCanvas.height = i.framebufferHeight, e.viewport(0, 0, i.framebufferHeight, i.framebufferWidth)), e.uniform1i(d, i.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, le);
      }
      e.activeTexture(se), e.useProgram(re), e.bindRenderbuffer(e.RENDERBUFFER, oe), e.bindFramebuffer(e.FRAMEBUFFER, ae), e.viewport(B[0], B[1], B[2], B[3]), (ie ? L : C)(e.SCISSOR_TEST), (ne ? L : C)(e.STENCIL_TEST), (te ? L : C)(e.DEPTH_TEST), (M ? L : C)(e.BLEND), (I ? L : C)(e.CULL_FACE), p(T);
    };
    window.addEventListener("unload", () => {
      i.popup && i.popup.close(), i.popup = null;
    }), P(), this[A] = {
      LookingGlassEnabled: !1,
      framebuffer: v,
      clearFramebuffer: J,
      blitTextureToDefaultFramebufferIfNeeded: ee,
      moveCanvasToWindow: qe
    };
  }
  get framebuffer() {
    return this[A].LookingGlassEnabled ? this[A].framebuffer : null;
  }
  get framebufferWidth() {
    return k().framebufferWidth;
  }
  get framebufferHeight() {
    return k().framebufferHeight;
  }
}
class Ze extends me {
  constructor(n) {
    super(n), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = b.create(), this.inlineProjectionMatrix = b.create(), this.inlineInverseViewMatrix = b.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [];
  }
  onBaseLayerSet(n, e) {
    const a = this.sessions.get(n);
    a.baseLayer = e;
    const i = k(), s = e[A];
    s.LookingGlassEnabled = a.immersive, a.immersive && (i.XRSession = this.sessions.get(n), i.popup == null ? s.moveCanvasToWindow(!0, () => {
      this.endSession(n);
    }) : console.warn("attempted to assign baselayer twice?"));
  }
  isSessionSupported(n) {
    return n === "inline" || n === "immersive-vr";
  }
  isFeatureSupported(n) {
    switch (n) {
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
        return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", n), !1;
    }
  }
  async requestSession(n, e) {
    if (!this.isSessionSupported(n))
      return Promise.reject();
    const a = n !== "inline", i = new Ke(n, e);
    return this.sessions.set(i.id, i), a && this.dispatchEvent("@@webxr-polyfill/vr-present-start", i.id), Promise.resolve(i.id);
  }
  requestAnimationFrame(n) {
    return this.global.requestAnimationFrame(n);
  }
  cancelAnimationFrame(n) {
    this.global.cancelAnimationFrame(n);
  }
  onFrameStart(n, e) {
    const a = this.sessions.get(n), i = k();
    if (a.immersive) {
      const s = Math.tan(0.5 * i.fovy), c = 0.5 * i.targetDiam / s, m = c - i.targetDiam, f = this.basePoseMatrix;
      b.fromTranslation(f, [i.targetX, i.targetY, i.targetZ]), b.rotate(f, f, i.trackballX, [0, 1, 0]), b.rotate(f, f, -i.trackballY, [1, 0, 0]), b.translate(f, f, [0, 0, c]);
      for (let v = 0; v < i.numViews; ++v) {
        const L = (v + 0.5) / i.numViews - 0.5, C = Math.tan(i.viewCone * L), x = c * C, _ = this.LookingGlassInverseViewMatrices[v] = this.LookingGlassInverseViewMatrices[v] || b.create();
        b.translate(_, f, [x, 0, 0]), b.invert(_, _);
        const p = Math.max(m + e.depthNear, 0.01), r = m + e.depthFar, u = p * s, o = u, l = -u, h = p * -C, F = i.aspect * u, w = h + F, d = h - F, P = this.LookingGlassProjectionMatrices[v] = this.LookingGlassProjectionMatrices[v] || b.create();
        b.set(P, 2 * p / (w - d), 0, 0, 0, 0, 2 * p / (o - l), 0, 0, (w + d) / (w - d), (o + l) / (o - l), -(r + p) / (r - p), -1, 0, 0, -2 * r * p / (r - p), 0);
      }
      a.baseLayer[A].clearFramebuffer();
    } else {
      const s = a.baseLayer.context, c = s.drawingBufferWidth / s.drawingBufferHeight;
      b.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, c, e.depthNear, e.depthFar), b.fromTranslation(this.basePoseMatrix, [0, H, 0]), b.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }
  onFrameEnd(n) {
    this.sessions.get(n).baseLayer[A].blitTextureToDefaultFramebufferIfNeeded();
  }
  async requestFrameOfReferenceTransform(n, e) {
    const a = b.create();
    switch (n) {
      case "viewer":
      case "local":
        return b.fromTranslation(a, [0, -H, 0]), a;
      case "local-floor":
        return a;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(n) {
    const e = this.sessions.get(n);
    e.immersive && e.baseLayer && (e.baseLayer[A].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", n)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(n, e) {
    const a = this.sessions.get(n);
    return a.ended ? !1 : a.enabledFeatures.has(e);
  }
  getViewSpaces(n) {
    if (n === "immersive-vr") {
      const e = k();
      for (let a = this.viewSpaces.length; a < e.numViews; ++a)
        this.viewSpaces[a] = new Qe(a);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(n, e, a, i, s) {
    if (s === void 0) {
      const m = this.sessions.get(n).baseLayer.context;
      i.x = 0, i.y = 0, i.width = m.drawingBufferWidth, i.height = m.drawingBufferHeight;
    } else {
      const c = k(), m = s % c.quiltWidth, f = Math.floor(s / c.quiltWidth);
      i.x = c.framebufferWidth / c.quiltWidth * m, i.y = c.framebufferHeight / c.quiltHeight * f, i.width = c.framebufferWidth / c.quiltWidth, i.height = c.framebufferHeight / c.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(n, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || b.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(n) {
    return this.LookingGlassInverseViewMatrices[n] = this.LookingGlassInverseViewMatrices[n] || b.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(n, e, a) {
    return null;
  }
  onWindowResize() {
  }
}
let $e = 0;
class Ke {
  constructor(n, e) {
    E(this, "mode");
    E(this, "immersive");
    E(this, "id");
    E(this, "baseLayer");
    E(this, "inlineVerticalFieldOfView");
    E(this, "ended");
    E(this, "enabledFeatures");
    this.mode = n, this.immersive = n === "immersive-vr" || n === "immersive-ar", this.id = ++$e, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class Qe extends be {
  constructor(e) {
    super();
    E(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class Q extends pe {
  constructor(e) {
    super();
    E(this, "vrButton");
    E(this, "device");
    E(this, "isPresenting", !1);
    Re(), q(e), this.loadPolyfill();
  }
  static async init(e) {
    console.log("css variables created"), console.timeStamp("css variables created"), new Q(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in O)
      this.global[e] = O[e];
    this.global.XRWebGLLayer = je, this.injected = !0, this.device = new Ze(this.global), this.xr = new ue(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await Je("xrbutton"), this.vrButton && this.device && (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI());
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await et(100), g(this.vrButton, Ae), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    q(e);
  }
}
async function Je(t) {
  return new Promise((n, e) => {
    const a = new MutationObserver(function(i) {
      i.forEach(function(s) {
        s.addedNodes.forEach(function(c) {
          const m = c;
          m.id == t && (n(m), a.disconnect());
        });
      });
    });
    a.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      a.disconnect(), e(`id:${t} not found`);
    }, 5e3);
  });
}
function et(t) {
  return new Promise((n) => setTimeout(n, t));
}
const dt = k();
export {
  dt as LookingGlassConfig,
  Q as LookingGlassWebXRPolyfill
};
