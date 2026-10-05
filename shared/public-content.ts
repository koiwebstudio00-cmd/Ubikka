export const privacyTitle = 'Privacidad y datos personales | Ubikka';
export const privacyDescription = 'Conocé qué datos recibe Ubikka al consultar por una propiedad, para qué se utilizan y cómo solicitar su actualización o eliminación.';
export const privacySections = [
  ['Quién recibe tu consulta', 'Los formularios de este sitio están dirigidos a Ubikka Inmobiliaria. Lokation es la plataforma que utiliza Ubikka para gestionar sus propiedades y consultas. Koi Studio desarrolla el sitio.'],
  ['Qué información se solicita', 'Al enviar una consulta se solicita tu nombre, mensaje y al menos un medio de contacto: teléfono o correo electrónico. En las consultas desde una ficha se agrega la referencia de esa propiedad; en el formulario general se agrega el motivo de tu búsqueda. Evitá incluir documentos, datos bancarios u otra información sensible.'],
  ['Para qué se utiliza', 'Ubikka utiliza esta información para responder, asesorarte sobre propiedades y dar seguimiento a tu consulta. La consulta se registra en Lokation y puede generar notificaciones internas y avisos por correo para el equipo de la inmobiliaria.'],
  ['Servicios que intervienen', 'El funcionamiento del sitio y la gestión de consultas requieren proveedores de alojamiento, infraestructura y correo, incluido Resend para los avisos enviados por Lokation. Estos servicios pueden procesar información técnica, como la dirección IP, para operar y proteger sus sistemas.'],
  ['Mapas, tipografías y enlaces externos', 'Las páginas pueden cargar mapas y tipografías de Google, lo que genera solicitudes a sus servidores. Los enlaces a Google Maps, WhatsApp y otros sitios externos se rigen por las políticas de sus respectivos proveedores. Si usás WhatsApp, tu mensaje se envía a través de ese servicio.'],
  ['Conservación y solicitudes sobre tus datos', 'Los datos de las consultas permanecen en las herramientas de gestión de Ubikka para su seguimiento. Podés solicitar información sobre tus datos, su corrección o eliminación a través del contacto publicado en este sitio o del formulario general, indicando que se trata de una solicitud de privacidad. La inmobiliaria deberá evaluar la solicitud y la información que necesite conservar.'],
  ['Cambios en esta página', 'Esta información puede actualizarse si cambian los formularios o los servicios utilizados. La fecha de la última actualización se indica al comienzo de esta página.'],
] as const;
export function localBusiness(site: { nombre?: string; telefono?: string; email?: string; direccion?: string; ciudad?: string } | null, origin = '') {
  return { '@type': 'RealEstateAgent', name: site?.nombre || 'Ubikka Inmobiliaria',
    ...(origin ? { '@id': `${origin}/#inmobiliaria`, url: `${origin}/`, logo: `${origin}/favicon.svg` } : {}),
    ...(site?.telefono ? { telephone: site.telefono } : {}), ...(site?.email ? { email: site.email } : {}),
    ...(site?.direccion || site?.ciudad ? { address: { '@type':'PostalAddress', ...(site.direccion ? { streetAddress:site.direccion } : {}), ...(site.ciudad ? { addressLocality:site.ciudad } : {}) } } : {}),
  };
}
export function propertyMetadata(p: Record<string, any>) {
  const reference = String(p.id || p.slug || '').slice(0,8);
  const title = `${p.titulo || 'Propiedad'}${reference ? ` · Ref. ${reference}` : ''} | Ubikka`;
  const description = [p.titulo, p.operacion ? `En ${p.operacion === 'ambos' ? 'venta y alquiler' : p.operacion}` : '', p.direccion || p.ciudad, p.dormitorios != null ? `${p.dormitorios} dormitorios` : '', 'Consultá disponibilidad y detalles con Ubikka.'].filter(Boolean).join('. ').slice(0,160);
  return { title, description };
}
