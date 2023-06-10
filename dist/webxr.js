var ce = Object.defineProperty;
var ue = (n, a, e) => a in n ? ce(n, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[a] = e;
var R = (n, a, e) => (ue(n, typeof a != "symbol" ? a + "" : a, e), e);
import q from "@lookingglass/webxr-polyfill/src/api/index";
import de from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import he from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as fe from "holoplay-core";
import { Shader as W } from "holoplay-core";
import pe from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import me from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as E } from "gl-matrix";
import be, { PRIVATE as ve } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const H = 1.6;
var O;
(function(n) {
  n[n.Swizzled = 0] = "Swizzled", n[n.Center = 1] = "Center", n[n.Quilt = 2] = "Quilt";
})(O || (O = {}));
class we extends EventTarget {
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
      screenW: { value: 250 },
      screenH: { value: 250 },
      flipImageX: { value: 0 },
      flipImageY: { value: 0 },
      flipSubp: { value: 0 },
      serial: "LKG-DEFAULT-#####"
    });
    R(this, "_viewControls", {
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
      inlineView: O.Center,
      capturing: !1,
      quiltResolution: 3840,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null
    });
    R(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new fe.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, s, t) {
    super.addEventListener(e, s, t);
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
let U = null;
function F() {
  return U == null && (U = new we()), U;
}
function z(n) {
  const a = F();
  n != null && a.updateViewControls(n);
}
async function Ee() {
  const n = F();
  let a = 2;
  function e() {
    if (n.appCanvas != null)
      try {
        let t = n.appCanvas.toDataURL();
        const o = document.createElement("a");
        o.style.display = "none", o.href = t, o.download = `hologram_qs${n.quiltWidth}x${n.quiltHeight}a${n.aspect}.png`, document.body.appendChild(o), o.click(), document.body.removeChild(o), window.URL.revokeObjectURL(t);
      } catch (t) {
        console.error("Error while capturing canvas data:", t);
      } finally {
        n.inlineView = a;
      }
  }
  const s = document.getElementById("screenshotbutton");
  s && s.addEventListener("click", () => {
    a = n.inlineView;
    const t = V.getInstance();
    if (!t) {
      console.warn("LookingGlassXRDevice not initialized");
      return;
    }
    n.inlineView = 2, t.captureScreenshot = !0, setTimeout(() => {
      t.screenshotCallback = e;
    }, 100);
  });
}
function ye() {
  var a;
  const n = F();
  if (console.log(n, "for debugging purposes"), n.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let e = function() {
      let r = v.d - v.a, c = v.w - v.s;
      r && c && (r *= Math.sqrt(0.5), c *= Math.sqrt(0.5));
      const u = n.trackballX, f = n.trackballY, y = Math.cos(u) * r - Math.sin(u) * Math.cos(f) * c, _ = -Math.sin(f) * c, S = -Math.sin(u) * r - Math.cos(u) * Math.cos(f) * c;
      n.targetX = n.targetX + y * n.targetDiam * 0.03, n.targetY = n.targetY + _ * n.targetDiam * 0.03, n.targetZ = n.targetZ + S * n.targetDiam * 0.03, requestAnimationFrame(e);
    };
    const s = document.createElement("style");
    document.head.appendChild(s), (a = s.sheet) == null || a.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const t = document.createElement("div");
    t.id = "LookingGlassWebXRControls", t.style.position = "fixed", t.style.zIndex = "1000", t.style.padding = "15px", t.style.width = "320px", t.style.maxWidth = "calc(100vw - 18px)", t.style.maxHeight = "calc(100vh - 18px)", t.style.whiteSpace = "nowrap", t.style.background = "rgba(0, 0, 0, 0.6)", t.style.color = "white", t.style.borderRadius = "10px", t.style.right = "15px", t.style.bottom = "15px", t.style.flex = "row";
    const o = document.createElement("div");
    t.appendChild(o), o.style.width = "100%", o.style.textAlign = "center", o.style.fontWeight = "bold", o.style.marginBottom = "8px", o.innerText = "Looking Glass Controls";
    const l = document.createElement("button");
    l.style.display = "block", l.style.margin = "auto", l.style.width = "100%", l.style.height = "35px", l.style.padding = "4px", l.style.marginBottom = "8px", l.style.borderRadius = "8px", l.id = "screenshotbutton", t.appendChild(l), l.innerText = "Save Hologram";
    const h = document.createElement("button");
    h.style.display = "block", h.style.margin = "auto", h.style.width = "100%", h.style.height = "35px", h.style.padding = "4px", h.style.marginBottom = "8px", h.style.borderRadius = "8px", h.id = "copybutton", t.appendChild(h), h.innerText = "Copy Config", h.addEventListener("click", () => {
      Ce(n);
    });
    const p = document.createElement("div");
    t.appendChild(p), p.style.width = "290px", p.style.whiteSpace = "normal", p.style.color = "rgba(255,255,255,0.7)", p.style.fontSize = "14px", p.style.margin = "5px 0", p.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const I = document.createElement("div");
    t.appendChild(I);
    const x = (r, c, u) => {
      const f = u.stringify, y = document.createElement("div");
      y.style.marginBottom = "8px", I.appendChild(y);
      const _ = r, S = n[r], w = document.createElement("label");
      y.appendChild(w), w.innerText = u.label, w.setAttribute("for", _), w.style.width = "100px", w.style.display = "inline-block", w.style.textDecoration = "dotted underline 1px", w.style.fontFamily = '"Courier New"', w.style.fontSize = "13px", w.style.fontWeight = "bold", w.title = u.title;
      const m = document.createElement("input");
      y.appendChild(m), Object.assign(m, c), m.id = _, m.title = u.title, m.value = c.value !== void 0 ? c.value : S;
      const M = (b) => {
        n[r] = b, P(b);
      };
      m.oninput = () => {
        const b = c.type === "range" ? parseFloat(m.value) : c.type === "checkbox" ? m.checked : m.value;
        M(b);
      };
      const A = (b) => {
        let k = b(n[r]);
        u.fixRange && (k = u.fixRange(k), m.max = Math.max(parseFloat(m.max), k).toString(), m.min = Math.min(parseFloat(m.min), k).toString()), m.value = k, M(k);
      };
      c.type === "range" && (m.style.width = "110px", m.style.height = "8px", m.onwheel = (b) => {
        A((k) => k + Math.sign(b.deltaX - b.deltaY) * c.step);
      });
      let P = (b) => {
      };
      if (f) {
        const b = document.createElement("span");
        b.style.fontFamily = '"Courier New"', b.style.fontSize = "13px", b.style.marginLeft = "3px", y.appendChild(b), P = (k) => {
          b.innerHTML = f(k);
        }, P(S);
      }
      return A;
    };
    x("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (r) => Math.max(1 / 180 * Math.PI, Math.min(r, 120.1 / 180 * Math.PI)),
      stringify: (r) => {
        const c = r / Math.PI * 180, u = Math.atan(Math.tan(r / 2) * n.aspect) * 2 / Math.PI * 180;
        return `${c.toFixed()}&deg;&times;${u.toFixed()}&deg;`;
      }
    }), x("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: "exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov.",
      fixRange: (r) => Math.max(0, r),
      stringify: (r) => `${r.toFixed(2)}x`
    }), x("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (r) => Math.max(0, Math.min(r, 2)),
      stringify: (r) => r === 0 ? "swizzled" : r === 1 ? "center" : r === 2 ? "quilt" : "?"
    }), n.lkgCanvas.oncontextmenu = (r) => {
      r.preventDefault();
    }, n.lkgCanvas.addEventListener("wheel", (r) => {
      const c = n.targetDiam, u = 1.1, f = Math.log(c) / Math.log(u);
      return n.targetDiam = Math.pow(u, f + r.deltaY * 0.01);
    }), n.lkgCanvas.addEventListener("mousemove", (r) => {
      const c = r.movementX, u = -r.movementY;
      if (r.buttons & 2 || r.buttons & 1 && (r.shiftKey || r.ctrlKey)) {
        const f = n.trackballX, y = n.trackballY, _ = -Math.cos(f) * c + Math.sin(f) * Math.sin(y) * u, S = -Math.cos(y) * u, w = Math.sin(f) * c + Math.cos(f) * Math.sin(y) * u;
        n.targetX = n.targetX + _ * n.targetDiam * 1e-3, n.targetY = n.targetY + S * n.targetDiam * 1e-3, n.targetZ = n.targetZ + w * n.targetDiam * 1e-3;
      } else
        r.buttons & 1 && (n.trackballX = n.trackballX - c * 0.01, n.trackballY = n.trackballY - u * 0.01);
    });
    const v = { w: 0, a: 0, s: 0, d: 0 };
    return n.lkgCanvas.addEventListener("keydown", (r) => {
      switch (r.code) {
        case "KeyW":
          v.w = 1;
          break;
        case "KeyA":
          v.a = 1;
          break;
        case "KeyS":
          v.s = 1;
          break;
        case "KeyD":
          v.d = 1;
          break;
      }
    }), n.lkgCanvas.addEventListener("keyup", (r) => {
      switch (r.code) {
        case "KeyW":
          v.w = 0;
          break;
        case "KeyA":
          v.a = 0;
          break;
        case "KeyS":
          v.s = 0;
          break;
        case "KeyD":
          v.d = 0;
          break;
      }
    }), requestAnimationFrame(e), setTimeout(() => {
      Ee();
    }, 1e3), t;
  }
}
function Ce(n) {
  const a = {
    targetX: n.targetX,
    targetY: n.targetY,
    targetZ: n.targetZ,
    fovy: `${Math.round(n.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: n.targetDiam,
    trackballX: n.trackballX,
    trackballY: n.trackballY,
    depthiness: n.depthiness
  };
  let e = JSON.stringify(a, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let G;
const ge = (n, a) => {
  const e = F();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (n == !1)
    Te(e, G);
  else {
    G == null && (G = ye()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(G);
    const s = "getScreenDetails" in window;
    console.log(s, "Screen placement API exists"), s ? Re(e.lkgCanvas, e, a) : K(e, e.lkgCanvas, a);
  }
};
async function Re(n, a, e) {
  const s = await window.getScreenDetails();
  console.log(s);
  const t = s.screens.filter((o) => o.label.includes("LKG"))[0];
  if (console.log(t, "monitors"), t === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), K(a, n, e);
    return;
  } else {
    console.log("monitor ID", t.label, "serial number", a.calibration);
    const o = [
      `left=${t.left}`,
      `top=${t.top}`,
      `width=${t.width}`,
      `height=${t.height}`,
      "menubar=no",
      "toolbar=no",
      "location=no",
      "status=no",
      "resizable=yes",
      "scrollbars=no",
      "fullscreenEnabled=true"
    ].join(",");
    a.popup = window.open("", "new", o), a.popup && (a.popup.document.body.style.background = "black", a.popup.document.body.style.transform = "1.0", j(a), a.popup.document.body.appendChild(n), console.assert(e), a.popup.onbeforeunload = e);
  }
}
function K(n, a, e) {
  n.popup = window.open("", void 0, "width=640,height=360"), n.popup && (n.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", n.popup.document.body.style.background = "black", n.popup.document.body.style.transform = "1.0", j(n), n.popup.document.body.appendChild(a), console.assert(e), n.popup.onbeforeunload = e);
}
function Te(n, a) {
  var e;
  (e = a.parentElement) == null || e.removeChild(a), n.popup && (n.popup.onbeforeunload = null, n.popup.close(), n.popup = null);
}
function j(n) {
  n.popup && n.popup.document.addEventListener("keydown", (a) => {
    a.ctrlKey && (a.key === "=" || a.key === "-" || a.key === "+") && a.preventDefault();
  });
}
const B = Symbol("LookingGlassXRWebGLLayer");
class xe extends be {
  constructor(a, e, s) {
    super(a, e, s);
    const t = F();
    t.appCanvas = e.canvas, t.lkgCanvas = document.createElement("canvas"), t.lkgCanvas.tabIndex = 0;
    const o = t.lkgCanvas.getContext("2d", { alpha: !1 });
    t.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const l = this[ve].config, h = e.createTexture();
    let p, I;
    const x = e.createFramebuffer(), v = e.getExtension("OES_vertex_array_object"), r = 34229, c = v ? v.bindVertexArrayOES.bind(v) : e.bindVertexArray.bind(e);
    (l.depth || l.stencil) && (l.depth && l.stencil ? I = {
      format: e.DEPTH_STENCIL,
      attachment: e.DEPTH_STENCIL_ATTACHMENT
    } : l.depth ? I = {
      format: e.DEPTH_COMPONENT16,
      attachment: e.DEPTH_ATTACHMENT
    } : l.stencil && (I = {
      format: e.STENCIL_INDEX8,
      attachment: e.STENCIL_ATTACHMENT
    }), p = e.createRenderbuffer());
    const u = (i, T, C, d, g) => {
      f(i, T, g.framebufferWidth, g.framebufferHeight), C && y(i, C, d, g.framebufferWidth, g.framebufferHeight);
    }, f = (i, T, C, d) => {
      const g = i.getParameter(i.TEXTURE_BINDING_2D);
      i.bindTexture(i.TEXTURE_2D, T), i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, C, d, 0, i.RGBA, i.UNSIGNED_BYTE, null), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR), i.bindTexture(i.TEXTURE_2D, g);
    }, y = (i, T, C, d, g) => {
      const L = i.getParameter(i.RENDERBUFFER_BINDING);
      i.bindRenderbuffer(i.RENDERBUFFER, T), i.renderbufferStorage(i.RENDERBUFFER, C.format, d, g), i.bindRenderbuffer(i.RENDERBUFFER, L);
    }, _ = (i, T, C, d, g, L) => {
      const X = i.getParameter(i.FRAMEBUFFER_BINDING);
      i.bindFramebuffer(i.FRAMEBUFFER, T), i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, C, 0), (L.depth || L.stencil) && i.framebufferRenderbuffer(i.FRAMEBUFFER, d.attachment, i.RENDERBUFFER, g), i.bindFramebuffer(i.FRAMEBUFFER, X);
    };
    u(e, h, p, I, t), t.addEventListener("on-config-changed", () => u(e, h, p, I, t)), _(e, x, h, I, p, l);
    const S = `
		attribute vec2 a_position;
		varying vec2 v_texcoord;
		void main() {
		  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
		  v_texcoord = a_position;
		}
	  `;
    function w(i, T, C) {
      const d = i.createShader(T);
      return i.shaderSource(d, C), i.compileShader(d), i.getShaderParameter(d, i.COMPILE_STATUS) ? d : (console.warn(i.getShaderInfoLog(d)), null);
    }
    function m(i, T, C) {
      let d = i.createProgram();
      const g = w(i, i.VERTEX_SHADER, T), L = w(i, i.FRAGMENT_SHADER, C);
      return g === null || L === null ? (console.error("There was a problem with shader construction"), null) : (i.attachShader(d, g), i.attachShader(d, L), i.linkProgram(d), i.getProgramParameter(d, i.LINK_STATUS) ? d : (console.warn(i.getProgramInfoLog(d)), null));
    }
    let M, A, P, b;
    const k = (i, T, C) => {
      const d = C(T);
      if (d === A)
        return;
      A = d;
      const g = w(i, i.FRAGMENT_SHADER, d);
      if (g === null)
        return;
      M && i.deleteShader(M), M = g;
      const L = m(i, S, d);
      if (L === null) {
        console.warn("There was a problem with shader construction");
        return;
      }
      P = i.getAttribLocation(L, "a_position"), b = i.getUniformLocation(L, "u_viewType");
      const X = i.getUniformLocation(L, "u_texture"), le = i.getParameter(i.CURRENT_PROGRAM);
      i.useProgram(L), i.uniform1i(X, 0), i.useProgram(le), D && i.deleteProgram(D), D = L;
    };
    console.log(W(t));
    let D = m(e, S, W(t));
    D === null && console.warn("There was a problem with shader construction"), t.addEventListener("on-config-changed", () => {
      k(e, t, W);
    });
    const Y = v ? v.createVertexArrayOES() : e.createVertexArray(), Z = e.createBuffer(), Q = e.getParameter(e.ARRAY_BUFFER_BINDING), J = e.getParameter(r);
    c(Y), e.bindBuffer(e.ARRAY_BUFFER, Z), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(P), e.vertexAttribPointer(P, 2, e.FLOAT, !1, 0, 0), c(J), e.bindBuffer(e.ARRAY_BUFFER, Q);
    const ee = () => {
      console.assert(this[B].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
      const i = e.getParameter(e.COLOR_CLEAR_VALUE), T = e.getParameter(e.DEPTH_CLEAR_VALUE), C = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(i[0], i[1], i[2], i[3]), e.clearDepth(T), e.clearStencil(C);
    };
    function te() {
      if (!t.appCanvas || !t.lkgCanvas)
        return;
      (t.appCanvas.width !== t.framebufferWidth || t.appCanvas.height !== t.framebufferHeight) && (t.appCanvas.width, t.appCanvas.height, t.appCanvas.width = t.framebufferWidth, t.appCanvas.height = t.framebufferHeight), e.isEnabled(e.SCISSOR_TEST);
      const i = ie();
      ae(), re(), se(), oe(), ne(i);
    }
    function ne(i) {
      e.activeTexture(i.activeTexture), e.bindTexture(e.TEXTURE_2D, i.textureBinding), e.useProgram(i.program), e.bindRenderbuffer(e.RENDERBUFFER, i.renderbufferBinding), e.bindFramebuffer(e.FRAMEBUFFER, i.framebufferBinding), i.scissorTest ? e.enable(e.SCISSOR_TEST) : e.disable(e.SCISSOR_TEST), i.stencilTest ? e.enable(e.STENCIL_TEST) : e.disable(e.STENCIL_TEST), i.depthTest ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST), i.blend ? e.enable(e.BLEND) : e.disable(e.BLEND), i.cullFace ? e.enable(e.CULL_FACE) : e.disable(e.CULL_FACE), i.scissorTest ? e.enable(e.SCISSOR_TEST) : e.disable(e.SCISSOR_TEST), e.scissor(i.scissorBox[0], i.scissorBox[1], i.scissorBox[2], i.scissorBox[3]), c(i.VAO);
    }
    function ie() {
      return {
        VAO: e.getParameter(e.VERTEX_ARRAY_BINDING),
        cullFace: e.getParameter(e.CULL_FACE),
        blend: e.getParameter(e.BLEND),
        depthTest: e.getParameter(e.DEPTH_TEST),
        stencilTest: e.getParameter(e.STENCIL_TEST),
        scissorTest: e.getParameter(e.SCISSOR_TEST),
        viewport: e.getParameter(e.VIEWPORT),
        framebufferBinding: e.getParameter(e.FRAMEBUFFER_BINDING),
        renderbufferBinding: e.getParameter(e.RENDERBUFFER_BINDING),
        program: e.getParameter(e.CURRENT_PROGRAM),
        activeTexture: e.getParameter(e.ACTIVE_TEXTURE),
        textureBinding: e.getParameter(e.TEXTURE_BINDING_2D),
        scissorBox: new Int32Array(e.getParameter(e.SCISSOR_BOX))
      };
    }
    function ae() {
      e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(D), c(Y), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, h), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight);
    }
    function re() {
      e.uniform1i(b, 0), e.drawArrays(e.TRIANGLES, 0, 6);
    }
    function se() {
      if (!t.lkgCanvas || !t.appCanvas) {
        console.warn("Looking Glass Canvas is not defined");
        return;
      }
      o == null || o.clearRect(0, 0, t.lkgCanvas.width, t.lkgCanvas.height), o == null || o.drawImage(t.appCanvas, 0, 0, t.framebufferWidth, t.framebufferHeight, 0, 0, t.calibration.screenW.value, t.calibration.screenH.value);
    }
    function oe() {
      if (!t.appCanvas) {
        console.warn("Looking Glass Canvas is not defined");
        return;
      }
      t.inlineView !== 0 && (t.capturing && t.appCanvas.width !== t.framebufferWidth && (t.appCanvas.width = t.framebufferWidth, t.appCanvas.height = t.framebufferHeight, e.viewport(0, 0, t.framebufferHeight, t.framebufferWidth)), e.uniform1i(b, t.inlineView), e.drawArrays(e.TRIANGLES, 0, 6));
    }
    window.addEventListener("unload", () => {
      t.popup && t.popup.close(), t.popup = null;
    }), this[B] = {
      LookingGlassEnabled: !1,
      framebuffer: x,
      clearFramebuffer: ee,
      blitTextureToDefaultFramebufferIfNeeded: te,
      moveCanvasToWindow: ge
    };
  }
  get framebuffer() {
    return this[B].LookingGlassEnabled ? this[B].framebuffer : null;
  }
  get framebufferWidth() {
    return F().framebufferWidth;
  }
  get framebufferHeight() {
    return F().framebufferHeight;
  }
}
const N = class extends pe {
  constructor(a) {
    super(a), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = E.create(), this.inlineProjectionMatrix = E.create(), this.inlineInverseViewMatrix = E.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, N.instance || (N.instance = this);
  }
  static getInstance() {
    return N.instance;
  }
  onBaseLayerSet(a, e) {
    const s = this.sessions.get(a);
    s.baseLayer = e;
    const t = F(), o = e[B];
    o.LookingGlassEnabled = s.immersive, s.immersive && (t.XRSession = this.sessions.get(a), t.popup == null ? o.moveCanvasToWindow(!0, () => {
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
    const s = a !== "inline", t = new Se(a, e);
    return this.sessions.set(t.id, t), s && this.dispatchEvent("@@webxr-polyfill/vr-present-start", t.id), Promise.resolve(t.id);
  }
  requestAnimationFrame(a) {
    return this.global.requestAnimationFrame(a);
  }
  cancelAnimationFrame(a) {
    this.global.cancelAnimationFrame(a);
  }
  onFrameStart(a, e) {
    const s = this.sessions.get(a), t = F();
    if (s.immersive) {
      const o = Math.tan(0.5 * t.fovy), l = 0.5 * t.targetDiam / o, h = l - t.targetDiam, p = this.basePoseMatrix;
      E.fromTranslation(p, [t.targetX, t.targetY, t.targetZ]), E.rotate(p, p, t.trackballX, [0, 1, 0]), E.rotate(p, p, -t.trackballY, [1, 0, 0]), E.translate(p, p, [0, 0, l]);
      for (let x = 0; x < t.numViews; ++x) {
        const v = (x + 0.5) / t.numViews - 0.5, r = Math.tan(t.viewCone * v), c = l * r, u = this.LookingGlassInverseViewMatrices[x] = this.LookingGlassInverseViewMatrices[x] || E.create();
        E.translate(u, p, [c, 0, 0]), E.invert(u, u);
        const f = Math.max(h + e.depthNear, 0.01), y = h + e.depthFar, _ = f * o, S = _, w = -_, m = f * -r, M = t.aspect * _, A = m + M, P = m - M, b = this.LookingGlassProjectionMatrices[x] = this.LookingGlassProjectionMatrices[x] || E.create();
        E.set(b, 2 * f / (A - P), 0, 0, 0, 0, 2 * f / (S - w), 0, 0, (A + P) / (A - P), (S + w) / (S - w), -(y + f) / (y - f), -1, 0, 0, -2 * y * f / (y - f), 0);
      }
      s.baseLayer[B].clearFramebuffer();
    } else {
      const o = s.baseLayer.context, l = o.drawingBufferWidth / o.drawingBufferHeight;
      E.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, l, e.depthNear, e.depthFar), E.fromTranslation(this.basePoseMatrix, [0, H, 0]), E.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }
  onFrameEnd(a) {
    this.sessions.get(a).baseLayer[B].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(a, e) {
    const s = E.create();
    switch (a) {
      case "viewer":
      case "local":
        return E.fromTranslation(s, [0, -H, 0]), s;
      case "local-floor":
        return s;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(a) {
    const e = this.sessions.get(a);
    e.immersive && e.baseLayer && (e.baseLayer[B].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", a)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(a, e) {
    const s = this.sessions.get(a);
    return s.ended ? !1 : s.enabledFeatures.has(e);
  }
  getViewSpaces(a) {
    if (a === "immersive-vr") {
      const e = F();
      for (let s = this.viewSpaces.length; s < e.numViews; ++s)
        this.viewSpaces[s] = new _e(s);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(a, e, s, t, o) {
    if (o === void 0) {
      const h = this.sessions.get(a).baseLayer.context;
      t.x = 0, t.y = 0, t.width = h.drawingBufferWidth, t.height = h.drawingBufferHeight;
    } else {
      const l = F(), h = o % l.quiltWidth, p = Math.floor(o / l.quiltWidth);
      t.x = l.framebufferWidth / l.quiltWidth * h, t.y = l.framebufferHeight / l.quiltHeight * p, t.width = l.framebufferWidth / l.quiltWidth, t.height = l.framebufferHeight / l.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(a, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || E.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(a) {
    return this.LookingGlassInverseViewMatrices[a] = this.LookingGlassInverseViewMatrices[a] || E.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(a, e, s) {
    return null;
  }
  onWindowResize() {
  }
};
let V = N;
R(V, "instance", null);
let Le = 0;
class Se {
  constructor(a, e) {
    R(this, "mode");
    R(this, "immersive");
    R(this, "id");
    R(this, "baseLayer");
    R(this, "inlineVerticalFieldOfView");
    R(this, "ended");
    R(this, "enabledFeatures");
    this.mode = a, this.immersive = a === "immersive-vr" || a === "immersive-ar", this.id = ++Le, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class _e extends me {
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
class $ extends he {
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
    this.global.XRWebGLLayer = xe, this.injected = !0, this.device = new V(this.global), this.xr = new de(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await ke("VRButton"), this.vrButton && this.device ? (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI()) : console.warn("Unable to find VRButton");
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await Fe(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    z(e);
  }
}
async function ke(n) {
  return new Promise((a) => {
    const e = new MutationObserver(function(s) {
      s.forEach(function(t) {
        t.addedNodes.forEach(function(o) {
          const l = o;
          l.id === n && (a(l), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), a(null);
    }, 5e3);
  });
}
function Fe(n) {
  return new Promise((a) => setTimeout(a, n));
}
const Xe = F();
export {
  Xe as LookingGlassConfig,
  $ as LookingGlassWebXRPolyfill
};
