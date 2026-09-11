/* =====================================================================
   Work: the project index. With a cursor, a preview of the hovered project
   floats beside it and leans with the movement; on touch screens the same
   preview sits inline in each row. Edit PROJECTS to add or change work.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function reportPreview() {
    var cells = '';
    for (var i = 0; i < 20; i++) cells += '<i' + ((i % 4 === 3 && i % 3 !== 0) ? ' class="g"' : '') + '></i>';
    return '<div class="pv pv-report"><div class="sheet"><div class="hd"></div><div class="sb"></div><div class="grid">' + cells + '</div></div><div class="stamp">A+</div></div>';
  }

  var PROJECTS = [
    {
      title: 'Academy Dashboard',
      desc: 'Everything for one class, in one place: report cards from Pre-Primary to College, fees and receipts, certificates, ID cards and timetables. Imported from Excel, printed or saved as PDF, and it works offline.',
      tags: ['Offline web app', 'Excel import', 'Print & PDF', 'Vanilla JS'],
      url: 'https://hedaprateek.github.io/report-generator/',
      preview: reportPreview()
    },
    {
      title: 'IPO Tracker',
      desc: 'Open, upcoming and recently closed IPOs, mainboard and SME, with category-wise subscription, a GMP trend that builds itself, and an apply-or-avoid read on every live issue. The data refreshes every 30 minutes.',
      tags: ['Live data', 'GitHub Actions', 'Node', 'AI reports'],
      url: 'https://hedaprateek.github.io/ipo-tracker/',
      preview: '<div class="pv pv-ipo"><div class="row"><span>GMP · SME</span><span class="chip apply">APPLY</span></div>' +
        '<svg viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true"><path d="M0 90 L30 84 L60 88 L90 70 L120 74 L150 52 L180 58 L210 36 L240 40 L270 22 L300 18 L300 110 L0 110Z" fill="rgba(61,220,132,.14)"/><polyline points="0,90 30,84 60,88 90,70 120,74 150,52 180,58 210,36 240,40 270,22 300,18" fill="none" stroke="#3DDC84" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>' +
        '<div class="row"><span class="big">+₹42</span><span class="chip avoid">2 AVOID</span></div></div>'
    },
    {
      title: 'ParDarshi',
      desc: 'A working demonstration of end-to-end transparency for public money in India: every rupee traced from taxpayer to the last mile, with acknowledgements, a 1% deviation rule and public show-cause notices. All data is synthetic.',
      tags: ['Concept demo', 'Data visualisation', 'Civic tech'],
      url: 'https://hedaprateek.github.io/pardarshi/',
      preview: '<div class="pv pv-chain"><svg viewBox="0 0 300 150" aria-hidden="true"><g fill="none" stroke-width="2.5" stroke-linecap="round">' +
        '<path d="M36 75 L104 38 L180 38 L262 75" stroke="#3DDC84"/><path d="M104 38 L104 112 L180 112" stroke="#3DDC84"/><path d="M180 112 L262 75" stroke="#FF5C6C" stroke-dasharray="6 6"/></g>' +
        '<g fill="#0B1512" stroke-width="2.5"><circle cx="36" cy="75" r="12" stroke="#3DDC84"/><circle cx="104" cy="38" r="10" stroke="#3DDC84"/><circle cx="180" cy="38" r="10" stroke="#3DDC84"/><circle cx="104" cy="112" r="10" stroke="#3DDC84"/><circle cx="180" cy="112" r="10" stroke="#FF5C6C"/><circle cx="262" cy="75" r="12" stroke="#3DDC84"/></g>' +
        '<text x="180" y="140" fill="#FF5C6C" font-size="10" font-family="monospace" text-anchor="middle">show-cause</text><text x="36" y="104" fill="#7FA89A" font-size="10" font-family="monospace" text-anchor="middle">₹ in</text></svg></div>'
    },
    {
      title: 'Solar business site',
      desc: 'A multi-page site for a solar sales & services business: services, a project gallery, a system-size estimator, quote forms and a direct WhatsApp line.',
      tags: ['Business website', 'Estimator', 'Mobile-first'],
      url: 'https://hedaprateek.github.io/solar-website/',
      preview: '<div class="pv pv-solar"><div class="sun"></div><div class="panels"></div></div>'
    },
    {
      title: 'project-starter',
      desc: 'A head start for new software projects. One command scaffolds the code, initialises git, creates the GitHub repo and pushes — with AI briefing files, so every session starts already knowing the conventions.',
      tags: ['Developer tooling', 'PowerShell', 'Open source'],
      url: 'https://github.com/hedaprateek/project-starter',
      preview: '<div class="pv pv-starter"><div><span class="p">PS&gt;</span> .\\new.ps1 badge-maker</div><div class="d">copying templates…</div><div><span class="o">✓</span> CLAUDE.md · /ship · /verify</div><div><span class="o">✓</span> git init · gh repo create</div><div><span class="o">✓</span> pushed. Pages is live.</div></div>'
    }
  ];

  A.initWork = function () {
    var list = A.$('#workList'), float = A.$('#workFloat');
    if (!list) return;

    list.innerHTML = PROJECTS.map(function (p, i) {
      return '<li class="work-item"><a href="' + A.esc(p.url) + '" target="_blank" rel="noopener" data-i="' + i + '">' +
        '<span class="w-num">' + ('0' + (i + 1)).slice(-2) + '</span>' +
        '<span class="w-main"><span class="w-title">' + A.esc(p.title) + '</span>' +
        '<span class="w-desc">' + A.esc(p.desc) + '</span>' +
        '<span class="w-tags">' + p.tags.map(function (t) { return '<span>' + A.esc(t) + '</span>'; }).join('') + '</span>' +
        '<span class="w-preview" aria-hidden="true">' + p.preview + '</span></span>' +
        '<span class="w-go" aria-hidden="true">→</span></a></li>';
    }).join('');

    if (!float || !A.canHover()) return;

    var cur = { x: 0, y: 0, rot: 0 }, target = { x: 0, y: 0 }, lastX = 0, ticking = false, shown = -1;
    var reduce = A.reducedMotion();

    function frame() {
      ticking = false;
      var k = reduce ? 1 : 0.14;
      var dx = target.x - cur.x;
      cur.x += dx * k;
      cur.y += (target.y - cur.y) * k;
      cur.rot += (A.clamp(dx * 0.05, -9, 9) - cur.rot) * 0.2;
      float.style.setProperty('--fx', cur.x.toFixed(1) + 'px');
      float.style.setProperty('--fy', cur.y.toFixed(1) + 'px');
      float.style.setProperty('--rot', (reduce ? 0 : cur.rot).toFixed(2) + 'deg');
      if (Math.abs(dx) + Math.abs(target.y - cur.y) + Math.abs(cur.rot) > 0.3) kick();
    }
    function kick() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

    list.addEventListener('pointermove', function (e) {
      var w = float.offsetWidth, h = float.offsetHeight;
      // sit to the right of the cursor, or flip left near the edge
      var x = e.clientX + 36;
      if (x + w > window.innerWidth - 40) x = e.clientX - w - 36;
      target.x = x;
      target.y = A.clamp(e.clientY - h / 2, 80, window.innerHeight - h - 16);
      if (shown === -1) { cur.x = target.x; cur.y = target.y; }
      lastX = e.clientX;
      var a = e.target.closest('a[data-i]');
      if (a) {
        var i = +a.getAttribute('data-i');
        if (i !== shown) { float.innerHTML = PROJECTS[i].preview; shown = i; }
        float.classList.add('on');
      }
      kick();
    });
    list.addEventListener('pointerleave', function () { float.classList.remove('on'); shown = -1; });
  };
})();
