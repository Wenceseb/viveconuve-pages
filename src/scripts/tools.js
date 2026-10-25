(() => {
  'use strict';
  const byId = (id) => document.getElementById(id);
  const clock = (seconds) => {
    const rounded = Math.round(seconds);
    return `${Math.floor(rounded / 60)}:${String(rounded % 60).padStart(2, '0')}`;
  };
  const number = (id, min, max, integer = false) => {
    const input = byId(id),
      raw = input.value.trim().replace(',', '.');
    const valid = /^\d+(?:\.\d+)?$/.test(raw);
    const value = valid ? Number(raw) : NaN;
    if (
      !Number.isFinite(value) ||
      value < min ||
      value > max ||
      (integer && !Number.isInteger(value))
    ) {
      input.setAttribute('aria-invalid', 'true');
      throw {
        input,
        message: `${input.labels[0].textContent}: introduce ${integer ? 'un número entero' : 'un número'} entre ${min} y ${max}.`,
      };
    }
    return value;
  };
  byId('pace-form').addEventListener('submit', (event) => {
    event.preventDefault();
    byId('pace-form')
      .querySelectorAll('input')
      .forEach((input) => input.removeAttribute('aria-invalid'));
    byId('pace-error').textContent = '';
    byId('pace-result').hidden = true;
    try {
      const count = number('segments', 1, 100, true),
        distance = number('distance', 0.01, 100);
      const minutes = number('pace-min', 0, 59, true),
        seconds = number('pace-sec', 0, 59, true);
      if (minutes + seconds === 0)
        throw { input: byId('pace-min'), message: 'El ritmo debe ser mayor que 0:00 min/km.' };
      const extraMin = byId('extra-min').value.trim() ? number('extra-min', 0, 999, true) : 0;
      const extraSec = byId('extra-sec').value.trim() ? number('extra-sec', 0, 59, true) : 0;
      const perLeg = distance * (minutes * 60 + seconds),
        run = perLeg * count;
      byId('per-leg').textContent = clock(perLeg);
      byId('total-distance').textContent =
        `${Number((distance * count).toFixed(3)).toLocaleString('es-ES')} km`;
      byId('run-total').textContent = clock(run);
      byId('combined-total').textContent = clock(run + extraMin * 60 + extraSec);
      byId('pace-assumptions').textContent =
        `${count} tramos de ${distance.toLocaleString('es-ES')} km al mismo ritmo de ${clock(minutes * 60 + seconds)}/km. Tiempo manual añadido: ${clock(extraMin * 60 + extraSec)}. Tiempos en minutos:segundos, redondeados al segundo. La suma no predice tu resultado.`;
      byId('pace-result').hidden = false;
    } catch (error) {
      byId('pace-error').textContent = error.message;
      error.input?.setAttribute('aria-invalid', 'true');
      error.input?.focus();
    }
  });
  document.querySelectorAll('[data-preset]').forEach((button) =>
    button.addEventListener('click', () => {
      byId('segments').value = '8';
      byId('distance').value = '1';
      byId('pace-min').value = '5';
      byId('pace-sec').value = '30';
      byId('pace-form').requestSubmit();
    }),
  );
  byId('pace-form').addEventListener('input', () => {
    byId('pace-result').hidden = true;
  });

  let storageOK = true,
    unsaved = false;
  const status = byId('storage-status');
  const unavailable = () => {
    storageOK = false;
    status.textContent =
      'No se puede guardar en este navegador. Puedes usar las herramientas en esta sesión; exporta o imprime antes de cerrar.';
  };
  try {
    localStorage.setItem('vcv_tools_probe', '1');
    localStorage.removeItem('vcv_tools_probe');
    status.textContent =
      'Las notas y la checklist se guardan automáticamente solo en este navegador. No se envían a ViveConUve. En un dispositivo compartido, bórralas al terminar.';
  } catch {
    unavailable();
  }
  const load = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      unavailable();
      return fallback;
    }
  };
  const persist = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (!storageOK) unsaved = true;
    } catch {
      unavailable();
      unsaved = true;
    }
  };
  window.addEventListener('beforeunload', (event) => {
    if (unsaved) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  const fields = Array.from(byId('review-form').querySelectorAll('input, textarea'));
  const review = load('vcv_race_review_v1', {});
  for (const input of fields)
    if (typeof review?.[input.name] === 'string')
      input.value = review[input.name].slice(0, input.maxLength > 0 ? input.maxLength : 100);
  const reviewValues = () => Object.fromEntries(fields.map((input) => [input.name, input.value]));
  const reviewText = () =>
    'Mi revisión de competición · ViveConUve\n\n' +
    fields
      .map((input) => `${input.labels[0].textContent}\n${input.value || 'Sin anotar'}\n`)
      .join('\n');
  const updateReview = () => {
    byId('review-print').textContent = reviewText();
  };
  updateReview();
  byId('review-form').addEventListener('input', () => {
    persist('vcv_race_review_v1', reviewValues());
    updateReview();
    byId('review-status').textContent = storageOK
      ? 'Cambios guardados en este navegador.'
      : 'Cambios disponibles solo en esta sesión. Exporta antes de cerrar.';
  });
  byId('review-form').addEventListener('submit', (event) => event.preventDefault());
  byId('export-review').addEventListener('click', () => {
    const blob = new Blob([reviewText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download = 'mi-revision-competicion.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  byId('clear-review').addEventListener('click', () => {
    if (!confirm('¿Borrar la revisión guardada? Exporta antes si quieres conservarla.')) return;
    fields.forEach((input) => {
      input.value = '';
    });
    try {
      localStorage.removeItem('vcv_race_review_v1');
    } catch {
      unavailable();
    }
    updateReview();
    byId('review-status').textContent = 'Revisión borrada.';
    fields[0].focus();
  });
  let savedList = load('vcv_checklist_v1', {});
  if (!savedList || typeof savedList !== 'object') savedList = {};
  const list = byId('custom-checks');
  const checks = () => Array.from(byId('checklist').querySelectorAll('input[type="checkbox"]'));
  for (const input of checks()) input.checked = savedList.checked?.[input.name] === true;
  const addCustom = (label, checked = false) => {
    const wrapper = document.createElement('label'),
      input = document.createElement('input'),
      span = document.createElement('span');
    input.type = 'checkbox';
    input.checked = checked;
    span.textContent = label;
    wrapper.append(input, span);
    list.append(wrapper);
  };
  if (Array.isArray(savedList.custom))
    savedList.custom.slice(0, 40).forEach((item) => {
      if (typeof item?.text === 'string') addCustom(item.text.slice(0, 160), item.checked === true);
    });
  const saveList = () =>
    persist('vcv_checklist_v1', {
      checked: Object.fromEntries(
        checks()
          .filter((input) => input.name)
          .map((input) => [input.name, input.checked]),
      ),
      custom: Array.from(list.querySelectorAll('label')).map((label) => ({
        text: label.querySelector('span').textContent,
        checked: label.querySelector('input').checked,
      })),
    });
  const updateCount = () => {
    byId('check-count').textContent =
      `${checks().filter((input) => input.checked).length} de ${checks().length} comprobaciones marcadas.`;
  };
  updateCount();
  byId('checklist').addEventListener('change', () => {
    saveList();
    updateCount();
  });
  byId('add-check-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = byId('custom-check').value.trim();
    if (!text) {
      byId('check-message').textContent = 'Escribe la comprobación que quieres añadir.';
      byId('custom-check').focus();
      return;
    }
    if (list.children.length >= 40) {
      byId('check-message').textContent = 'Puedes añadir hasta 40 comprobaciones propias.';
      return;
    }
    addCustom(text);
    byId('custom-check').value = '';
    saveList();
    updateCount();
    byId('check-message').textContent = 'Comprobación añadida.';
    byId('custom-check').focus();
  });
  byId('reset-checks').addEventListener('click', () => {
    if (!confirm('¿Desmarcar toda la lista? Se conservarán tus comprobaciones propias.')) return;
    checks().forEach((input) => {
      input.checked = false;
    });
    saveList();
    updateCount();
  });
  byId('clear-checks').addEventListener('click', () => {
    if (
      !confirm('¿Borrar los datos de la checklist, incluidas las comprobaciones que has añadido?')
    )
      return;
    list.replaceChildren();
    checks().forEach((input) => {
      input.checked = false;
    });
    try {
      localStorage.removeItem('vcv_checklist_v1');
    } catch {
      unavailable();
    }
    updateCount();
    byId('check-message').textContent = 'Datos de la checklist borrados.';
  });
  document.querySelectorAll('[data-print-tool]').forEach((button) =>
    button.addEventListener('click', () => {
      updateReview();
      document.body.dataset.printTool = button.dataset.printTool;
      window.print();
    }),
  );
  window.addEventListener('afterprint', () => {
    delete document.body.dataset.printTool;
  });
})();
