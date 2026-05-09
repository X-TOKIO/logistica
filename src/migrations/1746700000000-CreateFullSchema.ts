import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración completa — crea todas las tablas del sistema PARADISO.
 * Usa CREATE TABLE IF NOT EXISTS para ser idempotente en bases de datos existentes.
 *
 * El usuario administrador (admin / Admin123*) es creado automáticamente por
 * AuthService.onApplicationBootstrap() al iniciar la aplicación.
 */
export class CreateFullSchema1746700000000 implements MigrationInterface {
  name = 'CreateFullSchema1746700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Tablas independientes ───────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Rol" (
        "ID_Rol"      SERIAL                      NOT NULL,
        "Nombre"      character varying(100)       NOT NULL,
        "Descripcion" character varying(300),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_Rol" PRIMARY KEY ("ID_Rol")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Permiso" (
        "ID_Permiso"  SERIAL                      NOT NULL,
        "Nombre"      character varying(100)       NOT NULL,
        "Descripcion" character varying(300),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_Permiso" PRIMARY KEY ("ID_Permiso")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Empleado" (
        "ID_Empleado"       SERIAL                  NOT NULL,
        "Nombre"            character varying(100)   NOT NULL,
        "Materno"           character varying(100),
        "Paterno"           character varying(100),
        "CI"                character varying(20)    NOT NULL,
        "Telefono"          character varying(20),
        "Direccion"         character varying(200),
        "Cargo"             character varying(100),
        "FechaContratacion" date                     NOT NULL,
        "Image"             character varying(300),
        "deleted_at"        TIMESTAMP,
        CONSTRAINT "PK_Empleado"  PRIMARY KEY ("ID_Empleado"),
        CONSTRAINT "UQ_Empleado_CI" UNIQUE ("CI")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Categoria" (
        "ID_Categoria" SERIAL                     NOT NULL,
        "NombreC"      character varying(100)      NOT NULL,
        "Descripcion"  character varying(250),
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_Categoria" PRIMARY KEY ("ID_Categoria")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "UMedida" (
        "ID_Medida"         SERIAL                  NOT NULL,
        "Nombre"            character varying(100)   NOT NULL,
        "Abreviatura"       character varying(20)    NOT NULL,
        "Unidades_Bulto"    character varying(20)    NOT NULL DEFAULT '1',
        "factor_conversion" integer                  NOT NULL DEFAULT 1,
        "deleted_at"        TIMESTAMP,
        CONSTRAINT "PK_UMedida" PRIMARY KEY ("ID_Medida")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Almacen" (
        "ID_Almacen" SERIAL                    NOT NULL,
        "Nombre"     character varying(100)     NOT NULL,
        "Direccion"  character varying(200)     NOT NULL,
        "Latitud"    decimal(10,7),
        "Longitud"   decimal(10,7),
        "Color"      character varying(20)      DEFAULT '#6366f1',
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_Almacen" PRIMARY KEY ("ID_Almacen")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Sucursal" (
        "ID_Sucursal"  SERIAL                  NOT NULL,
        "Nombre"       character varying(100)   NOT NULL,
        "Direccion"    character varying(200)   NOT NULL,
        "Telefono"     character varying(20),
        "StockCritico" integer                  NOT NULL DEFAULT 0,
        "Latitud"      decimal(10,7),
        "Longitud"     decimal(10,7),
        "Color"        character varying(20)    DEFAULT '#10b981',
        "Tipo"         character varying(20)    DEFAULT 'sucursal',
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_Sucursal" PRIMARY KEY ("ID_Sucursal")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Proveedor" (
        "ID_Proveedor"       SERIAL               NOT NULL,
        "Nombre_RazonSocial" character varying(200),
        "NIT"                character varying(50) NOT NULL,
        "Telefono"           character varying(30),
        "Direccion"          character varying(300),
        "Estado"             character varying(20) NOT NULL DEFAULT 'ACTIVO',
        "deleted_at"         TIMESTAMP,
        CONSTRAINT "PK_Proveedor" PRIMARY KEY ("ID_Proveedor"),
        CONSTRAINT "UQ_Proveedor_NIT" UNIQUE ("NIT")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "PageVisitCounter" (
        "id"            SERIAL                  NOT NULL,
        "ruta_pagina"   character varying(300)   NOT NULL,
        "total_visitas" integer                  NOT NULL DEFAULT 0,
        CONSTRAINT "PK_PageVisitCounter" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_PageVisitCounter_ruta" UNIQUE ("ruta_pagina")
      )
    `);

    // ─── Tablas con FK a Empleado ────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Vehiculo" (
        "ID_Vehiculo"    SERIAL                  NOT NULL,
        "Placa"          character varying(20)    NOT NULL,
        "Marca"          character varying(100)   NOT NULL,
        "Modelo"         character varying(100)   NOT NULL,
        "Capacidad_Carga" decimal(10,2)           NOT NULL,
        "Estado"         character varying(30)    NOT NULL DEFAULT 'DISPONIBLE',
        "ID_Empleado"    integer,
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_Vehiculo" PRIMARY KEY ("ID_Vehiculo"),
        CONSTRAINT "UQ_Vehiculo_Placa" UNIQUE ("Placa"),
        CONSTRAINT "FK_Vehiculo_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Camion" (
        "ID_Camion"      SERIAL                  NOT NULL,
        "Placa"          character varying(20)    NOT NULL,
        "Modelo"         character varying(100)   NOT NULL,
        "CapacidadCarga" decimal(10,2)            NOT NULL,
        "Estado"         character varying(50)    NOT NULL,
        "ID_Empleado"    integer                  NOT NULL,
        "deleted_at"     TIMESTAMP,
        CONSTRAINT "PK_Camion" PRIMARY KEY ("ID_Camion"),
        CONSTRAINT "UQ_Camion_Placa" UNIQUE ("Placa"),
        CONSTRAINT "FK_Camion_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    // ─── RBAC: rol_permiso ───────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rol_permiso" (
        "ID_Rol"     integer   NOT NULL,
        "ID_Permiso" integer   NOT NULL,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_rol_permiso" PRIMARY KEY ("ID_Rol", "ID_Permiso"),
        CONSTRAINT "FK_rol_permiso_Rol" FOREIGN KEY ("ID_Rol")
          REFERENCES "Rol"("ID_Rol") ON DELETE NO ACTION,
        CONSTRAINT "FK_rol_permiso_Permiso" FOREIGN KEY ("ID_Permiso")
          REFERENCES "Permiso"("ID_Permiso") ON DELETE NO ACTION
      )
    `);

    // ─── Catálogo de Productos ───────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Producto" (
        "ID_Producto"      SERIAL                  NOT NULL,
        "CodigoBarra"      character varying(100),
        "Nombre"           character varying(100)   NOT NULL,
        "Descripcion"      character varying(300),
        "FechaVencimiento" date,
        "Fecha_Elaboracion" date,
        "Image"            character varying(300),
        "Ubicacion"        character varying(100),
        "PrecioUnitario"   decimal(10,2)            NOT NULL,
        "ID_Medida"        integer                  NOT NULL,
        "ID_Categoria"     integer                  NOT NULL,
        "deleted_at"       TIMESTAMP,
        CONSTRAINT "PK_Producto" PRIMARY KEY ("ID_Producto"),
        CONSTRAINT "UQ_Producto_CodigoBarra" UNIQUE ("CodigoBarra"),
        CONSTRAINT "FK_Producto_Medida" FOREIGN KEY ("ID_Medida")
          REFERENCES "UMedida"("ID_Medida") ON DELETE NO ACTION,
        CONSTRAINT "FK_Producto_Categoria" FOREIGN KEY ("ID_Categoria")
          REFERENCES "Categoria"("ID_Categoria") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ProductoAlmacen" (
        "ID_Producto"  integer        NOT NULL,
        "ID_Almacen"   integer        NOT NULL,
        "Stock_Actual" decimal(10,2)  NOT NULL DEFAULT 0,
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_ProductoAlmacen" PRIMARY KEY ("ID_Producto", "ID_Almacen"),
        CONSTRAINT "FK_ProductoAlmacen_Producto" FOREIGN KEY ("ID_Producto")
          REFERENCES "Producto"("ID_Producto") ON DELETE NO ACTION,
        CONSTRAINT "FK_ProductoAlmacen_Almacen" FOREIGN KEY ("ID_Almacen")
          REFERENCES "Almacen"("ID_Almacen") ON DELETE NO ACTION
      )
    `);

    // ─── Logística: Rutas ────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Ruta" (
        "ID_Ruta"               SERIAL          NOT NULL,
        "Nombre_Ruta"           character varying(200),
        "Origen"                character varying(300),
        "Destino"               character varying(300),
        "Distancia_KM"          decimal(8,2),
        "Tiempo_Estimado_Horas" decimal(6,2),
        "LatitudOrigen"         decimal(10,7),
        "LongitudOrigen"        decimal(10,7),
        "LatitudDestino"        decimal(10,7),
        "LongitudDestino"       decimal(10,7),
        "ID_Almacen"            integer,
        "ID_Sucursal"           integer,
        "deleted_at"            TIMESTAMP,
        CONSTRAINT "PK_Ruta" PRIMARY KEY ("ID_Ruta"),
        CONSTRAINT "FK_Ruta_Almacen" FOREIGN KEY ("ID_Almacen")
          REFERENCES "Almacen"("ID_Almacen") ON DELETE NO ACTION,
        CONSTRAINT "FK_Ruta_Sucursal" FOREIGN KEY ("ID_Sucursal")
          REFERENCES "Sucursal"("ID_Sucursal") ON DELETE NO ACTION
      )
    `);

    // ─── Compras ─────────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "NotaCompra" (
        "ID_Compra"          SERIAL                  NOT NULL,
        "Fecha_Emision"      date,
        "Hora_Emision"       time,
        "ID_Almacen"         integer,
        "Costo_Envio"        decimal(10,2)            NOT NULL DEFAULT 0,
        "Monto_Total"        decimal(10,2)            NOT NULL DEFAULT 0,
        "Estado_Documento"   character varying(20)    NOT NULL DEFAULT 'ACTIVO',
        "Condicion_Pago"     character varying(20)    NOT NULL DEFAULT 'CONTADO',
        "Nro_Factura"        character varying(50),
        "Ref_Libelula"       character varying(80),
        "Id_Libelula"        character varying(80),
        "Codigo_Recaudacion" character varying(30),
        "Refs_Previas"       text,
        "Qr_Url"             character varying(500),
        "ID_Proveedor"       integer                  NOT NULL,
        "ID_Empleado"        integer                  NOT NULL,
        "deleted_at"         TIMESTAMP,
        CONSTRAINT "PK_NotaCompra" PRIMARY KEY ("ID_Compra"),
        CONSTRAINT "FK_NotaCompra_Almacen" FOREIGN KEY ("ID_Almacen")
          REFERENCES "Almacen"("ID_Almacen") ON DELETE NO ACTION,
        CONSTRAINT "FK_NotaCompra_Proveedor" FOREIGN KEY ("ID_Proveedor")
          REFERENCES "Proveedor"("ID_Proveedor") ON DELETE NO ACTION,
        CONSTRAINT "FK_NotaCompra_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Pago" (
        "ID_Pago"    SERIAL         NOT NULL,
        "Fecha"      date           NOT NULL,
        "Plazo"      integer        NOT NULL,
        "MontoTotal" decimal(12,2)  NOT NULL,
        "ID_Compra"  integer        NOT NULL,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_Pago" PRIMARY KEY ("ID_Pago"),
        CONSTRAINT "UQ_Pago_Compra" UNIQUE ("ID_Compra"),
        CONSTRAINT "FK_Pago_NotaCompra" FOREIGN KEY ("ID_Compra")
          REFERENCES "NotaCompra"("ID_Compra") ON DELETE NO ACTION
      )
    `);

    // ─── Usuarios ────────────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Usuario" (
        "ID_Usuario"      SERIAL                  NOT NULL,
        "UserName"        character varying(100)   NOT NULL,
        "Password"        character varying(300)   NOT NULL,
        "Email"           character varying(150)   NOT NULL,
        "Estado"          character varying(50)    NOT NULL,
        "intentosFallidos" integer                 NOT NULL DEFAULT 0,
        "bloqueadoHasta"  TIMESTAMP,
        "ultimoLogin"     TIMESTAMP,
        "ID_Empleado"     integer                  NOT NULL,
        "ID_Rol"          integer,
        "deleted_at"      TIMESTAMP,
        CONSTRAINT "PK_Usuario" PRIMARY KEY ("ID_Usuario"),
        CONSTRAINT "UQ_Usuario_UserName"   UNIQUE ("UserName"),
        CONSTRAINT "UQ_Usuario_Email"      UNIQUE ("Email"),
        CONSTRAINT "UQ_Usuario_Empleado"   UNIQUE ("ID_Empleado"),
        CONSTRAINT "FK_Usuario_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    // ─── Correos enviados (common + mail module) ─────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "CorreoEnviados" (
        "ID_Correo"    SERIAL                  NOT NULL,
        "Remitente"    character varying(150)   NOT NULL,
        "Destinatario" character varying(150)   NOT NULL,
        "Asunto"       character varying(200)   NOT NULL,
        "Mensaje"      text                     NOT NULL,
        "FechaEnvio"   TIMESTAMP                NOT NULL,
        "Adjunto"      character varying(300),
        "ID_Empleado"  integer                  NOT NULL,
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_CorreoEnviados" PRIMARY KEY ("ID_Correo"),
        CONSTRAINT "FK_CorreoEnviados_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "CorreoEnviado" (
        "ID_Correo"    SERIAL                  NOT NULL,
        "Destinatario" character varying(150)   NOT NULL,
        "Asunto"       character varying(200)   NOT NULL,
        "TipoReporte"  character varying(50)    NOT NULL,
        "FechaEnvio"   TIMESTAMP                NOT NULL,
        "ID_Empleado"  integer                  NOT NULL,
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_CorreoEnviado" PRIMARY KEY ("ID_Correo"),
        CONSTRAINT "FK_CorreoEnviado_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "ContadorVisitas" (
        "ID_Visita"    SERIAL                  NOT NULL,
        "NombrePagina" character varying(200)   NOT NULL,
        "Contador"     integer                  NOT NULL DEFAULT 0,
        "UltimaVisita" TIMESTAMP                NOT NULL,
        "ID_Usuario"   integer                  NOT NULL,
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_ContadorVisitas" PRIMARY KEY ("ID_Visita"),
        CONSTRAINT "FK_ContadorVisitas_Usuario" FOREIGN KEY ("ID_Usuario")
          REFERENCES "Usuario"("ID_Usuario") ON DELETE NO ACTION
      )
    `);

