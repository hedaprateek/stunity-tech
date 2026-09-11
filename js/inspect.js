/* =====================================================================
   Inspect mode (button or the I key): the whole site becomes a live
   style inspector. Hover anything to see its size, font, colours, the
   WCAG contrast of its text, padding and radius — read from the browser,
   so it can't flatter us.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;
  var on = false, box, tip, banner, btn, last = null;

  function px(v) { return Math.round(parseFloat(v) || 0); }

  function label(el) {
    var s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    var raw = typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '';
    var cls = raw.trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (cls.length) s += '.' + cls.join('.');
    return s;
  }

  // The colour actually behind the element: the first mostly-opaque background up the tree.
  function backdrop(el) {
    while (el && el.nodeType === 1) {
      var c = A.parseColor(getComputedStyle(el).backgroundColor);
      if (c && c[3] > 0.5) return c;
      el = el.parentElement;
    }
    return A.parseColor(getComputedStyle(document.body).backgroundColor) || [10, 11, 15, 1];
  }

  function fmt(c) {
    if (!c) return '—';
    return c[3] < 1 ? 'rgba(' + c.slice(0, 3).join(', ') + ', ' + (+c[3].toFixed(2)) + ')' : A.toHex(c);
  }
  function swatch(c) { return '<span class="sw" style="background:' + fmt(c) + '"></span>'; }

  function show(x, y) {
    var el = document.elementFromPoint(x, y);
    if (!el || el === document.documentElement || el === document.body || el.closest('.insp-banner, .nav-tools')) {
      box.style.visibility = tip.style.visibility = 'hidden';
      return;
    }
    box.style.visibility = tip.style.visibility = 'visible';
    var r = el.getBoundingClientRect(), s = getComputedStyle(el);
    box.style.transform = 'translate(' + r.left + 'px,' + r.top + 'px)';
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
    box.setAttribute('data-w', Math.round(r.width));
    box.setAttribute('data-h', Math.round(r.height));

    var fg = A.parseColor(s.color), bg = backdrop(el);
    var ratio = fg && bg ? A.contrast(fg, bg) : 0;
    var fam = s.fontFamily.split(',')[0].replace(/["']/g, '');
    var rows = [
      '<b>' + A.esc(label(el)) + '</b>  <span class="dim">' + Math.round(r.width) + ' × ' + Math.round(r.height) + '</span>',
      '<span class="dim">font</span> ' + A.esc(fam) + ' · ' + px(s.fontSize) + 'px · ' + s.fontWeight,
      '<span class="dim">color</span> ' + swatch(fg) + fmt(fg),
      '<span class="dim">bg</span> ' + swatch(bg) + fmt(bg),
      '<span class="dim">contrast</span> ' + ratio.toFixed(2) + ':1 · ' + A.grade(ratio) + (ratio >= 4.5 ? ' ✓' : ''),
      '<span class="dim">padding</span> ' + [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(px).join(' ')
    ];
    if (px(s.borderTopLeftRadius)) rows.push('<span class="dim">radius</span> ' + (px(s.borderTopLeftRadius) > 400 ? 'pill' : px(s.borderTopLeftRadius) + 'px'));
    tip.innerHTML = rows.join('<br>');

    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var tx = x + 18, ty = y + 18;
    if (tx + tw > window.innerWidth - 12) tx = x - tw - 18;
    if (ty + th > window.innerHeight - 12) ty = y - th - 18;
    tip.style.transform = 'translate(' + Math.max(8, tx) + 'px,' + Math.max(8, ty) + 'px)';
  }

  function build() {
    if (box) return;
    box = document.createElement('div'); box.className = 'insp-box';
    tip = document.createElement('div'); tip.className = 'insp-tip';
    banner = document.createElement('div'); banner.className = 'insp-banner';
    banner.textContent = 'INSPECT MODE · hover anything · Esc to leave';
    [box, tip, banner].forEach(function (n) { n.setAttribute('aria-hidden', 'true'); document.body.appendChild(n); });
  }

  function set(state) {
    on = state;
    build();
    document.documentElement.classList.toggle('inspecting', on);
    if (btn) btn.setAttribute('aria-pressed', String(on));
    // the banner says how to leave; a toast would sit on top of it
    if (on) box.style.visibility = tip.style.visibility = 'hidden';
  }

  A.initInspect = function () {
    btn = A.$('#inspectToggle');
    if (btn) btn.addEventListener('click', function () { set(!on); });

    document.addEventListener('keydown', function (e) {
      var t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (e.key === 'Escape' && on) { set(false); return; }
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'i' || e.key === 'I')) set(!on);
    });

    document.addEventListener('pointermove', function (e) {
      if (!on) return;
      last = { x: e.clientX, y: e.clientY };
      show(last.x, last.y);
    }, { passive: true });

    window.addEventListener('scroll', function () { if (on && last) show(last.x, last.y); }, { passive: true });

    // Like a devtools picker: clicks inspect instead of navigating.
    document.addEventListener('click', function (e) {
      if (!on || (btn && btn.contains(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
      last = { x: e.clientX, y: e.clientY };
      show(last.x, last.y);
    }, true);
  };
})();
