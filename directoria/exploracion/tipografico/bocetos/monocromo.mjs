// Prueba a una tinta (sello, fotocopia, grabado): todo pizarra sobre papel; la D y la I quedan caladas.
import { horizontal, C } from '../build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const TOOLS = '/tmp/claude-0/-home-user-albertoprepatop-web-github-io/db30fac1-e41f-5e34-8ec7-ae08fc5fe643/scratchpad/brandtools';
const out = n => path.join(here, 'r6', n);
fs.writeFileSync(out('monocromo.svg'), horizontal({ dir: C.pizarra, ia: C.pizarra, tile: C.pizarra, dCol: C.papel, iCol: C.papel }));
execFileSync('node', [`${TOOLS}/render.mjs`, out('monocromo.svg'), out('monocromo.png'), '--width', '900', '--bg', C.papel, '--pad', '30']);
execFileSync('node', [`${TOOLS}/render.mjs`, out('monocromo.svg'), out('monocromo-160.png'), '--width', '160', '--bg', C.papel, '--pad', '10']);
execFileSync('node', [`${TOOLS}/render.mjs`, '--sheet', out('monocromo-hoja.png'), '--cols', '2', '--cell', '520', '--bg', '#ffffff',
  '--label', 'Una tinta', out('monocromo.png'), '--label', 'Una tinta a 160 px de ancho', out('monocromo-160.png')]);
console.log('ok');
