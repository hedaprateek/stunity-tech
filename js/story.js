/* =====================================================================
   The personal section: skills as a config file, typed in line by line,
   plus the hero's counting stats. From Prateek's résumé — edit CONFIG
   when something changes.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function st(s) { return '<span class="st">\'' + A.esc(s) + '\'</span>'; }
  function arr(list) { return '<span class="pu">[</span>' + list.map(st).join('<span class="pu">, </span>') + '<span class="pu">]</span>'; }
  function prop(k, v, comment) {
    return '  <span class="pr">' + k + '</span><span class="pu">:</span> ' + v + '<span class="pu">,</span>' + (comment ? ' <span class="co">// ' + A.esc(comment) + '</span>' : '');
  }

  var CONFIG = [
    '<span class="co">// the short version</span>',
    '<span class="kw">export const</span> prateek <span class="pu">=</span> <span class="pu">{</span>',
    prop('role', st('UI Technical Lead')),
    prop('experience', st('12+ years'), 'since 2013'),
    prop('frontend', arr(['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'])),
    prop('ui', arr(['Tailwind', 'Material UI', 'Kendo UI', 'Bootstrap'])),
    prop('backend', arr(['Node.js', 'Java', 'REST APIs']), 'Java: 5+ years'),
    prop('data', arr(['PostgreSQL', 'MongoDB', 'Oracle', 'SQL'])),
    prop('practices', arr(['Accessibility (508 / WCAG)', 'SEO', 'Performance', 'Legacy UI modernisation'])),
    prop('domains', arr(['Banking', 'Finance', 'Insurance', 'E-Learning', 'E-Commerce', 'CRM'])),
    prop('aiAssisted', '<span class="kw">true</span>', 'Copilot, Cursor, LLM assistants'),
    prop('leads', '<span class="nu">14</span>', 'developers, at the largest'),
    prop('speaks', arr(['English', 'Hindi', 'Marathi', 'Marwari', 'Italian (learning)'])),
    prop('offline', arr(['cricket', 'table tennis', 'travel', 'food'])),
    '<span class="pu">};</span>'
  ];

  function countUp(el) {
    var end = +el.getAttribute('data-count');
    if (A.reducedMotion()) { el.textContent = end; return; }
    var t0 = performance.now(), dur = 1400;
    (function tick(now) {
      var p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  A.initStory = function () {
    var code = A.$('#configCode');
    if (code) {
      code.innerHTML = CONFIG.map(function (l, i) { return '<span class="cl" style="transition-delay:' + (i * 45) + 'ms">' + l + '</span>'; }).join('');
      A.onVisible([code], function () { code.classList.add('in'); });
    }
    A.onVisible(A.$$('[data-count]'), countUp, '0px');
  };
})();
