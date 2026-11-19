(function () {
  var root = document.getElementById('planner');
  if (!root) return;
  var steps = root.querySelectorAll('.step');
  var bars = root.querySelectorAll('.progress i');
  var cur = 0;
  var state = {};

  function vals(name) {
    return Array.prototype.map.call(root.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
  }
  function one(name) { var v = vals(name); return v.length ? v[0] : ''; }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }

  function show(n) {
    cur = n;
    steps.forEach(function (s, i) { s.classList.toggle('active', i === n); });
    bars.forEach(function (b, i) { b.classList.toggle('on', i <= n); });
    root.querySelector('.count').textContent = 'Step ' + (n + 1) + ' of ' + steps.length;
    if (n === 4) buildContentFields();
    if (n === steps.length - 1) buildBrief();
    var h = steps[n].querySelector('h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    root.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function buildContentFields() {
    var wrap = document.getElementById('content-fields');
    var pages = vals('pages');
    if (!pages.length) { wrap.innerHTML = '<p>You have not picked any pages yet. Go back to step 3 and choose the pages you need.</p>'; return; }
    var old = {};
    wrap.querySelectorAll('textarea').forEach(function (t) { old[t.dataset.page] = t.value; });
    wrap.innerHTML = '';
    pages.forEach(function (p, i) {
      var l = document.createElement('label'); l.className = 'f'; l.htmlFor = 'pg' + i; l.textContent = p + ' page: what should it contain?';
      var t = document.createElement('textarea'); t.id = 'pg' + i; t.dataset.page = p; t.value = old[p] || '';
      t.placeholder = 'Headings, text, images, buttons, anything you already know';
      wrap.appendChild(l); wrap.appendChild(t);
    });
  }

  function validate(n) {
    var e = steps[n].querySelector('.err'); if (e) e.textContent = '';
    var msg = '';
    if (n === 0 && !one('type')) msg = 'Choose the kind of website you need.';
    if (n === 1 && !one('size')) msg = 'Choose roughly how many pages you want.';
    if (n === 2 && !vals('pages').length) msg = 'Pick at least one page.';
    if (n === 5 && !val('name')) msg = 'Add your name so we know who the brief is from.';
    if (n === 5 && !val('contact')) msg = 'Add a WhatsApp number or email so we can reply.';
    if (msg && e) { e.textContent = msg; return false; }
    return true;
  }

  function buildBrief() {
    var L = [];
    L.push('KYOMATOS TECH — WEBSITE BRIEF');
    L.push('');
    L.push('From: ' + (val('name') || '-') + '   Contact: ' + (val('contact') || '-'));
    if (val('business')) L.push('Business / brand: ' + val('business'));
    L.push('');
    L.push('Type of website: ' + (one('type') || '-'));
    L.push('Size: ' + (one('size') || '-'));
    L.push('Pages: ' + (vals('pages').join(', ') || '-'));
    L.push('Features: ' + (vals('features').join(', ') || 'none picked'));
    L.push('');
    L.push('PAGE CONTENT');
    var any = false;
    root.querySelectorAll('#content-fields textarea').forEach(function (t) {
      if (t.value.trim()) { any = true; L.push('- ' + t.dataset.page + ': ' + t.value.trim()); }
    });
    if (!any) L.push('- (not filled in yet)');
    L.push('');
    L.push('LOOK & FEEL');
    L.push('Vibe: ' + (vals('vibe').join(', ') || '-'));
    if (val('colours')) L.push('Colours: ' + val('colours'));
    if (val('refs')) L.push('Sites I like: ' + val('refs'));
    L.push('');
    L.push('Budget: ' + (val('budget') || '-') + '   Deadline: ' + (val('deadline') || '-'));
    document.getElementById('brief').textContent = L.join('\n');
  }

  root.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-go]'); if (!b) return;
    var dir = b.dataset.go;
    if (dir === 'next') { if (validate(cur)) show(Math.min(cur + 1, steps.length - 1)); }
    else if (dir === 'back') { show(Math.max(cur - 1, 0)); }
  });

  document.getElementById('copy').addEventListener('click', function () {
    var text = document.getElementById('brief').textContent, status = document.getElementById('copy-status');
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(document.getElementById('brief'));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      status.textContent = 'Press Ctrl+C (or hold and copy on your phone) to copy the selected brief.';
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status.textContent = 'Brief copied. Paste it into WhatsApp or email to Kyomatos Tech.'; }, fallback);
    } else fallback();
  });

  show(0);
})();
