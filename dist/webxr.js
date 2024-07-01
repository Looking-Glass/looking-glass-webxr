var oe = Object.defineProperty;
var le = (t, a, e) => a in t ? oe(t, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[a] = e;
var C = (t, a, e) => (le(t, typeof a != "symbol" ? a + "" : a, e), e);
import q from "@lookingglass/webxr-polyfill/src/api/index";
import ce from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import ue from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as de from "holoplay-core";
import { Shader as he } from "holoplay-core";
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
    C(this, "_calibration", {
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
      serial: "LKG-DEFAULT-#####",
      subpixelCells: [],
      CellPatternMode: { value: 0 }
    });
    C(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: O,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 13 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: Y.Center,
      capturing: !1,
      quiltResolution: null,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null,
      subpixelMode: 1,
      filterMode: 2,
      gaussianSigma: 0.02
    });
    C(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new de.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, n, i) {
    super.addEventListener(e, n, i);
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
    if (this._viewControls.quiltResolution == null) {
      const e = this._calibration.serial;
      switch (!0) {
        case e.startsWith("LKG-2K"):
          return 4096;
        case e.startsWith("LKG-4K"):
          return 4096;
        case e.startsWith("LKG-8K"):
          return 8192;
        case e.startsWith("LKG-P"):
          return 3360;
        case e.startsWith("LKG-A"):
          return 4096;
        case e.startsWith("LKG-B"):
          return 8192;
        case e.startsWith("LKG-F"):
          return 3360;
        case e.startsWith("LKG-E"):
          return 3840;
        case e.startsWith("LKG-H"):
          return 5995;
        case e.startsWith("LKG-J"):
          return 5999;
        case e.startsWith("LKG-K"):
          return 8184;
        case e.startsWith("LKG-L"):
          return 8190;
        default:
          return 4096;
      }
    } else
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
  get aspect() {
    return this._calibration.screenW.value / this._calibration.screenH.value;
  }
  get tileWidth() {
    return Math.round(this.framebufferWidth / this.quiltWidth);
  }
  get framebufferWidth() {
    return this.quiltResolution;
  }
  get quiltWidth() {
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
        return 5;
    }
  }
  get quiltHeight() {
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
        return 9;
    }
  }
  get framebufferHeight() {
    return this.quiltResolution;
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
    return this._calibration.subpixelCells.forEach((n, i) => {
      n.ROffsetX /= this.calibration.screenW.value, n.ROffsetY /= this.calibration.screenH.value, n.GOffsetX /= this.calibration.screenW.value, n.GOffsetY /= this.calibration.screenH.value, n.BOffsetX /= this.calibration.screenW.value, n.BOffsetY /= this.calibration.screenH.value, e[i * 6 + 0] = n.ROffsetX, e[i * 6 + 1] = n.ROffsetY, e[i * 6 + 2] = n.GOffsetX, e[i * 6 + 3] = n.GOffsetY, e[i * 6 + 4] = n.BOffsetX, e[i * 6 + 5] = n.BOffsetY;
    }), console.log({ subPixelCells: e }), e;
  }
}
let H = null;
function P() {
  return H == null && (H = new ve()), H;
}
function z(t) {
  const a = P();
  t != null && a.updateViewControls(t);
}
async function ge() {
  const t = P();
  let a = 2;
  async function e() {
    if (t.appCanvas != null)
      try {
        t.capturing = !0, await new Promise((c) => {
          requestAnimationFrame(c);
        }), t.appCanvas.width = t.quiltResolution, t.appCanvas.height = t.quiltResolution;
        let i = t.appCanvas.toDataURL();
        const l = document.createElement("a");
        l.style.display = "none", l.href = i, l.download = `hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`, document.body.appendChild(l), l.click(), document.body.removeChild(l), window.URL.revokeObjectURL(i);
      } catch (i) {
        console.error("Error while capturing canvas data:", i), t.capturing = !1;
      } finally {
        t.inlineView = a, t.capturing = !1, t.appCanvas.width = t.calibration.screenW.value, t.appCanvas.height = t.calibration.screenH.value;
      }
  }
  const n = document.getElementById("screenshotbutton");
  n && n.addEventListener("click", () => {
    a = t.inlineView;
    const i = V.getInstance();
    if (!i) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    t.inlineView = 2, i.captureScreenshot = !0, setTimeout(() => {
      i.screenshotCallback = e;
    }, 100);
  });
}
function we() {
  var a, e, n, i, l;
  const t = P();
  if (t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let c = function() {
      let s = u.d - u.a, d = u.w - u.s;
      s && d && (s *= Math.sqrt(0.5), d *= Math.sqrt(0.5));
      const r = t.trackballX, h = t.trackballY, f = Math.cos(r) * s - Math.sin(r) * Math.cos(h) * d, R = -Math.sin(h) * d, E = -Math.sin(r) * s - Math.cos(r) * Math.cos(h) * d;
      t.targetX = t.targetX + f * t.targetDiam * 0.03, t.targetY = t.targetY + R * t.targetDiam * 0.03, t.targetZ = t.targetZ + E * t.targetDiam * 0.03, requestAnimationFrame(c);
    };
    const L = document.createElement("style");
    document.head.appendChild(L), (a = L.sheet) == null || a.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const o = document.createElement("div");
    o.id = "LookingGlassWebXRControls", o.style.position = "fixed", o.style.zIndex = "1000", o.style.padding = "15px", o.style.width = "320px", o.style.maxWidth = "calc(100vw - 18px)", o.style.maxHeight = "calc(100vh - 18px)", o.style.whiteSpace = "nowrap", o.style.background = "rgba(0, 0, 0, 0.6)", o.style.color = "white", o.style.borderRadius = "10px", o.style.right = "15px", o.style.bottom = "15px", o.style.flex = "row";
    const T = document.createElement("div");
    o.appendChild(T), T.style.width = "100%", T.style.textAlign = "center", T.style.fontWeight = "bold", T.style.marginBottom = "8px", T.innerText = "Looking Glass Controls";
    const p = document.createElement("button");
    p.style.display = "block", p.style.margin = "auto", p.style.width = "100%", p.style.height = "35px", p.style.padding = "4px", p.style.marginBottom = "8px", p.style.borderRadius = "8px", p.id = "screenshotbutton", o.appendChild(p), p.innerText = "Save Hologram";
    const v = document.createElement("button");
    v.style.display = "block", v.style.margin = "auto", v.style.width = "100%", v.style.height = "35px", v.style.padding = "4px", v.style.marginBottom = "8px", v.style.borderRadius = "8px", v.id = "copybutton", o.appendChild(v), v.innerText = "Copy Config", v.addEventListener("click", () => {
      ye(t);
    });
    const y = document.createElement("div");
    o.appendChild(y), y.style.width = "290px", y.style.whiteSpace = "normal", y.style.color = "rgba(255,255,255,0.7)", y.style.fontSize = "14px", y.style.margin = "5px 0", y.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const F = document.createElement("div");
    o.appendChild(F);
    const M = (s, d, r) => {
      const h = r.stringify, f = document.createElement("div");
      f.style.marginBottom = "8px", F.appendChild(f);
      const R = s, E = t[s], m = document.createElement("label");
      f.appendChild(m), m.innerText = r.label, m.setAttribute("for", R), m.style.width = "100px", m.style.display = "inline-block", m.style.textDecoration = "dotted underline 1px", m.style.fontFamily = '"Courier New"', m.style.fontSize = "13px", m.style.fontWeight = "bold", m.title = r.title;
      const b = document.createElement("input");
      f.appendChild(b), Object.assign(b, d), b.id = R, b.title = r.title, b.value = d.value !== void 0 ? d.value : E;
      const G = (w) => {
        t[s] = w, D(w);
      };
      b.oninput = () => {
        const w = d.type === "range" ? parseFloat(b.value) : d.type === "checkbox" ? b.checked : b.value;
        G(w);
      };
      const K = (w) => {
        let k = w(t[s]);
        r.fixRange && (k = r.fixRange(k), b.max = Math.max(parseFloat(b.max), k).toString(), b.min = Math.min(parseFloat(b.min), k).toString()), b.value = k, G(k);
      };
      d.type === "range" && (b.style.width = "110px", b.style.height = "8px", b.onwheel = (w) => {
        K((k) => k + Math.sign(w.deltaX - w.deltaY) * d.step);
      });
      let D = (w) => {
      };
      if (h) {
        const w = document.createElement("span");
        w.style.fontFamily = '"Courier New"', w.style.fontSize = "13px", w.style.marginLeft = "3px", f.appendChild(w), D = (k) => {
          w.innerHTML = h(k);
        }, D(E);
      }
      return K;
    };
    M("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (s) => Math.max(1 / 180 * Math.PI, Math.min(s, 120.1 / 180 * Math.PI)),
      stringify: (s) => {
        const d = s / Math.PI * 180, r = Math.atan(Math.tan(s / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${d.toFixed()}&deg;&times;${r.toFixed()}&deg;`;
      }
    }), M("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (s) => Math.max(0, s),
      stringify: (s) => `${s.toFixed(2)}x`
    }), M("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (s) => Math.max(0, Math.min(s, 2)),
      stringify: (s) => s === 0 ? "swizzled" : s === 1 ? "center" : s === 2 ? "quilt" : "?"
    }), M("filterMode", { type: "range", min: 0, max: 3, step: 1 }, {
      label: "view filtering mode",
      title: "controls the method used for view blending",
      fixRange: (s) => Math.max(0, Math.min(s, 2)),
      stringify: (s) => s === 0 ? "old, studio style" : s === 1 ? "2 view" : s === 2 ? "gaussian" : s === 3 ? "10 view gaussian" : "?"
    }), M("gaussianSigma", { type: "range", min: -1, max: 1, step: 0.02 }, {
      label: "gaussian sigma",
      title: "control view blending",
      fixRange: (s) => Math.max(-1, Math.min(s, 1)),
      stringify: (s) => s
    }), t.lkgCanvas.oncontextmenu = (s) => {
      s.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (s) => {
      const d = t.targetDiam, r = 1.1, h = Math.log(d) / Math.log(r);
      return t.targetDiam = Math.pow(r, h + s.deltaY * 0.01);
    }, { passive: !1 }), t.lkgCanvas.addEventListener("mousemove", (s) => {
      const d = s.movementX, r = -s.movementY;
      if (s.buttons & 2 || s.buttons & 1 && (s.shiftKey || s.ctrlKey)) {
        const h = t.trackballX, f = t.trackballY, R = -Math.cos(h) * d + Math.sin(h) * Math.sin(f) * r, E = -Math.cos(f) * r, m = Math.sin(h) * d + Math.cos(h) * Math.sin(f) * r;
        t.targetX = t.targetX + R * t.targetDiam * 1e-3, t.targetY = t.targetY + E * t.targetDiam * 1e-3, t.targetZ = t.targetZ + m * t.targetDiam * 1e-3;
      } else
        s.buttons & 1 && (t.trackballX = t.trackballX - d * 0.01, t.trackballY = t.trackballY - r * 0.01);
    });
    const u = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (s) => {
      switch (s.code) {
        case "KeyW":
          u.w = 1;
          break;
        case "KeyA":
          u.a = 1;
          break;
        case "KeyS":
          u.s = 1;
          break;
        case "KeyD":
          u.d = 1;
          break;
      }
    }), t.lkgCanvas.addEventListener("keyup", (s) => {
      switch (s.code) {
        case "KeyW":
          u.w = 0;
          break;
        case "KeyA":
          u.a = 0;
          break;
        case "KeyS":
          u.s = 0;
          break;
        case "KeyD":
          u.d = 0;
          break;
      }
    }), (e = t.appCanvas) == null || e.addEventListener("wheel", (s) => {
      const d = t.targetDiam, r = 1.1, h = Math.log(d) / Math.log(r);
      return t.targetDiam = Math.pow(r, h + s.deltaY * 0.01);
    }, { passive: !1 }), (n = t.appCanvas) == null || n.addEventListener("mousemove", (s) => {
      const d = s.movementX, r = -s.movementY;
      if (s.buttons & 2 || s.buttons & 1 && (s.shiftKey || s.ctrlKey)) {
        const h = t.trackballX, f = t.trackballY, R = -Math.cos(h) * d + Math.sin(h) * Math.sin(f) * r, E = -Math.cos(f) * r, m = Math.sin(h) * d + Math.cos(h) * Math.sin(f) * r;
        t.targetX = t.targetX + R * t.targetDiam * 1e-3, t.targetY = t.targetY + E * t.targetDiam * 1e-3, t.targetZ = t.targetZ + m * t.targetDiam * 1e-3;
      } else
        s.buttons & 1 && (t.trackballX = t.trackballX - d * 0.01, t.trackballY = t.trackballY - r * 0.01);
    }), (i = t.appCanvas) == null || i.addEventListener("keydown", (s) => {
      switch (s.code) {
        case "KeyW":
          u.w = 1;
          break;
        case "KeyA":
          u.a = 1;
          break;
        case "KeyS":
          u.s = 1;
          break;
        case "KeyD":
          u.d = 1;
          break;
      }
    }), (l = t.appCanvas) == null || l.addEventListener("keyup", (s) => {
      switch (s.code) {
        case "KeyW":
          u.w = 0;
          break;
        case "KeyA":
          u.a = 0;
          break;
        case "KeyS":
          u.s = 0;
          break;
        case "KeyD":
          u.d = 0;
          break;
      }
    }), requestAnimationFrame(c), setTimeout(() => {
      ge();
    }, 1e3), o;
  }
}
function ye(t) {
  const a = {
    targetX: t.targetX,
    targetY: t.targetY,
    targetZ: t.targetZ,
    fovy: `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: t.targetDiam,
    trackballX: t.trackballX,
    trackballY: t.trackballY,
    depthiness: t.depthiness
  };
  let e = JSON.stringify(a, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let N;
const Ee = (t, a) => {
  const e = P();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (t == !1)
    Le(e, N);
  else {
    N == null && (N = we()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(N);
    const n = "getScreenDetails" in window;
    console.log(n, "Screen placement API exists"), n ? Ce(e.lkgCanvas, e, a) : j(e, e.lkgCanvas, a);
  }
};
async function Ce(t, a, e) {
  const n = await window.getScreenDetails();
  console.log(n);
  const i = n.screens.filter((l) => l.label.includes("LKG"))[0];
  if (console.log(i, "monitors"), i === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), j(a, t, e);
    return;
  } else {
    const l = [
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
    a.popup = window.open("", "new", l), a.popup && (a.popup.document.body.style.background = "black", a.popup.document.body.style.transform = "1.0", Z(a), a.popup.document.body.appendChild(t), console.assert(e), a.popup.onbeforeunload = e);
  }
}
function j(t, a, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.style.transform = "1.0", Z(t), t.popup.document.body.appendChild(a), console.assert(e), t.popup.onbeforeunload = e);
}
function Le(t, a) {
  var e;
  (e = a.parentElement) == null || e.removeChild(a), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
function Z(t) {
  t.popup && t.popup.document.addEventListener("keydown", (a) => {
    a.ctrlKey && (a.key === "=" || a.key === "-" || a.key === "+") && a.preventDefault();
  });
}
const S = Symbol("LookingGlassXRWebGLLayer");
class Re extends me {
  constructor(a, e, n) {
    super(a, e, n);
    const i = P();
    i.appCanvas = e.canvas, i.lkgCanvas = document.createElement("canvas"), i.lkgCanvas.tabIndex = 0;
    const l = i.lkgCanvas.getContext("2d", { alpha: !1 });
    i.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const c = this[be].config, L = e.createTexture();
    let o, T;
    const p = e.createFramebuffer(), v = e.enable.bind(e), y = e.disable.bind(e), F = e.getExtension("OES_vertex_array_object"), M = 34229, u = F ? F.bindVertexArrayOES.bind(F) : e.bindVertexArray.bind(e), s = () => {
      const x = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, L), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, i.framebufferWidth, i.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_BASE_LEVEL, 0), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAX_LEVEL, 0), e.bindTexture(e.TEXTURE_2D, x), o) {
        const A = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, o), e.renderbufferStorage(e.RENDERBUFFER, T.format, i.framebufferWidth, i.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, A);
      }
    };
    (c.depth || c.stencil) && (c.depth && c.stencil ? T = { format: e.DEPTH_STENCIL, attachment: e.DEPTH_STENCIL_ATTACHMENT } : c.depth ? T = { format: e.DEPTH_COMPONENT16, attachment: e.DEPTH_ATTACHMENT } : c.stencil && (T = { format: e.STENCIL_INDEX8, attachment: e.STENCIL_ATTACHMENT }), o = e.createRenderbuffer()), s(), i.addEventListener("on-config-changed", s);
    const d = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, p), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, L, 0), (c.depth || c.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, T.attachment, e.RENDERBUFFER, o), e.bindFramebuffer(e.FRAMEBUFFER, d);
    const r = e.createProgram();
    if (!r)
      return;
    const h = e.createShader(e.VERTEX_SHADER);
    if (!h)
      return;
    e.attachShader(r, h);
    const f = e.createShader(e.FRAGMENT_SHADER);
    if (!f)
      return;
    e.attachShader(r, f);
    {
      const x = `#version 300 es
			in vec2 a_position;
			out vec2 v_texcoord;
			void main() {
			  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
			  v_texcoord = a_position;
			}
		  `;
      e.shaderSource(h, x), e.compileShader(h), e.getShaderParameter(h, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(h));
    }
    let R, E, m;
    const b = () => {
      const x = he(i);
      if (x === R || (R = x, !f))
        return;
      if (e.shaderSource(f, x), e.compileShader(f), !e.getShaderParameter(f, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(f));
        return;
      }
      if (!r)
        return;
      if (e.linkProgram(r), !e.getProgramParameter(r, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(r));
        return;
      }
      E = e.getAttribLocation(r, "a_position"), m = e.getUniformLocation(r, "u_viewType");
      const A = e.getUniformLocation(r, "u_texture"), W = e.getUniformLocation(r, "subpixelData"), U = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(r), e.uniform1i(A, 0), e.uniform1fv(W, i.subpixelCells), e.useProgram(U);
    };
    i.addEventListener("on-config-changed", b);
    const G = F ? F.createVertexArrayOES() : e.createVertexArray(), K = e.createBuffer(), D = e.getParameter(e.ARRAY_BUFFER_BINDING), w = e.getParameter(M);
    u(G), e.bindBuffer(e.ARRAY_BUFFER, K), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(E), e.vertexAttribPointer(E, 2, e.FLOAT, !1, 0, 0), u(w), e.bindBuffer(e.ARRAY_BUFFER, D);
    const k = () => {
      console.assert(this[S].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, p);
      const x = e.getParameter(e.COLOR_CLEAR_VALUE), A = e.getParameter(e.DEPTH_CLEAR_VALUE), W = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(x[0], x[1], x[2], x[3]), e.clearDepth(A), e.clearStencil(W);
    }, _ = e.canvas;
    let B, I;
    const J = () => {
      if (!this[S].LookingGlassEnabled)
        return;
      (_.width !== i.calibration.screenW.value || _.height !== i.calibration.screenH.value) && i.capturing === !1 ? (B = _.width, I = _.height, _.width = i.calibration.screenW.value, _.height = i.calibration.screenH.value) : i.capturing === !0 && (B = _.width, I = _.height, _.width = i.framebufferWidth, _.height = i.framebufferHeight);
      const x = e.getParameter(M), A = e.getParameter(e.CULL_FACE), W = e.getParameter(e.BLEND), U = e.getParameter(e.DEPTH_TEST), Q = e.getParameter(e.STENCIL_TEST), ee = e.getParameter(e.SCISSOR_TEST), te = e.getParameter(e.VIEWPORT), ae = e.getParameter(e.FRAMEBUFFER_BINDING), ie = e.getParameter(e.RENDERBUFFER_BINDING), se = e.getParameter(e.CURRENT_PROGRAM), ne = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const re = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(r), u(G), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, L), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(m, 0), e.drawArrays(e.TRIANGLES, 0, 6), l == null || l.clearRect(0, 0, i.calibration.screenW.value, i.calibration.screenH.value), l == null || l.drawImage(_, 0, 0), i.inlineView !== 0 && (e.uniform1i(m, i.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, re);
      }
      e.activeTexture(ne), e.useProgram(se), e.bindRenderbuffer(e.RENDERBUFFER, ie), e.bindFramebuffer(e.FRAMEBUFFER, ae), e.viewport(...te), (ee ? v : y)(e.SCISSOR_TEST), (Q ? v : y)(e.STENCIL_TEST), (U ? v : y)(e.DEPTH_TEST), (W ? v : y)(e.BLEND), (A ? v : y)(e.CULL_FACE), u(x);
    };
    this[S] = {
      LookingGlassEnabled: !1,
      framebuffer: p,
      clearFramebuffer: k,
      blitTextureToDefaultFramebufferIfNeeded: J,
      moveCanvasToWindow: Ee,
      restoreOriginalCanvasDimensions: () => {
        B && I && (_.width = B, _.height = I, B = I = void 0);
      }
    };
  }
  get framebuffer() {
    return this[S].LookingGlassEnabled ? this[S].framebuffer : null;
  }
  get framebufferWidth() {
    return P().framebufferWidth;
  }
  get framebufferHeight() {
    return P().framebufferHeight;
  }
}
const X = class extends fe {
  constructor(a) {
    super(a), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = g.create(), this.inlineProjectionMatrix = g.create(), this.inlineInverseViewMatrix = g.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, X.instance || (X.instance = this);
  }
  static getInstance() {
    return X.instance;
  }
  onBaseLayerSet(a, e) {
    const n = this.sessions.get(a);
    n.baseLayer = e;
    const i = P(), l = e[S];
    l.LookingGlassEnabled = n.immersive, n.immersive && (i.XRSession = this.sessions.get(a), i.popup == null ? l.moveCanvasToWindow(!0, () => {
      this.endSession(a);
    }) : console.warn("attempted to assign baselayer twice?"));
  }
  isSessionSupported(a) {
    return a === "inline" || a === "immersive-vr";
  }
  isFeatureSupported(a) {
    switch (a) {
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
        return console.warn("LookingGlassXRDevice.isFeatureSupported: feature not understood:", a), !1;
    }
  }
  async requestSession(a, e) {
    if (!this.isSessionSupported(a))
      return Promise.reject();
    const n = a !== "inline", i = new Te(a, e);
    return this.sessions.set(i.id, i), n && this.dispatchEvent("@@webxr-polyfill/vr-present-start", i.id), Promise.resolve(i.id);
  }
  requestAnimationFrame(a) {
    return this.global.requestAnimationFrame(a);
  }
  cancelAnimationFrame(a) {
    this.global.cancelAnimationFrame(a);
  }
  onFrameStart(a, e) {
    const n = this.sessions.get(a), i = P();
    if (n.immersive) {
      const l = Math.tan(0.5 * i.fovy), c = 0.5 * i.targetDiam / l, L = c - i.targetDiam, o = this.basePoseMatrix;
      g.fromTranslation(o, [i.targetX, i.targetY, i.targetZ]), g.rotate(o, o, i.trackballX, [0, 1, 0]), g.rotate(o, o, -i.trackballY, [1, 0, 0]), g.translate(o, o, [0, 0, c]);
      for (let p = 0; p < i.numViews; ++p) {
        const v = (p + 0.5) / i.numViews - 0.5, y = Math.tan(i.viewCone * v), F = c * y, M = this.LookingGlassInverseViewMatrices[p] = this.LookingGlassInverseViewMatrices[p] || g.create();
        g.translate(M, o, [F, 0, 0]), g.invert(M, M);
        const u = Math.max(L + e.depthNear, 0.01), s = L + e.depthFar, d = u * l, r = d, h = -d, f = u * -y, R = i.aspect * d, E = f + R, m = f - R, b = this.LookingGlassProjectionMatrices[p] = this.LookingGlassProjectionMatrices[p] || g.create();
        g.set(b, 2 * u / (E - m), 0, 0, 0, 0, 2 * u / (r - h), 0, 0, (E + m) / (E - m), (r + h) / (r - h), -(s + u) / (s - u), -1, 0, 0, -2 * s * u / (s - u), 0);
      }
      n.baseLayer[S].clearFramebuffer();
    } else {
      const l = n.baseLayer.context, c = l.drawingBufferWidth / l.drawingBufferHeight;
      g.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, c, e.depthNear, e.depthFar), g.fromTranslation(this.basePoseMatrix, [0, O, 0]), g.invert(this.inlineInverseViewMatrix, this.basePoseMatrix), n.baseLayer[S].clearFramebuffer();
    }
  }
  onFrameEnd(a) {
    this.sessions.get(a).baseLayer[S].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(a, e) {
    const n = g.create();
    switch (a) {
      case "viewer":
      case "local":
        return g.fromTranslation(n, [0, -O, 0]), n;
      case "local-floor":
        return n;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(a) {
    const e = this.sessions.get(a);
    e.baseLayer[S].moveCanvasToWindow(!1), e.immersive && e.baseLayer && (e.baseLayer[S].LookingGlassEnabled = !1, e.baseLayer[S].restoreOriginalCanvasDimensions(), this.dispatchEvent("@@webxr-polyfill/vr-present-end", a)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(a, e) {
    const n = this.sessions.get(a);
    return n.ended ? !1 : n.enabledFeatures.has(e);
  }
  getViewSpaces(a) {
    if (a === "immersive-vr") {
      const e = P();
      for (let n = this.viewSpaces.length; n < e.numViews; ++n)
        this.viewSpaces[n] = new _e(n);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(a, e, n, i, l) {
    if (l === void 0) {
      const L = this.sessions.get(a).baseLayer.context;
      i.x = 0, i.y = 0, i.width = L.drawingBufferWidth, i.height = L.drawingBufferHeight;
    } else {
      const c = P(), L = l % c.quiltWidth, o = Math.floor(l / c.quiltWidth);
      i.x = c.framebufferWidth / c.quiltWidth * L, i.y = c.framebufferHeight / c.quiltHeight * o, i.width = c.framebufferWidth / c.quiltWidth, i.height = c.framebufferHeight / c.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(a, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || g.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(a) {
    return this.LookingGlassInverseViewMatrices[a] = this.LookingGlassInverseViewMatrices[a] || g.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(a, e, n) {
    return null;
  }
  onWindowResize() {
  }
};
let V = X;
C(V, "instance", null);
let xe = 0;
class Te {
  constructor(a, e) {
    C(this, "mode");
    C(this, "immersive");
    C(this, "id");
    C(this, "baseLayer");
    C(this, "inlineVerticalFieldOfView");
    C(this, "ended");
    C(this, "enabledFeatures");
    this.mode = a, this.immersive = a === "immersive-vr" || a === "immersive-ar", this.id = ++xe, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class _e extends pe {
  constructor(e) {
    super();
    C(this, "viewIndex");
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
    C(this, "vrButton");
    C(this, "device");
    C(this, "isPresenting", !1);
    z(e), this.loadPolyfill();
  }
  static async init(e) {
    new $(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in q)
      this.global[e] = q[e];
    this.global.XRWebGLLayer = Re, this.injected = !0, this.device = new V(this.global), this.xr = new ce(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
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
      await ke(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    z(e);
  }
}
async function Me(t) {
  return new Promise((a) => {
    const e = new MutationObserver(function(n) {
      n.forEach(function(i) {
        i.addedNodes.forEach(function(l) {
          const c = l;
          c.id === t && (a(c), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), a(null);
    }, 5e3);
  });
}
function ke(t) {
  return new Promise((a) => setTimeout(a, t));
}
const Ve = P();
export {
  Ve as LookingGlassConfig,
  $ as LookingGlassWebXRPolyfill
};
