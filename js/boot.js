/* =====================================================================
   Boot: page-wide behaviour (reveals, nav state, the scroll ruler,
   magnetic buttons) and then every section's init. Each init runs in its
   own try/catch — one broken section must not take the rest down.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function initReveals() {
    A.onVisible(A.$$('.reveal'), function (el) { el.classList.add('in'); });
  }

  function initNav() {
    var nav = A.$('#nav'), links = A.$$('.nav-links a');
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 20); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    A.$$('main > section[id]').forEach(function (s) { io.observe(s); });
  }

  // Where you are on the page, in pixels.
  function initRuler() {
    var mark = A.$('#rulerMark'), readout = A.$('#rulerReadout');
    if (!mark) return;
    var ticking = false;
    function update() {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? window.scrollY / max : 0;
      mark.style.setProperty('--ry', (p * (window.innerHeight - 2)).toFixed(1) + 'px');
      readout.textContent = 'y ' + Math.round(window.scrollY).toLocaleString('en-US');
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Primary buttons lean toward the cursor a little.
  function initMagnets() {
    if (!A.canHover() || A.reducedMotion()) return;
    A.$$('.btn-accent').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.style.transform = 'translate(' + (dx * 0.22).toFixed(1) + 'px,' + (dy * 0.32).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  function start() {
    [
      ['theme', A.initTheme], ['contact', A.initContact], ['reveals', initReveals], ['nav', initNav],
      ['ruler', initRuler], ['magnets', initMagnets], ['xray', A.initXray], ['inspect', A.initInspect],
      ['assembly', A.initAssembly], ['clinic', A.initClinic], ['revamp', A.initRevamp], ['lab', A.initLab],
      ['work', A.initWork], ['story', A.initStory]
    ].forEach(function (step) {
      try { if (step[1]) step[1](); } catch (e) {
        // Degrade, never crash: the section keeps its static markup.
        if (window.console) console.warn('[stunity] ' + step[0] + ' failed to start:', e);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
