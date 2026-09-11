/* =====================================================================
   The fix-it clinic: pick a symptom and a prescription prints out of the
   "printer". "Book this fix" carries the symptom into the contact form.
   Edit SYMPTOMS to change what the clinic offers.
   ===================================================================== */
(function () {
  'use strict';
  var A = window.STUNITY;

  var SYMPTOMS = [
    {
      label: 'Our website looks like it\'s from 2009',
      diagnosis: 'The site works, but it doesn\'t earn trust — and visitors decide in under a second.',
      treatment: ['Find out what people actually come to the site for', 'Redesign it mobile-first around those few things', 'Rebuild it as fast, light pages', 'Hand it over so you can edit the text yourself'],
      time: '2–4 weeks',
      proof: { text: 'A solar business site, live', url: 'https://hedaprateek.github.io/solar-website/' },
      topic: 'A new website'
    },
    {
      label: 'We redo the same Excel sheet every week',
      diagnosis: 'A repetitive job that a small tool could do in seconds.',
      treatment: ['Map what goes into the sheet and what has to come out', 'Build a tool that imports your Excel as it is today', 'Output print- and PDF-ready documents', 'Show your staff how to use it in fifteen minutes'],
      time: '1–3 weeks',
      proof: { text: 'Report Generator — a class\'s marks sheet in, printed report cards out', url: 'https://hedaprateek.github.io/report-generator/' },
      topic: 'A custom tool or utility'
    },
    {
      label: 'Our site is slow, and nobody finds it on Google',
      diagnosis: 'Nearly always heavy photos, scripts that block the page, and missing basics like page titles and descriptions.',
      treatment: ['Measure speed and SEO before touching anything', 'Compress and resize images, trim scripts', 'Fix titles, descriptions and structured data', 'Measure again and show you the difference'],
      time: '3–7 days',
      proof: { text: 'Try the image shrinker in the Lab', url: '#lab' },
      topic: 'Speed, SEO or accessibility'
    },
    {
      label: 'The old system works, but staff hate using it',
      diagnosis: 'Your backend is fine. The screens are the problem.',
      treatment: ['Keep your server, database and business rules exactly as they are', 'Redesign the screens around the tasks people do every day', 'Rebuild the front end on the same endpoints', 'Roll out screen by screen, with no big-bang switchover'],
      time: 'Depends on the screens — we\'ll count them together',
      proof: { text: 'See the before/after — this is my day job', url: '#revamp' },
      topic: 'Revamp an old system'
    },
    {
      label: 'Something broke and nobody knows why',
      diagnosis: 'An error nobody has read yet. There is almost always a log that says what happened.',
      treatment: ['Reproduce the problem', 'Read the logs and errors — I\'ve run Splunk and Kibana at enterprise scale', 'Fix the cause, not the symptom', 'Write down what happened so it doesn\'t come back'],
      time: 'Often the same day',
      topic: 'Fix something that\'s broken'
    },
    {
      label: 'We need a small tool, not a giant product',
      diagnosis: 'You need one job done well, without a monthly subscription.',
      treatment: ['One screen, one job, done properly', 'Runs in the browser and works offline', 'Your data stays on your own machine', 'No monthly fees, ever'],
      time: 'Days, not months',
      proof: { text: 'Three of them are running in the Lab', url: '#lab' },
      topic: 'A custom tool or utility'
    },
    {
      label: 'We have data but can\'t see what it\'s telling us',
      diagnosis: 'The numbers are in rows and the decisions are made in the dark.',
      treatment: ['Pick the three numbers that actually matter', 'Build a dashboard that refreshes itself', 'Flag the moment something changes'],
      time: '1–3 weeks',
      proof: { text: 'IPO Tracker — refreshes itself every 30 minutes', url: 'https://hedaprateek.github.io/ipo-tracker/' },
      topic: 'A custom tool or utility'
    },
    {
      label: 'Our forms and pages aren\'t accessible',
      diagnosis: 'Low contrast, missing labels, no keyboard path — and, for some clients, a legal risk.',
      treatment: ['Audit against WCAG 2.x', 'Fix contrast, labels, focus order and screen-reader names', 'Check it with a keyboard and a real screen reader', 'I\'ve delivered 508 compliance for clients before'],
      time: '1–2 weeks',
      proof: { text: 'Check your own colours in the Lab', url: '#lab' },
      topic: 'Speed, SEO or accessibility'
    },
    {
      label: 'Domain, email, hosting — it\'s all a mess',
      diagnosis: 'Accounts are scattered, renewals are expiring, and nobody really owns any of it.',
      treatment: ['List what you have and where it lives', 'Move the site to reliable (often free) hosting', 'Set up professional email on your own domain', 'Give you one page listing every login and renewal date'],
      time: '1–3 days',
      topic: 'Something else'
    }
  ];

  var ticket = 41;

  function receiptHTML(s) {
    ticket++;
    var now = new Date();
    var when = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
               now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var proof = '';
    if (s.proof) {
      var ext = /^https?:/.test(s.proof.url);
      proof = '<span class="rc-k">PROOF</span><span class="rc-v"><a href="' + A.esc(s.proof.url) + '"' +
              (ext ? ' target="_blank" rel="noopener"' : '') + '>' + A.esc(s.proof.text) + (ext ? ' ↗' : ' ↓') + '</a></span>';
    }
    return '<h4>STUNITY TECH</h4>' +
      '<p class="rc-sub">Diagnosis #00' + ticket + ' · ' + A.esc(when) + '</p><hr>' +
      '<span class="rc-k">SYMPTOM</span><span class="rc-v">“' + A.esc(s.label) + '”</span>' +
      '<span class="rc-k">DIAGNOSIS</span><span class="rc-v"><strong>' + A.esc(s.diagnosis) + '</strong></span>' +
      '<span class="rc-k">TREATMENT</span><ol>' + s.treatment.map(function (t) { return '<li>' + A.esc(t) + '</li>'; }).join('') + '</ol>' +
      '<span class="rc-k">TYPICAL TIME</span><span class="rc-v">' + A.esc(s.time) + '</span>' +
      proof + '<hr><div class="barcode" aria-hidden="true"></div>' +
      '<p class="rc-foot">The first conversation is free.</p>' +
      '<button class="rc-book" type="button">Book this fix →</button>';
  }

  A.initClinic = function () {
    var list = A.$('#symptoms'), receipt = A.$('#receipt'), printer = A.$('.printer');
    if (!list || !receipt) return;
    var busy;

    list.innerHTML = SYMPTOMS.map(function (s, i) {
      return '<button class="sym" type="button" aria-pressed="false" data-i="' + i + '"><span class="n">' + ('0' + (i + 1)).slice(-2) + '</span>' + A.esc(s.label) + '</button>';
    }).join('');

    receipt.innerHTML = '<div class="receipt-empty"><b>The printer\'s warmed up.</b>Pick a symptom, and your prescription prints here.</div>';

    list.addEventListener('click', function (e) {
      var b = e.target.closest('.sym');
      if (!b) return;
      A.$$('.sym', list).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var s = SYMPTOMS[+b.getAttribute('data-i')];
      receipt.innerHTML = receiptHTML(s);
      receipt.classList.remove('printing');
      void receipt.offsetWidth; // restart the feed animation
      receipt.classList.add('printing');
      printer.classList.add('busy');
      clearTimeout(busy);
      busy = setTimeout(function () { printer.classList.remove('busy'); }, 1250);

      A.$('.rc-book', receipt).addEventListener('click', function () {
        if (A.prefillContact) A.prefillContact(s.topic, 'Symptom: ' + s.label + '\n\n');
      });
      // On a phone the receipt is below the list; bring it into view.
      if (window.innerWidth < 900) printer.scrollIntoView({ behavior: A.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    });
  };
})();
