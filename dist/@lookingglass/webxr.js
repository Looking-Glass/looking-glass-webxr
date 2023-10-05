var ne = Object.defineProperty;
var ie = (t, i, e) => i in t ? ne(t, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[i] = e;
var y = (t, i, e) => (ie(t, typeof i != "symbol" ? i + "" : i, e), e);
import X from "@lookingglass/webxr-polyfill/src/api/index";
import ae from "@lookingglass/webxr-polyfill/src/api/XRSystem";
import re from "@lookingglass/webxr-polyfill/src/WebXRPolyfill";
import * as se from "holoplay-core";
import { Shader as oe } from "holoplay-core";
import le from "@lookingglass/webxr-polyfill/src/devices/XRDevice";
import ce from "@lookingglass/webxr-polyfill/src/api/XRSpace";
import { mat4 as g } from "gl-matrix";
import ue, { PRIVATE as de } from "@lookingglass/webxr-polyfill/src/api/XRWebGLLayer";
const B = 1.6;
var V;
(function(t) {
  t[t.Swizzled = 0] = "Swizzled", t[t.Center = 1] = "Center", t[t.Quilt = 2] = "Quilt";
})(V || (V = {}));
class he extends EventTarget {
  constructor(e) {
    super();
    y(this, "_calibration", {
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
    y(this, "_viewControls", {
      tileHeight: 512,
      numViews: 48,
      trackballX: 0,
      trackballY: 0,
      targetX: 0,
      targetY: B,
      targetZ: -0.5,
      targetDiam: 2,
      fovy: 13 / 180 * Math.PI,
      depthiness: 1.25,
      inlineView: V.Center,
      capturing: !1,
      quiltResolution: 3840,
      popup: null,
      XRSession: null,
      lkgCanvas: null,
      appCanvas: null
    });
    y(this, "LookingGlassDetected");
    this._viewControls = { ...this._viewControls, ...e }, this.syncCalibration();
  }
  syncCalibration() {
    new se.Client((e) => {
      if (e.devices.length < 1) {
        console.log("No Looking Glass devices found");
        return;
      }
      e.devices.length > 1 && console.log("More than one Looking Glass device found... using the first one"), this.calibration = e.devices[0].calibration;
    });
  }
  addEventListener(e, r, n) {
    super.addEventListener(e, r, n);
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
let D = null;
function L() {
  return D == null && (D = new he()), D;
}
function N(t) {
  const i = L();
  t != null && i.updateViewControls(t);
}
async function fe() {
  const t = L();
  if (t.appCanvas == null) {
    console.warn("Media Capture initialized while canvas is null!");
    return;
  } else {
    let i = function() {
      if (t.appCanvas != null) {
        let n = t.appCanvas.toDataURL();
        const s = document.createElement("a");
        s.style.display = "none", s.href = n, s.download = `hologram_qs${t.quiltWidth}x${t.quiltHeight}a${t.aspect}.png`, document.body.appendChild(s), s.click(), document.body.removeChild(s), window.URL.revokeObjectURL(n);
      }
    };
    const e = document.getElementById("screenshotbutton");
    e == null || e.addEventListener("click", r);
    async function r() {
      await be.promise(50).finally(i);
    }
  }
}
const pe = { timeout: 500 }, G = window.requestIdleCallback || window.requestAnimationFrame, me = window.cancelIdleCallback || window.cancelAnimationFrame, be = {
  request: G,
  cancel: me,
  promise: (t) => new Promise((i) => G(i, Object.assign({}, pe, t)))
};
function ve() {
  var i;
  const t = L();
  if (console.log(t, "for debugging purposes"), t.lkgCanvas == null)
    console.warn("window placement called without a valid XR Session!");
  else {
    let e = function() {
      let a = v.d - v.a, l = v.w - v.s;
      a && l && (a *= Math.sqrt(0.5), l *= Math.sqrt(0.5));
      const u = t.trackballX, d = t.trackballY, w = Math.cos(u) * a - Math.sin(u) * Math.cos(d) * l, T = -Math.sin(d) * l, m = -Math.sin(u) * a - Math.cos(u) * Math.cos(d) * l;
      t.targetX = t.targetX + w * t.targetDiam * 0.03, t.targetY = t.targetY + T * t.targetDiam * 0.03, t.targetZ = t.targetZ + m * t.targetDiam * 0.03, requestAnimationFrame(e);
    };
    const r = document.createElement("style");
    document.head.appendChild(r), (i = r.sheet) == null || i.insertRule("#LookingGlassWebXRControls * { all: revert; font-family: sans-serif }");
    const n = document.createElement("div");
    n.id = "LookingGlassWebXRControls", n.className = "controlsBackground";
    const s = document.createElement("div");
    n.appendChild(s), s.style.width = "100%", s.style.textAlign = "center", s.style.fontWeight = "bold", s.style.marginBottom = "8px", s.innerText = "Looking Glass Controls";
    const o = document.createElement("button");
    o.style.display = "block", o.style.margin = "auto", o.style.width = "100%", o.style.height = "35px", o.style.padding = "4px", o.style.marginBottom = "8px", o.style.borderRadius = "8px", o.id = "screenshotbutton", n.appendChild(o), o.innerText = "Save Hologram";
    const c = document.createElement("button");
    c.style.display = "block", c.style.margin = "auto", c.style.width = "100%", c.style.height = "35px", c.style.padding = "4px", c.style.marginBottom = "8px", c.style.borderRadius = "8px", c.id = "copybutton", n.appendChild(c), c.innerText = "Copy Config", c.addEventListener("click", () => {
      we(t);
    });
    const f = document.createElement("div");
    n.appendChild(f), f.style.width = "290px", f.style.whiteSpace = "normal", f.style.color = "rgba(255,255,255,0.7)", f.style.fontSize = "14px", f.style.margin = "5px 0", f.innerHTML = "Click the popup and use WASD, mouse left/right drag, and scroll.";
    const x = document.createElement("div");
    n.appendChild(x);
    const E = (a, l, u) => {
      const d = u.stringify, w = document.createElement("div");
      w.style.marginBottom = "8px", x.appendChild(w);
      const T = a, m = t[a], p = document.createElement("label");
      w.appendChild(p), p.innerText = u.label, p.setAttribute("for", T), p.style.width = "100px", p.style.display = "inline-block", p.style.textDecoration = "dotted underline 1px", p.style.fontFamily = '"Courier New"', p.style.fontSize = "13px", p.style.fontWeight = "bold", p.title = u.title;
      const h = document.createElement("input");
      w.appendChild(h), Object.assign(h, l), h.id = T, h.title = u.title, h.value = l.value !== void 0 ? l.value : m;
      const P = (b) => {
        t[a] = b, _(b);
      };
      h.oninput = () => {
        const b = l.type === "range" ? parseFloat(h.value) : l.type === "checkbox" ? h.checked : h.value;
        P(b);
      };
      const S = (b) => {
        let R = b(t[a]);
        u.fixRange && (R = u.fixRange(R), h.max = Math.max(parseFloat(h.max), R).toString(), h.min = Math.min(parseFloat(h.min), R).toString()), h.value = R, P(R);
      };
      l.type === "range" && (h.style.width = "110px", h.style.height = "8px", h.onwheel = (b) => {
        S((R) => R + Math.sign(b.deltaX - b.deltaY) * l.step);
      });
      let _ = (b) => {
      };
      if (d) {
        const b = document.createElement("span");
        b.style.fontFamily = '"Courier New"', b.style.fontSize = "13px", b.style.marginLeft = "3px", w.appendChild(b), _ = (R) => {
          b.innerHTML = d(R);
        }, _(m);
      }
      return S;
    };
    E("fovy", {
      type: "range",
      min: 1 / 180 * Math.PI,
      max: 120.1 / 180 * Math.PI,
      step: 1 / 180 * Math.PI
    }, {
      label: "fov",
      title: "perspective fov (degrades stereo effect)",
      fixRange: (a) => Math.max(1 / 180 * Math.PI, Math.min(a, 120.1 / 180 * Math.PI)),
      stringify: (a) => {
        const l = a / Math.PI * 180, u = Math.atan(Math.tan(a / 2) * t.aspect) * 2 / Math.PI * 180;
        return `${l.toFixed()}&deg;&times;${u.toFixed()}&deg;`;
      }
    }), E("depthiness", { type: "range", min: 0, max: 2, step: 0.01 }, {
      label: "depthiness",
      title: 'exaggerates depth by multiplying the width of the view cone (as reported by the firmware) - can somewhat compensate for depthiness lost using higher fov. 1.25 seems to be most physically accurate on Looking Glass 8.9".',
      fixRange: (a) => Math.max(0, a),
      stringify: (a) => `${a.toFixed(2)}x`
    }), E("inlineView", { type: "range", min: 0, max: 2, step: 1 }, {
      label: "inline view",
      title: "what to show inline on the original canvas (swizzled = no overwrite)",
      fixRange: (a) => Math.max(0, Math.min(a, 2)),
      stringify: (a) => a === 0 ? "swizzled" : a === 1 ? "center" : a === 2 ? "quilt" : "?"
    }), t.lkgCanvas.oncontextmenu = (a) => {
      a.preventDefault();
    }, t.lkgCanvas.addEventListener("wheel", (a) => {
      const l = t.targetDiam, u = 1.1, d = Math.log(l) / Math.log(u);
      return t.targetDiam = Math.pow(u, d + a.deltaY * 0.01);
    }), t.lkgCanvas.addEventListener("mousemove", (a) => {
      const l = a.movementX, u = -a.movementY;
      if (a.buttons & 2 || a.buttons & 1 && (a.shiftKey || a.ctrlKey)) {
        const d = t.trackballX, w = t.trackballY, T = -Math.cos(d) * l + Math.sin(d) * Math.sin(w) * u, m = -Math.cos(w) * u, p = Math.sin(d) * l + Math.cos(d) * Math.sin(w) * u;
        t.targetX = t.targetX + T * t.targetDiam * 1e-3, t.targetY = t.targetY + m * t.targetDiam * 1e-3, t.targetZ = t.targetZ + p * t.targetDiam * 1e-3;
      } else
        a.buttons & 1 && (t.trackballX = t.trackballX - l * 0.01, t.trackballY = t.trackballY - u * 0.01);
    });
    const v = { w: 0, a: 0, s: 0, d: 0 };
    return t.lkgCanvas.addEventListener("keydown", (a) => {
      switch (a.code) {
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
    }), t.lkgCanvas.addEventListener("keyup", (a) => {
      switch (a.code) {
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
      fe();
    }, 1e3), n;
  }
}
function we(t) {
  let i = t.targetX, e = t.targetY, r = t.targetZ, n = `${Math.round(t.fovy / Math.PI * 180)} * Math.PI / 180`, s = t.targetDiam, o = t.trackballX, c = t.trackballY, f = t.depthiness;
  const x = {
    targetX: i,
    targetY: e,
    targetZ: r,
    fovy: n,
    targetDiam: s,
    trackballX: o,
    trackballY: c,
    depthiness: f
  };
  let E = JSON.stringify(x, null, 4);
  navigator.clipboard.writeText(E);
}
let I;
const ge = (t, i) => {
  const e = L();
  if (e.lkgCanvas == null) {
    console.warn("window placement called without a valid XR Session!");
    return;
  } else if (t == !1)
    ye(e, I);
  else {
    I == null && (I = ve()), e.lkgCanvas.style.position = "fixed", e.lkgCanvas.style.bottom = "0", e.lkgCanvas.style.left = "0", e.lkgCanvas.width = e.calibration.screenW.value, e.lkgCanvas.height = e.calibration.screenH.value, document.body.appendChild(I);
    const r = "getScreenDetails" in window;
    console.log(r, "Screen placement API exists"), r ? Ee(e.lkgCanvas, e, i) : W(e, e.lkgCanvas, i);
  }
};
async function Ee(t, i, e) {
  const r = await window.getScreenDetails();
  console.log(r);
  const n = r.screens.filter((s) => s.label.includes("LKG"))[0];
  if (console.log(n, "monitors"), n === void 0) {
    console.log("no Looking Glass monitor detected - manually opening popup window"), W(i, t, e);
    return;
  } else {
    console.log("monitor ID", n.label, "serial number", i.calibration);
    const s = [
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
    i.popup = window.open("", "new", s), i.popup && (i.popup.document.body.style.background = "black", i.popup.document.body.appendChild(t), console.assert(e), i.popup.onbeforeunload = e);
  }
}
function W(t, i, e) {
  t.popup = window.open("", void 0, "width=640,height=360"), t.popup && (t.popup.document.title = "Looking Glass Window (fullscreen me on Looking Glass!)", t.popup.document.body.style.background = "black", t.popup.document.body.appendChild(i), console.assert(e), t.popup.onbeforeunload = e);
}
function ye(t, i) {
  var e;
  (e = i.parentElement) == null || e.removeChild(i), t.popup && (t.popup.onbeforeunload = null, t.popup.close(), t.popup = null);
}
const k = Symbol("LookingGlassXRWebGLLayer");
class Ce extends ue {
  constructor(i, e, r) {
    super(i, e, r);
    const n = L();
    n.appCanvas = e.canvas, n.lkgCanvas = document.createElement("canvas"), n.lkgCanvas.tabIndex = 0;
    const s = n.lkgCanvas.getContext("2d", { alpha: !1 });
    n.lkgCanvas.addEventListener("dblclick", function() {
      this.requestFullscreen();
    });
    const o = this[de].config, c = e.createTexture();
    let f, x;
    const E = e.createFramebuffer(), v = e.enable.bind(e), a = e.disable.bind(e), l = e.getExtension("OES_vertex_array_object"), u = 34229, d = l ? l.bindVertexArrayOES.bind(l) : e.bindVertexArray.bind(e);
    (o.depth || o.stencil) && (o.depth && o.stencil ? x = {
      format: e.DEPTH_STENCIL,
      attachment: e.DEPTH_STENCIL_ATTACHMENT
    } : o.depth ? x = {
      format: e.DEPTH_COMPONENT16,
      attachment: e.DEPTH_ATTACHMENT
    } : o.stencil && (x = {
      format: e.STENCIL_INDEX8,
      attachment: e.STENCIL_ATTACHMENT
    }), f = e.createRenderbuffer());
    const w = () => {
      const C = e.getParameter(e.TEXTURE_BINDING_2D);
      if (e.bindTexture(e.TEXTURE_2D, c), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, n.framebufferWidth, n.framebufferHeight, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.bindTexture(e.TEXTURE_2D, C), f) {
        const F = e.getParameter(e.RENDERBUFFER_BINDING);
        e.bindRenderbuffer(e.RENDERBUFFER, f), e.renderbufferStorage(e.RENDERBUFFER, x.format, n.framebufferWidth, n.framebufferHeight), e.bindRenderbuffer(e.RENDERBUFFER, F);
      }
    };
    w(), n.addEventListener("on-config-changed", w);
    const T = e.getParameter(e.FRAMEBUFFER_BINDING);
    e.bindFramebuffer(e.FRAMEBUFFER, E), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, c, 0), (o.depth || o.stencil) && e.framebufferRenderbuffer(e.FRAMEBUFFER, x.attachment, e.RENDERBUFFER, f), e.bindFramebuffer(e.FRAMEBUFFER, T);
    const m = e.createProgram(), p = e.createShader(e.VERTEX_SHADER), h = e.createShader(e.FRAGMENT_SHADER);
    if (m === null || p === null || h === null) {
      console.error("there was a problem with shader construction");
      return;
    }
    e.attachShader(m, p), e.attachShader(m, h);
    {
      const C = `
       attribute vec2 a_position;
       varying vec2 v_texcoord;
       void main() {
         gl_Position = vec4(a_position * 2.0 - 1.0, 0.0, 1.0);
         v_texcoord = a_position;
       }
     `;
      e.shaderSource(p, C), e.compileShader(p), e.getShaderParameter(p, e.COMPILE_STATUS) || console.warn(e.getShaderInfoLog(p));
    }
    let P, S, _;
    const b = () => {
      const C = oe(n);
      if (C === P)
        return;
      if (P = C, e.shaderSource(h, C), e.compileShader(h), !e.getShaderParameter(h, e.COMPILE_STATUS)) {
        console.warn(e.getShaderInfoLog(h));
        return;
      }
      if (e.linkProgram(m), !e.getProgramParameter(m, e.LINK_STATUS)) {
        console.warn(e.getProgramInfoLog(m));
        return;
      }
      S = e.getAttribLocation(m, "a_position"), _ = e.getUniformLocation(m, "u_viewType");
      const F = e.getUniformLocation(m, "u_texture"), M = e.getParameter(e.CURRENT_PROGRAM);
      e.useProgram(m), e.uniform1i(F, 0), e.useProgram(M);
    };
    n.addEventListener("on-config-changed", b);
    const R = l ? l.createVertexArrayOES() : e.createVertexArray(), H = e.createBuffer(), O = e.getParameter(e.ARRAY_BUFFER_BINDING), q = e.getParameter(u);
    d(R), e.bindBuffer(e.ARRAY_BUFFER, H), e.bufferData(e.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]), e.STATIC_DRAW), e.enableVertexAttribArray(S), e.vertexAttribPointer(S, 2, e.FLOAT, !1, 0, 0), d(q), e.bindBuffer(e.ARRAY_BUFFER, O);
    const Y = () => {
      console.assert(this[k].LookingGlassEnabled), e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer);
      const C = e.getParameter(e.COLOR_CLEAR_VALUE), F = e.getParameter(e.DEPTH_CLEAR_VALUE), M = e.getParameter(e.STENCIL_CLEAR_VALUE);
      e.clearColor(0, 0, 0, 0), e.clearDepth(1), e.clearStencil(0), e.clear(e.DEPTH_BUFFER_BIT | e.COLOR_BUFFER_BIT | e.STENCIL_BUFFER_BIT), e.clearColor(C[0], C[1], C[2], C[3]), e.clearDepth(F), e.clearStencil(M);
    }, j = () => {
      if (!this[k].LookingGlassEnabled || n.appCanvas == null || n.lkgCanvas == null)
        return;
      (n.appCanvas.width !== n.framebufferWidth || n.appCanvas.height !== n.framebufferHeight) && (n.appCanvas.width, n.appCanvas.height, n.appCanvas.width = n.framebufferWidth, n.appCanvas.height = n.framebufferHeight);
      const C = e.getParameter(u), F = e.getParameter(e.CULL_FACE), M = e.getParameter(e.BLEND), z = e.getParameter(e.DEPTH_TEST), K = e.getParameter(e.STENCIL_TEST), $ = e.getParameter(e.SCISSOR_TEST), A = e.getParameter(e.VIEWPORT), Z = e.getParameter(e.FRAMEBUFFER_BINDING), Q = e.getParameter(e.RENDERBUFFER_BINDING), J = e.getParameter(e.CURRENT_PROGRAM), ee = e.getParameter(e.ACTIVE_TEXTURE);
      {
        const te = e.getParameter(e.TEXTURE_BINDING_2D);
        e.bindFramebuffer(e.FRAMEBUFFER, null), e.useProgram(m), d(R), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, c), e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.STENCIL_TEST), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight), e.uniform1i(_, 0), e.drawArrays(e.TRIANGLES, 0, 6), s == null || s.clearRect(0, 0, n.lkgCanvas.width, n.lkgCanvas.height), s == null || s.drawImage(n.appCanvas, 0, 0, n.framebufferWidth, n.framebufferHeight, 0, 0, n.calibration.screenW.value, n.calibration.screenH.value), n.inlineView !== 0 && (n.capturing && n.appCanvas.width !== n.framebufferWidth && (n.appCanvas.width = n.framebufferWidth, n.appCanvas.height = n.framebufferHeight, e.viewport(0, 0, n.framebufferHeight, n.framebufferWidth)), e.uniform1i(_, n.inlineView), e.drawArrays(e.TRIANGLES, 0, 6)), e.bindTexture(e.TEXTURE_2D, te);
      }
      e.activeTexture(ee), e.useProgram(J), e.bindRenderbuffer(e.RENDERBUFFER, Q), e.bindFramebuffer(e.FRAMEBUFFER, Z), e.viewport(A[0], A[1], A[2], A[3]), ($ ? v : a)(e.SCISSOR_TEST), (K ? v : a)(e.STENCIL_TEST), (z ? v : a)(e.DEPTH_TEST), (M ? v : a)(e.BLEND), (F ? v : a)(e.CULL_FACE), d(C);
    };
    window.addEventListener("unload", () => {
      n.popup && n.popup.close(), n.popup = null;
    }), b(), this[k] = {
      LookingGlassEnabled: !1,
      framebuffer: E,
      clearFramebuffer: Y,
      blitTextureToDefaultFramebufferIfNeeded: j,
      moveCanvasToWindow: ge
    };
  }
  get framebuffer() {
    return this[k].LookingGlassEnabled ? this[k].framebuffer : null;
  }
  get framebufferWidth() {
    return L().framebufferWidth;
  }
  get framebufferHeight() {
    return L().framebufferHeight;
  }
}
class Re extends le {
  constructor(i) {
    super(i), this.sessions = /* @__PURE__ */ new Map(), this.viewSpaces = [], this.basePoseMatrix = g.create(), this.inlineProjectionMatrix = g.create(), this.inlineInverseViewMatrix = g.create(), this.LookingGlassProjectionMatrices = [], this.LookingGlassInverseViewMatrices = [];
  }
  onBaseLayerSet(i, e) {
    const r = this.sessions.get(i);
    r.baseLayer = e;
    const n = L(), s = e[k];
    s.LookingGlassEnabled = r.immersive, r.immersive && (n.XRSession = this.sessions.get(i), n.popup == null ? s.moveCanvasToWindow(!0, () => {
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
    const r = i !== "inline", n = new Le(i, e);
    return this.sessions.set(n.id, n), r && this.dispatchEvent("@@webxr-polyfill/vr-present-start", n.id), Promise.resolve(n.id);
  }
  requestAnimationFrame(i) {
    return this.global.requestAnimationFrame(i);
  }
  cancelAnimationFrame(i) {
    this.global.cancelAnimationFrame(i);
  }
  onFrameStart(i, e) {
    const r = this.sessions.get(i), n = L();
    if (r.immersive) {
      const s = Math.tan(0.5 * n.fovy), o = 0.5 * n.targetDiam / s, c = o - n.targetDiam, f = this.basePoseMatrix;
      g.fromTranslation(f, [n.targetX, n.targetY, n.targetZ]), g.rotate(f, f, n.trackballX, [0, 1, 0]), g.rotate(f, f, -n.trackballY, [1, 0, 0]), g.translate(f, f, [0, 0, o]);
      for (let E = 0; E < n.numViews; ++E) {
        const v = (E + 0.5) / n.numViews - 0.5, a = Math.tan(n.viewCone * v), l = o * a, u = this.LookingGlassInverseViewMatrices[E] = this.LookingGlassInverseViewMatrices[E] || g.create();
        g.translate(u, f, [l, 0, 0]), g.invert(u, u);
        const d = Math.max(c + e.depthNear, 0.01), w = c + e.depthFar, T = d * s, m = T, p = -T, h = d * -a, P = n.aspect * T, S = h + P, _ = h - P, b = this.LookingGlassProjectionMatrices[E] = this.LookingGlassProjectionMatrices[E] || g.create();
        g.set(b, 2 * d / (S - _), 0, 0, 0, 0, 2 * d / (m - p), 0, 0, (S + _) / (S - _), (m + p) / (m - p), -(w + d) / (w - d), -1, 0, 0, -2 * w * d / (w - d), 0);
      }
      r.baseLayer[k].clearFramebuffer();
    } else {
      const s = r.baseLayer.context, o = s.drawingBufferWidth / s.drawingBufferHeight;
      g.perspective(this.inlineProjectionMatrix, e.inlineVerticalFieldOfView, o, e.depthNear, e.depthFar), g.fromTranslation(this.basePoseMatrix, [0, B, 0]), g.invert(this.inlineInverseViewMatrix, this.basePoseMatrix);
    }
  }
  onFrameEnd(i) {
    this.sessions.get(i).baseLayer[k].blitTextureToDefaultFramebufferIfNeeded();
  }
  async requestFrameOfReferenceTransform(i, e) {
    const r = g.create();
    switch (i) {
      case "viewer":
      case "local":
        return g.fromTranslation(r, [0, -B, 0]), r;
      case "local-floor":
        return r;
      default:
        throw new Error("XRReferenceSpaceType not understood");
    }
  }
  endSession(i) {
    const e = this.sessions.get(i);
    e.immersive && e.baseLayer && (e.baseLayer[k].moveCanvasToWindow(!1), this.dispatchEvent("@@webxr-polyfill/vr-present-end", i)), e.ended = !0;
  }
  doesSessionSupportReferenceSpace(i, e) {
    const r = this.sessions.get(i);
    return r.ended ? !1 : r.enabledFeatures.has(e);
  }
  getViewSpaces(i) {
    if (i === "immersive-vr") {
      const e = L();
      for (let r = this.viewSpaces.length; r < e.numViews; ++r)
        this.viewSpaces[r] = new xe(r);
      return this.viewSpaces.length = e.numViews, this.viewSpaces;
    }
  }
  getViewport(i, e, r, n, s) {
    if (s === void 0) {
      const c = this.sessions.get(i).baseLayer.context;
      n.x = 0, n.y = 0, n.width = c.drawingBufferWidth, n.height = c.drawingBufferHeight;
    } else {
      const o = L(), c = s % o.quiltWidth, f = Math.floor(s / o.quiltWidth);
      n.x = o.framebufferWidth / o.quiltWidth * c, n.y = o.framebufferHeight / o.quiltHeight * f, n.width = o.framebufferWidth / o.quiltWidth, n.height = o.framebufferHeight / o.quiltHeight;
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
  getInputPose(i, e, r) {
    return null;
  }
  onWindowResize() {
  }
}
let Te = 0;
class Le {
  constructor(i, e) {
    y(this, "mode");
    y(this, "immersive");
    y(this, "id");
    y(this, "baseLayer");
    y(this, "inlineVerticalFieldOfView");
    y(this, "ended");
    y(this, "enabledFeatures");
    this.mode = i, this.immersive = i === "immersive-vr" || i === "immersive-ar", this.id = ++Te, this.baseLayer = null, this.inlineVerticalFieldOfView = Math.PI * 0.5, this.ended = !1, this.enabledFeatures = e;
  }
}
class xe extends ce {
  constructor(e) {
    super();
    y(this, "viewIndex");
    this.viewIndex = e;
  }
  get eye() {
    return "none";
  }
  _onPoseUpdate(e) {
    this._inverseBaseMatrix = e._getViewMatrixByIndex(this.viewIndex);
  }
}
class U extends re {
  constructor(e) {
    super();
    y(this, "vrButton");
    y(this, "device");
    y(this, "isPresenting", !1);
    N(e), this.loadPolyfill();
  }
  static async init(e) {
    new U(e);
  }
  async loadPolyfill() {
    this.overrideDefaultVRButton(), console.warn('Looking Glass WebXR "polyfill" overriding native WebXR API.');
    for (const e in X)
      this.global[e] = X[e];
    this.global.XRWebGLLayer = Ce, this.injected = !0, this.device = new Re(this.global), this.xr = new ae(Promise.resolve(this.device)), Object.defineProperty(this.global.navigator, "xr", {
      value: this.xr,
      configurable: !0
    });
  }
  async overrideDefaultVRButton() {
    this.vrButton = await _e("VRButton"), this.vrButton && this.device && (this.device.addEventListener("@@webxr-polyfill/vr-present-start", () => {
      this.isPresenting = !0, this.updateVRButtonUI();
    }), this.device.addEventListener("@@webxr-polyfill/vr-present-end", () => {
      this.isPresenting = !1, this.updateVRButtonUI();
    }), this.vrButton.addEventListener("click", (e) => {
      this.updateVRButtonUI();
    }), this.updateVRButtonUI());
  }
  async updateVRButtonUI() {
    if (this.vrButton) {
      await Se(100), this.isPresenting ? this.vrButton.innerHTML = "EXIT LOOKING GLASS" : this.vrButton.innerHTML = "ENTER LOOKING GLASS";
      const e = 220;
      this.vrButton.style.width = `${e}px`, this.vrButton.style.left = `calc(50% - ${e / 2}px)`;
    }
  }
  update(e) {
    N(e);
  }
}
async function _e(t) {
  return new Promise((i, e) => {
    const r = new MutationObserver(function(n) {
      n.forEach(function(s) {
        s.addedNodes.forEach(function(o) {
          const c = o;
          c.id == t && (i(c), r.disconnect());
        });
      });
    });
    r.observe(document.body, { subtree: !1, childList: !0 }), setTimeout(() => {
      r.disconnect(), e(`id:${t} not found`);
    }, 5e3);
  });
}
function Se(t) {
  return new Promise((i) => setTimeout(i, t));
}
const Xe = L();
export {
  Xe as LookingGlassConfig,
  U as LookingGlassWebXRPolyfill
};
