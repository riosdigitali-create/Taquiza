/**
 * main.js
 * Central wiring for Taquizas para Eventos.
 * Single source of truth for the WhatsApp number — every CTA on the site
 * derives its href from this constant, never a hardcoded number elsewhere.
 */
const WHATSAPP_NUMBER = '526644375224';

/**
 * Builds a wa.me deep link with a URL-encoded, prefilled Spanish message.
 * @param {string} message
 * @returns {string}
 */
function buildWhatsAppLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Wires every element with class "js-wa-cta" so its href is always derived
 * from WHATSAPP_NUMBER + its data-msg attribute (or data-wa-msg).
 */
function wireWhatsAppCTAs(root = document) {
  const ctas = root.querySelectorAll('.js-wa-cta');
  ctas.forEach((el) => {
    const msg = el.getAttribute('data-msg') || el.getAttribute('data-wa-msg') || '';
    const link = buildWhatsAppLink(msg);
    if (el.tagName === 'A') {
      el.setAttribute('href', link);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    } else {
      el.addEventListener('click', () => {
        window.open(link, '_blank', 'noopener');
      });
    }
  });
}

function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mobileNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('flex');
    nav.classList.toggle('hidden', isOpen);
    nav.classList.toggle('flex', !isOpen);
  });
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.add('hidden');
      nav.classList.remove('flex');
    });
  });
}

function initNavScrollState() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('bg-bg-black/80', 'backdrop-blur-xl', 'border-b', 'border-white/10');
    } else {
      nav.classList.remove('bg-bg-black/80', 'backdrop-blur-xl', 'border-b', 'border-white/10');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

/**
 * Contact form: builds a formatted WhatsApp message from field values,
 * validates required fields, and opens WhatsApp on submit.
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const confirmation = document.getElementById('formConfirmation');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = form.cName.value.trim();
    const phone = form.cPhone.value.trim();
    const email = form.cEmail.value.trim();

    const setError = (input, show) => {
      const wrapper = input.closest('div');
      const err = wrapper ? wrapper.querySelector('.field-error') : null;
      if (err) err.classList.toggle('hidden', !show);
      input.classList.toggle('border-ember', show);
    };

    const nameValid = name.length > 1;
    setError(form.cName, !nameValid);
    if (!nameValid) valid = false;

    const phoneValid = /^[0-9()+\-\s]{7,}$/.test(phone);
    setError(form.cPhone, !phoneValid);
    if (!phoneValid) valid = false;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setError(form.cEmail, !emailValid);
    if (!emailValid) valid = false;

    if (!valid) {
      if (confirmation) confirmation.classList.add('hidden');
      return;
    }

    const date = form.cDate.value || 'Por definir';
    const guests = form.cGuests.value || 'Por definir';
    const type = form.cType.value || 'Por definir';
    const location = form.cLocation.value.trim() || 'Por definir';
    const message = form.cMessage.value.trim() || 'Sin mensaje adicional';

    const text = [
      'Hola, quiero solicitar informacion para mi evento:',
      `Nombre: ${name}`,
      `Telefono: ${phone}`,
      `Correo: ${email}`,
      `Fecha del evento: ${date}`,
      `Numero de invitados: ${guests}`,
      `Tipo de evento: ${type}`,
      `Ubicacion: ${location}`,
      `Mensaje: ${message}`,
    ].join('\n');

    window.open(buildWhatsAppLink(text), '_blank', 'noopener');

    if (confirmation) {
      confirmation.classList.remove('hidden');
      confirmation.textContent = 'Gracias, ' + name.split(' ')[0] + '. Se abrio WhatsApp con tu solicitud lista para enviar.';
    }
  });
}

/**
 * Elegant preloader: fades out once fonts + window load are ready.
 */
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  if (!loader) return;

  const finish = () => {
    if (window.gsap) {
      gsap.to(bar, { scaleX: 1, duration: 0.6, ease: 'power2.out' });
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          loader.style.display = 'none';
          document.body.classList.remove('overflow-hidden');
          document.dispatchEvent(new CustomEvent('taquizas:loaded'));
        },
      });
    } else {
      loader.style.transition = 'opacity .6s ease';
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        document.dispatchEvent(new CustomEvent('taquizas:loaded'));
      }, 600);
    }
  };

  document.body.classList.add('overflow-hidden');

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const windowReady = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else window.addEventListener('load', resolve, { once: true });
  });

  Promise.race([
    Promise.all([fontsReady, windowReady]),
    new Promise((resolve) => setTimeout(resolve, 2200)), // safety timeout
  ]).then(finish);
}

document.addEventListener('DOMContentLoaded', () => {
  wireWhatsAppCTAs();
  initMobileNav();
  initNavScrollState();
  initFooterYear();
  initContactForm();
  initLoader();
});
