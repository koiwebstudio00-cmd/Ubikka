# Ubikka · web de la inmobiliaria.

Actualizado: **2026-10-04**.

**Ubikka es una inmobiliaria registrada en Lokation. Lokation es la plataforma SaaS.** Este repositorio contiene exclusivamente la web propia de Ubikka; utiliza la API de Lokation para consultar inventario y registrar consultas. No es el template `web-publica` de Lokation.

Stack: **React 19 + Vite + Tailwind**, con funciones de servidor para proteger la API key. No se acordó ni se realizó una migración a Next.js.

## Desarrollo

```sh
npm install
npm run dev -- --port 3004
```

Vite carga `.env.local`, excluido de Git:

```env
LOKATION_API_URL=https://api-lokation.koistudio.com.ar
LOKATION_API_KEY=clave_de_exportacion_de_ubikka
SITE_URL=https://dominio-definitivo-de-ubikka.example
```

Usar una key de Ubikka con `export:read`, generada desde el panel. No copiarla al código, logs o variables `VITE_`. `LOKATION_TENANT_SLUG`, si existe de la preparación anterior, **no se utiliza**: el servidor obtiene el slug de `/v1/export/site` a partir de la key para las consultas.

El middleware de Vite sirve las funciones locales. No detener ni reemplazar el servidor del usuario en 3004 sin indicación.

## Páginas y funciones

| Ruta | Comportamiento |
| --- | --- |
| `/` | Home con hasta seis propiedades reales, priorizando destacadas; no contiene inventario ficticio |
| `/propiedades` | Catálogo, búsqueda, filtros, orden y paginación de 12 resultados |
| `/propiedades/:slug` | Ficha directa, galería completa, datos de propiedad, alquiler, ubicación y consulta específica |
| `/api/properties` | Función GET que consume exportación de Lokation con la key del servidor |
| `/api/properties?id=...` | Detalle disponible por slug/ID; incluye todas las fotos y teléfono del sitio si está configurado |
| `/api/inquiries` | Función POST que valida y envía una consulta al CRM de la inmobiliaria identificada por la key |

- Sólo se muestran propiedades `disponible`; la ficha vuelve a comprobar ese estado.
- Catálogo de tres columnas desde 1280 px, dos desde 640 px y una en móvil. Filtros desplegables en pantallas pequeñas.
- Filtros: texto, operación, tipo, zona, dormitorios y rango de precios. Selects oficiales shadcn/Radix; columna lateral de 300 px. URL conserva filtros y página.
- El rango y el orden por importe siempre están habilitados; se usan valores publicados sin conversión entre monedas, indicado en la interfaz. En operación `ambos`, al filtrar alquiler se usa su precio/moneda de alquiler.
- El servidor reúne páginas de hasta 100 registros, con máximo de 100 páginas; ante exceso informa error y no presenta un catálogo incompleto. Filtros y paginación visual se calculan en el navegador. Optimizar para catálogos grandes queda pendiente.
- Las tarjetas abren directamente la ficha, sin modal intermedio.
- Se muestran los campos públicos disponibles: descripción, dirección/zona/ciudad, ambientes, dormitorios, baños, superficies, precios y condiciones de alquiler. Expensas conserva el texto enviado por la API.
- Se muestra mapa si hay coordenadas válidas y enlace si hay URL de ubicación o coordenadas. WhatsApp sólo aparece con teléfono configurado; confirmar su formato internacional.
- Favicon SVG basado en el isotipo de Ubikka: `public/favicon.svg`.

## Consultas, correo y CORS

```text
Navegador → /api/inquiries del propio sitio → API de Lokation → CRM / notificación / correo
```

El formulario de la **ficha** exige nombre, mensaje y teléfono o email. Envía `property_id`, tiene campo antispam, impide doble clic durante el envío y sólo muestra éxito cuando el servidor confirma la operación. La función comprueba que la propiedad pertenezca al catálogo de la key y siga disponible. El tenant no se toma de un campo enviado por el visitante.

