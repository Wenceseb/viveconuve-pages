// Pure, shared calculations and validation. Stored times are integer seconds.
export const stations = [
  'SkiErg',
  'Sled Push',
  'Sled Pull',
  'Burpee Broad Jumps',
  'Rowing',
  'Farmers Carry',
  'Sandbag Lunges',
  'Wall Balls',
];
export const categories = ['Women Open', 'Men Open', 'Women Pro', 'Men Pro'];
export function time(value, allowZero = false) {
  const raw = String(value).trim();
  let seconds;
  if (/^\d{1,3}:[0-5]\d$/.test(raw)) {
    const [m, s] = raw.split(':').map(Number);
    seconds = m * 60 + s;
  } else if (/^\d{1,2}:[0-5]\d:[0-5]\d$/.test(raw)) {
    const [h, m, s] = raw.split(':').map(Number);
    seconds = h * 3600 + m * 60 + s;
  } else if (/^\d{1,3}(?:[.,]\d{1,3})?$/.test(raw))
    seconds = Math.round(Number(raw.replace(',', '.')) * 60);
  else
    throw new Error(
      'Usa minutos:segundos (5:30), horas:minutos:segundos (1:20:00) o minutos decimales (5,5).',
    );
  if (seconds > 86400 || seconds < (allowZero ? 0 : 1))
    throw new Error(
      'El tiempo debe estar entre ' + (allowZero ? '0' : '1 segundo') + ' y 24 horas.',
    );
  return seconds;
}
export function clock(seconds) {
  const s = Math.round(Math.abs(seconds));
  return `${seconds < 0 ? '−' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
export function signed(seconds) {
  return (seconds > 0 ? '+' : '') + clock(seconds);
}
const fail = () => {
  throw new Error('Archivo incompatible o datos no válidos. No se ha importado ningún elemento.');
};
export function text(value, max = 160, required = true) {
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail();
  return value.trim();
}
export function numeric(value, min, max, integer = false) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  )
    fail();
  return value;
}
export function scenario(value) {
  if (!value || !categories.includes(value.category)) fail();
  const result = {
    id: text(value.id, 80),
    name: text(value.name, 100),
    category: value.category,
    target: numeric(value.target, 1, 86400, true),
  };
  for (const key of ['runs', 'work', 'entry', 'exit']) {
    if (!Array.isArray(value[key]) || value[key].length !== 8) fail();
    result[key] = value[key].map((v) =>
      numeric(v, key === 'runs' || key === 'work' ? 1 : 0, 7200, true),
    );
  }
  return result;
}
export function sumPlan(plan) {
  const parts = Object.fromEntries(
    ['runs', 'work', 'entry', 'exit'].map((k) => [k, plan[k].reduce((a, b) => a + b, 0)]),
  );
  let cumulative = 0;
  const timeline = stations.flatMap((station, i) =>
    [
      [`Carrera ${i + 1} · 1 km`, plan.runs[i]],
      [`Entrada ${i + 1}`, plan.entry[i]],
      [station, plan.work[i]],
      [`Salida ${i + 1}${i === 7 ? ' hasta meta' : ''}`, plan.exit[i]],
    ].map(([label, seconds]) => ({ label, seconds, cumulative: (cumulative += seconds) })),
  );
  return {
    ...parts,
    total: cumulative,
    transitions: parts.entry + parts.exit,
    delta: cumulative - plan.target,
    timeline,
  };
}
export function comparePlans(a, b) {
  const x = sumPlan(a),
    y = sumPlan(b);
  return {
    total: y.total - x.total,
    rows: x.timeline.map((r, i) => ({
      ...r,
      other: y.timeline[i].seconds,
      delta: y.timeline[i].seconds - r.seconds,
    })),
  };
}
export const activities = {
  run: { label: 'Carrera', unit: 'm', load: false },
  ski: { label: 'SkiErg', unit: 'm', load: false },
  row: { label: 'RowErg', unit: 'm', load: false },
  push: { label: 'Sled Push', unit: 'm', load: true },
  pull: { label: 'Sled Pull', unit: 'm', load: true },
  burpee: { label: 'Burpee Broad Jumps', unit: 'm', load: false },
  carry: { label: 'Farmers Carry', unit: 'm', load: true },
  lunge: { label: 'Sandbag Lunges', unit: 'm', load: true },
  wall: { label: 'Wall Balls', unit: 'repeticiones', load: true },
  race: { label: 'Competición / simulacro', unit: null, load: false },
};
export function record(value) {
  if (!value || !Object.hasOwn(activities, value.activity)) fail();
  const a = activities[value.activity];
  const date = text(value.date, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    fail();
  if (!['fresh', 'after', 'race'].includes(value.context)) fail();
  return {
    id: text(value.id, 80),
    activity: value.activity,
    date,
    name: text(value.name, 100),
    amount: a.unit ? numeric(value.amount, 0.01, 1000000) : null,
    load: a.load ? numeric(value.load, 0, 1000) : null,
    seconds: numeric(value.seconds, 1, 86400, true),
    context: value.context,
    conditions: text(value.conditions, 200, false),
    notes: text(value.notes, 2000, false),
    verified: value.verified === true,
  };
}
export function groupKey(value) {
  // Missing conditions never establish comparability.
  if (!value.conditions.trim()) return null;
  return JSON.stringify([
    value.activity,
    value.amount,
    value.load,
    value.context,
    value.conditions.trim().toLocaleLowerCase('es'),
    value.activity === 'race' ? value.name.trim().toLocaleLowerCase('es') : null,
  ]);
}
export function comparable(a, b) {
  const key = groupKey(a);
  return key !== null && key === groupKey(b);
}
export function pack(kind, items) {
  return { application: 'viveconuve', version: 1, kind, items };
}
export function unpack(value, kind, validator, limit) {
  if (
    value?.application !== 'viveconuve' ||
    value.version !== 1 ||
    value.kind !== kind ||
    !Array.isArray(value.items) ||
    value.items.length > limit
  )
    fail();
  const items = value.items.map(validator);
  if (new Set(items.map((v) => v.id)).size !== items.length) fail();
  return items;
}
export function csv(items) {
  const columns = [
    'date',
    'activity',
    'name',
    'amount',
    'load',
    'seconds',
    'context',
    'conditions',
    'notes',
    'verified',
  ];
  const cell = (v) =>
    `"${String(v ?? '')
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""')}"`;
  return (
    '\uFEFF' +
    [columns, ...items.map((r) => columns.map((k) => r[k]))]
      .map((row) => row.map(cell).join(','))
      .join('\r\n')
  );
}
