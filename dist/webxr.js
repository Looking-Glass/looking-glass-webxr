var oe = Object.defineProperty;
var le = (t, i, e) => i in t ? oe(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var R = (t, i, e) => (le(t, typeof i != "symbol" ? i + "" : i, e), e);
import q from "@lookingglass/webxr-polyfill/src/api/index";
import ce from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import ue from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as he from "holoplay-core";
import { Shader as de } from "holoplay-core";
import fe from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import pe from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as g } from "gl-matrix";
import me, { PRIVATE as be } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const O = 1.6;
var Y;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(Y || (Y = {}));
class ve extends EventTarget {
  constructor(e) {
    super();
    R(this, "_calibration", {
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
    R(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: O,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 14 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: Y.Center,
      capturing: !1,
      quiltResolution: null,
      columns: null,
      rows: null,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null,
      subpixelMode: 1,
      filterMode: 1,
      gaussianSigma: 0.01
    });
    R(this, "LookingGlassDetected");
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
  get subpixelCells() {
    const e = new Float32Array(6 * this._calibration.subpixelCells.length);
    return this._calibration.subpixelCells.forEach((n, s) => {
      n.ROffsetX /= this.calibration.screenW.value, n.ROffsetY /= this.calibration.screenH.value, n.GOffsetX /= this.calibration.screenW.value, n.GOffsetY /= this.calibration.screenH.value, n.BOffsetX /= this.calibration.screenW.value, n.BOffsetY /= this.calibration.screenH.value, e[s * 6 + 0] = n.ROffsetX, e[s * 6 + 1] = n.ROffsetY, e[s * 6 + 2] = n.GOffsetX, e[s * 6 + 3] = n.GOffsetY, e[s * 6 + 4] = n.BOffsetX, e[s * 6 + 5] = n.BOffsetY;
    }), e;
  }
}
let H = null;
function S() {
  return H == null && (H = new ve()), H;
}
function z(t) {
  const i = S();
  t != null && i.updateViewControls(t);
}
function we(t) {
  const i = S();
  i.calibration = t;
}
async function ge() {
  const t = S();
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
    const s = I.getInstance();
    if (!s) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    t.inlineView = 2, s.captureScreenshot = !0, setTimeout(() => {
      s.screenshotCallback = e;
    }, 100);
  });
}
function ye() {
  var i, e, n, s, o;
  const t = S();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let u = function() {
      let a = d.d - d.a, r = d.w - d.s;
      a && r && (a *= Math.sqrt(0.5), r *= Math.sqrt(0.5));
      const l = t.trackballX, h = t.trackballY, m = Math.cos(l) * a - Math.sin(l) * Math.cos(h) * r, C = -Math.sin(h) * r, k = -Math.sin(l) * a - Math.cos(l) * Math.cos(h) * r;
      t.targetX = t.targetX + m * t.targetDiam * 0.03, t.targetY = t.targetY + C * t.targetDiam * 0.03, t.targetZ = t.targetZ + k * t.targetDiam * 0.03, requestAnimationFrame(u);
    };
    const x = document.createElement("style");
    document.head.appendChild(x), (i = x.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const c = document.createElement("div");
    c.id = "LookingGlassWebXRControls", c.style.position = "fixed", c.style.zIndex = "1000", c.style.padding = "15px", c.style.width = "320px", c.style.maxWidth = "calc(100vw - 18px)", c.style.maxHeight = "calc(100vh - 18px)", c.style.whiteSpace = "nowrap", c.style.background = "rgba(0, 0, 0, 0.6)", c.style.color = "white", c.style.borderRadius = "10px", c.style.right = "15px", c.style.bottom = "15px", c.style.flex = "row";
    const b = document.createElement("div");
    c.appendChild(b), b.style.width = "100%", b.style.textAlign = "center", b.style.fontWeight = "bold", b.style.marginBottom = "8px", b.innerText = "Looking Glass Controls";
    const f = document.createElement("button");
    f.style.display = "block", f.style.margin = "auto", f.style.width = "100%", f.style.height = "35px", f.style.padding = "4px", f.style.marginBottom = "8px", f.style.borderRadius = "8px", f.id = "screenshotbutton", c.appendChild(f), f.innerText = "Save Hologram", t.quiltResolution.height * t.quiltResolution.width > 33177600 ? (f.style.backgroundColor = "#ccc", f.style.color = "#999", f.style.cursor = "not-allowed", f.title = "Button is disabled because the quilt resolution is too large.") : (f.style.backgroundColor = "", f.style.color = "", f.style.cursor = "", f.title = "");
    const w = document.createElement("button");
    w.style.display = "block", w.style.margin = "auto", w.style.width = "100%", w.style.height = "35px", w.style.padding = "4px", w.style.marginBottom = "8px", w.style.borderRadius = "8px", w.id = "copybutton", c.appendChild(w), w.innerText = "Copy Config", w.addEventListener("click", () => {
      Ee(t);
    });
    const E = document.createElement("div");
    c.appendChild(E), E.style.width = "290px", E.style.whiteSpace = "normal", E.style.color = "rgba(255,255,255,0.7)", E.style.fontSize = "14px", E.style.margin = "5px 0", E.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const _ = document.createElement("div");
    c.appendChild(_);
    const T = (a, r, l) => {
      const h = l.stringify, m = document.createElement("div");
      m.style.marginBottom = "8px", _.appendChild(m);
      const C = a, k = t[a], L = document.createElement("label");
      m.appendChild(L), L.innerText = l.label, L.setAttribute("for", C), L.style.width = "100px", L.style.display = "inline-block", L.style.textDecoration = "dotted underline 1px", L.style.fontFamily = '"Courier New"', L.style.fontSize = "13px", L.style.fontWeight = "bold", L.title = l.title;
      const v = document.createElement("input");
      m.appendChild(v), Object.assign(v, r), v.id = C, v.title = l.title, v.value = r.value !== void 0 ? r.value : k;
      const X = (y) => {
        t[a] = y, D(y);
      };
      v.oninput = () => {
        const y = r.type === "range" ? parseFloat(v.value) : r.type === "checkbox" ? v.checked : v.value;
        X(y);
      };
      const K = (y) => {
        let p = y(t[a]);
        l.fixRange && (p = l.fixRange(p), v.max = Math.max(parseFloat(v.max), p).toString(), v.min = Math.min(parseFloat(v.min), p).toString()), v.value = p, X(p);
      };
      r.type === "range" && (v.style.width = "110px", v.style.height = "8px", v.onwheel = (y) => {
        K((p) => p + Math.sign(y.deltaX - y.deltaY) * r.step);
      });
      let D = (y) => {
      };
      if (h) {
        const y = document.createElement("span");
        y.style.fontFamily = '"Courier New"', y.style.fontSize = "13px", y.style.marginLeft = "3px", m.appendChild(y), D = (p) => {
          y.innerHTML = h(p);
        }, D(k);
      }
      return K;
    };
    T("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (a) => Math.max(1 / 180 * Math.PI, Math.min(a, 120.1 / 180 * Math.PI)),
      stringify: (a) => {
        const r = a / Math.PI * 180, l = Math.atan(Math.tan(a / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${r.toFixed()}&deg;&times;${l.toFixed()}&deg;`;
      }
    }), T("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (a) => Math.max(0, a),
      stringify: (a) => `${a.toFixed(2)}x`
    }), T("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (a) => Math.max(0, Math.min(a, 2)),
      stringify: (a) => a === 0 ? "swizzled" : a === 1 ? "center" : a === 2 ? "quilt" : "?"
    }), T("filterMode", { type: "range", min: 0, max: 3, step: 1 }, {
      label: "view filtering mode",
      title: "controls the method used for view blending",
      fixRange: (a) => Math.max(0, Math.min(a, 2)),
      stringify: (a) => a === 0 ? "old, studio style" : a === 1 ? "2 view" : a === 2 ? "gaussian" : a === 3 ? "10 view gaussian" : "?"
    }), T("gaussianSigma", { type: "range", min: -1, max: 1, step: 0.01 }, {
      label: "gaussian sigma",
      title: "control view blending",
      fixRange: (a) => Math.max(-1, Math.min(a, 1)),
      stringify: (a) => a
    }), t.lkgCanvas.oncontextmenu = (a) => {
      a.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (a) => {
      const r = t.targetDiam, l = 1.1, h = Math.log(r) / Math.log(l);
      return t.targetDiam = Math.pow(l, h + a.deltaY * 0.01);
    }, { passive: !1 }), t.lkgCanvas.addEventListener("mousemove", (a) => {
      const r = a.movementX, l = -a.movementY;
      if (a.buttons & 2 || a.buttons & 1 && (a.shiftKey || a.ctrlKey)) {
        const h = t.trackballX, m = t.trackballY, C = -Math.cos(h) * r + Math.sin(h) * Math.sin(m) * l, k = -Math.cos(m) * l, L = Math.sin(h) * r + Math.cos(h) * Math.sin(m) * l;
        t.targetX = t.targetX + C * t.targetDiam * 1e-3, t.targetY = t.targetY + k * t.targetDiam * 1e-3, t.targetZ = t.targetZ + L * t.targetDiam * 1e-3;
      } else
        a.buttons & 1 && (t.trackballX = t.trackballX - r * 0.01, t.trackballY = t.trackballY - l * 0.01);
    });
    const d = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (a) => {
      switch (a.code) {
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
    }), t.lkgCanvas.addEventListener("keyup", (a) => {
      switch (a.code) {
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
    }), (e = t.appCanvas) == null || e.addEventListener("wheel", (a) => {
      const r = t.targetDiam, l = 1.1, h = Math.log(r) / Math.log(l);
      return t.targetDiam = Math.pow(l, h + a.deltaY * 0.01);
    }, { passive: !1 }), (n = t.appCanvas) == null || n.addEventListener("mousemove", (a) => {
      const r = a.movementX, l = -a.movementY;
      if (a.buttons & 2 || a.buttons & 1 && (a.shiftKey || a.ctrlKey)) {
        const h = t.trackballX, m = t.trackballY, C = -Math.cos(h) * r + Math.sin(h) * Math.sin(m) * l, k = -Math.cos(m) * l, L = Math.sin(h) * r + Math.cos(h) * Math.sin(m) * l;
        t.targetX = t.targetX + C * t.targetDiam * 1e-3, t.targetY = t.targetY + k * t.targetDiam * 1e-3, t.targetZ = t.targetZ + L * t.targetDiam * 1e-3;
      } else
        a.buttons & 1 && (t.trackballX = t.trackballX - r * 0.01, t.trackballY = t.trackballY - l * 0.01);
    }), (s = t.appCanvas) == null || s.addEventListener("keydown", (a) => {
      switch (a.code) {
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
    }), (o = t.appCanvas) == null || o.addEventListener("keyup", (a) => {
      switch (a.code) {
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
      ge();
    }, 1e3), c;
  }
}
function Ee(t) {
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
let N;
const Ce = (t, i) => {
  const e = S();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else
    t == !1 ? Re(e, N) : (N == null && (N = ye()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(N), "getScreenDetails" in window ? Le(e.lkgCanvas, e, i) : j(e, e.lkgCanvas, i));
};
async function Le(t, i, e) {
  const s = (await window.getScreenDetails()).screens.filter((o) => o.label.includes("LKG"))[0];
  if (s === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), j(i, t, e);
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
    i.popup = window.open("", "new", o), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.style.transform = "1.0", Z(i), i.popup.document.body.appendChild(t), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function j(t, i, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.style.transform = "1.0", Z(t), t.popup.document.body.appendChild(i), console.assert(e), t.popup.onbeforeunload = e);
}
function Re(t, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
function Z(t) {
  t.popup && t.popup.document.addEventListener("keydown", (i) => {
    i.ctrlKey && (i.key === "=" || i.key === "-" || i.key === "+") && i.preventDefault();
  });
}
const P = Symbol("LookingGlassXRWebGLLayer");
class xe extends me {
  constructor(i, e, n) {
    super(i, e, n);
    const s = S();
    s.appCanvas = e.canvas, s.lkgCanvas = document.createElement("canvas"), s.lkgCanvas.tabIndex = 0;
    const o = s.lkgCanvas.getContext("2d", { alpha: !1 });
    s.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const u = this[be].config, x = e.createTexture();
    let c, b;
    const f = e.createFramebuffer(), F = e.enable.bind(e), w = e.disable.bind(e), E = e.getExtension("OES_vertex_array_object"), _ = 34229, T = E ? E.bindVertexArrayOES.bind(E) : e.bindVertexArray.bind(e), d = () => {
      const M = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, x), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, s.framebufferWidth, s.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_BASE_LEVEL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, 0), e.bindTexture(e.TEXTURE_2D, M), c) {
        const G = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, c), e.renderbufferStorage(e.RENDERBUFFER, b.format, s.framebufferWidth, s.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, G);
      }
    };
    (u.depth || u.stencil) && (u.depth && u.stencil ? b = { format: e.DEPTH_STENCIL, attachment: e.DEPTH_STENCIL_ATTACHMENT } : u.depth ? b = { format: e.DEPTH_COMPONENT16, attachment: e.DEPTH_ATTACHMENT } : u.stencil && (b = { format: e.STENCIL_INDEX8, attachment: e.STENCIL_ATTACHMENT }), c = e.createRenderbuffer()), d(), s.addEventListener("on-config-changed", d);
    const a = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, f), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, x, 0), (u.depth || u.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, b.attachment, e.RENDERBUFFER, c), e.bindFramebuffer(e.FRAMEBUFFER, a);
    const r = e.createProgram();
    if (!r)
      return;
    const l = e.createShader(e.VERTEX_SHADER);
    if (!l)
      return;
    e.attachShader(r, l);
    const h = e.createShader(e.FRAGMENT_SHADER);
    if (!h)
      return;
    e.attachShader(r, h);
    {
      const M = `#version 300 es
			in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;
      e.shaderSource(l, M), e.compileShader(l), e.getShaderParameter(l, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(l));
    }
    let m, C, k;
    const L = () => {
      const M = de(s);
      if (M === m || (m = M, !h))
        return;
      if (e.shaderSource(h, M), e.compileShader(h), !e.getShaderParameter(h, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(h));
        return;
      }
      if (!r)
        return;
      if (e.linkProgram(r), !e.getProgramParameter(r, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(r));
        return;
      }
      C = e.getAttribLocation(r, "a_position"), k = e.getUniformLocation(r, "u_viewType");
      const G = e.getUniformLocation(r, "u_texture"), W = e.getUniformLocation(r, "subpixelData"), U = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(r), e.uniform1i(G, 0), e.uniform1fv(W, s.subpixelCells), e.useProgram(U);
    };
    s.addEventListener("on-config-changed", L);
    const v = E ? E.createVertexArrayOES() : e.createVertexArray(), X = e.createBuffer(), K = e.getParameter(e.ARRAY_BUFFER_BINDING), D = e.getParameter(_);
    T(v), e.bindBuffer(e.ARRAY_BUFFER, X), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(C), e.vertexAttribPointer(C, 2, e.FLOAT, !1, 0, 0), T(D), e.bindBuffer(e.ARRAY_BUFFER, K);
    const y = () => {
      console.assert(this[P].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, f);
      const M = e.getParameter(e.COLOR_CLEAR_VALUE), G = e.getParameter(e.DEPTH_CLEAR_VALUE), W = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(M[0], M[1], M[2], M[3]), e.clearDepth(G), e.clearStencil(W);
    }, p = e.canvas;
    let A, B;
    const J = () => {
      if (!this[P].LookingGlassEnabled)
        return;
      (p.width !== s.calibration.screenW.value || p.height !== s.calibration.screenH.value) && s.capturing === !1 ? (A = p.width, B = p.height, p.width = s.calibration.screenW.value, p.height = s.calibration.screenH.value) : s.capturing === !0 && (A = p.width, B = p.height, p.width = s.framebufferWidth, p.height = s.framebufferHeight);
      const M = e.getParameter(_), G = e.getParameter(e.CULL_FACE), W = e.getParameter(e.BLEND), U = e.getParameter(e.DEPTH_TEST), Q = e.getParameter(e.STENCIL_TEST), ee = e.getParameter(e.SCISSOR_TEST), te = e.getParameter(e.VIEWPORT), ie = e.getParameter(e.FRAMEBUFFER_BINDING), se = e.getParameter(e.RENDERBUFFER_BINDING), ae = e.getParameter(e.CURRENT_PROGRAM), ne = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const re = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(r), T(v), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, x), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(k, 0), e.drawArrays(e.TRIANGLES, 0, 6), o == null || o.clearRect(0, 0, s.calibration.screenW.value, s.calibration.screenH.value), o == null || o.drawImage(p, 0, 0), s.inlineView !== 0 && (e.uniform1i(k, s.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, re);
      }
      e.activeTexture(ne), e.useProgram(ae), e.bindRenderbuffer(e.RENDERBUFFER, se), e.bindFramebuffer(e.FRAMEBUFFER, ie), e.viewport(...te), (ee ? F : w)(e.SCISSOR_TEST), (Q ? F : w)(e.STENCIL_TEST), (U ? F : w)(e.DEPTH_TEST), (W ? F : w)(e.BLEND), (G ? F : w)(e.CULL_FACE), T(M);
    };
    this[P] = {
      LookingGlassEnabled: !1,
      framebuffer: f,
      clearFramebuffer: y,
      blitTextureToDefaultFramebufferIfNeeded: J,
      moveCanvasToWindow: Ce,
      restoreOriginalCanvasDimensions: () => {
        A && B && (p.width = A, p.height = B, A = B = void 0);
      }
    };
  }
  get framebuffer() {
    return this[P].LookingGlassEnabled ? this[P].framebuffer : null;
  }
  get framebufferWidth() {
    return S().framebufferWidth;
  }
  get framebufferHeight() {
    return S().framebufferHeight;
  }
}
const V = class extends fe {
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = g.create(), this.inlineProjectionMatrix = g.create(), this.inlineInverseViewMatrix = g.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, V.instance || (V.instance = this);
  }
  static getInstance() {
    return V.instance;
  }
  onBaseLayerSet(i, e) {
    const n = this.sessions.get(i);
    n.baseLayer = e;
    const s = S(), o = e[P];
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
    const n = i !== "inline", s = new _e(i, e), o = S();
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
    const n = this.sessions.get(i), s = S();
    if (n.immersive) {
      const o = Math.tan(0.5 * s.fovy), u = 0.5 * s.targetDiam / o, x = u - s.targetDiam, c = this.basePoseMatrix;
      g.fromTranslation(c, [s.targetX, s.targetY, s.targetZ]), g.rotate(c, c, s.trackballX, [0, 1, 0]), g.rotate(c, c, -s.trackballY, [1, 0, 0]), g.translate(c, c, [0, 0, u]);
      for (let b = 0; b < s.numViews; ++b) {
        const f = (b + 0.5) / s.numViews - 0.5, F = Math.tan(s.viewCone * f), w = u * F, E = this.LookingGlassInverseViewMatrices[b] = this.LookingGlassInverseViewMatrices[b] || g.create();
        g.translate(E, c, [w, 0, 0]), g.invert(E, E);
        const _ = Math.max(x + e.depthNear, 0.01), T = x + e.depthFar, d = _ * o, a = d, r = -d, l = _ * -F, h = s.aspect * d, m = l + h, C = l - h, k = this.LookingGlassProjectionMatrices[b] = this.LookingGlassProjectionMatrices[b] || g.create();
        g.set(k, 2 * _ / (m - C), 0, 0, 0, 0, 2 * _ / (a - r), 0, 0, (m + C) / (m - C), (a + r) / (a - r), -(T + _) / (T - _), -1, 0, 0, -2 * T * _ / (T - _), 0);
      }
    } else {
      const o = n.baseLayer.context, u = o.drawingBufferWidth / o.drawingBufferHeight;
      g.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, u, e.depthNear, e.depthFar), g.fromTranslation(this.basePoseMatrix, [0, O, 0]), g.invert(this.inlineInverseViewMatrix, this.basePoseMatrix), n.baseLayer[P].clearFramebuffer();
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[P].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(i, e) {
    const n = g.create();
    switch (i) {
      case "viewer":
      case "local":
        return g.fromTranslation(n, [0, -O, 0]), n;
      case "local-floor":
        return n;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[P].moveCanvasToWindow(!1), e.baseLayer[P].LookingGlassEnabled = !1, e.baseLayer[P].restoreOriginalCanvasDimensions(), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const n = this.sessions.get(i);
    return n.ended ? !1 : n.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = S();
      for (let n = this.viewSpaces.length; n < e.numViews; ++n)
        this.viewSpaces[n] = new ke(n);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, n, s, o) {
    if (o === void 0) {
      const x = this.sessions.get(i).baseLayer.context;
      s.x = 0, s.y = 0, s.width = x.drawingBufferWidth, s.height = x.drawingBufferHeight;
    } else {
      const u = S(), x = o % u.quiltWidth, c = Math.floor(o / u.quiltWidth);
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
let I = V;
R(I, "instance", null);
let Te = 0;
class _e {
  constructor(i, e) {
    R(this, "mode");
    R(this, "immersive");
    R(this, "id");
    R(this, "baseLayer");
    R(this, "inlineVerticalFieldOfView");
    R(this, "ended");
    R(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++Te, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class ke extends pe {
  constructor(e) {
    super();
    R(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class $ extends ue {
  constructor(e) {
    super();
    R(this, "vrButton");
    R(this, "device");
    R(this, "isPresenting", !1);
    z(e), this.loadPolyfill();
  }
  static async init(e) {
    new $(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in q)
      this.global[e] = q[e];
    this.global.XRWebGLLayer = xe, this.injected = !0, this.device = new I(this.global), this.xr = new ce(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await Me("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await Se(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    z(e);
  }
  setCalibration(e) {
    we(e);
  }
}
async function Me(t) {
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
function Se(t) {
  return new Promise((i) => setTimeout(i, t));
}
const Xe = S();
export {
  Xe as LookingGlassConfig,
  $ as LookingGlassWebXRPolyfill
};
