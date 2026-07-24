/**
 * quote-calculator.js
 * "Cotizador automático" — a transparent, self-contained estimate formula:
 *   total = invitados x precioPorPersona(nivel) x factorTipoEvento x factorCiudad
 * The result is always labeled as an estimate subject to confirmation, and
 * feeds a prefilled WhatsApp deep link built from the shared WHATSAPP_NUMBER
 * constant defined in main.js.
 */
(function () {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  const els = {
    eventType: document.getElementById('qEventType'),
    guests: document.getElementById('qGuests'),
    guestsValue: document.getElementById('qGuestsValue'),
    city: document.getElementById('qCity'),
    date: document.getElementById('qDate'),
    tier: document.getElementById('qTier'),
    result: document.getElementById('qResult'),
    breakdown: document.getElementById('qBreakdown'),
    cta: document.getElementById('qCta'),
  };

  const PRICE_PER_PERSON = {
    'Clásico': 180,
    'Premium': 260,
    'Deluxe': 340,
  };

  const EVENT_MULTIPLIER = {
    'Boda': 1.05,
    'XV Años': 1.05,
    'Evento Corporativo': 1.0,
    'Cumpleaños': 0.95,
    'Graduación': 0.95,
    'Bautizo': 0.9,
    'Evento Privado': 1.0,
    'Evento Masivo': 0.92,
  };

  const CITY_MULTIPLIER = {
    'Tijuana': 1.0,
    'Playas de Tijuana': 1.0,
    'Rosarito': 1.03,
    'Tecate': 1.05,
    'Ensenada': 1.08,
    'Mexicali': 1.1,
  };

  function formatMXN(n) {
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  }

  function calculate() {
    const eventType = els.eventType.value;
    const guests = parseInt(els.guests.value, 10);
    const city = els.city.value;
    const tier = els.tier.value;
    const date = els.date.value;

    els.guestsValue.textContent = guests;

    const perPerson = PRICE_PER_PERSON[tier] || PRICE_PER_PERSON['Clásico'];
    const eventFactor = EVENT_MULTIPLIER[eventType] || 1;
    const cityFactor = CITY_MULTIPLIER[city] || 1;

    const rawTotal = guests * perPerson * eventFactor * cityFactor;
    const total = Math.round(rawTotal / 50) * 50;

    els.result.textContent = `${formatMXN(total)} MXN`;

    els.breakdown.innerHTML = `
      <div class="flex justify-between border-b border-white/10 pb-2"><span>Precio base (${tier})</span><span>${formatMXN(perPerson)} / persona</span></div>
      <div class="flex justify-between border-b border-white/10 pb-2"><span>Invitados</span><span>${guests}</span></div>
      <div class="flex justify-between border-b border-white/10 pb-2"><span>Ajuste por tipo de evento</span><span>x${eventFactor.toFixed(2)}</span></div>
      <div class="flex justify-between pb-2"><span>Ajuste por ciudad (${city})</span><span>x${cityFactor.toFixed(2)}</span></div>
    `;

    const dateLabel = date ? new Date(date + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }) : 'por definir';

    const message = [
      'Hola, quiero solicitar una cotizacion para mi evento con estos datos:',
      `Tipo de evento: ${eventType}`,
      `Numero de invitados: ${guests}`,
      `Ciudad: ${city}`,
      `Fecha del evento: ${dateLabel}`,
      `Nivel de servicio: ${tier}`,
      `Estimado calculado en el sitio: ${formatMXN(total)} MXN (estimado, sujeto a confirmacion)`,
    ].join('\n');

    if (els.cta) {
      els.cta.setAttribute('data-msg', message);
      els.cta.setAttribute('data-wa-msg', message);
      if (typeof WHATSAPP_NUMBER !== 'undefined') {
        els.cta.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
      }
    }
  }

  ['input', 'change'].forEach((evt) => {
    form.addEventListener(evt, calculate);
  });

  calculate();
})();
