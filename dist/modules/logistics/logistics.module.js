"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogisticsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sucursal_entity_1 = require("./entities/sucursal.entity");
const ruta_entity_1 = require("./entities/ruta.entity");
const camion_entity_1 = require("./entities/camion.entity");
const vehiculo_entity_1 = require("./entities/vehiculo.entity");
const despacho_entity_1 = require("./entities/despacho.entity");
const despacho_camion_entity_1 = require("./entities/despacho-camion.entity");
const tracking_gps_entity_1 = require("./entities/tracking-gps.entity");
const logistics_service_1 = require("./logistics.service");
const logistics_controller_1 = require("./logistics.controller");
const logistics_catalog_service_1 = require("./logistics-catalog.service");
const logistics_catalog_controller_1 = require("./logistics-catalog.controller");
const nota_egreso_entity_1 = require("../inventory/entities/nota-egreso.entity");
const usuario_entity_1 = require("../auth/entities/usuario.entity");
const almacen_entity_1 = require("../warehouse/entities/almacen.entity");
const proveedor_entity_1 = require("../payments/entities/proveedor.entity");
let LogisticsModule = class LogisticsModule {
};
exports.LogisticsModule = LogisticsModule;
exports.LogisticsModule = LogisticsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                sucursal_entity_1.Sucursal, ruta_entity_1.Ruta, camion_entity_1.Camion, vehiculo_entity_1.Vehiculo, despacho_entity_1.Despacho, despacho_camion_entity_1.DespachoCamion, tracking_gps_entity_1.TrackingGPS,
                nota_egreso_entity_1.NotaEgreso, usuario_entity_1.Usuario, almacen_entity_1.Almacen, proveedor_entity_1.Proveedor,
            ])],
        controllers: [logistics_controller_1.LogisticsController, logistics_catalog_controller_1.LogisticsCatalogController],
        providers: [logistics_service_1.LogisticsService, logistics_catalog_service_1.LogisticsCatalogService],
        exports: [typeorm_1.TypeOrmModule],
    })
], LogisticsModule);
//# sourceMappingURL=logistics.module.js.map