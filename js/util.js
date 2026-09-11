/* =====================================================================
   Small shared helpers. Everything hangs off window.STUNITY (aliased A).
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY = window.STUNITY || {};

  A.$ = function (sel, root) { return (root || document).querySelector(sel); };
  A.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  A.clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };

  function mq(q) { return !!(window.matchMedia && window.matchMedia(q).matches); }
  A.reducedMotion = function () { return mq('(prefers-reduced-motion: reduce)'); };
  // A real cursor: the lens follows it and the work list shows a floating preview.
  A.canHover = function () { return mq('(hover: hover) and (pointer: fine)'); };

  // Private browsing can throw on any storage access; a lost preference is fine.
  A.store = {
    get: function (k) { try { return localStorage.getItem('stunity-tech.' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('stunity-tech.' + k, v); } catch (e) { /* ignore */ } }
  };

  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  A.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };

  A.debounce = function (fn, ms) {
    var t;
    return function () { var args = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, args); }, ms); };
  };

  var toastTimer;
  A.toast = function (msg) {
    var t = A.$('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  };

  A.copy = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  };
  // file:// is not a secure context, so the Clipboard API is missing there.
  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  /* ---------- colour: shared by the craft device, inspector and lab ---------- */

  // Returns [r, g, b, a] from '#rgb', '#rrggbb' or 'rgb()/rgba()', else null.
  A.parseColor = function (str) {
    if (!str) return null;
    str = String(str).trim();
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(str);
    if (m) {
      var h = m[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    m = /^rgba?\(([^)]+)\)$/i.exec(str);
    if (m) {
      var p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);
      if (p.length < 3) return null;
      return [Math.round(p[0]), Math.round(p[1]), Math.round(p[2]), p.length > 3 ? p[3] : 1];
    }
    return null;
  };

  A.toHex = function (c) {
    return '#' + c.slice(0, 3).map(function (v) { return ('0' + A.clamp(v, 0, 255).toString(16)).slice(-2); }).join('').toUpperCase();
  };

  // WCAG 2.x relative luminance.
  A.luminance = function (c) {
    var ch = c.slice(0, 3).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };

  A.contrast = function (a, b) {
    var la = A.luminance(a), lb = A.luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  };

  A.grade = function (ratio) {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA large';
    return 'fails';
  };

  // Calls cb(el) once, the first time each element scrolls into view.
  A.onVisible = function (els, cb, rootMargin) {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); }
      });
    }, { rootMargin: rootMargin || '0px 0px -12% 0px' });
    els.forEach(function (el) { io.observe(el); });
  };
})();
