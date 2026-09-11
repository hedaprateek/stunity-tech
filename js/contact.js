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
    if (credit) credit.innerHTML = '<b>' + A.esc(cfg.company) + '</b><span class="vf-dot">·</span>by ' + A.esc(cfg.author);
    var year = A.$('#year');
    if (year) year.textContent = new Date().getFullYear();
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
