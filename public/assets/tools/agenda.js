(() => {
  const form = document.getElementById('agenda-filters');
  if (!form) return;
  const events = [...document.querySelectorAll('[data-event]')];
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date());
  const normalized = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  function filter() {
    const format = document.getElementById('agenda-format').value;
    const month = document.getElementById('agenda-month').value;
    const city = normalized(document.getElementById('agenda-city').value);
    const period = document.getElementById('agenda-period').value;
    let count = 0;
    for (const event of events) {
      const d = event.dataset;
      const match =
        (!format || d.formats.split('|').includes(format)) &&
        (!month || (d.start.slice(0, 7) <= month && d.end.slice(0, 7) >= month)) &&
        (!city || normalized(d.city).includes(city)) &&
        (period === 'all' || (period === 'past' ? d.end < today : d.end >= today));
      event.hidden = !match;
      if (match) count++;
    }
    document.getElementById('agenda-count').textContent =
      `${count} ${count === 1 ? 'prueba encontrada' : 'pruebas encontradas'}.`;
    document.getElementById('agenda-empty').hidden = count > 0;
    document.getElementById('agenda-stale').hidden = !events.some(
      (event) => Date.parse(today) - Date.parse(event.dataset.verified) > 30 * 86400000,
    );
  }
  form.hidden = false;
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', filter);
  form.addEventListener('reset', () => setTimeout(filter, 0));
  filter();
})();
