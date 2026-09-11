/* =====================================================================
   Page-wide effects that aren't a section of their own:
     · decode    — mono labels scramble into place as they appear
     · paint     — section headings are drawn as outlines, then painted in
     · spotlight — .spot cards pick up an accent edge under the cursor
     · vitals    — the footer reports this page's real load, measured in
                   the visitor's browser (time, files, bytes, third parties)
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

  // Works on a text node so markup beside it (the eyebrow's pulse dot) survives.
  function decode(node) {
    var text = node.nodeValue;
    if (!text || !text.trim() || A.reducedMotion()) return;
    var t0 = performance.now(), dur = 600 + text.length * 14, last = 0;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      if (p >= 1) { node.nodeValue = text; return; }
      // ~28 swaps a second: fast enough to read as scrambling, slow enough to see
      if (now - last > 35) {
        last = now;
        var settled = Math.floor(p * text.length), out = '';
        for (var i = 0; i < text.length; i++) {
          var ch = text[i];
          out += i < settled || /[\s—·-]/.test(ch) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        node.nodeValue = out;
      }
      requestAnimationFrame(tick);
    })(t0);
  }
  function lastText(el) {
    for (var n = el.lastChild; n; n = n.previousSibling) if (n.nodeType === 3 && n.nodeValue.trim()) return n;
    return null;
  }

  function initDecode() {
    A.onVisible(A.$$('.sec-num, .contact-direct .k'), function (el) { var n = lastText(el); if (n) decode(n); });
    // The x-ray has already cloned the hero by now, so its copy stays unscrambled.
    var eb = A.$('#heroFinal .eyebrow');
    if (eb && lastText(eb)) decode(lastText(eb));
  }

  // The sweep itself is CSS (.sec-head.in h2). Afterwards the heading goes back
  // to plain solid text, so Inspect mode reads a real colour, not "transparent".
  function initPaint() {
    A.onVisible(A.$$('.sec-head'), function (head) {
      var h2 = A.$('h2', head);
      if (h2) setTimeout(function () { h2.classList.add('painted'); }, A.reducedMotion() ? 0 : 1900);
    });
  }

  function initSpotlight() {
    if (!A.canHover()) return;
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot');
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
    }, { passive: true });
  }

  function initVitals() {
    var out = A.$('#vitals');
    if (!out || !window.performance || !performance.getEntriesByType) return;

    function measure() {
      var nav = performance.getEntriesByType('navigation')[0];
      var res = performance.getEntriesByType('resource');
      var bytes = (nav && nav.encodedBodySize) || 0, foreign = 0;
      res.forEach(function (r) {
        bytes += r.encodedBodySize || 0;
        try { if (new URL(r.name, location.href).origin !== location.origin) foreign++; } catch (e) { /* odd URL; not ours to count */ }
      });
      var ms = nav ? (nav.loadEventEnd || nav.domContentLoadedEventEnd) : 0;
      var parts = [], files = res.length + 1;
      if (ms) parts.push('loaded in ' + (ms / 1000).toFixed(2) + ' s');
      // Opened from disk, the browser records no timings or sizes for the
      // other files — leave those out rather than report "1 file, 25 KB".
      if (location.protocol !== 'file:') {
        parts.push(files + ' file' + (files === 1 ? '' : 's'));
        if (bytes) parts.push(Math.round(bytes / 1024) + ' KB over the wire');
      }
      parts.push(document.getElementsByTagName('*').length.toLocaleString('en-US') + ' elements');
      parts.push(foreign + ' third-party request' + (foreign === 1 ? '' : 's'));
      out.innerHTML = '<span class="v-dot" aria-hidden="true"></span>Measured in your browser just now: ' + A.esc(parts.join(' · '));
    }
    if (document.readyState === 'complete') setTimeout(measure, 0);
    else window.addEventListener('load', function () { setTimeout(measure, 0); });
  }

  A.initEffects = function () {
    initDecode();
    initPaint();
    initSpotlight();
    initVitals();
  };
})();
