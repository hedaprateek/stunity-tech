/* =====================================================================
   The Lab: three utilities that run entirely in the browser.
     · List cleaner     — trim, fix capitals, normalise phones, dedupe
     · Contrast checker — WCAG ratios, with a suggested fix when it fails
     · Image shrinker   — resize and re-encode a photo with canvas
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  /* ---------- tabs ---------- */
  function initTabs() {
    var tabs = A.$$('.lab-tabs [role="tab"]');
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        A.$('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (d) { select(tabs[(i + d + tabs.length) % tabs.length], true); e.preventDefault(); }
      });
    });
  }

  /* ---------- list cleaner ---------- */
  function cleanOne(raw, opt) {
    var v = raw.trim().replace(/\s+/g, ' ');
    var digits = v.replace(/\D/g, '');
    if (/@/.test(v)) return { text: v.toLowerCase().replace(/\s/g, ''), key: v.toLowerCase().replace(/\s/g, '') };
    if (/^[\d\s+().-]+$/.test(v) && digits.length >= 10) {
      var ten = digits.length === 12 && digits.indexOf('91') === 0 ? digits.slice(2) : digits.length === 11 && digits[0] === '0' ? digits.slice(1) : digits;
      var text = opt.phone && ten.length === 10 ? '+91 ' + ten.slice(0, 5) + ' ' + ten.slice(5) : v;
      return { text: text, key: ten };
    }
    var name = opt.caps ? v.toLowerCase().replace(/(^|[\s'-])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }) : v;
    return { text: name, key: v.toLowerCase() };
  }

  function initCleaner() {
    var input = A.$('#cleanIn'), out = A.$('#cleanOut'), stat = A.$('#cleanStat');
    if (!input) return;
    var result = '';

    function run() {
      var opt = { dedupe: A.$('#optDedupe').checked, caps: A.$('#optCase').checked, sort: A.$('#optSort').checked, phone: A.$('#optPhone').checked };
      var lines = input.value.split(/\r?\n/), blanks = 0, dupes = 0, seen = {}, rows = [];
      lines.forEach(function (raw) {
        if (!raw.trim()) { blanks++; return; }
        var c = cleanOne(raw, opt);
        if (opt.dedupe && seen[c.key]) { dupes++; return; }
        seen[c.key] = true;
        rows.push({ text: c.text, fixed: c.text !== raw });
      });
      if (opt.sort) rows.sort(function (a, b) { return a.text.localeCompare(b.text); });
      result = rows.map(function (r) { return r.text; }).join('\n');
      out.innerHTML = rows.map(function (r, i) {
        return '<span class="ln' + (r.fixed ? ' fixed' : '') + '" style="animation-delay:' + (i * 30) + 'ms">' + A.esc(r.text) + (r.fixed ? '<span class="t">← fixed</span>' : '') + '</span>';
      }).join('');
      var inCount = lines.length - blanks;
      stat.innerHTML = inCount + ' in → <b>' + rows.length + ' out</b>' + (dupes ? ' · ' + dupes + ' duplicate' + (dupes > 1 ? 's' : '') : '') + (blanks ? ' · ' + blanks + ' blank' + (blanks > 1 ? 's' : '') : '') + ' removed';
    }

    input.addEventListener('input', A.debounce(run, 140));
    A.$$('#panel-clean input[type="checkbox"]').forEach(function (c) { c.addEventListener('change', run); });
    A.$('#cleanCopy').addEventListener('click', function () {
      A.copy(result).then(function (ok) { A.toast(ok ? 'Copied ' + result.split('\n').length + ' clean lines' : 'Couldn\'t copy — select the text and copy it yourself'); });
    });
    run();
  }

  /* ---------- contrast checker ---------- */
  function mix(c, to, t) { return c.slice(0, 3).map(function (v, i) { return Math.round(v + (to[i] - v) * t); }).concat(1); }

  // Nudge the text colour toward black or white until it passes AA.
  function suggest(fg, bg) {
    var to = A.luminance(bg) > 0.18 ? [0, 0, 0] : [255, 255, 255];
    for (var t = 0.02; t <= 1; t += 0.02) {
      var c = mix(fg, to, t);
      if (A.contrast(c, bg) >= 4.5) return c;
    }
    return to.concat(1);
  }

  function initContrast() {
    var fgPick = A.$('#fgPick'), bgPick = A.$('#bgPick'), fgHex = A.$('#fgHex'), bgHex = A.$('#bgHex');
    if (!fgPick) return;
    var preview = A.$('#contrastPreview'), ratioEl = A.$('#ratio'), verdicts = A.$('#verdicts');
    var CHECKS = [
      ['Body text', 'AA · 4.5 : 1', 4.5], ['Large text', 'AA · 3 : 1', 3],
      ['Body text', 'AAA · 7 : 1', 7], ['Large text', 'AAA · 4.5 : 1', 4.5],
      ['Icons & borders', 'UI · 3 : 1', 3]
    ];

    function render() {
      var fg = A.parseColor(fgHex.value), bg = A.parseColor(bgHex.value);
      if (!fg || !bg) return;
      var r = A.contrast(fg, bg);
      preview.style.background = A.toHex(bg);
      preview.style.color = A.toHex(fg);
      ratioEl.textContent = r.toFixed(2);
      var html = CHECKS.map(function (c) {
        var pass = r >= c[2];
        return '<li><span>' + c[0] + '<small>' + c[1] + '</small></span><span class="verdict ' + (pass ? 'pass' : 'fail') + '">' + (pass ? 'PASS' : 'FAIL') + '</span></li>';
      }).join('');
      if (r < 4.5) {
        var s = A.toHex(suggest(fg, bg));
        html += '<li class="contrast-tip">Body text fails. The closest passing shade is <b>' + s + '</b>.<br><button type="button" data-fix="' + s + '">Use ' + s + '</button></li>';
      }
      verdicts.innerHTML = html;
    }

    function sync(pick, hex) {
      pick.addEventListener('input', function () { hex.value = pick.value; render(); });
      hex.addEventListener('input', function () {
        var v = hex.value.trim();
        if (v[0] !== '#') v = '#' + v;
        if (/^#[0-9a-f]{6}$/i.test(v)) { pick.value = v.toLowerCase(); render(); }
      });
    }
    sync(fgPick, fgHex);
    sync(bgPick, bgHex);

    A.$('#swapColors').addEventListener('click', function () {
      var f = fgHex.value; fgHex.value = bgHex.value; bgHex.value = f;
      fgPick.value = fgHex.value; bgPick.value = bgHex.value;
      render();
    });
    verdicts.addEventListener('click', function (e) {
      var fix = e.target.getAttribute && e.target.getAttribute('data-fix');
      if (!fix) return;
      fgHex.value = fix.toLowerCase(); fgPick.value = fix.toLowerCase();
      render();
      A.toast('Fixed — that now passes AA');
    });
    render();
  }

  /* ---------- image shrinker ---------- */
  function bytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(0) + ' KB';
    return (n / 1048576).toFixed(2) + ' MB';
  }

  function initShrinker() {
    var input = A.$('#shrinkFile'), drop = A.$('#drop');
    if (!input) return;
    var result = A.$('#shrinkResult'), img = A.$('#shrinkImg'), save = A.$('#shrinkSave');
    var q = A.$('#quality'), w = A.$('#maxW');
    var source = null, file = null, outUrl = null;

    function compress() {
      if (!source) return;
      var scale = Math.min(1, +w.value / Math.max(source.naturalWidth, source.naturalHeight));
      var cw = Math.max(1, Math.round(source.naturalWidth * scale)), ch = Math.max(1, Math.round(source.naturalHeight * scale));
      var canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      var ctx = canvas.getContext('2d');
      // JPEG has no transparency; paint white so PNG cut-outs don't turn black.
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(source, 0, 0, cw, ch);
      canvas.toBlob(function (blob) {
        if (!blob) { A.toast('This browser couldn\'t re-encode that image.'); return; }
        if (outUrl) URL.revokeObjectURL(outUrl);
        outUrl = URL.createObjectURL(blob);
        img.src = outUrl;
        save.href = outUrl;
        save.download = file.name.replace(/\.[^.]+$/, '') + '-small.jpg';
        A.$('#sizeBefore').textContent = bytes(file.size);
        A.$('#sizeAfter').textContent = bytes(blob.size);
        var saved = 1 - blob.size / file.size;
        A.$('#sizeSaved').textContent = saved > 0
          ? Math.round(saved * 100) + '% smaller · ' + cw + ' × ' + ch + 'px'
          : 'Already lean — this one doesn\'t need shrinking.';
      }, 'image/jpeg', +q.value / 100);
    }

    function load(f) {
      if (!f || !/^image\//.test(f.type)) { A.toast('That isn\'t an image — try a JPG or PNG.'); return; }
      file = f;
      var url = URL.createObjectURL(f), im = new Image();
      im.onload = function () { source = im; result.hidden = false; compress(); };
      im.onerror = function () { A.toast('Couldn\'t read that image.'); URL.revokeObjectURL(url); };
      im.src = url;
    }

    input.addEventListener('change', function () { load(input.files[0]); });
    ['dragenter', 'dragover'].forEach(function (t) { drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (t) { drop.addEventListener(t, function () { drop.classList.remove('over'); }); });
    drop.addEventListener('drop', function (e) { e.preventDefault(); load(e.dataTransfer.files[0]); });

    var rerun = A.debounce(compress, 120);
    q.addEventListener('input', function () { A.$('#qVal').textContent = q.value; rerun(); });
    w.addEventListener('input', function () { A.$('#wVal').textContent = w.value; rerun(); });
  }

  A.initLab = function () {
    initTabs();
    initCleaner();
    initContrast();
    initShrinker();
  };
})();
