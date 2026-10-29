import { escapeHtml as e } from './content.mjs';
const drawings = {
  skierg: [
    'Ergómetro de esquí',
    '<path d="M95 215H245M150 210V40H220V210M155 45L110 125M215 45L260 125"/><path d="M98 125H122M248 125H272"/><rect x="165" y="90" width="40" height="26" rx="3"/><circle cx="185" cy="175" r="25"/><path d="M130 150V195L120 185M240 150V195L230 185"/>',
    '1.000 m',
    'Monitor, empuñaduras y plataforma. La distancia se comprueba en el monitor.',
  ],
  rowing: [
    'Ergómetro de remo',
    '<circle cx="100" cy="155" r="48"/><circle cx="100" cy="155" r="27"/><path d="M145 170H310M72 198V220M295 170V220M122 120L155 75H190M130 145L215 125M202 120L227 130"/><rect x="160" y="58" width="40" height="25" rx="3"/><rect x="225" y="150" width="42" height="13" rx="4"/>',
    '1.000 m',
    'Monitor, volante, empuñadura y asiento sobre el raíl. Esquema del material, sin escala.',
  ],
  'sled-push': [
    'Trineo: empujar',
    '<path d="M90 195H275M105 190V80M255 190V80M115 80V185M245 80V185"/><rect x="150" y="160" width="65" height="22"/><rect x="160" y="140" width="45" height="20"/><path d="M182 140V100M135 225H260L245 214M260 225L245 236"/>',
    '4 × 12,5 m',
    'Cuatro largos en el mismo carril, cambiando de sentido. 50 m en total.',
  ],
  'sled-pull': [
    'Trineo: tirar',
    '<path d="M160 195H305M175 190V95M290 190V95"/><rect x="205" y="157" width="55" height="25"/><path d="M232 157V115M160 180C130 130 105 215 70 155M140 225H50L65 214M50 225L65 236"/>',
    '4 × 12,5 m',
    'Trineo y cuerda. Cuatro largos alternando el extremo desde el que se tira.',
  ],
  'burpee-broad-jumps': [
    'Avance por el recorrido',
    '<path d="M55 200H315M60 185V215M310 185V215M85 170Q135 70 185 170M185 170Q235 70 285 170M85 175H105M175 175H195M275 175H295"/><path d="M285 170L272 150M285 170L264 166"/>',
    '80 m',
    'Cada avance enlaza un burpee y un salto hacia delante. Esquema de recorrido, no de técnica corporal.',
  ],
  'farmers-carry': [
    'Una pesa en cada mano',
    '<path d="M88 125V105Q88 65 128 65Q168 65 168 105V125M208 125V105Q208 65 248 65Q288 65 288 105V125"/><circle cx="128" cy="160" r="50"/><circle cx="248" cy="160" r="50"/><path d="M80 235H295L280 224M295 235L280 246"/>',
    '200 m',
    'Dos pesas. Consulta el peso de cada una en la tabla de tu modalidad.',
  ],
  'sandbag-lunges': [
    'Saco de carga',
    '<rect x="80" y="100" width="225" height="95" rx="35"/><path d="M125 100V195M260 100V195M160 125H225V145H160ZM80 230H305L290 219M305 230L290 241"/>',
    '100 m',
    'Saco y distancia del recorrido. Consulta la carga de tu modalidad; el dibujo no representa la ejecución de la zancada.',
  ],
  'wall-balls': [
    'Balón y diana',
    '<path d="M100 220V65M275 220V40"/><circle cx="100" cy="65" r="30"/><circle cx="275" cy="40" r="30"/><circle cx="100" cy="65" r="10"/><circle cx="275" cy="40" r="10"/><circle cx="185" cy="180" r="32"/><path d="M160 160Q190 180 208 202M182 148Q170 180 182 210"/>',
    '100 repeticiones',
    'Diana femenina: 2,70 m. Diana masculina: 3,00 m. Alturas esquemáticas, sin escala.',
  ],
};
export function stationVisual(slug) {
  const [label, shapes, measure, caption] = drawings[slug];
  return `<figure class="station-diagram station-material"><svg viewBox="0 0 380 280" role="img" aria-labelledby="material-title"><title id="material-title">${e(label)}</title><rect width="380" height="280" fill="#e3ebe4"/><g stroke="#193b32" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${shapes}</g></svg><div class="station-material-label"><span>${e(label)}</span><strong>${e(measure)}</strong></div><figcaption>${e(caption)} Ilustración original de ViveConUve.</figcaption></figure>`;
}
