/**
 * cursor.js
 * Custom cursor: a small dot + a lagging outline ring.
 * Disabled entirely on touch/coarse-pointer devices.
 */
(function () {
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  if (isCoarse) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.documentElement.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const hasGsap = typeof gsap !== 'undefined';
  let dotX, dotY;
  if (hasGsap) {
    dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (hasGsap) {
      dotX(mouseX);
      dotY(mouseY);
    } else {
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function raf() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  const hoverTargets = 'a, button, .gallery-item, input, select, textarea, .card-lift';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.add('is-active');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('is-active');
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
