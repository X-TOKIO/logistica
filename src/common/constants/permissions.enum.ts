/**
 * Única fuente de verdad para los strings de permisos RBAC.
 * Sistema simplificado: un permiso por módulo (On/Off).
 * Usar estas constantes en @RequirePermissions() y en el seed.
 */
export const PERMS = {
  // ── Almacenes / Catálogo ───────────────────────────────────────────
  MODULO_CATALOGO:    'MODULO_CATALOGO',    // Categorías, Medidas, Productos
  MODULO_ALMACEN:     'MODULO_ALMACEN',     // Almacenes, Sucursales

  // ── Inventario ────────────────────────────────────────────────────
  MODULO_INVENTARIO:  'MODULO_INVENTARIO',  // Ingresos, Egresos, Mermas

  // ── Logística Terrestre ───────────────────────────────────────────
  MODULO_DESPACHOS:   'MODULO_DESPACHOS',   // Asignar Despacho, Monitor Satelital
  MODULO_TERMINAL:    'MODULO_TERMINAL',    // Terminal Vehicular, Vehículos
  MODULO_PROVEEDORES: 'MODULO_PROVEEDORES', // Gestionar Proveedores

  // ── Finanzas ──────────────────────────────────────────────────────
  MODULO_FINANZAS:    'MODULO_FINANZAS',    // Compras, Cuentas por Pagar

  // ── Reportes ──────────────────────────────────────────────────────
  MODULO_REPORTES:    'MODULO_REPORTES',    // Inteligencia de Negocios

  // ── Administración ────────────────────────────────────────────────
  MODULO_RRHH:        'MODULO_RRHH',        // Recursos Humanos, Empleados
  MODULO_USUARIOS:    'MODULO_USUARIOS',    // Gestión de Usuarios
  MODULO_SEGURIDAD:   'MODULO_SEGURIDAD',   // Seguridad y Roles
} as const;

export type PermKey = keyof typeof PERMS;
export type PermValue = typeof PERMS[PermKey];
