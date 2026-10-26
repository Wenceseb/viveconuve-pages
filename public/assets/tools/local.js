import { pack, unpack } from './model.js';
export const id = () => crypto.randomUUID();
export function download(name, value, type = 'application/json') {
  const url = URL.createObjectURL(new Blob([value], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function imported(file, kind, validator, limit) {
  const maxBytes = kind === 'records' ? 8000000 : 1000000;
  if (!file || file.size > maxBytes)
    throw new Error(
      `Elige una copia de seguridad de ViveConUve de hasta ${maxBytes / 1000000} MB.`,
    );
  let data;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error(
      'No podemos leer esta copia de seguridad. Elige una descargada desde ViveConUve. Tus datos no se han cambiado.',
    );
  }
  return unpack(data, kind, validator, limit);
}
export function localCollection(kind, validator, limit, status) {
  const key = `vcv_${kind}_v1`;
  let items = [],
    locked = false,
    unsaved = false;
  const warn = (message) => {
    status.textContent = message;
  };
  try {
    const raw = localStorage.getItem(key);
    if (raw) items = unpack(JSON.parse(raw), kind, validator, limit);
    localStorage.setItem('vcv_probe', '1');
    localStorage.removeItem('vcv_probe');
    warn('Guardado local disponible. Pulsa Guardar para conservar tus cambios en este navegador.');
  } catch {
    locked = true;
    warn(
      'No se puede leer o guardar el archivo local. Se conserva sin sobrescribir. Puedes trabajar en esta sesión y exportar antes de cerrar.',
    );
  }
  window.addEventListener('storage', (event) => {
    if (event.key === key || event.key === null) {
      locked = true;
      warn(
        'El archivo ha cambiado en otra pestaña. Exporta lo que necesites y recarga antes de volver a guardar.',
      );
    }
  });
  window.addEventListener('beforeunload', (event) => {
    if (unsaved) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  return {
    get items() {
      return items;
    },
    dirty() {
      unsaved = true;
    },
    replace(next) {
      if (next.length > limit)
        throw new Error(
          `Puedes guardar hasta ${limit} elementos. Exporta y borra los que ya no necesites.`,
        );
      items = next.map(validator);
      try {
        if (locked) throw new Error();
        localStorage.setItem(key, JSON.stringify(pack(kind, items)));
        unsaved = false;
        warn(
          'Guardado en este navegador. Exporta una copia para conservarla fuera de este dispositivo.',
        );
      } catch {
        unsaved = true;
        warn(
          'Cambios disponibles solo en esta sesión: el navegador no permite guardarlos. Exporta antes de cerrar.',
        );
      }
    },
    export() {
      download(`viveconuve-${kind}.json`, JSON.stringify(pack(kind, items), null, 2));
    },
    raw() {
      try {
        download(
          `viveconuve-${kind}-recuperacion.txt`,
          localStorage.getItem(key) || 'Sin datos locales',
          'text/plain',
        );
      } catch {
        warn('El navegador impide acceder a los datos locales.');
      }
    },
    clear() {
      if (!confirm('¿Borrar todo este archivo local? Exporta antes si quieres conservarlo.'))
        return false;
      try {
        localStorage.removeItem(key);
        locked = false;
        unsaved = false;
        items = [];
        warn('Archivo local borrado.');
        return true;
      } catch {
        warn('El navegador no permite borrar el archivo local.');
        return false;
      }
    },
  };
}
export const el = (tag, text = '', className = '') => {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
};
export function options(select, items, placeholder = 'Selecciona un registro') {
  const previous = select.value;
  select.replaceChildren(new Option(placeholder, ''));
  items.forEach((v) => select.add(new Option(v.name, v.id)));
  if (items.some((v) => v.id === previous)) select.value = previous;
}