    // ─── RBAC: rol_permiso_usuario ───────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "rol_permiso_usuario" (
        "ID_Rol"           integer   NOT NULL,
        "ID_Permiso"       integer   NOT NULL,
        "ID_Usuario"       integer   NOT NULL,
        "fecha_asignacion" date      NOT NULL,
        "deleted_at"       TIMESTAMP,
        CONSTRAINT "PK_rol_permiso_usuario" PRIMARY KEY ("ID_Rol", "ID_Permiso", "ID_Usuario"),
        CONSTRAINT "FK_rpu_RolPermiso" FOREIGN KEY ("ID_Rol", "ID_Permiso")
          REFERENCES "rol_permiso"("ID_Rol", "ID_Permiso") ON DELETE NO ACTION,
        CONSTRAINT "FK_rpu_Usuario" FOREIGN KEY ("ID_Usuario")
          REFERENCES "Usuario"("ID_Usuario") ON DELETE NO ACTION
      )
    `);

    // ─── Inventario: Notas ───────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "NotaIngreso" (
        "ID_Ingreso"  SERIAL                  NOT NULL,
        "Fecha"       date                     NOT NULL,
        "Hora"        time                     NOT NULL,
        "Descripcion" character varying(300),
        "Nombre"      character varying(100),
        "ID_Compra"   integer,
        "ID_Empleado" integer                  NOT NULL,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_NotaIngreso" PRIMARY KEY ("ID_Ingreso"),
        CONSTRAINT "FK_NotaIngreso_NotaCompra" FOREIGN KEY ("ID_Compra")
          REFERENCES "NotaCompra"("ID_Compra") ON DELETE NO ACTION,
        CONSTRAINT "FK_NotaIngreso_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "NotaEgreso" (
        "ID_Egreso"   SERIAL                  NOT NULL,
        "Fecha"       date                     NOT NULL,
        "Hora"        time                     NOT NULL,
        "Descripcion" character varying(300),
        "MontoTotal"  decimal(12,2)            NOT NULL,
        "ID_Empleado" integer                  NOT NULL,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_NotaEgreso" PRIMARY KEY ("ID_Egreso"),
        CONSTRAINT "FK_NotaEgreso_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Mermas" (
        "ID_Merma"      SERIAL                  NOT NULL,
        "Fecha"         date                     NOT NULL,
        "MotivoPerdida" character varying(300)   NOT NULL,
        "ID_Empleado"   integer                  NOT NULL,
        "deleted_at"    TIMESTAMP,
        CONSTRAINT "PK_Mermas" PRIMARY KEY ("ID_Merma"),
        CONSTRAINT "FK_Mermas_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    // ─── Finanzas: CxP ───────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "DetalleCompra" (
        "ID_Detalle"        SERIAL          NOT NULL,
        "Cantidad"          integer         NOT NULL,
        "Precio_Unitario"   decimal(10,2)   NOT NULL,
        "Subtotal"          decimal(10,2)   NOT NULL,
        "Fecha_Elaboracion" date,
        "Fecha_Vencimiento" date,
        "ID_Compra"         integer         NOT NULL,
        "ID_Producto"       integer         NOT NULL,
        CONSTRAINT "PK_DetalleCompra" PRIMARY KEY ("ID_Detalle"),
        CONSTRAINT "FK_DetalleCompra_NotaCompra" FOREIGN KEY ("ID_Compra")
          REFERENCES "NotaCompra"("ID_Compra") ON DELETE CASCADE,
        CONSTRAINT "FK_DetalleCompra_Producto" FOREIGN KEY ("ID_Producto")
          REFERENCES "Producto"("ID_Producto") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "CuentaPorPagar" (
        "ID_Cuenta"        SERIAL          NOT NULL,
        "Saldo_Pendiente"  decimal(10,2)   NOT NULL,
        "Fecha_Vencimiento" date            NOT NULL,
        "Estado_Pago"      character varying(20) NOT NULL DEFAULT 'PENDIENTE',
        "ID_Compra"        integer         NOT NULL,
        "deleted_at"       TIMESTAMP,
        CONSTRAINT "PK_CuentaPorPagar" PRIMARY KEY ("ID_Cuenta"),
        CONSTRAINT "FK_CuentaPorPagar_NotaCompra" FOREIGN KEY ("ID_Compra")
          REFERENCES "NotaCompra"("ID_Compra") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "CuotaCxP" (
        "ID_CuotaCxP"      SERIAL          NOT NULL,
        "ID_Cuenta"        integer         NOT NULL,
        "Numero_Cuota"     integer         NOT NULL,
        "Fecha_Vencimiento" date            NOT NULL,
        "Monto"            decimal(10,2)   NOT NULL,
        "Estado"           character varying(20) NOT NULL DEFAULT 'PENDIENTE',
        CONSTRAINT "PK_CuotaCxP" PRIMARY KEY ("ID_CuotaCxP"),
        CONSTRAINT "FK_CuotaCxP_CuentaPorPagar" FOREIGN KEY ("ID_Cuenta")
          REFERENCES "CuentaPorPagar"("ID_Cuenta") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "RegistroPago" (
        "ID_Pago"                  SERIAL                  NOT NULL,
        "Monto_Pagado"             decimal(10,2)            NOT NULL,
        "Fecha_Pago"               date                     NOT NULL,
        "Metodo_Pago"              character varying(20)    NOT NULL,
        "Referencia_Comprobante"   character varying(255),
        "Observaciones"            text,
        "ID_Cuenta"                integer                  NOT NULL,
        "ID_Empleado"              integer                  NOT NULL,
        "deleted_at"               TIMESTAMP,
        CONSTRAINT "PK_RegistroPago" PRIMARY KEY ("ID_Pago"),
        CONSTRAINT "FK_RegistroPago_CuentaPorPagar" FOREIGN KEY ("ID_Cuenta")
          REFERENCES "CuentaPorPagar"("ID_Cuenta") ON DELETE NO ACTION,
        CONSTRAINT "FK_RegistroPago_Empleado" FOREIGN KEY ("ID_Empleado")
          REFERENCES "Empleado"("ID_Empleado") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "PlanPago" (
        "ID_Pago"    integer        NOT NULL,
        "ID_Cuota"   integer        NOT NULL,
        "Fecha"      date           NOT NULL,
        "Monto"      decimal(12,2)  NOT NULL,
        "Estado"     character varying(50) NOT NULL,
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_PlanPago" PRIMARY KEY ("ID_Pago", "ID_Cuota"),
        CONSTRAINT "FK_PlanPago_Pago" FOREIGN KEY ("ID_Pago")
          REFERENCES "Pago"("ID_Pago") ON DELETE NO ACTION
      )
    `);

    // ─── Inventario: Detalles ────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "DetalleIngreso" (
        "ID_Ingreso"  integer        NOT NULL,
        "ID_Producto" integer        NOT NULL,
        "ID_Almacen"  integer        NOT NULL,
        "Cantidad"    decimal(10,2)  NOT NULL,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_DetalleIngreso" PRIMARY KEY ("ID_Ingreso", "ID_Producto", "ID_Almacen"),
        CONSTRAINT "FK_DetalleIngreso_NotaIngreso" FOREIGN KEY ("ID_Ingreso")
          REFERENCES "NotaIngreso"("ID_Ingreso") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleIngreso_ProductoAlmacen" FOREIGN KEY ("ID_Producto", "ID_Almacen")
          REFERENCES "ProductoAlmacen"("ID_Producto", "ID_Almacen") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleIngreso_Producto" FOREIGN KEY ("ID_Producto")
          REFERENCES "Producto"("ID_Producto") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "DetalleEgreso" (
        "ID_Egreso"   integer        NOT NULL,
        "ID_Producto" integer        NOT NULL,
        "ID_Almacen"  integer        NOT NULL,
        "Cantidad"    decimal(10,2)  NOT NULL,
        "ID_Sucursal" integer,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_DetalleEgreso" PRIMARY KEY ("ID_Egreso", "ID_Producto", "ID_Almacen"),
        CONSTRAINT "FK_DetalleEgreso_NotaEgreso" FOREIGN KEY ("ID_Egreso")
          REFERENCES "NotaEgreso"("ID_Egreso") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleEgreso_ProductoAlmacen" FOREIGN KEY ("ID_Producto", "ID_Almacen")
          REFERENCES "ProductoAlmacen"("ID_Producto", "ID_Almacen") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleEgreso_Producto" FOREIGN KEY ("ID_Producto")
          REFERENCES "Producto"("ID_Producto") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleEgreso_Sucursal" FOREIGN KEY ("ID_Sucursal")
          REFERENCES "Sucursal"("ID_Sucursal") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "DetalleMerma" (
        "ID_Merma"    integer        NOT NULL,
        "ID_Producto" integer        NOT NULL,
        "ID_Almacen"  integer        NOT NULL,
        "Cantidad"    decimal(10,2)  NOT NULL,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_DetalleMerma" PRIMARY KEY ("ID_Merma", "ID_Producto", "ID_Almacen"),
        CONSTRAINT "FK_DetalleMerma_Mermas" FOREIGN KEY ("ID_Merma")
          REFERENCES "Mermas"("ID_Merma") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleMerma_ProductoAlmacen" FOREIGN KEY ("ID_Producto", "ID_Almacen")
          REFERENCES "ProductoAlmacen"("ID_Producto", "ID_Almacen") ON DELETE NO ACTION,
        CONSTRAINT "FK_DetalleMerma_Producto" FOREIGN KEY ("ID_Producto")
          REFERENCES "Producto"("ID_Producto") ON DELETE NO ACTION
      )
    `);

    // ─── Despachos y GPS ─────────────────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "Despacho" (
        "ID_Despacho"               SERIAL                  NOT NULL,
        "FechaSalida"               date                     NOT NULL,
        "FechaEntregaEstimada"      date                     NOT NULL,
        "FechaHora_Salida"          TIMESTAMP WITH TIME ZONE,
        "FechaHora_Estimada_Entrega" TIMESTAMP WITH TIME ZONE,
        "ID_Egreso"                 integer                  NOT NULL,
        "ID_Ruta"                   integer                  NOT NULL,
        "Estado_Despacho"           character varying(20)    NOT NULL DEFAULT 'PENDIENTE',
        "Progreso_Porcentaje"       double precision         NOT NULL DEFAULT 0,
        "Ultima_Actualizacion_Ms"   double precision,
        "deleted_at"                TIMESTAMP,
        CONSTRAINT "PK_Despacho" PRIMARY KEY ("ID_Despacho"),
        CONSTRAINT "FK_Despacho_NotaEgreso" FOREIGN KEY ("ID_Egreso")
          REFERENCES "NotaEgreso"("ID_Egreso") ON DELETE NO ACTION,
        CONSTRAINT "FK_Despacho_Ruta" FOREIGN KEY ("ID_Ruta")
          REFERENCES "Ruta"("ID_Ruta") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "despacho_camion" (
        "ID_Despacho"  integer                NOT NULL,
        "ID_Camion"    integer                NOT NULL,
        "EstadoDeEnvio" character varying(100) NOT NULL,
        "deleted_at"   TIMESTAMP,
        CONSTRAINT "PK_despacho_camion" PRIMARY KEY ("ID_Despacho", "ID_Camion"),
        CONSTRAINT "FK_despacho_camion_Despacho" FOREIGN KEY ("ID_Despacho")
          REFERENCES "Despacho"("ID_Despacho") ON DELETE NO ACTION,
        CONSTRAINT "FK_despacho_camion_Camion" FOREIGN KEY ("ID_Camion")
          REFERENCES "Camion"("ID_Camion") ON DELETE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "TrackingGPS" (
        "ID_Tracking" SERIAL          NOT NULL,
        "Latitud"     decimal(10,7)   NOT NULL,
        "Longitud"    decimal(10,7)   NOT NULL,
        "FechaHora"   TIMESTAMP        NOT NULL,
        "ID_Despacho" integer          NOT NULL,
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "PK_TrackingGPS" PRIMARY KEY ("ID_Tracking"),
        CONSTRAINT "FK_TrackingGPS_Despacho" FOREIGN KEY ("ID_Despacho")
          REFERENCES "Despacho"("ID_Despacho") ON DELETE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Orden inverso respetando dependencias FK
    await queryRunner.query(`DROP TABLE IF EXISTS "TrackingGPS" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "despacho_camion" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Despacho" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "DetalleMerma" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "DetalleEgreso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "DetalleIngreso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "PlanPago" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "RegistroPago" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "CuotaCxP" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "CuentaPorPagar" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "DetalleCompra" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Mermas" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "NotaEgreso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "NotaIngreso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rol_permiso_usuario" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ContadorVisitas" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "CorreoEnviado" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "CorreoEnviados" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Usuario" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Pago" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "NotaCompra" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Ruta" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ProductoAlmacen" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Producto" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "rol_permiso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Camion" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Vehiculo" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "PageVisitCounter" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Proveedor" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Sucursal" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Almacen" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "UMedida" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Categoria" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Empleado" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Permiso" CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Rol" CASCADE`);
  }
}
