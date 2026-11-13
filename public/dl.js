/* APK download counter for apps.codelove.in.
 * Counts live in ONE public Firestore doc (project codelove-analytics): dl/apps = { n: { <appId>: count } }.
 * Page load = 1 read (fills every [data-dl-count] on the page). A Download APK click = 1 write that adds 1
 * to that app — once per browser per app, so the number means "how many people downloaded it". */
(function () {
  'use strict';
  var BASE = 'https://firestore.googleapis.com/v1/projects/codelove-analytics/databases/(default)/documents';
  var KEY = 'AIzaSyDxvgBOnJBPpUNgoYk_8Dpk85ahxMrqv5I';
  var counts = {};

  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K';
    return String(n);
  }
  function paint() {
    var els = document.querySelectorAll('[data-dl-count]');
    for (var i = 0; i < els.length; i++) {
      var n = counts[els[i].getAttribute('data-dl-count')] || 0;
      var num = els[i].querySelector('.dl-num') || els[i];
      // Only touch the DOM when the value changed, so the MutationObserver below doesn't loop.
      if (num.textContent !== fmt(n)) num.textContent = fmt(n);
      var t = n + (n === 1 ? ' download' : ' downloads');
      if (els[i].getAttribute('title') !== t) els[i].setAttribute('title', t);
    }
  }

  function load() {
    fetch(BASE + '/dl/apps?key=' + KEY)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (doc) {
        var m = doc && doc.fields && doc.fields.n && doc.fields.n.mapValue && doc.fields.n.mapValue.fields;
        if (m) for (var k in m) counts[k] = +(m[k].integerValue || 0);
        paint();
      })
      .catch(function () { paint(); });
  }

  function count(id) {
    var flag = 'cl_dl_' + id;
    try { if (localStorage.getItem(flag)) return; localStorage.setItem(flag, '1'); } catch (e) { }
    counts[id] = (counts[id] || 0) + 1;
    paint();
    var body = JSON.stringify({
      writes: [{
        transform: {
          document: 'projects/codelove-analytics/databases/(default)/documents/dl/apps',
          fieldTransforms: [{ fieldPath: 'n.`' + id + '`', increment: { integerValue: '1' } }]
        }
      }]
    });
    try {
      fetch(BASE + ':commit?key=' + KEY, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'application/json' } });
    } catch (e) { }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-dl-app]');
    if (a) count(a.getAttribute('data-dl-app'));
  }, true);

  // Re-paint after client-side navigation (Next swaps the page without reloading this script).
  var timer;
  new MutationObserver(function () { clearTimeout(timer); timer = setTimeout(paint, 50); })
    .observe(document.documentElement, { childList: true, subtree: true });

  if (/(^|\.)codelove\.in$|^localhost$/.test(location.hostname)) load(); else paint();
})();
