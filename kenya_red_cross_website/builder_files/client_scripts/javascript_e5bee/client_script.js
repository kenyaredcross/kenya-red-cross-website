// Write your script here
/* Tender search bar: search, Open/Closed filter and closing-date sort.
   It works on any list of tender elements. Each tender element needs the class set in
   data-target on .tsb (default ".tender") and, for status and sorting, a data-closing="YYYY-MM-DD" attribute. */
(function () {
  if (window.__tsb) return;

  function start() {
    var bar = document.querySelector('.tsb');
    if (!bar) return false;
    var items = [].slice.call(document.querySelectorAll(bar.getAttribute('data-target') || '.tender'));
    var q = bar.querySelector('.tsb-q'), sortEl = bar.querySelector('.tsb-s');
    var btns = [].slice.call(bar.querySelectorAll('.tsb-seg button'));
    var st = { q: '', f: 'all', s: 'asc' };
    var today = new Date().toLocaleDateString('en-CA'); /* YYYY-MM-DD, local time */

    var none = document.createElement('div');
    none.className = 'tsb-none';
    none.setAttribute('role', 'status');
    none.textContent = 'No tenders match your search.';
    if (items.length) items[0].parentNode.parentNode.insertBefore(none, items[0].parentNode.nextSibling);

    function closing(el) { return el.getAttribute('data-closing') || ''; }

    function apply() {
      var shown = 0;
      items.forEach(function (el) {
        var d = closing(el), open = d ? d >= today : null;
        var ok = el.textContent.toLowerCase().indexOf(st.q) > -1 &&
                 (st.f === 'all' || open === null || (st.f === 'open') === open);
        el.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      if (items.length) {
        var parent = items[0].parentNode;
        items.slice().sort(function (a, b) {
          var x = closing(a), y = closing(b);
          if (!x && !y) return 0; if (!x) return 1; if (!y) return -1;
          return st.s === 'asc' ? (x < y ? -1 : x > y ? 1 : 0) : (x < y ? 1 : x > y ? -1 : 0);
        }).forEach(function (el) { parent.appendChild(el); });
      }
      none.style.display = items.length && !shown ? 'block' : 'none';
      bar.dispatchEvent(new CustomEvent('tsb:change', { detail: { q: st.q, status: st.f, sort: st.s, shown: shown } }));
    }

    q.addEventListener('input', function () { st.q = q.value.trim().toLowerCase(); apply(); });
    sortEl.addEventListener('change', function () { st.s = sortEl.value; apply(); });
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        st.f = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        apply();
      });
    });

    window.__tsb = true;
    apply();
    return true;
  }

  /* Wait for the page builder to draw the markup, then start. */
  (function wait(n) {
    if (start()) return;
    if (n > 0) setTimeout(function () { wait(n - 1); }, 200);
    else console.warn('Tender search bar: .tsb not found on this page.');
  })(100);
})();