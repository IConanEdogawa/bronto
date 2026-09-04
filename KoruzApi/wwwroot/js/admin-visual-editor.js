(function () {
  var n = 4, parts = [], loaded = 0;
  function tryRun() {
    if (loaded < n) return;
    (0, eval)(parts.join(''));
  }
  for (var i = 0; i < n; i++) {
    (function (i) {
      fetch('/js/editor-part-' + i + '.js?v=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.text(); })
        .then(function (t) { parts[i] = t; loaded++; tryRun(); })
        .catch(function (e) { console.error('editor load failed', i, e); });
    })(i);
  }
})();
