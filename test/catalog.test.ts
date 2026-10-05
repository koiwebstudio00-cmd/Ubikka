import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaults, filterCatalog, fromApi } from '../src/lib/catalog.ts';
const both = fromApi({ id: '1', titulo: 'Casa en Tucumán', tipo: 'casa', operacion: 'ambos', precio: '150000', moneda: 'USD', precioAlquiler: '450000', monedaAlquiler: 'ARS', dormitorios: 4, createdAt: '2026-01-01' });
const rent = fromApi({ id: '2', titulo: 'Departamento', tipo: 'departamento', operacion: 'alquiler', precio: '300000', moneda: 'ARS', dormitorios: 2, createdAt: '2026-02-01' });
test('alquiler usa precio y moneda propios para propiedades de ambas operaciones', () => {
 const result = filterCatalog([both, rent], { ...defaults, op: 'alquiler', moneda: 'ARS', min: '400000' });
 assert.equal(result.length, 1); assert.equal(result[0].price, 450000); assert.equal(result[0].currency, 'ARS');
});
test('combina búsqueda sin acentos, dormitorios y tipo', () => {
 assert.equal(filterCatalog([both, rent], { ...defaults, q: 'tucuman', dormitorios: '4', tipo: 'casa' }).length, 1);
 assert.equal(filterCatalog([both, rent], { ...defaults, op: 'venta', tipo: 'departamento' }).length, 0);
});
test('ordena sólo resultados de la moneda seleccionada y no muta datos', () => {
 const result = filterCatalog([both, rent], { ...defaults, op: 'alquiler', moneda: 'ARS', orden: 'price-asc' });
 assert.deepEqual(result.map(p => p.id), ['2', '1']); assert.equal(both.price, 150000);
});

test('rango de importes funciona sin elegir moneda y permite ordenar', () => {
 const result = filterCatalog([both, rent], { ...defaults, min: '100000', max: '350000', orden: 'price-asc' });
 assert.deepEqual(result.map(p => p.id), ['1', '2']);
 assert.equal(filterCatalog([both, rent], { ...defaults, min: '350001' }).length, 0);
});
