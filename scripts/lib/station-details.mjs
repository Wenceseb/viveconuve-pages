import { escapeHtml as e } from './content.mjs';
import { stationVisual } from './station-visuals.mjs';
const names = ['Femenino Open', 'Masculino Open', 'Mixto Open', 'Femenino Pro', 'Masculino Pro'];
export function stationDetails(page, items) {
  const item = items.find((v) => page.permalink === `/hyrox-${v.slug}.html`);
  if (!item) return { stationTeams: '', stationPractice: '', stationVisual: '' };
  const table = (caption, labels, values) =>
    `<table><caption>${caption}</caption><thead><tr><th scope="col">Participación</th><th scope="col">Referencia</th></tr></thead><tbody>${labels.map((label, i) => `<tr><th scope="row">${e(label)}</th><td>${e(values[i])}</td></tr>`).join('')}</tbody></table>`;
  const note = item.slug.startsWith('sled-')
    ? 'Las cargas incluyen el trineo. Distancia total: 50 m.'
    : item.slug === 'farmers-carry'
      ? 'Dos pesas; la cifra indica el peso de cada una. Distancia total: 200 m.'
      : item.slug === 'sandbag-lunges'
        ? 'Peso del saco. Distancia total: 100 m.'
        : item.slug === 'wall-balls'
          ? '100 repeticiones por estación. Diana femenina: 2,70 m; masculina: 3,00 m.'
          : 'La distancia indicada corresponde al total de la estación.';
  return {
    stationVisual: stationVisual(item.slug),
    stationPractice: `<aside class="station-fieldnotes"><h3>${e(item.question)}</h3><p>${e(item.practice)}</p><p><strong>Qué anotar:</strong> ${e(item.record)}</p><p class="station-source">Propuesta editorial para organizar tus observaciones. No es un estándar de competición ni una prescripción de entrenamiento.</p></aside>`,
    stationTeams: `<section id="equipos" class="station-teams" aria-labelledby="teams-heading"><header><h2 id="teams-heading">Si el dorsal se comparte.</h2><p>Dobles y relevos tienen reglas propias. Estas referencias corresponden a la temporada 2026/27; el bloque superior de la ficha detalla individuales.</p></header><div class="station-team-grid"><section><h3>Dobles</h3><p>Ambos corren; las estaciones se reparten. Acordad el reparto y ensayad los cambios.</p>${table('Dobles · referencia de esta estación', names, item.doubles)}<p>${note}</p><p class="station-source"><a href="https://maintain.hyrox.com/rulebooks/HYROX_RulebookDoubles_EN.pdf#page=${item.doublePage}">Reglamento Doubles 2026/27: estación y cargas</a>. Consulta: 29/10/2026. Revisa también las reglas de cambio de compañero; una tabla no sustituye el reglamento.</p></section><section><h3>Relevos de cuatro</h3><p>Cada integrante completa dos bloques de carrera y estación. Una estación se completa por el participante asignado.</p>${table('Relevos · categorías femenina y masculina', ['Equipo femenino', 'Equipo masculino'], item.relay)}<p>${note}</p><p>Relevo mixto: el reglamento presenta las cargas de mujeres y hombres, pero esta tabla no resuelve su asignación dentro del equipo. Confírmala con la organización de tu prueba antes de fijar las cargas.</p><p class="station-source"><a href="https://maintain.hyrox.com/rulebooks/HYROX_RulebookRelay_EN.pdf#page=${item.relayPage}">Reglamento Team Relay 2026/27: estación y cargas</a>. Consulta: 29/10/2026.</p></section></div><p>Antes de estimar tiempos, identifica tu modalidad en el <a href="/planificador-hyrox.html">planificador</a>. Anota los cambios de compañero y tránsitos dentro de tus estimaciones para no olvidarlos ni sumarlos dos veces.</p></section>`,
  };
}
