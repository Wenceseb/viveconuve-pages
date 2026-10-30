import { parse } from 'parse5';
import { nodes, attr, text } from './html.mjs';
import { escapeHtml as e } from './content.mjs';
import { categoryLabels, stations } from '../../public/assets/tools/model.js';

export function raceSheets(pages, items) {
  const references = items.map((item, i) => {
    const page = pages.find((p) => p.permalink === `/hyrox-${item.slug}.html`);
    if (!page) throw Error(`Missing station: ${item.slug}`);
    const doc = parse(page.content);
    const distance = nodes(doc, 'p').find((n) => attr(n, 'class') === 'station-measure');
    const cells = nodes(doc, 'table')
      .flatMap((t) => nodes(t, 'td'))
      .map(text);
    if (!distance || (cells.length !== 0 && cells.length !== 4))
      throw Error(`Invalid reference: ${item.slug}`);
    return { ...item, name: stations[i], distance: text(distance), singles: cells };
  });
  const choices = Object.entries(categoryLabels);
  const panels = choices
    .map(([key, label], index) => {
      const doubles = key.startsWith('Doubles');
      const relay = key.startsWith('Relay');
      const mixed = key === 'Relay Mixed';
      const source = relay ? 'Relay' : doubles ? 'Doubles' : 'Singles';
      const rows = references
        .map((ref, stationIndex) => {
          let value = ref.singles.length ? ref.singles[index] : '—';
          if (doubles) value = ref.singles.length ? ref.doubles[index - 4] : '—';
          if (relay)
            value = ref.singles.length
              ? mixed
                ? 'Por confirmar con la organización'
                : ref.relay[index - 9]
              : '—';
          if (!value) throw Error(`Missing load: ${key} / ${ref.slug}`);
          return `<tr><th scope="row"><span class="race-order">${stationIndex + 1}</span> <a href="/hyrox-${ref.slug}.html">${e(ref.name)}</a></th><td>${e(ref.distance)}</td><td>${e(value)}</td></tr>`;
        })
        .join('');
      return `<details data-race-category="${e(key)}"><summary>${e(label)}</summary><div class="race-sheet-result"><p class="race-sheet-brand">ViveConUve · Ficha HYROX 2026/27</p><h3>${e(label)}</h3><p>${relay ? 'Cuatro participantes: cada integrante completa dos carreras de 1 km y sus dos estaciones.' : doubles ? 'Los dos participantes corren juntos los ocho kilómetros y comparten el trabajo de las estaciones. Los cambios también cuentan.' : 'Completas las ocho carreras de 1 km y las ocho estaciones.'}</p>${mixed ? '<p class="race-sheet-warning"><strong>Cargas pendientes de confirmar.</strong> El reglamento consultado muestra referencias de mujeres y hombres, pero esta ficha no resuelve su asignación en el equipo mixto. Confírmala con la organización; no utilices las cargas de otra modalidad como sustituto.</p>' : ''}<table><caption>Ocho estaciones · temporada 2026/27. Un kilómetro de carrera antes de cada estación.</caption><thead><tr><th scope="col">Estación</th><th scope="col">Trabajo total</th><th scope="col">Carga / referencia</th></tr></thead><tbody>${rows}</tbody></table><p class="race-sheet-notes">Los kilos de los trineos incluyen el trineo. En Farmers Carry, la carga corresponde a dos pesas; consulta la ficha para distinguir cada pesa del total. Las distancias y repeticiones son el total de la estación, no el trabajo de cada compañero.</p>${doubles || relay ? '<p class="race-sheet-notes">Wall Balls: consulta también la altura de diana en la ficha de la estación. Esta tabla no sustituye las reglas de ejecución, reparto o relevos.</p>' : ''}<p class="race-sheet-source">Fuente: <a href="https://maintain.hyrox.com/rulebooks/HYROX_Rulebook${source}_EN.pdf">Reglamento HYROX ${source} 2026/27</a>. Referencias revisadas el 30/10/2026. Comprueba actualizaciones y las indicaciones de tu prueba antes de competir. Ficha de consulta de ViveConUve, no documento oficial.</p></div></details>`;
    })
    .join('');
  return `<section id="race-sheet" class="race-sheet" aria-labelledby="race-sheet-title"><header><p class="h-kicker">De las ocho fichas a tu prueba</p><h2 id="race-sheet-title">Tu modalidad, en una sola hoja.</h2><p>Consulta distancias y cargas sin mezclar categorías. Elige la modalidad de tu inscripción; la edad por sí sola no determina la carga.</p></header><div class="race-sheet-controls" hidden><label for="race-category">Modalidad de mi inscripción</label><select id="race-category"><option value="">Elige tu modalidad</option>${choices.map(([key, label]) => `<option value="${e(key)}">${e(label)}</option>`).join('')}</select><button type="button" id="race-print" hidden>Imprimir o guardar en PDF</button><p id="race-print-help" hidden>En la ventana de impresión, elige «Guardar como PDF». Se imprime únicamente tu modalidad.</p><p id="race-selection-status" class="race-sheet-status" role="status"></p></div><div class="race-sheet-panels">${panels}</div><p class="race-sheet-next">Con tus referencias claras, <a href="/planificador-hyrox.html">prepara tus tiempos en el planificador</a>. Las cargas no predicen tu ritmo.</p></section>`;
}
