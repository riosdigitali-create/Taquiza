/**
 * gallery.js
 * Masonry grid (CSS columns, see .masonry in input.css) + a vanilla-JS
 * fullscreen lightbox with prev/next, ESC to close, and GSAP transitions.
 */
(function () {
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const img = document.getElementById('lightboxImg');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  let currentIndex = -1;
  const hasGsap = typeof gsap !== 'undefined';

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const src = item.getAttribute('data-full');
    const alt = item.querySelector('img') ? item.querySelector('img').alt : '';

    img.src = src;
    img.alt = alt;

    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';

    if (hasGsap) {
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(img, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
    }
  }

  function close() {
    const finish = () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
      document.body.style.overflow = '';
      currentIndex = -1;
    };
    if (hasGsap) {
      gsap.to(lightbox, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: finish });
    } else {
      finish();
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => show(i));
  });

  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev) btnPrev.addEventListener('click', () => show(currentIndex - 1));
  if (btnNext) btnNext.addEventListener('click', () => show(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (currentIndex === -1) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
  });
})();
