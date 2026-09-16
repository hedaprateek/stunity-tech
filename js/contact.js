/* =====================================================================
   Contact details from config.js, the studio credit, and the enquiry
   form. There is no server: the form opens WhatsApp or the mail app with
   the message already written.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  function fillConfig(cfg) {
    A.$$('[data-cfg]').forEach(function (el) {
      var v = cfg[el.getAttribute('data-cfg')];
      if (v) el.textContent = v;
    });
    A.$$('[data-cfg-href]').forEach(function (el) {
      var v = cfg[el.getAttribute('data-cfg-href')];
      if (v) el.href = v;
    });
    A.$$('[data-cfg-mail]').forEach(function (el) { el.href = 'mailto:' + cfg.email; });
    A.$$('[data-cfg-wa]').forEach(function (el) { el.href = 'https://wa.me/' + cfg.whatsapp; });

    var credit = A.$('#vendorFooter');
    /* The name is the trigger for the contact card; everything in it comes
       from config.js, so a new number stays a one-line edit. */
    if (credit) {
      credit.innerHTML =
        '<span class="sc-wrap">' +
          '<a class="sc-link" href="#contact">' + '<b>' + A.esc(cfg.company) + '</b>' + '</a>' +
          '<span class="sc-card" role="note">' +
            '<b>' + A.esc(cfg.company) + '</b>' +
            '<i>Small tools, built one at a time.</i>' +
            '<span class="sc-acts">' +
              '<a href="#contact">Say hello</a>' +
              '<a href="mailto:' + A.esc(cfg.email) + '">Email</a>' +
              '<a href="https://wa.me/' + A.esc(cfg.whatsapp) + '" target="_blank" rel="noopener">WhatsApp</a>' +
            '</span>' +
          '</span>' +
        '</span>' +
        '<span class="vf-dot">·</span>by ' + A.esc(cfg.author);
      initCreditCard();
    }
    var year = A.$('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* Portals the card to <body> while open: position:fixed alone is not
     enough, because a transformed ancestor becomes the containing block
     for fixed descendants. Pointer devices open on hover, touch on tap. */
  function initCreditCard() {
    var M = 10, GAP = 12, T = null;
    var fine = !window.matchMedia || matchMedia('(hover:hover) and (pointer:fine)').matches;
    var list = document.querySelectorAll('.sc-wrap');
    if (!list.length) return;
    function isOpen(w) { return !!w.__scCard && w.__scCard.parentElement === document.body; }
    function show(w) {
      var c = w.__scCard; if (!c) return;
      clearTimeout(T);
      if (c.parentElement !== document.body) document.body.appendChild(c);
      c.style.position = 'fixed'; c.style.bottom = 'auto'; c.style.right = 'auto';
      c.style.transform = 'none'; c.style.opacity = '1';
      c.style.visibility = 'visible'; c.style.pointerEvents = 'auto';
      c.style.maxWidth = (innerWidth - M * 2) + 'px';
      c.style.left = '0px'; c.style.top = '0px';
      var t = w.getBoundingClientRect(), r = c.getBoundingClientRect();
      var x = Math.max(M, Math.min(t.left + t.width / 2 - r.width / 2, innerWidth - r.width - M));
      var y = t.top - r.height - GAP, below = false;
      if (y < M) { y = t.bottom + GAP; below = true; }
      c.classList.toggle('sc-below', below);
      c.style.left = Math.round(x) + 'px'; c.style.top = Math.round(y) + 'px';
    }
    function hide(w) {
      var c = w.__scCard; if (!c) return;
      c.removeAttribute('style'); c.classList.remove('sc-below');
      if (c.parentElement === document.body) w.appendChild(c);
    }
    function arm(w) { clearTimeout(T); T = setTimeout(function () { hide(w); }, 120); }
    Array.prototype.forEach.call(list, function (w) {
      var c = w.querySelector('.sc-card'), a = w.querySelector('.sc-link');
      w.__scCard = c;
      if (!c) return;
      if (fine) {
        w.addEventListener('pointerenter', function () { show(w); });
        w.addEventListener('pointerleave', function () { arm(w); });
        c.addEventListener('pointerenter', function () { clearTimeout(T); });
        c.addEventListener('pointerleave', function () { arm(w); });
      } else if (a) {
        a.addEventListener('click', function (e) {
          if (!isOpen(w)) { e.preventDefault(); show(w); }
        });
        document.addEventListener('click', function (e) {
          if (isOpen(w) && !w.contains(e.target) && !c.contains(e.target)) hide(w);
        }, true);
      }
      w.addEventListener('focusin', function () { show(w); });
      w.addEventListener('focusout', function () {
        setTimeout(function () {
          if (!w.contains(document.activeElement) && !c.contains(document.activeElement)) hide(w);
        }, 0);
      });
    });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape') Array.prototype.forEach.call(list, hide);
    });
    addEventListener('scroll', function () {
      Array.prototype.forEach.call(list, function (w) { if (isOpen(w)) show(w); });
    }, { passive: true });
  }

  A.initContact = function () {
    var cfg = A.config || {};
    fillConfig(cfg);

    var form = A.$('#contactForm');
    if (!form) return;
    var name = A.$('#cName'), topic = A.$('#cTopic'), msg = A.$('#cMsg'), err = A.$('#formError');

    function compose() {
      if (!name.value.trim()) {
        err.textContent = 'Tell us your name so we know who we\'re talking to.';
        name.focus();
        return null;
      }
      err.textContent = '';
      return 'Hi Stunity Tech, I\'m ' + name.value.trim() + '.\nI need: ' + topic.value + '\n\n' + msg.value.trim();
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = compose();
      if (!text) return;
      window.open('https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
    A.$('#sendEmail').addEventListener('click', function () {
      var text = compose();
      if (!text) return;
      location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('Stunity Tech — ' + topic.value) + '&body=' + encodeURIComponent(text);
    });

    // Used by the clinic's "Book this fix".
    A.prefillContact = function (t, m) {
      A.$$('option', topic).forEach(function (o) { if (o.textContent === t) topic.value = t; });
      if (m && msg.value.indexOf(m.trim()) === -1) msg.value = m + msg.value;
      A.$('#contact').scrollIntoView({ behavior: A.reducedMotion() ? 'auto' : 'smooth' });
      setTimeout(function () { name.focus({ preventScroll: true }); }, 700);
    };
  };
})();
