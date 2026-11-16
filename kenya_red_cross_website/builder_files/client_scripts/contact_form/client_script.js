// Write your script here
/* Contact form: validation, Discard, and submit to a Frappe endpoint.
   Set the endpoint in the form's data-endpoint attribute. */
(function () {
  if (window.__cf) return;

  function start() {
    var f = document.querySelector('.cf');
    if (!f) return false;
    var status = f.querySelector('.cf-status');
    var send = f.querySelector('.cf-primary');

    function setErr(name, msg) {
      var el = f.querySelector('[name="' + name + '"]'), out = f.querySelector('[data-for="' + name + '"]');
      if (el) { if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); }
      if (out) out.textContent = msg || '';
    }
    function say(msg, kind) { status.textContent = msg || ''; status.className = 'cf-status' + (kind ? ' ' + kind : ''); }

    function validate() {
      var ok = true, v = function (n) { return (f.elements[n].value || '').trim(); };
      var rules = [
        ['full_name', v('full_name') ? '' : 'Please enter your full name.'],
        ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')) ? '' : 'Please enter a valid email address.'],
        ['phone', !v('phone') || /^[+\d][\d\s()-]{6,}$/.test(v('phone')) ? '' : 'Please enter a valid phone number.'],
        ['subject', v('subject') ? '' : 'Please enter a subject.'],
        ['message', v('message') ? '' : 'Please enter your message.']
      ];
      rules.forEach(function (r) { setErr(r[0], r[1]); if (r[1]) ok = false; });
      if (!ok) { var first = f.querySelector('[aria-invalid="true"]'); if (first) first.focus(); }
      return ok;
    }

    f.addEventListener('reset', function () {
      ['full_name', 'email', 'phone', 'subject', 'i_want_to', 'message'].forEach(function (n) { setErr(n, ''); });
      say('');
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      say('');
      if (!validate()) return;
      if (f.elements.website.value) { f.reset(); return; } /* honeypot: bots fill this in */

      var endpoint = f.getAttribute('data-endpoint') || '';
      if (!endpoint || endpoint.indexOf('your_app') > -1) {
        say('This form is not connected yet. Set the endpoint in data-endpoint.', 'bad');
        return;
      }
      var data = {};
      ['full_name', 'email', 'phone', 'subject', 'i_want_to', 'message'].forEach(function (n) { data[n] = f.elements[n].value.trim(); });

      send.disabled = true; send.textContent = 'Sending…';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function () {
        f.reset();
        say('Thank you. Your message has been sent.', 'ok');
      }).catch(function () {
        say('Sorry, your message could not be sent. Please try again.', 'bad');
      }).then(function () {
        send.disabled = false; send.textContent = 'Submit';
      });
    });

    window.__cf = true;
    return true;
  }

  /* Wait for the page builder to draw the form, then start. */
  (function wait(n) {
    if (start()) return;
    if (n > 0) setTimeout(function () { wait(n - 1); }, 200);
    else console.warn('Contact form: .cf not found on this page.');
  })(100);
})();