import { el } from './local.js';
const $ = (s) => document.getElementById(s);
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
