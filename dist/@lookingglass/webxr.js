var pe = Object.defineProperty;
var he = (t, i, e) => i in t ? pe(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var L = (t, i, e) => (he(t, typeof i != "symbol" ? i + "" : i, e), e);
import j from "@lookingglass/webxr-polyfill/src/api/index";
import fe from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import me from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as be from "holoplay-core";
import { Shader as ge } from "holoplay-core";
import ve from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import Ce from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as v } from "gl-matrix";
import we, { PRIVATE as xe } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const Y = 1.6;
var Z;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(Z || (Z = {}));
class Ee extends EventTarget {
  constructor(e) {
    super();
    L(this, "_calibration", {
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
    L(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: Y,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 13 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: Z.Center,
      capturing: !1,
      quiltResolution: 3840,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null
    });
    L(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new be.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, a, n) {
    super.addEventListener(e, a, n);
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
let q = null;
function _() {
  return q == null && (q = new Ee()), q;
}
function $(t) {
  const i = _();
  t != null && i.updateViewControls(t);
}
async function ye(t) {
  const i = _();
  if (i.appCanvas == null) {
    console.warn("Media Capture initialized while canvas is null!");
    return;
  } else
    t.onclick = async () => await e();
  async function e() {
    await Te.promise(50).finally(a);
  }
  function a() {
    if (i.appCanvas != null) {
      console.time("capture"), setTimeout(() => t.textContent = "Capturing...", 0);
      let n = i.appCanvas.toDataURL("image/jpeg");
      console.timeLog("capture"), console.timeEnd("capture"), setTimeout(() => t.textContent = "Saving...", 0);
      const r = document.createElement("a");
      r.style.display = "none", r.href = n, r.download = `hologram_qs${i.quiltWidth}x${i.quiltHeight}a${i.aspect}.jpeg`, document.body.appendChild(r), r.click(), document.body.removeChild(r), window.URL.revokeObjectURL(n), setTimeout(() => t.textContent = "Save Hologram", 125);
    }
  }
}
const Re = { timeout: 500 }, K = window.requestIdleCallback || window.requestAnimationFrame, Le = window.cancelIdleCallback || window.cancelAnimationFrame, Te = {
  request: K,
  cancel: Le,
  promise: (t) => new Promise((i) => K(i, Object.assign({}, Re, t)))
};
function Fe() {
  let t = document.createElement("style");
  document.head.appendChild(t);
  let i = `
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
  t.appendChild(document.createTextNode(i));
}
const Se = {
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
}, Q = {
  width: "100%",
  display: "flex",
  justifyContent: "start",
  alignItems: "center",
  textAlign: "left",
  fontWeight: "bold",
  marginBottom: "8px"
}, ke = {
  display: "block",
  fontFamily: "Helvetica Neue",
  fontStyle: "normal",
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "20px",
  alignItems: "center",
  letterSpacing: "-0.2px"
}, _e = {
  display: "flex",
  flexDirection: "column",
  alignItems: "left",
  padding: "0px",
  gap: "16px",
  paddingRight: "16px",
  paddingLeft: "16px"
}, Ie = {
  order: 2,
  flexGrow: 0,
  width: "100%",
  height: "91px"
}, ee = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%"
}, J = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  gap: "8px"
}, Pe = {
  border: "none",
  background: "none",
  cursor: "pointer",
  opacity: "40%",
  hover: "opacity: 100%"
}, Ae = {
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
}, Me = {
  border: "none",
  cursor: "pointer",
  width: "100%",
  background: "none",
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
}, Ve = {
  display: "flex",
  flexDirection: "row",
  background: "#28273F",
  padding: "4px",
  borderRadius: "8px"
}, W = {
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
}, X = {
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
}, De = {
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
function f(t, i) {
  Object.assign(t.style, i);
}
function U(t, i, e, a) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  return n.setAttribute("width", `${a}px`), n.setAttribute("height", `${a}px`), n.setAttribute("viewBox", `0 0 ${a} ${a}`), n.setAttribute("fill", "none"), n.setAttribute("xmlns", "http://www.w3.org/2000/svg"), Be(n, i), n;
}
function Be(t, i, e) {
  for (let a = 0; a < i.length; a++) {
    const n = document.createElementNS("http://www.w3.org/2000/svg", "path");
    n.setAttribute("fill-rule", "evenodd"), n.setAttribute("clip-rule", "evenodd"), n.setAttribute("d", i[a]), n.setAttribute("fill", "white"), t.appendChild(n);
  }
}
const te = {
  fillRule: "evenodd",
  clipRule: "evenodd",
  fill: "white",
  width: "16px",
  height: "20px",
  display: "block"
}, ne = {
  fillRule: "evenodd",
  clipRule: "evenodd",
  fill: "white",
  width: "24px",
  height: "24px",
  display: "block",
  opacity: "40%"
}, He = [
  "M29 16.2743V23.6543C29 24.58 28.5114 25.4286 27.7143 25.8786L21.2857 29.5814C20.8871 29.8129 20.45 29.9286 20 29.9286C19.55 29.9286 19.1129 29.8129 18.7143 29.5814L18.0018 29.171C18.0022 29.0134 17.9894 28.8522 17.9624 28.6882C17.801 27.6951 17.4588 26.7641 16.9708 25.9295L19.11 27.21V20.6971L13.17 17.3V22.5773C12.5794 22.3251 11.9526 22.1412 11.2996 22.0352L11.2879 22.0333L11.2761 22.0316C11.1832 22.0176 11.0911 22.0082 11 22.0032V16.2743C11 15.3486 11.4886 14.5 12.2857 14.0371L18.7143 10.3471C19.1129 10.1157 19.55 10 20 10C20.45 10 20.8871 10.1157 21.2857 10.3471L27.7143 14.05C28.5114 14.5 29 15.3486 29 16.2743ZM15.6704 27.8281L12.2857 25.8786C11.5941 25.4881 11.1347 24.7977 11.0253 24.0171L11.0323 24.0183C11.2863 24.0618 11.5349 24.121 11.7771 24.195C13.5676 24.7418 15.0071 26.0923 15.6704 27.8281ZM14.31 15.5029L20 18.87L25.69 15.5029L20 12.07L14.31 15.5029ZM20.89 27.21L26.83 23.6543V17.3L20.89 20.6971V27.21Z",
  "M10 30L10 27.3992C11.4387 27.3992 12.6 28.5609 12.6 30L10 30ZM15.122 30C14.6974 30 14.342 29.6879 14.2727 29.2631C13.9607 27.4599 12.5394 26.0381 10.7367 25.726C10.312 25.6566 10 25.3012 10 24.8764C10 24.3475 10.4593 23.9314 10.9793 24.0094C13.5447 24.4256 15.5727 26.4455 15.9887 29.0117C16.0754 29.5319 15.6507 30 15.122 30Z"
], Ne = [
  "M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM11.94 18.43C12.6138 18.43 13.16 17.8838 13.16 17.21C13.16 16.5362 12.6138 15.99 11.94 15.99C11.2662 15.99 10.72 16.5362 10.72 17.21C10.72 17.8838 11.2662 18.43 11.94 18.43ZM13.3319 13.415C13.342 13.3946 13.3522 13.3742 13.3624 13.364C13.6395 12.9577 14.0255 12.6192 14.4168 12.2761C15.3197 11.4846 16.2508 10.6682 15.9383 8.93513C15.643 7.21448 14.2685 5.79926 12.5479 5.54472C10.4505 5.23928 8.5975 6.53232 8.03752 8.38534C7.86444 8.97586 8.31242 9.57656 8.92331 9.57656H9.12693C9.54437 9.57656 9.88036 9.2813 10.0229 8.91477C10.3487 8.00863 11.3058 7.38756 12.3646 7.61155C13.342 7.81518 14.0547 8.78241 13.9631 9.78019C13.8941 10.5576 13.3388 10.9875 12.7225 11.4647C12.3379 11.7624 11.9296 12.0785 11.601 12.5088L11.5908 12.4986C11.5732 12.5163 11.5589 12.5407 11.5442 12.5661C11.5334 12.5846 11.5223 12.6036 11.5094 12.6208C11.4941 12.6463 11.4763 12.6717 11.4585 12.6972C11.4407 12.7226 11.4228 12.7481 11.4076 12.7735C11.3159 12.9161 11.2447 13.0586 11.1836 13.2215C11.1785 13.2419 11.1683 13.2571 11.1581 13.2724C11.1479 13.2877 11.1378 13.303 11.1327 13.3233C11.1225 13.3335 11.1225 13.3437 11.1225 13.3539C11.0003 13.7204 10.9189 14.1582 10.9189 14.6775H12.9653C12.9653 14.4229 12.9959 14.1989 13.0671 13.9851C13.0875 13.9138 13.118 13.8426 13.1486 13.7713C13.1588 13.7306 13.169 13.6899 13.1893 13.6593C13.23 13.5779 13.2809 13.4964 13.3318 13.415L13.3319 13.415Z"
], We = [
  "M17.09 9.83203H15.5V4.83203C15.5 4.28203 15.05 3.83203 14.5 3.83203H10.5C9.95 3.83203 9.5 4.28203 9.5 4.83203V9.83203H7.91C7.02 9.83203 6.57 10.912 7.2 11.542L11.79 16.132C12.18 16.522 12.81 16.522 13.2 16.132L17.79 11.542C18.42 10.912 17.98 9.83203 17.09 9.83203ZM5.5 19.832C5.5 20.382 5.95 20.832 6.5 20.832H18.5C19.05 20.832 19.5 20.382 19.5 19.832C19.5 19.282 19.05 18.832 18.5 18.832H6.5C5.95 18.832 5.5 19.282 5.5 19.832Z"
], Xe = [
  "M9.5 2.33203C8.39543 2.33203 7.5 3.22746 7.5 4.33203H6.5C5.39543 4.33203 4.5 5.22746 4.5 6.33203V11.332H6.5V6.33203H7.5C7.5 7.4366 8.39543 8.33203 9.5 8.33203H15.5C16.6046 8.33203 17.5 7.4366 17.5 6.33203H18.5V20.332H6.5V17.332H4.5V20.332C4.5 21.4366 5.39543 22.332 6.5 22.332H18.5C19.6046 22.332 20.5 21.4366 20.5 20.332V6.33203C20.5 5.22746 19.6046 4.33203 18.5 4.33203H17.5C17.5 3.22746 16.6046 2.33203 15.5 2.33203H9.5ZM9.5 4.33203H15.5V6.33203H9.5V4.33203ZM4.5 15.332H13.0871L10.7933 17.6248L12.2072 19.0393L16.2072 15.0411C16.3948 14.8536 16.5002 14.5993 16.5002 14.3341C16.5003 14.0689 16.395 13.8145 16.2075 13.6269L12.2075 9.62508L10.793 11.039L13.085 13.332H4.5V15.332Z"
], z = {
  width: "24px",
  height: "24px",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
}, Ge = {
  width: "40px",
  height: "40px",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Ue() {
  return U(z, We, te, 24);
}
function Oe() {
  return U(z, Ne, ne, 24);
}
function qe() {
  return U(Ge, He, te, 40);
}
function Ye() {
  return U(z, Xe, ne, 24);
}
function Ze() {
  const t = [];
  for (let i = 0; i <= 10 * 12; i += 12)
    t.push(`${i + "\xB0"}`);
  return t;
}
function ze(t) {
  const i = document.createElement("div");
  f(i, ee), t.appendChild(i);
  const e = Ze();
  return e.forEach((a) => {
    const n = document.createElement("p");
    n.style.fontSize = "12px", n.style.lineHeight = "16px", n.style.color = "rgba(255, 255, 255, 0.40)", n.textContent = a, i.appendChild(n);
  }), e;
}
function je() {
  const t = [];
  for (let i = 0; i <= 10 * 0.2; i += 0.2) {
    const e = i.toFixed(1);
    t.push(e);
  }
  return t;
}
function $e(t) {
  const i = document.createElement("div");
  f(i, ee), t.appendChild(i);
  const e = je();
  return e.forEach((a) => {
    const n = document.createElement("p");
    n.style.fontSize = "12px", n.style.lineHeight = "16px", n.style.color = "rgba(255, 255, 255, 0.40)", n.textContent = a, i.appendChild(n);
  }), e;
}
function Ke() {
  var i;
  const t = _();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let e = function(o) {
      const l = document.createElement("div");
      l.style.marginBottom = "8px", f(l, Ve), C.appendChild(l);
      const c = document.createElement("button");
      c.innerText = "Center", f(c, t.inlineView === 1 ? W : X), l.appendChild(c);
      const d = document.createElement("button");
      d.innerText = "Quilt", f(d, t.inlineView === 2 ? W : X), l.appendChild(d);
      const R = (V) => {
        t[o] = V;
      };
      return d.onclick = () => {
        d.classList.add("active"), f(d, W), c.classList.remove("active"), f(c, X), R("2");
      }, c.onclick = () => {
        c.classList.add("active"), f(c, W), d.classList.remove("active"), f(d, X), R("1");
      }, l;
    }, a = function() {
      let o = w.d - w.a, l = w.w - w.s;
      o && l && (o *= Math.sqrt(0.5), l *= Math.sqrt(0.5));
      const c = t.trackballX, d = t.trackballY, R = Math.cos(c) * o - Math.sin(c) * Math.cos(d) * l, V = -Math.sin(d) * l, P = -Math.sin(c) * o - Math.cos(c) * Math.cos(d) * l;
      t.targetX = t.targetX + R * t.targetDiam * 0.03, t.targetY = t.targetY + V * t.targetDiam * 0.03, t.targetZ = t.targetZ + P * t.targetDiam * 0.03, requestAnimationFrame(a);
    };
    const n = document.createElement("style");
    document.head.appendChild(n), (i = n.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { font-family: sans-serif }");
    const r = document.createElement("div");
    r.id = "LookingGlassWebXRControls", r.className = "controlsBackground", f(r, Se);
    const s = document.createElement("div");
    r.appendChild(s), f(s, _e);
    const h = document.createElement("div");
    f(h, Q), s.appendChild(h);
    const p = document.createElement("div");
    f(p, Q), h.appendChild(p);
    const I = document.createElement("span");
    I.innerText = "Casting to Looking Glass", p.appendChild(qe()), p.appendChild(I);
    const E = document.createElement("button");
    h.appendChild(E), f(E, Pe), E.appendChild(Oe()), E.onclick = () => {
      window.open("https://docs.lookingglassfactory.com/developer-tools/webxr", "_blank");
    };
    const T = document.createElement("button");
    f(T, Ae), T.id = "screenshotbutton";
    const F = document.createElement("div");
    f(F, J), T.appendChild(F);
    const A = Ue();
    F.appendChild(A);
    const M = document.createElement("span");
    M.innerText = "Save Hologram", F.appendChild(M);
    const g = document.createElement("button");
    g.id = "copybutton", f(g, Me);
    const S = document.createElement("div");
    f(S, J), g.appendChild(S);
    const B = Ye();
    S.appendChild(B);
    const m = document.createElement("span");
    m.innerText = "Copy Config", S.appendChild(m), g.addEventListener("click", () => {
      m.innerText = "Copied!", Qe(t), setTimeout(() => {
        m.innerText = "Copy Config";
      }, 300);
    });
    const C = document.createElement("div");
    C.style.display = "inline-flex", C.style.flexDirection = "column", C.style.gap = "16px", C.style.alignContent = "start", s.appendChild(C);
    const k = (o, l, c) => {
      const d = document.createElement("div");
      d.style.marginBottom = "8px", C.appendChild(d), f(d, Ie);
      const R = o, V = t[o], P = document.createElement("label");
      d.appendChild(P), P.innerText = c.label, P.setAttribute("for", R), f(P, ke), P.title = c.title, R === "fovy" ? ze(d) : R === "depthiness" && $e(d);
      const u = document.createElement("input");
      if (d.appendChild(u), Object.assign(u, l), u.id = R, u.className = "looking-glass-input", u.title = c.title, u.value = l.value !== void 0 ? l.value : V, l.type === "range") {
        const b = (parseFloat(u.value) - parseFloat(u.min)) / (parseFloat(u.max) - parseFloat(u.min)) * 100, x = `linear-gradient(90deg, #ffffff ${b}%, rgba(255, 255, 255, 0.20) ${b}%)`;
        u.style.backgroundImage = x;
      }
      const H = (b) => {
        t[o] = b;
      };
      u.oninput = () => {
        if (l.type === "range") {
          const b = (parseFloat(u.value) - parseFloat(u.min)) / (parseFloat(u.max) - parseFloat(u.min)) * 100, x = `linear-gradient(90deg, #ffffff ${b}%, rgba(255, 255, 255, 0.08) ${b}%)`;
          u.style.backgroundImage = x;
          const O = l.type === "range" ? parseFloat(u.value) : l.type === "checkbox" ? u.checked : u.value;
          H(O);
        }
      };
      const y = (b) => {
        let x = b(t[o]);
        c.fixRange && (x = c.fixRange(x), u.max = Math.max(parseFloat(u.max), x).toString(), u.min = Math.min(parseFloat(u.min), x).toString()), u.value = x, H(x);
      };
      return l.type === "range" && (u.onwheel = (b) => {
        y((x) => x + Math.sign(b.deltaX - b.deltaY) * l.step);
      }), d;
    };
    e("inlineView"), k("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "Field of view",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (o) => Math.max(1 / 180 * Math.PI, Math.min(o, 120.1 / 180 * Math.PI))
    }), k("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "Depthiness",
      title: "exaggerates depth by multiplying the width of the view cone",
      fixRange: (o) => Math.max(0, o),
      stringify: (o) => `${o.toFixed(2)}x`
    }), s.appendChild(T), s.appendChild(g), t.lkgCanvas.oncontextmenu = (o) => {
      o.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (o) => {
      const l = t.targetDiam, c = 1.1, d = Math.log(l) / Math.log(c);
      return t.targetDiam = Math.pow(c, d + o.deltaY * 0.01);
    }), t.lkgCanvas.addEventListener("mousemove", (o) => {
      const l = o.movementX, c = -o.movementY;
      if (o.buttons & 2 || o.buttons & 1 && (o.shiftKey || o.ctrlKey)) {
        const d = t.trackballX, R = t.trackballY, V = -Math.cos(d) * l + Math.sin(d) * Math.sin(R) * c, P = -Math.cos(R) * c, u = Math.sin(d) * l + Math.cos(d) * Math.sin(R) * c;
        t.targetX = t.targetX + V * t.targetDiam * 1e-3, t.targetY = t.targetY + P * t.targetDiam * 1e-3, t.targetZ = t.targetZ + u * t.targetDiam * 1e-3;
      } else
        o.buttons & 1 && (t.trackballX = t.trackballX - l * 0.01, t.trackballY = t.trackballY - c * 0.01);
    });
    const w = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (o) => {
      switch (o.code) {
        case "KeyW":
          w.w = 1;
          break;
        case "KeyA":
          w.a = 1;
          break;
        case "KeyS":
          w.s = 1;
          break;
        case "KeyD":
          w.d = 1;
          break;
      }
    }), t.lkgCanvas.addEventListener("keyup", (o) => {
      switch (o.code) {
        case "KeyW":
          w.w = 0;
          break;
        case "KeyA":
          w.a = 0;
          break;
        case "KeyS":
          w.s = 0;
          break;
        case "KeyD":
          w.d = 0;
          break;
      }
    }), requestAnimationFrame(a), setTimeout(() => {
      ye(T);
    }, 1e3), r;
  }
}
function Qe(t) {
  let i = t.targetX, e = t.targetY, a = t.targetZ, n = `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`, r = t.targetDiam, s = t.trackballX, h = t.trackballY, p = t.depthiness;
  const I = {
    targetX: i,
    targetY: e,
    targetZ: a,
    fovy: n,
    targetDiam: r,
    trackballX: s,
    trackballY: h,
    depthiness: p
  };
  let E = JSON.stringify(I, null, 4);
  navigator.clipboard.writeText(E);
}
let G;
const Je = (t, i) => {
  const e = _();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (t == !1)
    tt(e, G);
  else {
    G == null && (G = Ke()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(G);
    try {
      const a = "getScreenDetails" in window;
      if (console.log(a, "Screen placement API exists"), !a)
        throw new Error("Screen Placement API not supported");
      et(e.lkgCanvas, e, i);
    } catch {
      console.log("user did not allow window placement, using normal popup instead"), ie(e, e.lkgCanvas, i);
    }
  }
};
async function et(t, i, e) {
  const a = await window.getScreenDetails();
  console.log(a);
  const n = a.screens.filter((r) => r.label.includes("LKG"))[0];
  if (console.log(n, "monitors"), n === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), ie(i, t, e);
    return;
  } else {
    console.log("monitor ID", n.label, "serial number", i.calibration);
    const r = [
      `left=${n.left}`,
      `top=${n.top}`,
      `width=${n.width}`,
      `height=${n.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    i.popup = window.open("", "new", r), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.appendChild(t), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function ie(t, i, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.appendChild(i), console.assert(e), t.popup.onbeforeunload = e);
}
function tt(t, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
const D = Symbol("LookingGlassXRWebGLLayer");
class nt extends we {
  constructor(i, e, a) {
    super(i, e, a);
    const n = _();
    n.appCanvas = e.canvas, n.lkgCanvas = document.createElement("canvas"), n.lkgCanvas.tabIndex = 0;
    const r = n.lkgCanvas.getContext("2d", { alpha: !1 });
    n.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const s = this[xe].config, h = e.createTexture();
    let p, I;
    const E = e.createFramebuffer(), T = e.enable.bind(e), F = e.disable.bind(e), A = e.getExtension("OES_vertex_array_object"), M = 34229, g = A ? A.bindVertexArrayOES.bind(A) : e.bindVertexArray.bind(e);
    (s.depth || s.stencil) && (s.depth && s.stencil ? I = {
      format: e.DEPTH_STENCIL,
      attachment: e.DEPTH_STENCIL_ATTACHMENT
    } : s.depth ? I = {
      format: e.DEPTH_COMPONENT16,
      attachment: e.DEPTH_ATTACHMENT
    } : s.stencil && (I = {
      format: e.STENCIL_INDEX8,
      attachment: e.STENCIL_ATTACHMENT
    }), p = e.createRenderbuffer());
    const S = () => {
      const y = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, h), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, n.framebufferWidth, n.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.bindTexture(e.TEXTURE_2D, y), p) {
        const b = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, p), e.renderbufferStorage(e.RENDERBUFFER, I.format, n.framebufferWidth, n.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, b);
      }
    };
    S(), n.addEventListener("on-config-changed", S);
    const B = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, E), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, h, 0), (s.depth || s.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, I.attachment, e.RENDERBUFFER, p), e.bindFramebuffer(e.FRAMEBUFFER, B);
    const m = e.createProgram(), C = e.createShader(e.VERTEX_SHADER), k = e.createShader(e.FRAGMENT_SHADER);
    if (m === null || C === null || k === null) {
      console.error("there was a problem with shader construction");
      return;
    }
    e.attachShader(m, C), e.attachShader(m, k);
    {
      const y = `
       attribute vec2 a_position;
       varying vec2 v_texcoord;
       void main() {
         gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
         v_texcoord = a_position;
       }
     `;
      e.shaderSource(C, y), e.compileShader(C), e.getShaderParameter(C, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(C));
    }
    let w, o, l;
    const c = () => {
      const y = ge(n);
      if (y === w)
        return;
      if (w = y, e.shaderSource(k, y), e.compileShader(k), !e.getShaderParameter(k, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(k));
        return;
      }
      if (e.linkProgram(m), !e.getProgramParameter(m, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(m));
        return;
      }
      o = e.getAttribLocation(m, "a_position"), l = e.getUniformLocation(m, "u_viewType");
      const b = e.getUniformLocation(m, "u_texture"), x = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(m), e.uniform1i(b, 0), e.useProgram(x);
    };
    n.addEventListener("on-config-changed", c);
    const d = A ? A.createVertexArrayOES() : e.createVertexArray(), R = e.createBuffer(), V = e.getParameter(e.ARRAY_BUFFER_BINDING), P = e.getParameter(M);
    g(d), e.bindBuffer(e.ARRAY_BUFFER, R), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(o), e.vertexAttribPointer(o, 2, e.FLOAT, !1, 0, 0), g(P), e.bindBuffer(e.ARRAY_BUFFER, V);
    const u = () => {
      console.assert(this[D].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
      const y = e.getParameter(e.COLOR_CLEAR_VALUE), b = e.getParameter(e.DEPTH_CLEAR_VALUE), x = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(y[0], y[1], y[2], y[3]), e.clearDepth(b), e.clearStencil(x);
    }, H = () => {
      if (!this[D].LookingGlassEnabled || n.appCanvas == null || n.lkgCanvas == null)
        return;
      (n.appCanvas.width !== n.framebufferWidth || n.appCanvas.height !== n.framebufferHeight) && (n.appCanvas.width, n.appCanvas.height, n.appCanvas.width = n.framebufferWidth, n.appCanvas.height = n.framebufferHeight);
      const y = e.getParameter(M), b = e.getParameter(e.CULL_FACE), x = e.getParameter(e.BLEND), O = e.getParameter(e.DEPTH_TEST), oe = e.getParameter(e.STENCIL_TEST), re = e.getParameter(e.SCISSOR_TEST), N = e.getParameter(e.VIEWPORT), se = e.getParameter(e.FRAMEBUFFER_BINDING), le = e.getParameter(e.RENDERBUFFER_BINDING), ce = e.getParameter(e.CURRENT_PROGRAM), de = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const ue = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(m), g(d), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, h), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(l, 0), e.drawArrays(e.TRIANGLES, 0, 6), r == null || r.clearRect(0, 0, n.lkgCanvas.width, n.lkgCanvas.height), r == null || r.drawImage(n.appCanvas, 0, 0, n.framebufferWidth, n.framebufferHeight, 0, 0, n.calibration.screenW.value, n.calibration.screenH.value), n.inlineView !== 0 && (n.capturing && n.appCanvas.width !== n.framebufferWidth && (n.appCanvas.width = n.framebufferWidth, n.appCanvas.height = n.framebufferHeight, e.viewport(0, 0, n.framebufferHeight, n.framebufferWidth)), e.uniform1i(l, n.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, ue);
      }
      e.activeTexture(de), e.useProgram(ce), e.bindRenderbuffer(e.RENDERBUFFER, le), e.bindFramebuffer(e.FRAMEBUFFER, se), e.viewport(N[0], N[1], N[2], N[3]), (re ? T : F)(e.SCISSOR_TEST), (oe ? T : F)(e.STENCIL_TEST), (O ? T : F)(e.DEPTH_TEST), (x ? T : F)(e.BLEND), (b ? T : F)(e.CULL_FACE), g(y);
    };
    window.addEventListener("unload", () => {
      n.popup && n.popup.close(), n.popup = null;
    }), c(), this[D] = {
      LookingGlassEnabled: !1,
      framebuffer: E,
      clearFramebuffer: u,
      blitTextureToDefaultFramebufferIfNeeded: H,
      moveCanvasToWindow: Je
    };
  }
  get framebuffer() {
    return this[D].LookingGlassEnabled ? this[D].framebuffer : null;
  }
  get framebufferWidth() {
    return _().framebufferWidth;
  }
  get framebufferHeight() {
    return _().framebufferHeight;
  }
}
class it extends ve {
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = v.create(), this.inlineProjectionMatrix = v.create(), this.inlineInverseViewMatrix = v.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [];
  }
  onBaseLayerSet(i, e) {
    const a = this.sessions.get(i);
    a.baseLayer = e;
    const n = _(), r = e[D];
    r.LookingGlassEnabled = a.immersive, a.immersive && (n.XRSession = this.sessions.get(i), n.popup == null ? r.moveCanvasToWindow(!0, () => {
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
    const a = i !== "inline", n = new ot(i, e);
    return this.sessions.set(n.id, n), a && this.dispatchEvent("@@webxr-polyfill/vr-present-start", n.id), Promise.resolve(n.id);
  }
  requestAnimationFrame(i) {
    return this.global.requestAnimationFrame(i);
  }
  cancelAnimationFrame(i) {
    this.global.cancelAnimationFrame(i);
  }
  onFrameStart(i, e) {
    const a = this.sessions.get(i), n = _();
    if (a.immersive) {
      const r = Math.tan(0.5 * n.fovy), s = 0.5 * n.targetDiam / r, h = s - n.targetDiam, p = this.basePoseMatrix;
      v.fromTranslation(p, [n.targetX, n.targetY, n.targetZ]), v.rotate(p, p, n.trackballX, [0, 1, 0]), v.rotate(p, p, -n.trackballY, [1, 0, 0]), v.translate(p, p, [0, 0, s]);
      for (let E = 0; E < n.numViews; ++E) {
        const T = (E + 0.5) / n.numViews - 0.5, F = Math.tan(n.viewCone * T), A = s * F, M = this.LookingGlassInverseViewMatrices[E] = this.LookingGlassInverseViewMatrices[E] || v.create();
        v.translate(M, p, [A, 0, 0]), v.invert(M, M);
        const g = Math.max(h + e.depthNear, 0.01), S = h + e.depthFar, B = g * r, m = B, C = -B, k = g * -F, w = n.aspect * B, o = k + w, l = k - w, c = this.LookingGlassProjectionMatrices[E] = this.LookingGlassProjectionMatrices[E] || v.create();
        v.set(c, 2 * g / (o - l), 0, 0, 0, 0, 2 * g / (m - C), 0, 0, (o + l) / (o - l), (m + C) / (m - C), -(S + g) / (S - g), -1, 0, 0, -2 * S * g / (S - g), 0);
      }
      a.baseLayer[D].clearFramebuffer();
    } else {
      const r = a.baseLayer.context, s = r.drawingBufferWidth / r.drawingBufferHeight;
      v.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, s, e.depthNear, e.depthFar), v.fromTranslation(this.basePoseMatrix, [0, Y, 0]), v.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[D].blitTextureToDefaultFramebufferIfNeeded();
  }
  async requestFrameOfReferenceTransform(i, e) {
    const a = v.create();
    switch (i) {
      case "viewer":
      case "local":
        return v.fromTranslation(a, [0, -Y, 0]), a;
      case "local-floor":
        return a;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[D].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const a = this.sessions.get(i);
    return a.ended ? !1 : a.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = _();
      for (let a = this.viewSpaces.length; a < e.numViews; ++a)
        this.viewSpaces[a] = new rt(a);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, a, n, r) {
    if (r === void 0) {
      const h = this.sessions.get(i).baseLayer.context;
      n.x = 0, n.y = 0, n.width = h.drawingBufferWidth, n.height = h.drawingBufferHeight;
    } else {
      const s = _(), h = r % s.quiltWidth, p = Math.floor(r / s.quiltWidth);
      n.x = s.framebufferWidth / s.quiltWidth * h, n.y = s.framebufferHeight / s.quiltHeight * p, n.width = s.framebufferWidth / s.quiltWidth, n.height = s.framebufferHeight / s.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(i, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || v.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(i) {
    return this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || v.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(i, e, a) {
    return null;
  }
  onWindowResize() {
  }
}
let at = 0;
class ot {
  constructor(i, e) {
    L(this, "mode");
    L(this, "immersive");
    L(this, "id");
    L(this, "baseLayer");
    L(this, "inlineVerticalFieldOfView");
    L(this, "ended");
    L(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++at, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class rt extends Ce {
  constructor(e) {
    super();
    L(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class ae extends me {
  constructor(e) {
    super();
    L(this, "vrButton");
    L(this, "device");
    L(this, "isPresenting", !1);
    Fe(), $(e), this.loadPolyfill();
  }
  static async init(e) {
    new ae(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in j)
      this.global[e] = j[e];
    this.global.XRWebGLLayer = nt, this.injected = !0, this.device = new it(this.global), this.xr = new fe(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await st("xrbutton"), this.vrButton && this.device && (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI());
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await lt(100), f(this.vrButton, De), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    $(e);
  }
}
async function st(t) {
  return new Promise((i, e) => {
    const a = new MutationObserver(function(n) {
      n.forEach(function(r) {
        r.addedNodes.forEach(function(s) {
          const h = s;
          h.id == t && (i(h), a.disconnect());
        });
      });
    });
    a.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      a.disconnect(), e(`id:${t} not found`);
    }, 5e3);
  });
}
function lt(t) {
  return new Promise((i) => setTimeout(i, t));
}
const vt = _();
export {
  vt as LookingGlassConfig,
  ae as LookingGlassWebXRPolyfill
};