La llamada a Lokation es entre servidores: no requiere agregar el dominio del sitio al CORS para este recorrido. Esto no convierte CORS en un mecanismo de autenticación. La key permanece exclusivamente en el servidor. El endpoint público de leads tiene sus propias validaciones y límite por IP; al pasar por la función, el límite puede compartirse entre visitantes del sitio. Revisar esa limitación al crecer el tráfico, sin confiar en cabeceras de IP arbitrarias.

El sitio no necesita una clave de Resend: el backend gestiona el correo. Guardar una consulta no garantiza que el correo se entregue; comprobar ambas cosas en el piloto.

El formulario general de la home también envía a `/api/inquiries`, sin `property_id`; incluye el motivo de búsqueda en el mensaje, validación de contacto, antispam y estados reales. Teléfono, email y dirección se obtienen desde `/api/site`, que expone únicamente campos públicos de «Mi sitio» en Lokation. Los datos ausentes se omiten; se quitaron contactos y redes ficticios.

## Despliegue manual en Vercel

- Preset Vite; build `npm run build`; directorio estático `dist`.
- Desplegar el repositorio completo, incluidas `api/` y `server/`; subir sólo `dist` no habilita las consultas ni el catálogo protegido.
- Configurar `LOKATION_API_URL`, `LOKATION_API_KEY` y `SITE_URL` en los entornos correspondientes de Vercel y redesplegar al cambiarlas.
- `vercel.json` sirve home, catálogo y fichas mediante `api/page.ts`. La función incluye `dist/index.html`, agrega HTML semántico inicial y metadatos por ruta; React/Vite reemplaza ese contenido con la interfaz interactiva. No es una migración a Next ni SSR completo de todos los componentes. `/robots.txt` y `/sitemap.xml` usan `api/seo.ts`; el sitemap consulta el inventario y las fichas consultan su propiedad, sin reconstruir para agregar o retirar propiedades. La home y el catálogo entregan el HTML sin esperar a Lokation; las propiedades se cargan dentro de su sección. Las rutas API conservan JSON.
- Elegir y configurar el dominio definitivo. Su despliegue final aún no está confirmado en la documentación.

## Verificación y pendientes

```sh
npm run lint
npm run build
node --import tsx --test test/*.test.ts
```

Última entrega: TypeScript/build correctos y catorce pruebas aprobadas. Se inspeccionaron catálogo y ficha con una propiedad real. Los tests de envío simulan el proveedor; **no se enviaron consultas de prueba a producción**.

Antes de publicar: confirmar dominio, completar datos públicos en Lokation y enviar una consulta general y otra específica para comprobar CRM/destinatario/aviso/correo. La entrega real de correos todavía requiere esa prueba del operador.

## SEO y recursos

