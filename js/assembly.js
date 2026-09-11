/* =====================================================================
   Craft: the invoice screen assembles itself as the steps scroll past.
   Stage classes are cumulative (s2…s6), so CSS can layer each pass on the
   one before. At stage 6 the contrast figures are measured from the
   rendered colours, not typed in.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;
  var NAMES = ['structure', 'type', 'colour', 'depth', 'motion', 'access'];
  var TOTAL = 47200;

  A.initAssembly = function () {
    var device = A.$('#device'), steps = A.$$('.craft-step');
    if (!device || !steps.length) return;
    var amount = A.$('#dAmount'), sw = A.$('#dSwitch'), pay = A.$('#dPay');
    var stage = 0, loop = null, counted = false;

    function money(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }

    function countUp() {
      if (A.reducedMotion()) { amount.textContent = money(TOTAL); return; }
      var t0 = performance.now(), dur = 1100;
      (function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        amount.textContent = money(TOTAL * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }

    function measure() {
      var bg = A.parseColor(getComputedStyle(device).backgroundColor);
      var rows = [[amount, bg, '#cAmount'], [pay, A.parseColor(getComputedStyle(pay).backgroundColor), '#cPay']];
      rows.forEach(function (row) {
        var fg = A.parseColor(getComputedStyle(row[0]).color), out = A.$(row[2]);
        if (!fg || !row[1] || !out) return;
        var ratio = A.contrast(fg, row[1]);
        out.textContent = ratio.toFixed(1) + ':1 ' + A.grade(ratio);
      });
    }

    function setStage(n) {
      if (n === stage) return;
      var prev = stage;
      stage = n;
      device.setAttribute('data-stage', n);
      for (var k = 2; k <= 6; k++) device.classList.toggle('s' + k, n >= k);
      A.$('#dStageNum').textContent = n;
      A.$('#dStageName').textContent = NAMES[n - 1];
      steps.forEach(function (s) { s.classList.toggle('active', +s.getAttribute('data-stage') === n); });

      if (n >= 5 && prev < 5 && !counted) { counted = true; countUp(); }
      clearInterval(loop);
      if (n === 5 && !A.reducedMotion()) {
        loop = setInterval(function () {
          sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
        }, 2200);
      }
      // wait for the colour transitions to land before reading colours
      if (n === 6) { sw.setAttribute('aria-checked', 'true'); setTimeout(measure, 700); }
    }

    sw.addEventListener('click', function () {
      sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    });
    pay.addEventListener('click', function () {
      if (pay.disabled) return;
      var label = pay.textContent;
      pay.textContent = 'Sent ✓';
      pay.disabled = true;
      setTimeout(function () { pay.textContent = label; pay.disabled = false; }, 1600);
    });
    document.addEventListener('stunity:theme', function () { if (stage === 6) setTimeout(measure, 700); });

    if (!('IntersectionObserver' in window)) { setStage(6); return; }
    // A step is "current" while it crosses a thin band of the viewport: the
    // middle on wide screens; lower on phones, where the device is pinned on top.
    var narrow = window.innerWidth < 860;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setStage(+e.target.getAttribute('data-stage'));
      });
    }, { rootMargin: narrow ? '-62% 0px -30% 0px' : '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    setStage(1);
  };
})();
