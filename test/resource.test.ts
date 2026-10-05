import { test } from 'node:test';
import assert from 'node:assert/strict';
test('deduplica solicitudes concurrentes, conserva datos y permite reintentar errores', async () => {
 const oldDocument = globalThis.document, oldFetch = globalThis.fetch;
 globalThis.document = { getElementById: () => null } as any;
 try {
  const { loadResource } = await import('../src/lib/resource.ts');
  let calls=0;
  globalThis.fetch = async () => { calls++; return Response.json({ data: ['real'] }); };
  await Promise.all([loadResource('/test'), loadResource('/test')]);
  await loadResource('/test'); assert.equal(calls,1);
  globalThis.fetch=async()=>Response.json({}, {status:503});
  await assert.rejects(loadResource('/failed'));
  globalThis.fetch=async()=>Response.json({data:['recovered']});
  assert.deepEqual(await loadResource('/failed'),{data:['recovered']});
 } finally { globalThis.document=oldDocument; globalThis.fetch=oldFetch; }
});
