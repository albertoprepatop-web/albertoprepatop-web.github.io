// Ronda 4: el símbolo elegido («visto bueno») con la palabra, en varias combinaciones.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo, horizontal } from '../build.mjs';
import { C, write } from '../lib.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = f => path.join(here, 'r4', f);

const V = (o) => ({ ...base, ...o });
const sets = [
  ['A · I con remates, IA chispa-texto, baldosa pizarra-2 en negativo', V({})],
  ['B · igual, negativo sin baldosa (el fondo es la pizarra)', V({ negTile: null })],
  ['C · IA en chispa también sobre claro', V({ iaLight: C.chispa })],
  ['D · I de Rubik sin remates (control)', V({ iStyle: 'plain' })],
  ['E · Rubik 600', V({ weight: 600 })],
];
await previewLogos(out('logos.png'), sets.map(([label, o]) => ({ label, pos: horizontal('pos', o), neg: horizontal('neg', o), h: 110 })), { title: 'Ronda 4 · logotipo' });
await previewSheet(out('simbolos.png'), [
  { label: 'base', pos: isotipo('pos'), neg: isotipo('neg') },
  { label: 'negativo sin baldosa', pos: isotipo('pos'), neg: isotipo('neg', V({ negTile: null })) },
  { label: 'una tinta', pos: isotipo('mono'), neg: isotipo('monoNeg') },
], { title: 'Ronda 4 · símbolo' });
console.log('ok');
