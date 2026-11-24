// Comprobación a una tinta (sello, fotocopia, grabado): pizarra con el visto y la chispa calados.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { base, isotipo, horizontal } from '../build.mjs';
import { write } from '../lib.mjs';
import { previewSheet, previewLogos } from '../preview.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const out = f => path.join(here, 'una-tinta', f);

write(out('isotipo-una-tinta.svg'), isotipo('mono'));
write(out('isotipo-una-tinta-negativo.svg'), isotipo('monoNeg'));
write(out('logo-una-tinta.svg'), horizontal('mono'));
write(out('logo-una-tinta-negativo.svg'), horizontal('monoNeg'));
await previewSheet(out('una-tinta.png'), [{ label: 'isotipo a una tinta', pos: isotipo('mono'), neg: isotipo('monoNeg') }], { title: 'Una tinta' });
await previewLogos(out('logo-una-tinta.png'), [{ label: 'logotipo a una tinta (la I con remates sigue leyéndose como mayúscula sin el color)', pos: horizontal('mono'), neg: horizontal('monoNeg'), h: 90 }], { title: 'Una tinta' });
console.log('ok');
