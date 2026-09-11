/* =====================================================================
   The hero x-ray. The finished headline is cloned into a blueprint layer
   that sits on top, clipped to a circle under the cursor. The annotations
   in that layer are read from the real computed styles, so what the lens
   shows is the page's actual CSS, not a picture of it.

   With no cursor (phones, tablets) the lens drifts through the headline on
   its own, and a finger can steer it.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  var CODE = [
    '<span class="c">/* what the lens sees */</span>',
    '.hero-title {',
    '  font-size: clamp(58px, 12.2vw, 168px);',
    '  line-height: .88;',
    '  letter-spacing: -.058em;',
    '}',
    '.hero-title em {',
    '  font-family: var(--f-serif);',
    '  color: var(--accent);',
    '}'
  ].join('\n');

  function px(v) { return Math.round(parseFloat(v)); }

  A.initXray = function () {
    var hero = A.$('#top'), stage = A.$('#heroStage'), final = A.$('#heroFinal'), ring = A.$('#lensRing');
    if (!hero || !stage || !final || !ring) return;

    /* ---------- build the blueprint layer ---------- */
    var xray = document.createElement('div');
    xray.className = 'hero-xray';
    xray.setAttribute('aria-hidden', 'true');
    var inner = document.createElement('div');
    inner.className = 'xray-inner';
    var clone = final.cloneNode(true);
    clone.classList.remove('hero-final');
    clone.removeAttribute('id');
    A.$$('[id]', clone).forEach(function (el) { el.removeAttribute('id'); });
    A.$$('a, button', clone).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
    inner.appendChild(clone);
    var code = document.createElement('pre');
    code.className = 'code-ghost';
    code.innerHTML = CODE;
    inner.appendChild(code);
    var marks = document.createElement('div');
    inner.appendChild(marks);
    xray.appendChild(inner);
    stage.insertBefore(xray, ring);

    /* ---------- annotations from real computed styles ---------- */
    function annotate() {
      var base = final.getBoundingClientRect();
      var html = '';
      function rel(el) {
        var r = el.getBoundingClientRect();
        return { l: r.left - base.left, t: r.top - base.top, r: r.right - base.left, b: r.bottom - base.top, w: r.width, h: r.height };
      }
      function tag(x, y, text) {
        html += '<span class="spec-tag" style="left:' + Math.round(x) + 'px;top:' + Math.round(y) + 'px">' + text + '</span>';
      }
      function redline(x, y1, y2) {
        var h = Math.round(y2 - y1);
        if (h < 6) return;
        html += '<span class="redline" style="left:' + Math.round(x) + 'px;top:' + Math.round(y1) + 'px;height:' + h + 'px"><span>' + h + 'px</span></span>';
      }
      var dot = ' <i>·</i> ';

      var eb = A.$('.eyebrow', final), h1 = A.$('.hero-title', final), first = A.$('.ht-line > span', final),
          em = A.$('em', final), lede = A.$('.hero-lede', final), ctas = A.$('.hero-ctas', final);
      var s, r;

      if (eb) {
        r = rel(eb); s = getComputedStyle(eb);
        tag(r.r + 14, r.t - 3, 'p.eyebrow' + dot + 'mono ' + px(s.fontSize) + 'px' + dot + 'tracking ' + (parseFloat(s.letterSpacing) / parseFloat(s.fontSize)).toFixed(2) + 'em');
      }
      if (h1 && first) {
        s = getComputedStyle(h1);
        var fr = rel(first);
        tag(fr.r + 18, fr.t + fr.h * 0.3, 'h1' + dot + px(s.fontSize) + 'px / ' + (parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2) + dot + s.fontWeight + dot + (parseFloat(s.letterSpacing) / parseFloat(s.fontSize)).toFixed(3) + 'em');
        if (eb) redline(-14, rel(eb).b, rel(h1).t);
      }
      if (em) {
        r = rel(em); s = getComputedStyle(em);
        var c = A.parseColor(s.color);
        tag(r.r + 14, r.t + r.h * 0.42, 'em' + dot + 'serif italic' + dot + (c ? A.toHex(c) : s.color));
      }
      if (lede) {
        r = rel(lede); s = getComputedStyle(lede);
        tag(r.l, r.b + 7, 'p' + dot + px(s.fontSize) + 'px / ' + (parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2) + dot + 'max ' + px(s.maxWidth) + 'px');
        if (h1) redline(-14, rel(h1).b, r.t);
      }
      if (ctas && ctas.lastElementChild) {
        var btn = ctas.firstElementChild, last = rel(ctas.lastElementChild);
        s = getComputedStyle(btn);
        tag(last.r + 14, last.t + last.h / 2 - 9, '.btn' + dot + 'h ' + px(s.height) + dot + 'radius ' + (px(s.borderTopLeftRadius) > 200 ? 'pill' : px(s.borderTopLeftRadius)) + dot + 'gap ' + px(getComputedStyle(ctas).columnGap));
      }
      marks.innerHTML = html;
    }

    annotate();
    // The title lines rise in over ~1.2s; measure again once they've landed.
    setTimeout(annotate, 1500);
    window.addEventListener('resize', A.debounce(annotate, 150));

    /* ---------- the lens ---------- */
    var canHover = A.canHover(), reduce = A.reducedMotion();
    var hint = A.$('.hero-hint');
    if (hint && !canHover) hint.textContent = 'Touch the headline — the lens shows the real CSS underneath it.';
    var cur = { x: 0, y: 0, r: 0 }, target = { x: 0, y: 0, r: 0 };
    var ticking = false, visible = true, lastTouch = -1e9, t0 = performance.now();

    function radius() { return A.clamp(window.innerWidth * 0.2, 90, 170); }
    function drifting(now) { return !canHover && !reduce && visible && now - lastTouch > 2600; }

    function frame(now) {
      ticking = false;
      if (drifting(now)) {
        // a slow figure-of-eight through the headline
        var sr = stage.getBoundingClientRect(), t = (now - t0) / 1000;
        target.x = sr.left + sr.width * (0.45 + 0.32 * Math.sin(t * 0.45));
        target.y = sr.top + sr.height * (0.4 + 0.2 * Math.sin(t * 0.9));
        target.r = radius() * 0.85;
      }
      if (cur.r < 1) { cur.x = target.x; cur.y = target.y; } // appear in place, don't sweep in
      cur.x += (target.x - cur.x) * 0.2;
      cur.y += (target.y - cur.y) * 0.2;
      cur.r += (target.r - cur.r) * 0.16;
      if (target.r === 0 && cur.r < 0.5) cur.r = 0;

      var xr = xray.getBoundingClientRect();
      xray.style.setProperty('--x', (cur.x - xr.left).toFixed(1) + 'px');
      xray.style.setProperty('--y', (cur.y - xr.top).toFixed(1) + 'px');
      xray.style.setProperty('--r', cur.r.toFixed(1) + 'px');
      ring.style.transform = 'translate(' + cur.x.toFixed(1) + 'px,' + cur.y.toFixed(1) + 'px)';
      ring.style.setProperty('--r', cur.r.toFixed(1) + 'px');
      ring.classList.toggle('on', cur.r > 4);

      var moving = Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) + Math.abs(target.r - cur.r) > 0.4;
      if (moving || drifting(now)) kick();
    }
    function kick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

    function aim(e, r) {
      var xr = xray.getBoundingClientRect();
      var inside = e.clientY >= xr.top && e.clientY <= xr.bottom;
      target.x = e.clientX;
      target.y = e.clientY;
      target.r = inside ? r : 0;
      kick();
    }

    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') aim(e, radius());
      else { lastTouch = performance.now(); aim(e, radius() * 0.85); }
    });
    hero.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') { lastTouch = performance.now(); aim(e, radius() * 0.85); }
    });
    hero.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') { target.r = 0; kick(); }
    });
    // The page moves under a still cursor; keep the clip in register.
    window.addEventListener('scroll', function () { if (cur.r > 0) kick(); }, { passive: true });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) kick();
      }).observe(hero);
    }
    if (!canHover && !reduce) kick();
  };
})();
