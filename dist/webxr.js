var ce = Object.defineProperty;
var ue = (n, i, e) => i in n ? ce(n, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[i] = e;
var R = (n, i, e) => (ue(n, typeof i != "symbol" ? i + "" : i, e), e);
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
      numViews: this.quiltHeight * this.quiltWidth,
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
    return this._viewControls.numViews;
  }
  set numViews(e) {
    this.updateViewControls({ numViews: e });
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
  const i = F();
  n != null && i.updateViewControls(n);
}
async function Ee() {
  const n = F();
  let i = 2;
  function e() {
    if (n.appCanvas != null)
      try {
        let t = n.appCanvas.toDataURL();
        const o = document.createElement("a");
        o.style.display = "none", o.href = t, o.download = `hologram_qs${n.quiltWidth}x${n.quiltHeight}a${n.aspect}.png`, document.body.appendChild(o), o.click(), document.body.removeChild(o), window.URL.revokeObjectURL(t);
      } catch (t) {
        console.error("Error while capturing canvas data:", t);
      } finally {
        n.inlineView = i;
      }
  }
  const s = document.getElementById("screenshotbutton");
  s && s.addEventListener("click", () => {
    i = n.inlineView;
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
  var i;
  const n = F();
  if (console.log(n, "for debugging purposes"), n.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let e = function() {
      let r = v.d - v.a, c = v.w - v.s;
      r && c && (r *= Math.sqrt(0.5), c *= Math.sqrt(0.5));
      const u = n.trackballX, f = n.trackballY, y = Math.cos(u) * r - Math.sin(u) * Math.cos(f) * c, S = -Math.sin(f) * c, _ = -Math.sin(u) * r - Math.cos(u) * Math.cos(f) * c;
      n.targetX = n.targetX + y * n.targetDiam * 0.03, n.targetY = n.targetY + S * n.targetDiam * 0.03, n.targetZ = n.targetZ + _ * n.targetDiam * 0.03, requestAnimationFrame(e);
    };
    const s = document.createElement("style");
    document.head.appendChild(s), (i = s.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const t = document.createElement("div");
    t.id = "LookingGlassWebXRControls", t.style.position = "fixed", t.style.zIndex = "1000", t.style.padding = "15px", t.style.width = "320px", t.style.maxWidth = "calc(100vw - 18px)", t.style.maxHeight = "calc(100vh - 18px)", t.style.whiteSpace = "nowrap", t.style.background = "rgba(0, 0, 0, 0.6)", t.style.color = "white", t.style.borderRadius = "10px", t.style.right = "15px", t.style.bottom = "15px", t.style.flex = "row";
    const o = document.createElement("div");
    t.appendChild(o), o.style.width = "100%", o.style.textAlign = "center", o.style.fontWeight = "bold", o.style.marginBottom = "8px", o.innerText = "Looking Glass Controls";
    const l = document.createElement("button");
    l.style.display = "block", l.style.margin = "auto", l.style.width = "100%", l.style.height = "35px", l.style.padding = "4px", l.style.marginBottom = "8px", l.style.borderRadius = "8px", l.id = "screenshotbutton", t.appendChild(l), l.innerText = "Save Hologram";
    const h = document.createElement("button");
    h.style.display = "block", h.style.margin = "auto", h.style.width = "100%", h.style.height = "35px", h.style.padding = "4px", h.style.marginBottom = "8px", h.style.borderRadius = "8px", h.id = "copybutton", t.appendChild(h), h.innerText = "Copy Config", h.addEventListener("click", () => {
      ge(n);
    });
    const p = document.createElement("div");
    t.appendChild(p), p.style.width = "290px", p.style.whiteSpace = "normal", p.style.color = "rgba(255,255,255,0.7)", p.style.fontSize = "14px", p.style.margin = "5px 0", p.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const M = document.createElement("div");
    t.appendChild(M);
    const x = (r, c, u) => {
      const f = u.stringify, y = document.createElement("div");
      y.style.marginBottom = "8px", M.appendChild(y);
      const S = r, _ = n[r], w = document.createElement("label");
      y.appendChild(w), w.innerText = u.label, w.setAttribute("for", S), w.style.width = "100px", w.style.display = "inline-block", w.style.textDecoration = "dotted underline 1px", w.style.fontFamily = '"Courier New"', w.style.fontSize = "13px", w.style.fontWeight = "bold", w.title = u.title;
      const m = document.createElement("input");
      y.appendChild(m), Object.assign(m, c), m.id = S, m.title = u.title, m.value = c.value !== void 0 ? c.value : _;
      const I = (b) => {
        n[r] = b, P(b);
      };
      m.oninput = () => {
        const b = c.type === "range" ? parseFloat(m.value) : c.type === "checkbox" ? m.checked : m.value;
        I(b);
      };
      const A = (b) => {
        let k = b(n[r]);
        u.fixRange && (k = u.fixRange(k), m.max = Math.max(parseFloat(m.max), k).toString(), m.min = Math.min(parseFloat(m.min), k).toString()), m.value = k, I(k);
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
        }, P(_);
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
        const f = n.trackballX, y = n.trackballY, S = -Math.cos(f) * c + Math.sin(f) * Math.sin(y) * u, _ = -Math.cos(y) * u, w = Math.sin(f) * c + Math.cos(f) * Math.sin(y) * u;
        n.targetX = n.targetX + S * n.targetDiam * 1e-3, n.targetY = n.targetY + _ * n.targetDiam * 1e-3, n.targetZ = n.targetZ + w * n.targetDiam * 1e-3;
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
function ge(n) {
  const i = {
    targetX: n.targetX,
    targetY: n.targetY,
    targetZ: n.targetZ,
    fovy: `${Math.round(n.fovy / Math.PI * 180)} * Math.PI / 180`,
    targetDiam: n.targetDiam,
    trackballX: n.trackballX,
    trackballY: n.trackballY,
    depthiness: n.depthiness
  };
  let e = JSON.stringify(i, null, 4).replace(/"/g, "").replace(/{/g, "").replace(/}/g, "");
  navigator.clipboard.writeText(e);
}
let G;
const Ce = (n, i) => {
  const e = F();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (n == !1)
    Te(e, G);
  else {
    G == null && (G = ye()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(G);
    const s = "getScreenDetails" in window;
    console.log(s, "Screen placement API exists"), s ? Re(e.lkgCanvas, e, i) : K(e, e.lkgCanvas, i);
  }
};
async function Re(n, i, e) {
  const s = await window.getScreenDetails();
  console.log(s);
  const t = s.screens.filter((o) => o.label.includes("LKG"))[0];
  if (console.log(t, "monitors"), t === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), K(i, n, e);
    return;
  } else {
    console.log("monitor ID", t.label, "serial number", i.calibration);
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
    i.popup = window.open("", "new", o), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.style.transform = "1.0", j(i), i.popup.document.body.appendChild(n), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function K(n, i, e) {
  n.popup = window.open("", void 0, "width=640,height=360"), n.popup && (n.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", n.popup.document.body.style.background = "black", n.popup.document.body.style.transform = "1.0", j(n), n.popup.document.body.appendChild(i), console.assert(e), n.popup.onbeforeunload = e);
}
function Te(n, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), n.popup && (n.popup.onbeforeunload = null, n.popup.close(), n.popup = null);
}
function j(n) {
  n.popup && n.popup.document.addEventListener("keydown", (i) => {
    i.ctrlKey && (i.key === "=" || i.key === "-" || i.key === "+") && i.preventDefault();
  });
}
const B = Symbol("LookingGlassXRWebGLLayer");
class xe extends be {
  constructor(i, e, s) {
    super(i, e, s);
    const t = F();
    t.appCanvas = e.canvas, t.lkgCanvas = document.createElement("canvas"), t.lkgCanvas.tabIndex = 0;
    const o = t.lkgCanvas.getContext("2d", { alpha: !1 });
    t.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const l = this[ve].config, h = e.createTexture();
    let p, M;
    const x = e.createFramebuffer(), v = e.getExtension("OES_vertex_array_object"), r = 34229, c = v ? v.bindVertexArrayOES.bind(v) : e.bindVertexArray.bind(e);
    (l.depth || l.stencil) && (l.depth && l.stencil ? M = {
      format: e.DEPTH_STENCIL,
      attachment: e.DEPTH_STENCIL_ATTACHMENT
    } : l.depth ? M = {
      format: e.DEPTH_COMPONENT16,
      attachment: e.DEPTH_ATTACHMENT
    } : l.stencil && (M = {
      format: e.STENCIL_INDEX8,
      attachment: e.STENCIL_ATTACHMENT
    }), p = e.createRenderbuffer());
    const u = (a, T, g, d, C) => {
      f(a, T, C.framebufferWidth, C.framebufferHeight), g && y(a, g, d, C.framebufferWidth, C.framebufferHeight);
    }, f = (a, T, g, d) => {
      const C = a.getParameter(a.TEXTURE_BINDING_2D);
      a.bindTexture(a.TEXTURE_2D, T), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, g, d, 0, a.RGBA, a.UNSIGNED_BYTE, null), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR), a.bindTexture(a.TEXTURE_2D, C);
    }, y = (a, T, g, d, C) => {
      const L = a.getParameter(a.RENDERBUFFER_BINDING);
      a.bindRenderbuffer(a.RENDERBUFFER, T), a.renderbufferStorage(a.RENDERBUFFER, g.format, d, C), a.bindRenderbuffer(a.RENDERBUFFER, L);
    }, S = (a, T, g, d, C, L) => {
      const X = a.getParameter(a.FRAMEBUFFER_BINDING);
      a.bindFramebuffer(a.FRAMEBUFFER, T), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, g, 0), (L.depth || L.stencil) && a.framebufferRenderbuffer(a.FRAMEBUFFER, d.attachment, a.RENDERBUFFER, C), a.bindFramebuffer(a.FRAMEBUFFER, X);
    };
    u(e, h, p, M, t), t.addEventListener("on-config-changed", () => u(e, h, p, M, t)), S(e, x, h, M, p, l);
    const _ = `
		attribute vec2 a_position;
		varying vec2 v_texcoord;
		void main() {
		  gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
		  v_texcoord = a_position;
		}
	  `;
    function w(a, T, g) {
      const d = a.createShader(T);
      return a.shaderSource(d, g), a.compileShader(d), a.getShaderParameter(d, a.COMPILE_STATUS) ? d : (console.warn(a.getShaderInfoLog(d)), null);
    }
    function m(a, T, g) {
      let d = a.createProgram();
      const C = w(a, a.VERTEX_SHADER, T), L = w(a, a.FRAGMENT_SHADER, g);
      return C === null || L === null ? (console.error("There was a problem with shader construction"), null) : (a.attachShader(d, C), a.attachShader(d, L), a.linkProgram(d), a.getProgramParameter(d, a.LINK_STATUS) ? d : (console.warn(a.getProgramInfoLog(d)), null));
    }
    let I, A, P, b;
    const k = (a, T, g) => {
      const d = g(T);
      if (d === A)
        return;
      A = d;
      const C = w(a, a.FRAGMENT_SHADER, d);
      if (C === null)
        return;
      I && a.deleteShader(I), I = C;
      const L = m(a, _, d);
      if (L === null) {
        console.warn("There was a problem with shader construction");
        return;
      }
      P = a.getAttribLocation(L, "a_position"), b = a.getUniformLocation(L, "u_viewType");
      const X = a.getUniformLocation(L, "u_texture"), le = a.getParameter(a.CURRENT_PROGRAM);
      a.useProgram(L), a.uniform1i(X, 0), a.useProgram(le), D && a.deleteProgram(D), D = L;
    };
    console.log(W(t));
    let D = m(e, _, W(t));
    D === null && console.warn("There was a problem with shader construction"), t.addEventListener("on-config-changed", () => {
      k(e, t, W);
    });
    const Y = v ? v.createVertexArrayOES() : e.createVertexArray(), Z = e.createBuffer(), Q = e.getParameter(e.ARRAY_BUFFER_BINDING), J = e.getParameter(r);
    c(Y), e.bindBuffer(e.ARRAY_BUFFER, Z), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(P), e.vertexAttribPointer(P, 2, e.FLOAT, !1, 0, 0), c(J), e.bindBuffer(e.ARRAY_BUFFER, Q);
    const ee = () => {
      console.assert(this[B].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
      const a = e.getParameter(e.COLOR_CLEAR_VALUE), T = e.getParameter(e.DEPTH_CLEAR_VALUE), g = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(a[0], a[1], a[2], a[3]), e.clearDepth(T), e.clearStencil(g);
    };
    function te() {
      if (!t.appCanvas || !t.lkgCanvas)
        return;
      (t.appCanvas.width !== t.framebufferWidth || t.appCanvas.height !== t.framebufferHeight) && (t.appCanvas.width, t.appCanvas.height, t.appCanvas.width = t.framebufferWidth, t.appCanvas.height = t.framebufferHeight);
      const a = ie();
      ae(), re(), se(), oe(), ne(a);
    }
    function ne(a) {
      e.activeTexture(a.activeTexture), e.bindTexture(e.TEXTURE_2D, a.textureBinding), e.useProgram(a.program), e.bindRenderbuffer(e.RENDERBUFFER, a.renderbufferBinding), e.bindFramebuffer(e.FRAMEBUFFER, a.framebufferBinding), a.scissorTest ? e.enable(e.SCISSOR_TEST) : e.disable(e.SCISSOR_TEST), a.stencilTest ? e.enable(e.STENCIL_TEST) : e.disable(e.STENCIL_TEST), a.depthTest ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST), a.blend ? e.enable(e.BLEND) : e.disable(e.BLEND), a.cullFace ? e.enable(e.CULL_FACE) : e.disable(e.CULL_FACE), c(a.VAO);
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
        textureBinding: e.getParameter(e.TEXTURE_BINDING_2D)
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
      moveCanvasToWindow: Ce
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
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = E.create(), this.inlineProjectionMatrix = E.create(), this.inlineInverseViewMatrix = E.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [], this.captureScreenshot = !1, this.screenshotCallback = null, N.instance || (N.instance = this);
  }
  static getInstance() {
    return N.instance;
  }
  onBaseLayerSet(i, e) {
    const s = this.sessions.get(i);
    s.baseLayer = e;
    const t = F(), o = e[B];
    o.LookingGlassEnabled = s.immersive, s.immersive && (t.XRSession = this.sessions.get(i), t.popup == null ? o.moveCanvasToWindow(!0, () => {
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
    const s = i !== "inline", t = new _e(i, e);
    return this.sessions.set(t.id, t), s && this.dispatchEvent("@@webxr-polyfill/vr-present-start", t.id), Promise.resolve(t.id);
  }
  requestAnimationFrame(i) {
    return this.global.requestAnimationFrame(i);
  }
  cancelAnimationFrame(i) {
    this.global.cancelAnimationFrame(i);
  }
  onFrameStart(i, e) {
    const s = this.sessions.get(i), t = F();
    if (s.immersive) {
      const o = Math.tan(0.5 * t.fovy), l = 0.5 * t.targetDiam / o, h = l - t.targetDiam, p = this.basePoseMatrix;
      E.fromTranslation(p, [t.targetX, t.targetY, t.targetZ]), E.rotate(p, p, t.trackballX, [0, 1, 0]), E.rotate(p, p, -t.trackballY, [1, 0, 0]), E.translate(p, p, [0, 0, l]);
      for (let x = 0; x < t.numViews; ++x) {
        const v = (x + 0.5) / t.numViews - 0.5, r = Math.tan(t.viewCone * v), c = l * r, u = this.LookingGlassInverseViewMatrices[x] = this.LookingGlassInverseViewMatrices[x] || E.create();
        E.translate(u, p, [c, 0, 0]), E.invert(u, u);
        const f = Math.max(h + e.depthNear, 0.01), y = h + e.depthFar, S = f * o, _ = S, w = -S, m = f * -r, I = t.aspect * S, A = m + I, P = m - I, b = this.LookingGlassProjectionMatrices[x] = this.LookingGlassProjectionMatrices[x] || E.create();
        E.set(b, 2 * f / (A - P), 0, 0, 0, 0, 2 * f / (_ - w), 0, 0, (A + P) / (A - P), (_ + w) / (_ - w), -(y + f) / (y - f), -1, 0, 0, -2 * y * f / (y - f), 0);
      }
      s.baseLayer[B].clearFramebuffer();
    } else {
      const o = s.baseLayer.context, l = o.drawingBufferWidth / o.drawingBufferHeight;
      E.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, l, e.depthNear, e.depthFar), E.fromTranslation(this.basePoseMatrix, [0, H, 0]), E.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[B].blitTextureToDefaultFramebufferIfNeeded(), this.captureScreenshot && this.screenshotCallback && (this.screenshotCallback(), this.captureScreenshot = !1);
  }
  async requestFrameOfReferenceTransform(i, e) {
    const s = E.create();
    switch (i) {
      case "viewer":
      case "local":
        return E.fromTranslation(s, [0, -H, 0]), s;
      case "local-floor":
        return s;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[B].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const s = this.sessions.get(i);
    return s.ended ? !1 : s.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = F();
      for (let s = this.viewSpaces.length; s < e.numViews; ++s)
        this.viewSpaces[s] = new Se(s);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, s, t, o) {
    if (o === void 0) {
      const h = this.sessions.get(i).baseLayer.context;
      t.x = 0, t.y = 0, t.width = h.drawingBufferWidth, t.height = h.drawingBufferHeight;
    } else {
      const l = F(), h = o % l.quiltWidth, p = Math.floor(o / l.quiltWidth);
      t.x = l.framebufferWidth / l.quiltWidth * h, t.y = l.framebufferHeight / l.quiltHeight * p, t.width = l.framebufferWidth / l.quiltWidth, t.height = l.framebufferHeight / l.quiltHeight;
    }
    return !0;
  }
  getProjectionMatrix(i, e) {
    return e === void 0 ? this.inlineProjectionMatrix : this.LookingGlassProjectionMatrices[e] || E.create();
  }
  getBasePoseMatrix() {
    return this.basePoseMatrix;
  }
  getBaseViewMatrix() {
    return this.inlineInverseViewMatrix;
  }
  _getViewMatrixByIndex(i) {
    return this.LookingGlassInverseViewMatrices[i] = this.LookingGlassInverseViewMatrices[i] || E.create();
  }
  getInputSources() {
    return [];
  }
  getInputPose(i, e, s) {
    return null;
  }
  onWindowResize() {
  }
};
let V = N;
R(V, "instance", null);
let Le = 0;
class _e {
  constructor(i, e) {
    R(this, "mode");
    R(this, "immersive");
    R(this, "id");
    R(this, "baseLayer");
    R(this, "inlineVerticalFieldOfView");
    R(this, "ended");
    R(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++Le, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class Se extends me {
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
  return new Promise((i) => {
    const e = new MutationObserver(function(s) {
      s.forEach(function(t) {
        t.addedNodes.forEach(function(o) {
          const l = o;
          l.id === n && (i(l), e.disconnect());
        });
      });
    });
    e.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      e.disconnect(), i(null);
    }, 5e3);
  });
}
function Fe(n) {
  return new Promise((i) => setTimeout(i, n));
}
const Xe = F();
export {
  Xe as LookingGlassConfig,
  $ as LookingGlassWebXRPolyfill
};
