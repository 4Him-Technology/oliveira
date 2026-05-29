/* =========================================================================
   app.js — scroll reveal, parallax, header behaviour, nav, progress
   Vanilla JS, no dependencies. Runs after DOM is ready.
   ========================================================================= */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Reveal on scroll ------------------------------------------------ */
  function initReveal() {
    const els = $$('[data-reveal]');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('revealed');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // assign stagger delays within groups
    $$('[data-stagger]').forEach((group) => {
      const step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
      $$('[data-reveal]', group).forEach((el, i) => {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * step) + 'ms');
      });
    });
    els.forEach((e) => io.observe(e));
  }

  /* ---- Header behaviour ------------------------------------------------ */
  function initHeader() {
    const header = $('.site-header');
    const hero = $('#hero');
    if (!header) return;
    const update = () => {
      const heroH = hero ? hero.offsetHeight : 600;
      const past = window.scrollY > Math.min(heroH - 120, window.innerHeight - 120);
      header.classList.toggle('solid', past);
      // over-light only relevant for variant A while still in hero
      const variant = document.documentElement.getAttribute('data-hero');
      header.classList.toggle('on-light', variant === 'a' && !past);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // expose so tweaks can re-evaluate after variant switch
    window.__updateHeader = update;
  }

  /* ---- Parallax -------------------------------------------------------- */
  function initParallax() {
    if (reduce) return;
    const layers = $$('[data-parallax]');
    if (!layers.length) return;
    let ticking = false;
    const apply = () => {
      const vh = window.innerHeight;
      layers.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const offset = (center - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
  }

  /* ---- Scroll progress bar -------------------------------------------- */
  function initProgress() {
    const bar = $('.progress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = p + '%';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---- Mobile nav ------------------------------------------------------ */
  function initNav() {
    const toggle = $('.menu-toggle');
    const drawer = $('.mobile-nav');
    if (!toggle || !drawer) return;
    const open = () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { drawer.classList.remove('open'); document.body.style.overflow = ''; };
    toggle.addEventListener('click', open);
    $('.mobile-nav .close', document).addEventListener('click', close);
    $$('.mobile-nav a').forEach((a) => a.addEventListener('click', close));
  }

  /* ---- Smooth anchor scroll (account for fixed header) ----------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.getElementById(id.slice(1));
        if (!t) return;
        e.preventDefault();
        const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const y = t.getBoundingClientRect().top + window.scrollY - hh + 4;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function init() {
    document.documentElement.classList.add('js');
    initHeroIntro();
    initReveal();
    initHeader();
    initParallax();
    initProgress();
    initNav();
    initAnchors();
  }

  /* ---- Hero entrance ---------------------------------------------------- */
  function initHeroIntro() {
    const variants = $$('.hero-variant');
    const reveal = () => variants.forEach((v) => v.classList.add('in'));
    // next frame so the transition from the hidden state actually plays
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    // hard safety net: once the staggered transition would have finished,
    // force the resting (visible) state with transitions off, so hero copy
    // can NEVER stay invisible even if CSS transitions don't run.
    setTimeout(() => {
      $$('.hero-variant .anim').forEach((el) => {
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1800);
    window.__playHero = reveal;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
