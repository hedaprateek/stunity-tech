/* =====================================================================
   Work: the project index. With a cursor, a preview of the hovered project
   floats beside it and leans with the movement; on touch screens the same
   preview sits inline in each row. Edit PROJECTS to add or change work —
   the "Products shipped" figure in the hero counts this list.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function nailsPreview() {
    var shades = ['#B5364B', '#E8A0A8', '#7A1F2B', '#D9B38C', '#2E2A3A'];
    return '<div class="pv pv-nails"><span class="pv-brand">Tinted <em>Nails</em></span>' +
      '<div class="nails">' + shades.map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join('') + '</div>' +
      '<div class="shades">' + shades.concat(['#C98B6B']).map(function (c) { return '<b style="--c:' + c + '"></b>'; }).join('') + '</div></div>';
  }

  function societyPreview() {
    var rows = '';
    [['#6C8EBF', 62], ['#D9A441', 48], ['#7FB08A', 70]].forEach(function (r) {
      rows += '<div class="row"><i style="background:' + r[0] + '"></i><span style="width:' + r[1] + 'px"></span><em>Call</em></div>';
    });
    return '<div class="pv pv-soc"><div class="xl"><span>data.xlsx</span></div><div class="flow" aria-hidden="true">→</div>' +
      '<div class="phone"><div class="hd">Society Directory</div><div class="sos">Emergency · Security · Lift</div>' + rows + '</div></div>';
  }

  function heirloomPreview() {
    function card(x, y, w, gold) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="24" rx="5" fill="#FFFDF7" stroke="' + (gold ? '#B8892E' : '#8B6B4A') + '" stroke-width="' + (gold ? 2 : 1.2) + '"/>' +
        '<rect x="' + (x + 7) + '" y="' + (y + 8) + '" width="' + (w - 14) + '" height="3" rx="1.5" fill="#6B4F35"/>' +
        '<rect x="' + (x + 7) + '" y="' + (y + 14) + '" width="' + (w - 22) + '" height="2.5" rx="1.25" fill="#C9B79C"/>';
    }
    return '<div class="pv pv-heirloom"><svg viewBox="0 0 300 180" aria-hidden="true">' +
      '<text x="16" y="24" font-family="Georgia, serif" font-style="italic" font-size="15" fill="#6B4F35">Heirloom</text>' +
      '<g fill="none" stroke="#8B6B4A" stroke-width="1.4" stroke-linecap="round">' +
      '<path d="M122 52 H178 M150 52 V84 M70 84 H230 M70 84 V100 M150 84 V100 M230 84 V100"/>' +
      '<path d="M230 124 V140 M205 140 H255 M205 140 V150 M255 140 V150"/></g>' +
      card(82, 40, 40) + card(178, 40, 40) + card(50, 100, 40) + card(130, 100, 40, true) + card(210, 100, 40) +
      card(185, 150, 40) + card(235, 150, 40) +
      '<path d="M150 64 l3 3 -3 3 -3 -3z" fill="#B8892E"/></svg></div>';
  }

  var PROJECTS = [
    {
      title: 'Heirloom',
      desc: 'A family tree you build by hand and print as a poster — anything from A4 to a six-sheet A1. A guided start for first-timers, remarriages and adoptions handled properly, and names you can speak instead of type. One self-contained HTML file.',
      tags: ['Print-ready posters', 'Voice input', 'Single file', 'Works offline'],
      url: 'https://hedaprateek.github.io/heirloom-family-tree/',
      preview: heirloomPreview()
    },
    {
      title: 'Tinted Nails',
      desc: 'A brand site for a hand-painted press-on nail studio. Tap any of ten shades and the whole page re-tints; a three-tap shade finder, nail art drawn in SVG, a size ruler that prints at true millimetres, and orders that land in WhatsApp.',
      tags: ['Brand site', 'Live re-theming', 'SVG artwork', 'WhatsApp orders'],
      url: 'https://hedaprateek.github.io/tinted-nails/',
      preview: nailsPreview()
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
      title: 'Society Directory',
      desc: 'A mobile-friendly directory for a housing society — committee, emergency numbers, service contacts, residents and documents. There is no database: the committee\'s Excel file is the data, kept up to date from a small admin page.',
      tags: ['Excel as the database', 'Admin page', 'Cloudflare', 'Installable app'],
      url: 'https://society-info.hedaprateek.workers.dev/',
      preview: societyPreview()
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
    // The hero's count comes from this list, so it can't drift from it.
    var stat = A.$('#statProducts');
    if (stat) { stat.setAttribute('data-count', PROJECTS.length); stat.textContent = PROJECTS.length; }

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

    var cur = { x: 0, y: 0, rot: 0 }, target = { x: 0, y: 0 }, ticking = false, shown = -1;
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
