/* =====================================================================
   The personal section: career as a git log, skills as a config file,
   and the awards. All of it from Prateek's résumé — edit the data below
   when something changes.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  // Newest first, like git log. cls: head | branch | tag
  var LOG = [
    { cls: 'head', h: 'a1f9e02', ref: '(HEAD → ink-it)', ty: 'feat:', msg: 'UI Lead at Ink IT Solutions', when: 'Aug 2025 – now', sub: 'Leading UI across CRM tools; rebuilt a legacy Struts app\'s screens with the backend left untouched.' },
    { cls: 'branch', h: '5c7d3aa', ref: '(stunity-tech)', ty: 'feat:', msg: 'Stunity Tech, after hours', when: 'ongoing', sub: 'Report cards for schools, an IPO tracker, ParDarshi, a solar business site, project-starter.' },
    { h: '7c3d1b8', ty: 'feat:', msg: 'Senior UI Lead at UST', when: 'Nov 2021 – Jul 2025', sub: 'Led 14 developers across Angular, React and Node projects; primary UI contact for clients.' },
    { cls: 'tag', msg: 'tag: 3× HiLife & HiFi awards', when: 'Hitachi' },
    { h: '51be0aa', ty: 'feat:', msg: 'Senior Consultant at Hitachi Vantara', when: 'Jun 2019 – Nov 2021', sub: 'Full-stack for a major US education client, several projects running at once.' },
    { cls: 'tag', msg: 'tag: ACE award · 2× Best Mentor', when: 'Accenture' },
    { h: '2e8f4c1', ty: 'refactor:', msg: 'Java → Angular, went full-stack', when: 'Accenture', sub: 'Took the front end on as well as the backend across multiple projects.' },
    { h: '0d4a7e9', ty: 'init:', msg: 'Java Developer at Accenture', when: 'Jan 2013', sub: '6+ enterprise projects.' },
    { h: '9b1c3f0', ty: 'chore:', msg: 'Trainee engineer at Chroma Energy', when: '2012', sub: 'Embedded code, PCB design and circuit debugging for solar trackers.' },
    { h: '3f0a11c', ty: 'research:', msg: 'SiPM detector optimisation, TIFR Mumbai', when: 'research', sub: 'Silvaco and LTSpice, for a cosmic-ray study.' }
  ];

  var AWARDS = [
    ['ACE', 'ACE Award', 'Accenture\'s highest honour for individual contribution'],
    ['3×', 'HiLife & HiFi Awards', 'Hitachi Vantara, within two years'],
    ['2×', 'Best Mentor', 'In a single year, for growing the people around me'],
    ['508', 'Accessibility & SEO', 'Recognised by clients for compliance work'],
    ['Doc', 'Splunk Basics guide', 'Recognised by senior leadership globally']
  ];

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
    var log = A.$('#gitlog'), code = A.$('#configCode'), awards = A.$('#awards');

    if (log) {
      log.innerHTML = LOG.map(function (c) {
        var line = c.cls === 'tag'
          ? '<span class="msg">' + A.esc(c.msg) + '</span> <span class="when">· ' + A.esc(c.when) + '</span>'
          : '<span class="h">' + c.h + '</span> ' + (c.ref ? '<span class="ref">' + A.esc(c.ref) + '</span> ' : '') +
            '<span class="ty">' + c.ty + '</span> <span class="msg">' + A.esc(c.msg) + '</span> <span class="when">· ' + A.esc(c.when) + '</span>' +
            (c.sub ? '<span class="sub">' + A.esc(c.sub) + '</span>' : '');
        return '<li class="' + (c.cls || '') + '"><span class="g"><i></i></span><span>' + line + '</span></li>';
      }).join('');
      A.onVisible([log], function () {
        A.$$('li', log).forEach(function (li, i) { setTimeout(function () { li.classList.add('in'); }, i * 110); });
      });
    }

    if (code) {
      code.innerHTML = CONFIG.map(function (l, i) { return '<span class="cl" style="transition-delay:' + (i * 45) + 'ms">' + l + '</span>'; }).join('');
      A.onVisible([code], function () { code.classList.add('in'); });
    }

    if (awards) {
      awards.innerHTML = AWARDS.map(function (a) {
        return '<li><span class="aw-n">' + A.esc(a[0]) + '</span><span><b>' + A.esc(a[1]) + '</b><small>' + A.esc(a[2]) + '</small></span></li>';
      }).join('');
    }

    A.onVisible(A.$$('[data-count]'), countUp, '0px');
  };
})();
