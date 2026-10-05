import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

test('compiled server functions start in native Node ESM without the Vite/tsx resolver', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'ubikka-runtime-'));
  try {
    await writeFile(join(dir, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const folder of ['api', 'server', 'shared']) {
      await mkdir(join(dir, folder));
      for (const file of await readdir(resolve(folder))) {
        if (!file.endsWith('.ts')) continue;
        const source = await readFile(resolve(folder, file), 'utf8');
        const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
        await writeFile(join(dir, folder, file.replace(/\.ts$/, '.js')), result.outputText);
      }
    }
    await mkdir(join(dir, 'dist'));
    await writeFile(join(dir, 'dist/index.html'), '<html><head><title>Base</title></head><body><div id="root"></div></body></html>');
    const check = `
      import assert from 'node:assert/strict';
      const names = ['page', 'properties', 'inquiries', 'seo', 'site'];
      for (const name of names) assert.equal(typeof (await import('./api/' + name + '.js')).default, 'function');
      const page = (await import('./api/page.js')).default;
      for (const path of ['/', '/propiedades', '/privacidad']) {
        const res = { statusCode: 200, setHeader() {}, end(body) { this.body = body; } };
        await page({ method: 'GET', url: '/api/page?path=' + path }, res, {});
        assert.equal(res.statusCode, 200);
        assert.match(res.body, /Ubikka/);
      }
    `;
    const result = spawnSync(process.execPath, ['--input-type=module', '-e', check], { cwd: dir, encoding: 'utf8', env: { PATH: process.env.PATH } });
    assert.equal(result.status, 0, result.stderr);
  } finally { await rm(dir, { recursive: true, force: true }); }
});
