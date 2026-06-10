// Datos demo de respaldo: la app nunca se traba aunque no haya DATABASE_URL.
export const DEMO_CLIENTES = [
  { id: 1, nombre: "Abarrotes La Esquina", direccion: "Calle 60 #312, Centro", zona: "Centro", saldo_pendiente: "1240.00" },
  { id: 2, nombre: "Minisuper Don Beto", direccion: "Av. Itzáes #145", zona: "Centro", saldo_pendiente: "0" },
  { id: 3, nombre: "Tienda El Faro", direccion: "Calle 50 #88, García Ginerés", zona: "Norte", saldo_pendiente: "560.50" },
  { id: 4, nombre: "Cremería Yucatán", direccion: "Av. Colón #210", zona: "Centro", saldo_pendiente: "0" },
  { id: 5, nombre: "Súper Las Palmas", direccion: "Calle 21 #44, Montejo", zona: "Norte", saldo_pendiente: "2310.00" },
  { id: 6, nombre: "Abarrotes Mérida", direccion: "Calle 86 #501, Sur", zona: "Sur", saldo_pendiente: "0" },
  { id: 7, nombre: "Tiendita La Güera", direccion: "Calle 15 #77, Oriente", zona: "Oriente", saldo_pendiente: "430.00" },
  { id: 8, nombre: "Comercial San Juan", direccion: "Av. Aviación #909", zona: "Sur", saldo_pendiente: "0" },
];
export const DEMO_PRODUCTOS = [
  { id: 1, nombre: "Refresco Cola 600ml", categoria: "Bebidas", precio: "14.50", stock_total: 240, unidad: "pieza" },
  { id: 2, nombre: "Agua Natural 1L", categoria: "Bebidas", precio: "9.00", stock_total: 180, unidad: "pieza" },
  { id: 3, nombre: "Jugo de Naranja 1L", categoria: "Bebidas", precio: "22.00", stock_total: 96, unidad: "pieza" },
  { id: 4, nombre: "Galletas Surtido 1kg", categoria: "Abarrotes", precio: "48.00", stock_total: 60, unidad: "caja" },
  { id: 5, nombre: "Frituras Mix 50g", categoria: "Abarrotes", precio: "12.50", stock_total: 320, unidad: "pieza" },
  { id: 6, nombre: "Aceite Vegetal 1L", categoria: "Abarrotes", precio: "38.00", stock_total: 72, unidad: "pieza" },
  { id: 7, nombre: "Detergente 1kg", categoria: "Limpieza", precio: "34.00", stock_total: 88, unidad: "pieza" },
  { id: 8, nombre: "Jabón de Tocador", categoria: "Limpieza", precio: "10.50", stock_total: 150, unidad: "pieza" },
];
const today = new Date();
const d = (n: number) => new Date(today.getTime() - n * 3600 * 1000).toISOString();
export const DEMO_PEDIDOS = [
  { id: 1, folio: "PD-1042", total: "1820.50", cobrado: "1820.50", estado: "cobrado", tipo: "venta_bordo", created_at: d(1), cliente_nombre: "Abarrotes La Esquina" },
  { id: 2, folio: "PD-1041", total: "960.00", cobrado: "0", estado: "entregado", tipo: "preventa", created_at: d(3), cliente_nombre: "Tienda El Faro" },
  { id: 3, folio: "PD-1040", total: "2440.00", cobrado: "2440.00", estado: "cobrado", tipo: "venta_bordo", created_at: d(5), cliente_nombre: "Súper Las Palmas" },
  { id: 4, folio: "PD-1039", total: "640.00", cobrado: "0", estado: "pendiente", tipo: "preventa", created_at: d(7), cliente_nombre: "Cremería Yucatán" },
  { id: 5, folio: "PD-1038", total: "1180.00", cobrado: "1180.00", estado: "cobrado", tipo: "venta_bordo", created_at: d(9), cliente_nombre: "Minisuper Don Beto" },
  { id: 6, folio: "PD-1037", total: "430.00", cobrado: "0", estado: "entregado", tipo: "preventa", created_at: d(26), cliente_nombre: "Tiendita La Güera" },
  { id: 7, folio: "PD-1036", total: "300.00", cobrado: "0", estado: "cancelado", tipo: "preventa", created_at: d(30), cliente_nombre: "Comercial San Juan" },
];
export const DEMO_VENDEDORES = [
  { id: 1, nombre: "Carlos Mendoza", zona: "Centro A", activo: true, telefono: "999-123-4567" },
  { id: 2, nombre: "Lupita García", zona: "Norte B", activo: true, telefono: "999-234-5678" },
  { id: 3, nombre: "Raúl Torres", zona: "Sur C", activo: true, telefono: "999-345-6789" },
  { id: 4, nombre: "Ana Jiménez", zona: "Oriente D", activo: true, telefono: "999-456-7890" },
];
export const DEMO_VISITAS = [
  { id: 1, resultado: "venta", notas: "Pedido levantado", created_at: d(1), cliente_nombre: "Abarrotes La Esquina" },
  { id: 2, resultado: "venta", notas: "Reabasto semanal", created_at: d(3), cliente_nombre: "Tienda El Faro" },
  { id: 3, resultado: "cobro", notas: "Pago parcial", created_at: d(5), cliente_nombre: "Súper Las Palmas" },
  { id: 4, resultado: "visita", notas: "Sin pedido hoy", created_at: d(7), cliente_nombre: "Cremería Yucatán" },
];
