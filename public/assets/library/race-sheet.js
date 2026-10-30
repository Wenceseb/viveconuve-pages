(() => {
  const sheet = document.querySelector('#race-sheet');
  if (!sheet) return;
  const controls = sheet.querySelector('.race-sheet-controls');
  const select = sheet.querySelector('#race-category');
  const panels = [...sheet.querySelectorAll('[data-race-category]')];
  const print = sheet.querySelector('#race-print');
  const help = sheet.querySelector('#race-print-help');
  const status = sheet.querySelector('#race-selection-status');
  const update = (value, announce = false) => {
    const selected = panels.find((panel) => panel.dataset.raceCategory === value);
    select.value = selected ? value : '';
    panels.forEach((panel) => {
      panel.hidden = panel !== selected;
      panel.open = panel === selected;
    });
    print.hidden = help.hidden = !selected;
    sheet.classList.toggle('race-sheet-selected', !!selected);
    status.textContent = announce
      ? selected
        ? `Ficha actualizada: ${select.selectedOptions[0].textContent}.`
        : 'Elige una modalidad para consultar su ficha.'
      : '';
  };
  const fromUrl = () => update(new URL(location.href).searchParams.get('modalidad'));
  select.addEventListener('change', () => {
    update(select.value, true);
    const url = new URL(location.href);
    if (select.value) url.searchParams.set('modalidad', select.value);
    else url.searchParams.delete('modalidad');
    try {
      history.replaceState(null, '', url);
    } catch {
      /* Selection still works without history access. */
    }
  });
  addEventListener('popstate', fromUrl);
  print.addEventListener('click', () => {
    const selected = panels.find((panel) => !panel.hidden);
    if (!selected) return;
    selected.open = true;
    window.print();
  });
  fromUrl();
  controls.hidden = false;
})();
