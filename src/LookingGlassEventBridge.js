// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement#events
export const DOM_EVENTS = [
  // ClipboardEvent
  'copy',
  'cut',
  'paste',
  'invalid',
  // AnimationEvent
  'animationcancel',
  'animationend',
  'animationiteration',
  'animationstart',
  // InputEvent
  'beforeinput',
  'input',
  'change',
  // PointerEvent
  'gotpointercapture',
  'lostpointercapture',
  'pointercancel',
  'pointerdown',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointerout',
  'pointerover',
  'pointerup',
  // MouseEvent
  'click',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseup',
  // Wheel Event
  'mousewheel',
  'wheel',
  // TouchEvent
  'touchcancel',
  'touchend',
  'touchmove',
  'touchstart',
  // DragEvent
  'drag',
  'dragend',
  'dragenter',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  // TransitionEvent
  'transitioncancel',
  'transitionend',
  'transitionrun',
  'transitionstart',
  // FocusEvent
  'blur',
  'focus',
  'focusin',
  'focusout',
  // KeyboardEvent
  'keydown',
  'keypress',
  'keyup',
  // Event
  'fullscreenchange',
  'fullscreenerror'
];

/**
 * Forwards DOM events between two elements.
 */
export function forwardEvents(sourceElement, targetElement) {
  // Binds bridge listeners
  const listeners = new Map();
  for (const type of DOM_EVENTS) {
    const listener = (event) => targetElement.dispatchEvent(new event.constructor(event.type, event));
    sourceElement.addEventListener(type, listener);
    listeners.set(type, listener);
  }

  // Returns a cleanup function to unbind listeners
  return () => {
    for (const [type, listener] of listeners) {
      sourceElement.removeEventListener(type, listener);
      listeners.delete(type);
    }
  };
}
