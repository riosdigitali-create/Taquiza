/**
 * animations.js
 * GSAP + ScrollTrigger + SplitType driven motion for the whole page:
 * hero text reveal, Ken Burns hero fallback, mask-reveal images, parallax,
 * stats count-up, magnetic buttons, staggered entrances, FAQ accordion,
 * timeline steps.
 */
(function () {
  const hasGsap = typeof gsap !== 'undefined';
  if (!hasGsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Hero title split + reveal ---------------- */
  function heroReveal() {
    const titleEl = document.getElementById('heroTitle');
    const tl = gsap.timeline({ delay: 0.15 });

    if (titleEl && typeof SplitType !== 'undefined' && !prefersReducedMotion) {
      const split = new SplitType(titleEl, { types: 'words,chars' });
      gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      tl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.018,
      });
    } else if (titleEl) {
      tl.from(titleEl, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' });
    }

    tl.to('[data-hero-fade]', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.5');
  }

  /* ---------------- Ken Burns hero background fallback ---------------- */
  function kenBurns() {
    const slides = document.querySelectorAll('.kb-slide');
    if (!slides.length) return;
    let index = 0;
    slides.forEach((s, i) => gsap.set(s, { opacity: i === 0 ? 1 : 0, scale: 1 }));

    function cycle() {
      const current = slides[index];
      const nextIndex = (index + 1) % slides.length;
      const next = slides[nextIndex];

      gsap.fromTo(next, { scale: 1 }, { scale: 1.12, duration: 9, ease: 'none' });
      gsap.to(next, { opacity: 1, duration: 1.6, ease: 'power2.inOut' });
      gsap.to(current, { opacity: 0, duration: 1.6, ease: 'power2.inOut' });

      index = nextIndex;
    }

    gsap.to(slides[0], { scale: 1.12, duration: 9, ease: 'none' });
    setInterval(cycle, 6000);
  }

  /* ---------------- Stats count-up ---------------- */
  function statsCountUp() {
    const stats = document.querySelectorAll('[data-count]');
    stats.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.round(obj.val).toLocaleString('es-MX');
            },
          });
        },
      });
    });
  }

  /* ---------------- Mask reveal images (Nosotros) ---------------- */
  function maskReveal() {
    document.querySelectorAll('.mask-reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      );
      const img = el.querySelector('img');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.25 },
          {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          }
        );
      }
    });
  }

  /* ---------------- Staggered card entrances ---------------- */
  function staggerCards(selector) {
    document.querySelectorAll(selector).forEach((group) => {
      const cards = group.querySelectorAll(':scope > *');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      });
    });
  }

  function staggerSingle(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  }

  /* ---------------- Parallax on hero + media ---------------- */
  function parallax() {
    document.querySelectorAll('.menu-card img, .reveal-card img').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  function magneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo(relX * 0.3);
        yTo(relY * 0.4);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  function faqAccordion() {
    document.querySelectorAll('.faq-item').forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      const panel = item.querySelector('.faq-panel');
      const icon = item.querySelector('.faq-icon');
      if (!trigger || !panel) return;

      gsap.set(panel, { height: 0 });

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            gsap.to(openItem.querySelector('.faq-panel'), { height: 0, duration: 0.45, ease: 'power2.inOut' });
            const oi = openItem.querySelector('.faq-icon');
            if (oi) gsap.to(oi, { rotate: 0, duration: 0.3 });
          }
        });

        if (isOpen) {
          item.classList.remove('is-open');
          gsap.to(panel, { height: 0, duration: 0.45, ease: 'power2.inOut' });
          if (icon) gsap.to(icon, { rotate: 0, duration: 0.3 });
        } else {
          item.classList.add('is-open');
          gsap.set(panel, { height: 'auto' });
          const h = panel.offsetHeight;
          gsap.fromTo(panel, { height: 0 }, { height: h, duration: 0.5, ease: 'power2.inOut' });
          if (icon) gsap.to(icon, { rotate: 45, duration: 0.3 });
        }
      });
    });
  }

  /* ---------------- Timeline steps ---------------- */
  function timelineSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    if (!steps.length) return;
    gsap.from(steps, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#timeline', start: 'top 80%' },
    });
  }

  function init() {
    if (window.__taquizasAnimInit) return;
    window.__taquizasAnimInit = true;
    heroReveal();
    kenBurns();
    statsCountUp();
    maskReveal();
    staggerCards('#serviciosGrid');
    staggerCards('#testimonialsGrid');
    staggerCards('#coverageList');
    staggerSingle('.reveal-card');
    parallax();
    magneticButtons();
    faqAccordion();
    timelineSteps();

    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }

  document.addEventListener('taquizas:loaded', init);
  // Safety net in case the loader event never fires.
  window.addEventListener('load', () => setTimeout(init, 2500));
})();
