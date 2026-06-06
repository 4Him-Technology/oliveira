/* =========================================================================
   fusion.js — melhorias exclusivas da Versão 5 (Fusion).
   Roda JUNTO do app.js (não substitui). Hoje: count-up dos KPIs [data-count].
   Respeita prefers-reduced-motion. Vanilla JS, sem dependências.
   ========================================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCounters() {
    var nums = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length) return;

    var setFinal = function (el) {
      var end = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = (end % 1 ? end.toFixed(1) : Math.round(end)) + suffix;
    };

    if (reduce || !('IntersectionObserver' in window)) {
      nums.forEach(setFinal);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target;
        var end = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400;
        var t0 = performance.now();
        var tick = function (t) {
          var p = Math.min(1, (t - t0) / dur);
          var e = 1 - Math.pow(1 - p, 3);
          var v = end * e;
          el.textContent = (end % 1 ? v.toFixed(1) : Math.round(v)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });

    nums.forEach(function (n) { io.observe(n); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }
})();
