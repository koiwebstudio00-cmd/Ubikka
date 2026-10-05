import { test } from 'node:test';
import assert from 'node:assert/strict';
import inquiries from '../api/inquiries.ts';
import properties from '../api/properties.ts';
const env = { LOKATION_API_URL: 'https://api.example.test', LOKATION_API_KEY: 'test-secret' };
const id = '11111111-1111-4111-8111-111111111111';
const body = { nombre: 'Test', telefono: '123456', mensaje: 'Consulta', property_id: id };
function response() { return { statusCode: 200, body: '', setHeader() {}, end(value: string) { this.body = value; } }; }
test('asocia consulta al id real y obtiene el tenant desde la clave, omitiendo email vacío', async () => {
 const original = globalThis.fetch; const calls: any[] = [];
 globalThis.fetch = async (url, options) => { calls.push([String(url), options]); return Response.json(calls.length === 1 ? { site: { slug: 'tenant-correcto' } } : calls.length === 2 ? { property: { estado: 'disponible' } } : { ok: true }); };
 try { const res = response(); await inquiries({ method: 'POST', headers: { 'content-type': 'application/json' }, body: { ...body, email: '', tenant_slug: 'otro' } } as any, res as any, env);
 assert.equal(res.statusCode, 201); assert.match(calls[2][0], /public\/tenant-correcto\/leads$/);
 const sent = JSON.parse(calls[2][1].body); assert.equal(sent.property_id, id); assert.equal(sent.email, undefined); assert.equal(sent.tenant_slug, undefined);
 } finally { globalThis.fetch = original; }
});
test('rechaza falta de contacto y honeypot antes de llamar a la API', async () => {
 for (const data of [{ ...body, telefono: '' }, { ...body, website: 'bot' }]) {
 const res = response(); await inquiries({ method: 'POST', headers: { 'content-type': 'application/json' }, body: data } as any,res as any,env); assert.equal(res.statusCode,400);
 }
});
test('no envía consultas para propiedades no disponibles ni simula éxito si falla el proveedor', async () => {
 const original = globalThis.fetch;
 try {
 for (const available of [false, true]) {
 let calls=0;
 globalThis.fetch = async () => { calls++; return calls===1 ? Response.json({site:{slug:'tenant'}}) : calls===2 ? Response.json({property:{estado:available?'disponible':'reservado'}}) : Response.json({}, {status:500}); };
 const res=response(); await inquiries({method:'POST',headers:{'content-type':'application/json'},body} as any,res as any,env);
 assert.equal(res.statusCode,available?502:404); assert.equal(calls,available?3:2);
 }
 } finally { globalThis.fetch=original; }
});
test('detalle conserva galería completa y bloquea propiedades privadas', async () => {
 const original=globalThis.fetch;
 try {
 for (const state of ['disponible','privado']) {
 globalThis.fetch=async url=>String(url).endsWith('/site')?Response.json({site:{configSitio:{telefono:'+54 123'}}}):Response.json({property:{estado:state,images:[{id:'a',url:'a'},{id:'b',url:'b'}]}});
 const res=response(); await properties({method:'GET',url:`/?id=${id}`} as any,res as any,env);
 assert.equal(res.statusCode,state==='disponible'?200:404);
 if(state==='disponible') { assert.equal(JSON.parse(res.body).property.images.length,2); assert.equal(JSON.parse(res.body).phone,'54123'); }
 assert.ok(!res.body.includes('test-secret'));
 }
 } finally { globalThis.fetch=original; }
});