- Título, descripción, canonical, Open Graph, tarjeta social y JSON-LD incluidos en HTML inicial. No garantiza posiciones ni menciones en buscadores/IA.
- Ficha inexistente o retirada: HTTP 404 y `noindex`; fallo del proveedor: 503 con reintento, sin simular catálogo vacío.
- `SITE_URL` debe ser la URL HTTPS definitiva. Sin ella, o en Vercel Preview, se usa `noindex`, robots bloquea rastreo y no se publica sitemap. Configurar la URL en Production y redesplegar.
- El sitemap contiene sólo propiedades disponibles. Los filtros usan canonical del catálogo sin parámetros.
- Hero y fotografías de presentación usan WebP: ~0,5 MB entre las cuatro, frente a ~8,5 MB originales. PNG originales conservados como fuentes.
- Revisados home, catálogo, ficha y menú móvil a 390 px; formulario general rechaza envíos sin contacto. No se enviaron leads reales durante la verificación.
- Configuración de archivos de funciones: [documentación oficial de Vercel](https://vercel.com/docs/project-configuration/vercel-json).

## Checklist para publicar manualmente

1. Subir este repositorio completo a GitHub e importarlo en Vercel como Vite (Node 22 o 24). Build: `npm run build`; salida: `dist`.
2. Configurar las tres variables del ejemplo. La API key debe pertenecer a Ubikka y tener `export:read`; nunca usar `VITE_LOKATION_API_KEY`.
3. Asociar el dominio y aplicar el registro DNS indicado por Vercel.
4. Abrir home, `/propiedades` y una ficha pegando la URL directamente. Revisar «Ver código fuente»: título y descripción propios; comprobar `/robots.txt` y `/sitemap.xml`.
5. Enviar una consulta desde home y otra desde ficha con tus datos. Confirmar en Lokation que la segunda tenga la propiedad asociada y revisar notificación/correo. Borrar o marcar esas consultas de prueba desde el panel.
6. Confirmar teléfono en formato internacional, email y dirección en «Mi sitio». La web los obtiene automáticamente. Si se cambia una variable en Vercel, redesplegar.

El despliegue real y la entrega del correo no se consideran comprobados por pasar el build local.

Estado global y backlog en el workspace: [Lokation](../docs/ESTADO_ACTUAL.md) · [Funcionalidades futuras](../docs/FEATURES_FUTURAS.md). Esos documentos pertenecen al repositorio raíz, no a un clon aislado de esta web.

## Navegación y revisión visual · 2026-10-05

Comparación con `lamelas-web`: ambos mantienen React/Vite. Lamelas ya utilizaba React Router y filtros resueltos por API; Ubikka ahora utiliza React Router 7, `Link` y parámetros de búsqueda, conservando su proxy privado y filtrado del catálogo completo. La API key de Ubikka sigue sólo en el servidor.

Las fichas incluyen sus datos públicos en el HTML inicial y React los reutiliza. La home y el catálogo cargan los datos después de mostrar la interfaz: el skeleton y los errores se limitan a la sección de propiedades. El schema inicial de la home identifica a Ubikka; los datos de contacto se completan cuando responde la API. Las peticiones concurrentes se comparten; al volver a una pantalla se muestra su último resultado mientras se revalida si pasaron 30 segundos. Los errores iniciales permiten reintentar. Las tarjetas anticipan la ficha al recibir foco/hover. El backend sigue validando disponibilidad al enviar una consulta.

Ficha: galería superior con visor Radix, navegación con flechas y Escape; datos e iconos a la izquierda, formulario a la derecha; móvil en una columna. Footer en cuatro columnas con atribución a Koi Studio. Contacto general en dos columnas iguales, título/datos a la izquierda y formulario a la derecha.

Referencias técnicas: [React Router](https://reactrouter.com/api/declarative-routers/BrowserRouter), [Select oficial shadcn/Radix](https://ui.shadcn.com/docs/components/radix/select).

## SEO, 404 y privacidad · 2026-10-05

- `/privacidad`: política informativa sobre formularios, Lokation, notificaciones, Resend, Google Maps/tipografías y solicitudes de datos. Enlazada desde footer y formularios. Ubikka debe mantener el contacto público y confirmar que el texto refleja su operación.
- URLs inexistentes y fichas retiradas: pantalla con logo de Ubikka, navegación de regreso, HTTP 404 y noindex. Vercel resuelve primero rutas explícitas y archivos existentes; luego utiliza el manejador de páginas para rutas desconocidas.
- Metadatos específicos de home, catálogo, fichas, privacidad y 404. Fichas incluyen una referencia para distinguir títulos repetidos; se actualizan al navegar sin recarga.
- Schema `RealEstateAgent` con nombre, URL, logo y contacto/dirección disponibles en Lokation. No se inventan horarios, reseñas, coordenadas de oficina ni domicilios.
- Imágenes de propiedades con alt contextual; galería con título y número de foto. Fondos decorativos del hero/CTA conservan alt vacío para no repetir información en lectores de pantalla.
- Robots dinámico y sitemap con privacidad y propiedades disponibles. Es necesario configurar `SITE_URL` HTTPS para permitir indexación en producción; los previews permanecen bloqueados.
- Referencia de ruteo: https://vercel.com/kb/guide/custom-404-page .
