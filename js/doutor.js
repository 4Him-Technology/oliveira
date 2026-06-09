/* =========================================================================
   doutor.js — comportamentos exclusivos do site Doutor Safety.
   Tubelight navbar: indicador-pílula que desliza entre os itens (com brilho)
   e segue a seção atual (scroll-spy). Roda junto do app.js.
   ========================================================================= */
(function () {
  'use strict';
  var nav = document.querySelector('.ds-nav');
  if (!nav) return;
  var lamp = nav.querySelector('.nav-lamp');
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  if (!lamp || !links.length) return;

  var sections = links.map(function (a) {
    var h = a.getAttribute('href');
    return (h && h.charAt(0) === '#') ? document.getElementById(h.slice(1)) : null;
  });
  var activeLink = null;

  function moveTo(link) {
    if (!link) { lamp.classList.remove('on'); return; }
    lamp.style.left = link.offsetLeft + 'px';
    lamp.style.width = link.offsetWidth + 'px';
    lamp.classList.add('on');
  }

  function spy() {
    var y = window.scrollY + 150;
    var cur = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i] && sections[i].offsetTop <= y) cur = links[i];
    }
    activeLink = cur; // null no topo (hero) -> lâmpada some
    if (!nav.matches(':hover')) moveTo(activeLink);
  }

  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { moveTo(a); });
  });
  nav.addEventListener('mouseleave', function () { moveTo(activeLink); });
  window.addEventListener('scroll', spy, { passive: true });
  window.addEventListener('resize', function () { moveTo(nav.matches(':hover') ? null : activeLink); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', spy);
  else setTimeout(spy, 80);
})();
