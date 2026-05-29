/* =========================================================================
   engine.js — shared scroll/animation engine for the alt Oliveira designs
   (Clínico Minimalista + Humanizado). Vanilla JS, no deps.
   Features: scroll reveal w/ stagger, [data-intro] entrance + safety net,
   parallax, header solidify, scroll progress, count-up, mobile nav, anchors.
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
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });

    $$('[data-stagger]').forEach((group) => {
      const step = parseInt(group.getAttribute('data-stagger'), 10) || 90;
      $$('[data-reveal]', group).forEach((el, i) => {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (i * step) + 'ms');
      });
    });
    els.forEach((e) => io.observe(e));
  }

  /* ---- Intro entrance (hero) ------------------------------------------- */
  function initIntro() {
    const blocks = $$('[data-intro]');
    if (!blocks.length) return;
    const reveal = () => blocks.forEach((b) => b.classList.add('in'));
    requestAnimationFrame(() => requestAnimationFrame(reveal));
    // hard safety net: force resting (visible) state so intro copy can never
    // stay invisible even if CSS transitions don't run (offscreen/throttled).
    setTimeout(() => {
      $$('[data-intro] .anim').forEach((el) => {
        el.style.transition = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1900);
  }

  /* ---- Header solidify ------------------------------------------------- */
  function initHeader() {
    const header = $('.site-header');
    if (!header) return;
    const update = () => {
      header.classList.toggle('solid', window.scrollY > 40);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
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
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', apply);
  }

  /* ---- Scroll progress ------------------------------------------------- */
  function initProgress() {
    const bar = $('.progress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---- Count-up -------------------------------------------------------- */
  function initCounters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      nums.forEach((n) => { n.textContent = n.getAttribute('data-count') + (n.getAttribute('data-suffix') || ''); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        const el = en.target;
        const end = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const dur = 1400; const t0 = performance.now();
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          const v = end * e;
          el.textContent = (end % 1 ? v.toFixed(1) : Math.round(v)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  }

  /* ---- Mobile nav ------------------------------------------------------ */
  function initNav() {
    const toggle = $('.menu-toggle');
    const drawer = $('.mobile-nav');
    if (!toggle || !drawer) return;
    const open = () => { drawer.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { drawer.classList.remove('open'); document.body.style.overflow = ''; };
    toggle.addEventListener('click', open);
    const x = $('.mobile-nav .close'); if (x) x.addEventListener('click', close);
    $$('.mobile-nav a').forEach((a) => a.addEventListener('click', close));
  }

  /* ---- Smooth anchors -------------------------------------------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length < 2) return;
        const t = document.getElementById(id.slice(1));
        if (!t) return;
        e.preventDefault();
        const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        const y = t.getBoundingClientRect().top + window.scrollY - hh + 6;
        window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  function init() {
    document.documentElement.classList.add('js');
    initIntro();
    initReveal();
    initHeader();
    initParallax();
    initProgress();
    initCounters();
    initNav();
    initAnchors();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
