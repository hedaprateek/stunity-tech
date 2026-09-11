/* =====================================================================
   Before/after slider over the legacy and revamped screens. Drag anywhere
   on it, or focus the handle and use the arrow keys.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  A.initRevamp = function () {
    var box = A.$('#compare'), handle = A.$('#compareHandle');
    if (!box || !handle) return;
    var pos = 50, dragging = false;

    function set(p) {
      pos = A.clamp(p, 0, 100);
      box.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
      handle.setAttribute('aria-valuetext', Math.round(pos) + '% old screen');
    }
    function fromEvent(e) {
      var r = box.getBoundingClientRect();
      set((e.clientX - r.left) / r.width * 100);
    }

    box.addEventListener('pointerdown', function (e) {
      dragging = true;
      box.classList.add('dragging');
      try { box.setPointerCapture(e.pointerId); } catch (err) { /* older browsers */ }
      fromEvent(e);
    });
    box.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
      box.addEventListener(t, function () { dragging = false; box.classList.remove('dragging'); });
    });

    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 20 : 5, map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
      if (e.key in map) { set(pos + map[e.key]); e.preventDefault(); }
      else if (e.key === 'Home') { set(0); e.preventDefault(); }
      else if (e.key === 'End') { set(100); e.preventDefault(); }
    });

    // A one-time sweep when it first scrolls in, so people know it moves.
    if (A.reducedMotion()) return;
    A.onVisible([box], function () {
      var keys = [[0, 50], [650, 18], [1400, 82], [2100, 50]], t0 = performance.now();
      (function tick(now) {
        if (dragging) return;
        var t = now - t0, i = 0;
        while (i < keys.length - 1 && t > keys[i + 1][0]) i++;
        if (i >= keys.length - 1) { set(50); return; }
        var a = keys[i], b = keys[i + 1], p = (t - a[0]) / (b[0] - a[0]);
        var eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        set(a[1] + (b[1] - a[1]) * eased);
        requestAnimationFrame(tick);
      })(t0);
    }, '0px 0px -30% 0px');
  };
})();
