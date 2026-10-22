import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageHtml, siteOrigin } from '../server/seo.ts';
import { brandContact, homeDescription, localBusiness } from '../shared/public-content.ts';
import seo from '../api/seo.ts';
import siteHandler from '../api/site.ts';
import inquiries from '../api/inquiries.ts';
const env = { SITE_URL: 'https://ubikka.example', LOKATION_API_URL: 'https://api.example', LOKATION_API_KEY: 'secret-key' };
const template = '<html><head><title>Base</title><meta name="description" content="Base" /></head><body><div id="root"></div></body></html>';
function response() { return { statusCode: 200, body: '', setHeader() {}, end(value = '') { this.body = value; } }; }
test('general inquiry derives tenant and sends no property association', async () => {
 const original=globalThis.fetch; const calls:any[]=[];
 globalThis.fetch=async(url,options)=>{calls.push([String(url),options]);return Response.json(calls.length===1?{site:{slug:'ubikka'}}:{ok:true});};
 try {const res=response(); await inquiries({method:'POST',headers:{'content-type':'application/json'},body:{nombre:'Test',email:'test@example.test',mensaje:'Estoy buscando: Comprar. Casa.',website:''}} as any,res as any,env);assert.equal(res.statusCode,201);assert.match(calls[1][0],/public\/ubikka\/leads$/);assert.equal(JSON.parse(calls[1][1].body).property_id,undefined);}finally{globalThis.fetch=original;}
});
test('site exposes only public contact fields',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({site:{nombre:'Ubikka',configSitio:{telefono:'123',private:'secret-key'}}});
 try{const res=response();await siteHandler({method:'GET'} as any,res as any,env);assert.equal(res.statusCode,200);assert.equal(JSON.parse(res.body).site.telefono,'123');assert.ok(!res.body.includes('secret-key'));}finally{globalThis.fetch=original;}
});
test('property HTML has escaped metadata, real content and structured data',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({property:{estado:'disponible',titulo:'Casa <script>bad</script>',descripcion:'</script><script>attack</script>',slug:'casa',dormitorios:3}});
 try{const result=await pageHtml(template,'/propiedades/casa',env);assert.equal(result.status,200);assert.match(result.html,/canonical.*https:\/\/ubikka.example\/propiedades\/casa/);assert.ok(result.html.includes('<h1>Casa &lt;script&gt;'));assert.ok(!result.html.includes('<script>attack'));assert.match(result.html,/RealEstateListing/);assert.ok(!result.html.includes('secret-key'));}finally{globalThis.fetch=original;}
});
test('withdrawn listings are 404; preview and missing domain are noindex',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({property:{estado:'reservado',titulo:'Hidden'}});
 try{const result=await pageHtml(template,'/propiedades/casa',env);assert.equal(result.status,404);assert.ok(!result.html.includes('Hidden'));assert.match(result.html,/noindex/);}finally{globalThis.fetch=original;}
 assert.match((await pageHtml(template,'/',{...env,VERCEL_ENV:'preview'})).html,/noindex/);assert.match((await pageHtml(template,'/',{})).html,/noindex/);
});
test('sitemap includes available inventory; robots allows the site and protects the API',async()=>{
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({data:[{slug:'casa',estado:'disponible'},{slug:'privada',estado:'reservado'}],meta:{total:2}});
 try{const res=response();await seo({method:'GET',url:'/sitemap.xml'} as any,res as any,env);assert.equal(res.statusCode,200);assert.match(res.body,/https:\/\/ubikka.example\/propiedades\/casa/);assert.ok(!res.body.includes('privada'));const robots=response();await seo({method:'GET',url:'/robots.txt'} as any,robots as any,env);assert.match(robots.body,/Allow: \/\n/);assert.match(robots.body,/Disallow: \/api\//);assert.match(robots.body,/Sitemap: https:\/\/ubikka.example\/sitemap.xml/);}finally{globalThis.fetch=original;}
});

test('home uses the approved brand description and verified contact fallback', async () => {
 const home = await pageHtml(template, '/', env);
 assert.ok(home.html.includes(homeDescription));
 assert.match(home.html, /og:image.*ubikka-social-share-v2\.jpg/);
 assert.match(home.html, /og:image:width.*1200/);
 const business = localBusiness(null, 'https://ubikka.example');
 assert.equal(business.telephone, brandContact.phoneDisplay);
 assert.equal(business.address.streetAddress, brandContact.address);
});

test('production metadata falls back to the Vercel project domain', async () => {
 assert.equal(siteOrigin({ VERCEL_PROJECT_PRODUCTION_URL: 'ubikka.vercel.app' }), 'https://ubikka.vercel.app');
 assert.equal(siteOrigin({ VERCEL_ENV: 'production' }), 'https://ubikka.vercel.app');
 const home = await pageHtml(template, '/', { VERCEL_ENV: 'production' });
 assert.match(home.html, /og:image[^>]+https:\/\/ubikka\.vercel\.app\/images\/ubikka-social-share-v2\.jpg/);
 assert.match(home.html, /canonical[^>]+https:\/\/ubikka\.vercel\.app\//);
 assert.match(home.html, /content="index,follow"/);
});

test('privacy has unique metadata and unknown routes return branded 404', async () => {
 const privacy = await pageHtml(template, '/privacidad', env);
 assert.equal(privacy.status, 200); assert.match(privacy.html, /Privacidad y datos personales/);
 assert.match(privacy.html, /Resend/); assert.match(privacy.html, /canonical.*\/privacidad/);
 const missing = await pageHtml(template, '/pagina-inexistente', env);
 assert.equal(missing.status, 404); assert.match(missing.html, /favicon.svg/); assert.match(missing.html, /noindex/);
});
test('home and catalog render without requesting or waiting for the API', async () => {
 const original = globalThis.fetch;
 let calls = 0;
 globalThis.fetch = async () => { calls++; throw new Error('API unavailable'); };
 try {
  for (const path of ['/', '/propiedades']) {
   const result = await pageHtml(template, path, env);
   assert.equal(result.status, 200);
   assert.ok(!result.html.includes('initial-data'));
   assert.ok(!result.html.includes('No pudimos cargar'));
  }
  assert.equal(calls, 0);
  const home = await pageHtml(template, '/', env);
  assert.match(home.html, /San Miguel de Tucumán y Yerba Buena/);
  assert.match(home.html, /RealEstateAgent/);
 } finally { globalThis.fetch = original; }
});
