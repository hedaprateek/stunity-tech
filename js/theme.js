/* =====================================================================
   Light / dark theme. The switch ripples outward from the button using a
   View Transition where the browser has them; elsewhere it just switches.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    var btn = A.$('#themeToggle');
    if (btn) btn.setAttribute('aria-label', t === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    var meta = A.$('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#F3F0E8' : '#0A0B0F');
    document.dispatchEvent(new CustomEvent('stunity:theme', { detail: t }));
  }

  A.initTheme = function () {
    var btn = A.$('#themeToggle');
    apply(current());
    if (!btn) return;

    btn.addEventListener('click', function () {
      var next = current() === 'light' ? 'dark' : 'light';
      A.store.set('theme', next);
      if (!document.startViewTransition || A.reducedMotion()) { apply(next); return; }

      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var root = document.documentElement;

      // CSS colour transitions would run *inside* the new snapshot and the
      // ripple would reveal the old colours fading out, so pause them.
      root.classList.add('vt-lock');
      var vt = document.startViewTransition(function () { apply(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () { /* transition skipped; the theme still applied */ });
      vt.finished.then(unlock, unlock);
      function unlock() { root.classList.remove('vt-lock'); }
    });

    // Follow the OS setting only until the visitor makes a choice of their own.
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: light)');
      var follow = function (e) { if (!A.store.get('theme')) apply(e.matches ? 'light' : 'dark'); };
      if (mq.addEventListener) mq.addEventListener('change', follow);
    }
  };
})();
