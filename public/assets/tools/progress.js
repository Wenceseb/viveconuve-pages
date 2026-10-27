import { activities, time, clock, signed, record, comparable, csv } from './model.js';
import { id, localCollection, imported, download, el, options } from './local.js';
const $ = (s) => document.getElementById(s),
  form = $('record-form');
const store = localCollection('records', record, 500, $('local-status'));
let current = id();
const stationPages = {
  ski: 'skierg',
  push: 'sled-push',
  pull: 'sled-pull',
  burpee: 'burpee-broad-jumps',
  row: 'rowing',
  carry: 'farmers-carry',
  lunge: 'sandbag-lunges',
  wall: 'wall-balls',
};
Object.entries(activities).forEach(([key, a]) => {
  for (const control of ['activity', 'filter-activity']) $(control).add(new Option(a.label, key));
});
function adapt() {
  const a = activities[$('activity').value];
  const slug = stationPages[$('activity').value];
  const guide = $('activity-guide');
  guide.replaceChildren();
  guide.hidden = !slug;
  if (slug) {
    const link = el('a', `Consultar la ficha de ${a.label}`);
    link.href = `/hyrox-${slug}.html`;
    guide.append(link);
  }
  $('amount-field').hidden = !a.unit;
  $('load-field').hidden = !a.load;
  $('amount-label').textContent = `Cantidad (${a.unit || 'no procede'})`;
  $('conditions-help').textContent =
    $('activity').value === 'race'
      ? 'Anota formato, categoría y condiciones de recorrido; usa el mismo texto solo si son comparables.'
      : $('activity').value === 'push' || $('activity').value === 'pull'
        ? 'Anota superficie y si la carga incluye el trineo. Dos trineos distintos pueden deslizar de forma diferente.'
        : $('activity').value === 'carry'
          ? 'La carga es el peso de cada pesa. Anota material, superficie y pausas.'
          : $('activity').value === 'ski' || $('activity').value === 'row'
            ? 'Anota modelo, factor de arrastre y si fue esfuerzo continuo.'
            : 'Anota recorrido o material, superficie y pausas. Para intervalos, describe repeticiones y descansos.';
}
$('activity').addEventListener('change', adapt);
function read() {
  const numeric = (key) => {
    const raw = $(key).value.trim().replace(',', '.');
    const min = key === 'load' ? 0 : 0.01,
      max = key === 'load' ? 1000 : 1000000;
    if (!/^\d+(?:\.\d+)?$/.test(raw) || Number(raw) < min || Number(raw) > max) {
      $(key).focus();
      throw new Error(`${$(key).labels[0].textContent}: escribe un número entre ${min} y ${max}.`);
    }
    return Number(raw);
  };
  if (!$('record-name').value.trim())
    throw new Error('Pon un nombre a la referencia para reconocerla después.');
  if (!$('record-date').value) throw new Error('Indica la fecha del registro.');
  const activity = $('activity').value,
    a = activities[activity];
  return record({
    id: current,
    activity,
    name: $('record-name').value,
    date: $('record-date').value,
    amount: a.unit ? numeric('amount') : null,
    load: a.load ? numeric('load') : null,
    seconds: time($('record-time').value),
    context: $('context').value,
    conditions: $('conditions').value,
    notes: $('notes').value,
    verified: $('verified').checked,
  });
}
function reset() {
  current = id();
  form.reset();
  adapt();
  $('edit-state').textContent = 'Nueva referencia';
  store.clean();
}
function load(r, clone = false) {
  if (
    store.hasDraft &&
    !confirm('Tienes cambios sin guardar. ¿Descartarlos y abrir esta referencia?')
  )
    return;
  current = clone ? id() : r.id;
  $('activity').value = r.activity;
  $('record-name').value = r.name;
  $('record-date').value = clone ? '' : r.date;
  $('amount').value = r.amount ?? '';
  $('load').value = r.load ?? '';
  $('record-time').value = clock(r.seconds);
  $('context').value = r.context;
  $('conditions').value = r.conditions;
  $('notes').value = r.notes;
  $('verified').checked = clone ? false : r.verified;
  adapt();
  $('edit-state').textContent = clone
    ? 'Copia: cambia la fecha y el resultado antes de guardar.'
    : 'Editando una referencia guardada';
  $('record-name').focus();
  if (clone) store.dirty();
  else store.clean();
}
const description = (r) => `${r.date} · ${r.name} · ${clock(r.seconds)}`;
const sorted = () => store.items.slice().sort((a, b) => a.date.localeCompare(b.date));
function render() {
  const kind = $('filter-activity').value,
    query = $('filter-text').value.trim().toLocaleLowerCase('es');
  const list = sorted()
    .reverse()
    .filter(
      (r) =>
        (!kind || r.activity === kind) &&
        (!query || `${r.name} ${r.conditions} ${r.notes}`.toLocaleLowerCase('es').includes(query)),
    );
  $('records-list').replaceChildren();
  $('record-count').textContent =
    `${list.length} referencias visibles · ${store.items.length} guardadas de un máximo de 500.`;
  $('empty-records').hidden = store.items.length > 0;
  for (const r of list) {
    const article = el('article', '', 'record-row'),
      head = el('div'),
      actions = el('div', '', 'tool-actions');
    head.append(
      el('p', `${r.date} · ${activities[r.activity].label}`, 'record-date'),
      el('h3', r.name),
      el(
        'p',
        `${clock(r.seconds)}${r.amount ? ` · ${r.amount} ${activities[r.activity].unit}` : ''}${r.load !== null ? ` · ${r.load} kg` : ''}`,
        'record-time',
      ),
    );
    if (r.activity === 'run' || r.activity === 'ski' || r.activity === 'row')
      head.append(
        el(
          'p',
          `Ritmo: ${clock((r.seconds / r.amount) * (r.activity === 'run' ? 1000 : 500))} / ${r.activity === 'run' ? 'km' : '500 m'}`,
        ),
      );
    head.append(
      el(
        'p',
        `${{ fresh: 'En fresco', after: 'Después de otro esfuerzo', race: 'En competición / simulacro' }[r.context]} · ${r.verified ? 'Dato comprobado por ti' : 'Dato sin comprobar'}`,
      ),
    );
    head.append(
      el('p', r.conditions || 'Sin condiciones anotadas: no se compara automáticamente.'),
      el('p', r.notes, 'record-notes'),
    );
    for (const [label, fn] of [
      ['Editar', () => load(r)],
      ['Duplicar', () => load(r, true)],
      [
        'Borrar',
        () => {
          if (confirm('¿Borrar esta referencia?')) {
            store.replace(store.items.filter((v) => v.id !== r.id));
            if (current === r.id) reset();
            render();
          }
        },
      ],
    ]) {
      const button = el('button', label);
      button.type = 'button';
      button.setAttribute('aria-label', `${label}: ${r.name}, ${r.date}`);
      button.addEventListener('click', fn);
      actions.append(button);
    }
    article.append(head, actions);
    $('records-list').append(article);
  }
  const choices = sorted().map((r) => ({ ...r, name: description(r) }));
  options($('reference-a'), choices, 'Referencia A');
  options($('reference-b'), choices, 'Referencia B');
  $('progress-comparison').hidden = true;
}
form.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const r = read();
    store.replace([...store.items.filter((v) => v.id !== r.id), r]);
    reset();
    render();
    $('record-error').textContent = '';
    $('history-heading').focus();
  } catch (e) {
    $('record-error').textContent = e.message;
  }
});
form.addEventListener('input', () => store.dirty());
$('new-record').addEventListener('click', () => {
  if (confirm('¿Vaciar el formulario? Guarda primero los cambios que quieras conservar.')) reset();
});
for (const key of ['filter-activity', 'filter-text']) $(key).addEventListener('input', render);
$('compare-records').addEventListener('click', () => {
  const a = store.items.find((r) => r.id === $('reference-a').value),
    b = store.items.find((r) => r.id === $('reference-b').value);
  $('progress-comparison').hidden = true;
  if (!a || !b || a.id === b.id) {
    $('comparison-error').textContent = 'Selecciona dos referencias distintas.';
    return;
  }
  if (!comparable(a, b)) {
    $('comparison-error').textContent =
      'No son comparables: deben coincidir actividad, cantidad, carga, contexto y condiciones anotadas; en competiciones, también el nombre/formato. No se calcula una diferencia engañosa.';
    return;
  }
  $('comparison-error').textContent = '';
  $('progress-difference').textContent =
    `${description(a)} → ${description(b)}. Diferencia B − A: ${signed(b.seconds - a.seconds)}. Menos tiempo no demuestra por sí solo una mejora: revisa las condiciones y tus notas.`;
  const series = sorted().filter((r) => comparable(a, r)),
    verified = series.filter((r) => r.verified);
  $('best-record').textContent = verified.length
    ? `Menor tiempo entre los datos comprobados por ti de esta referencia: ${clock(Math.min(...verified.map((r) => r.seconds)))}. Comparación local; no es una certificación ni un récord oficial.`
    : 'Aún no has marcado como comprobado ningún resultado de esta referencia.';
  const body = $('evolution-body'),
    chart = $('evolution-chart');
  body.replaceChildren();
  chart.replaceChildren();
  const max = Math.max(...series.map((r) => r.seconds));
  series.forEach((r) => {
    const row = el('tr');
    row.append(el('th', r.date), el('td', clock(r.seconds)), el('td', r.notes || 'Sin notas'));
    row.firstChild.scope = 'row';
    body.append(row);
    const item = el('div', '', 'evolution-row');
    item.append(el('span', r.date));
    const meter = el('meter');
    meter.min = 0;
    meter.max = max;
    meter.value = r.seconds;
    meter.setAttribute('aria-label', `${r.date}: ${clock(r.seconds)}`);
    item.append(meter, el('strong', clock(r.seconds)));
    chart.append(item);
  });
  $('progress-comparison').hidden = false;
  $('evolution-heading').focus();
});
$('export-records').addEventListener('click', () => store.export());
$('export-csv').addEventListener('click', () =>
  download('viveconuve-progreso.csv', csv(store.items), 'text/csv'),
);
$('recover-records').addEventListener('click', () => store.raw());
$('import-records').addEventListener('change', async (event) => {
  try {
    const values = await imported(event.target.files[0], 'records', record, 500);
    store.replace([...store.items, ...values.map((v) => ({ ...v, id: id() }))]);
    render();
    $('record-error').textContent =
      'Registros recuperados. Los que ya tenías guardados se conservan.';
  } catch (e) {
    $('record-error').textContent = e.message;
  }
  event.target.value = '';
});
$('clear-records').addEventListener('click', () => {
  if (store.clear()) {
    reset();
    render();
  }
});
const requestedActivity = new URLSearchParams(location.search).get('actividad');
if (Object.hasOwn(stationPages, requestedActivity)) $('activity').value = requestedActivity;
adapt();
render();

$('print-records').addEventListener('click', () => {
  const rows = [...$('records-list').children];
  if (!rows.length) {
    $('print-records-error').textContent =
      'No hay registros visibles para guardar. Añade una referencia o cambia los filtros.';
    return;
  }
  $('print-records-error').textContent = '';
  const sheet = $('progress-print');
  sheet.replaceChildren(
    el('h1', 'Mi cuaderno de progreso · ViveConUve'),
    el(
      'p',
      `${rows.length} ${rows.length === 1 ? 'referencia seleccionada' : 'referencias seleccionadas'}. Tiempos en minutos:segundos. Datos y notas introducidos por su autor.`,
    ),
  );
  for (const row of rows) {
    const copy = row.cloneNode(true);
    copy.querySelector('.tool-actions')?.remove();
    sheet.append(copy);
  }
  document.body.classList.add('progress-print');
  try {
    window.print();
  } finally {
    document.body.classList.remove('progress-print');
  }
});
