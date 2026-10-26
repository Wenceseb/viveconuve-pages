import {
  stations,
  categories,
  time,
  clock,
  signed,
  scenario,
  sumPlan,
  comparePlans,
} from './model.js';
import { id, localCollection, imported, el, options } from './local.js';
const $ = (s) => document.getElementById(s);
const store = localCollection('plans', scenario, 30, $('local-status'));
let current = id(),
  result = null;
const form = $('planner-form');
categories.forEach((v) => $('category').add(new Option(v, v)));
stations.forEach((name, i) => {
  const section = el('details', '', 'race-block'),
    legend = el('summary', `${i + 1}. ${name}`);
  section.id = `block-${i}`;
  section.open = i === 0;
  section.append(legend);
  const grid = el('div', '', 'race-inputs');
  [
    ['runs', 'Carrera · 1 km'],
    ['entry', 'Entrada a estación'],
    ['work', name],
    ['exit', i === 7 ? 'Salida hasta meta' : 'Salida a carrera'],
  ].forEach(([key, label]) => {
    const wrap = el('div'),
      l = el('label', label),
      input = el('input');
    input.id = `${key}-${i}`;
    l.htmlFor = input.id;
    input.defaultValue = key === 'entry' || key === 'exit' ? '0:00' : '';
    input.placeholder = 'min:ss';
    input.inputMode = 'text';
    input.maxLength = 9;
    input.setAttribute('aria-describedby', 'time-help planner-error');
    wrap.append(l, input);
    grid.append(wrap);
  });
  section.append(grid);
  $('race-blocks').append(section);
});
function read() {
  const value = { id: current, name: $('plan-name').value.trim(), category: $('category').value };
  form.querySelectorAll('[aria-invalid]').forEach((n) => n.removeAttribute('aria-invalid'));
  const parse = (input, zero = false) => {
    try {
      const value = time(input.value, zero);
      if (input.id !== 'target' && value > 7200)
        throw new Error('Cada segmento admite hasta 120 minutos.');
      return value;
    } catch (error) {
      input.setAttribute('aria-invalid', 'true');
      const block = input.closest('details');
      if (block) block.open = true;
      input.focus();
      throw new Error(`${input.labels[0].textContent}: ${error.message}`);
    }
  };
  if (!value.name) {
    $('plan-name').focus();
    throw new Error('Pon un nombre al escenario.');
  }
  value.target = parse($('target'));
  for (const key of ['runs', 'work', 'entry', 'exit'])
    value[key] = stations.map((_, i) => parse($(`${key}-${i}`), key === 'entry' || key === 'exit'));
  return scenario(value);
}
function summary(plan, target) {
  const s = sumPlan(plan);
  target.replaceChildren();
  target.append(
    el('p', plan.name, 'result-name'),
    el('p', plan.category),
    el('p', clock(s.total), 'race-total'),
    el('p', `Objetivo ${clock(plan.target)} · diferencia ${signed(s.delta)}`),
  );
  const list = el('dl', '', 'composition');
  [
    ['Carrera', s.runs],
    ['Estaciones', s.work],
    ['Roxzone y llegada', s.transitions],
  ].forEach(([label, value]) => {
    const row = el('div');
    row.append(el('dt', label), el('dd', clock(value)));
    const meter = el('meter');
    meter.min = 0;
    meter.max = s.total;
    meter.value = value;
    meter.setAttribute('aria-label', `${label}: ${clock(value)} de ${clock(s.total)}`);
    const visual = el('dd', '', 'composition-meter');
    visual.append(meter);
    row.append(visual);
    list.append(row);
  });
  target.append(list);
}
function renderResult(plan) {
  result = plan;
  summary(plan, $('plan-summary'));
  const body = $('timeline-body');
  body.replaceChildren();
  sumPlan(plan).timeline.forEach((row) => {
    const tr = el('tr');
    tr.append(el('th', row.label), el('td', clock(row.seconds)), el('td', clock(row.cumulative)));
    tr.firstChild.scope = 'row';
    body.append(tr);
  });
  $('planner-result').hidden = false;
  $('planner-error').textContent = '';
}
const attempt = (fn) => {
  try {
    fn();
    $('planner-error').textContent = '';
  } catch (e) {
    $('planner-error').textContent = e.message;
  }
};
form.addEventListener('submit', (event) => {
  event.preventDefault();
  attempt(() => {
    renderResult(read());
    $('result-heading').focus();
  });
});
form.addEventListener('input', () => {
  result = null;
  $('planner-result').hidden = true;
  store.dirty();
});
$('uniform').addEventListener('click', () =>
  attempt(() => {
    const seconds = time($('uniform-pace').value);
    stations.forEach((_, i) => ($(`runs-${i}`).value = clock(seconds)));
    result = null;
    $('planner-result').hidden = true;
    store.dirty();
  }),
);
$('example').addEventListener('click', () => {
  if (
    !confirm(
      '¿Cargar un ejemplo inventado de HYROX? Sustituye los campos actuales, pero no borra escenarios guardados.',
    )
  )
    return;
  current = id();
  $('plan-name').value = 'Ejemplo HYROX · hipótesis';
  $('target').value = '80:00';
  stations.forEach((_, i) => {
    for (const [key, v] of [
      ['runs', '5:30'],
      ['work', '3:00'],
      ['entry', '0:15'],
      ['exit', '0:15'],
    ])
      $(`${key}-${i}`).value = v;
  });
  renderResult(read());
  store.dirty();
});
function load(plan) {
  current = plan.id;
  $('plan-name').value = plan.name;
  $('category').value = plan.category;
  $('target').value = clock(plan.target);
  for (const key of ['runs', 'work', 'entry', 'exit'])
    plan[key].forEach((v, i) => ($(`${key}-${i}`).value = clock(v)));
  renderResult(plan);
  $('plan-name').focus();
}
function refresh() {
  options($('saved-plans'), store.items, 'Escenarios guardados');
  options($('compare-a'), store.items, 'Escenario A');
  options($('compare-b'), store.items, 'Escenario B');
  $('plan-count').textContent = `${store.items.length} de 30 escenarios guardados.`;
  $('comparison').hidden = true;
}
$('save-plan').addEventListener('click', () =>
  attempt(() => {
    const plan = read(),
      next = store.items.filter((v) => v.id !== plan.id);
    store.replace([...next, plan]);
    refresh();
    $('saved-plans').value = plan.id;
    renderResult(plan);
  }),
);
$('new-plan').addEventListener('click', () => {
  if (!confirm('¿Empezar un escenario vacío? Guarda primero los cambios que quieras conservar.'))
    return;
  current = id();
  form.reset();
  result = null;
  $('planner-result').hidden = true;
  $('plan-name').focus();
});
$('load-plan').addEventListener('click', () =>
  attempt(() => {
    const plan = store.items.find((v) => v.id === $('saved-plans').value);
    if (!plan) throw new Error('Selecciona un escenario guardado.');
    if (confirm('¿Abrir este escenario y sustituir los campos actuales?')) load(plan);
  }),
);
$('clone-plan').addEventListener('click', () =>
  attempt(() => {
    const plan = read();
    plan.id = id();
    plan.name = (plan.name + ' · copia').slice(0, 100);
    store.replace([...store.items, plan]);
    refresh();
    load(plan);
    $('saved-plans').value = plan.id;
  }),
);
$('delete-plan').addEventListener('click', () =>
  attempt(() => {
    const value = $('saved-plans').value;
    if (!value) throw new Error('Selecciona el escenario que quieres borrar.');
    if (confirm('¿Borrar este escenario del archivo local?')) {
      store.replace(store.items.filter((v) => v.id !== value));
      if (current === value) current = id();
      refresh();
    }
  }),
);
$('compare').addEventListener('click', () =>
  attempt(() => {
    const a = store.items.find((v) => v.id === $('compare-a').value),
      b = store.items.find((v) => v.id === $('compare-b').value);
    if (!a || !b || a.id === b.id)
      throw new Error('Selecciona dos escenarios distintos para comparar.');
    if (a.category !== b.category)
      throw new Error('Selecciona escenarios de la misma categoría para comparar sus hipótesis.');
    summary(a, $('summary-a'));
    summary(b, $('summary-b'));
    const comparison = comparePlans(a, b);
    $('compare-difference').textContent =
      `B respecto a A: ${signed(comparison.total)}. Un valor negativo significa menos tiempo. Los objetivos pueden ser distintos.`;
    const body = $('compare-body');
    body.replaceChildren();
    comparison.rows
      .filter((v) => v.delta !== 0)
      .forEach((row) => {
        const tr = el('tr');
        tr.append(
          el('th', row.label),
          el('td', clock(row.seconds)),
          el('td', clock(row.other)),
          el('td', signed(row.delta)),
        );
        tr.firstChild.scope = 'row';
        body.append(tr);
      });
    $('same-plan').hidden = comparison.rows.some((v) => v.delta !== 0);
    $('comparison').hidden = false;
    $('comparison-heading').focus();
  }),
);
$('export-plans').addEventListener('click', () => store.export());
$('recover-plans').addEventListener('click', () => store.raw());
$('import-plans').addEventListener('change', async (event) => {
  try {
    const values = await imported(event.target.files[0], 'plans', scenario, 30);
    store.replace([...store.items, ...values.map((v) => ({ ...v, id: id() }))]);
    refresh();
    $('planner-error').textContent =
      'Importación añadida al archivo. Los escenarios anteriores se conservan.';
  } catch (e) {
    $('planner-error').textContent = e.message;
  }
  event.target.value = '';
});
$('clear-plans').addEventListener('click', () => {
  if (store.clear()) refresh();
});
$('print-plan').addEventListener('click', () =>
  attempt(() => {
    renderResult(read());
    window.print();
  }),
);
refresh();
