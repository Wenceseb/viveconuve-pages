import { escapeHtml as e } from './content.mjs';
export function renderAgenda(events) {
  const allowed = new Set(['support.hyrox.com', 'hyrox.com', 'athlonx.es', 'es.spartan.com']);
  const date = (v) =>
    new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'UTC' }).format(
      new Date(v + 'T12:00:00Z'),
    );
  return [...events]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((item) => {
      if (
        !allowed.has(new URL(item.source).hostname) ||
        !item.source.startsWith('https://') ||
        !item.formats.length ||
        item.end < item.start
      )
        throw Error('Invalid agenda event');
      for (const key of ['start', 'end', 'verified'])
        if (!/^\d{4}-\d{2}-\d{2}$/.test(item[key]) || Number.isNaN(Date.parse(item[key])))
          throw Error('Invalid event date');
      return `<article class="h-split" data-event data-start="${e(item.start)}" data-end="${e(item.end)}" data-city="${e(item.city)}" data-formats="${e(item.formats.join('|'))}" data-verified="${e(item.verified)}"><div><p>${e(item.formats.join(' · '))}</p><h3>${e(item.name)}</h3><p>${e(item.city)}, ${e(item.country)}</p></div><div><p><time datetime="${item.start}">${date(item.start)}</time>${item.end !== item.start ? ` — <time datetime="${item.end}">${date(item.end)}</time>` : ''}</p><p>Revisado: ${date(item.verified)}. Plazas sin comprobar.</p><a href="${e(item.source)}">Consultar ${e(item.name)} en la web oficial</a></div></article>`;
    })
    .join('\n');
}
