"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nota_ingreso_entity_1 = require("./entities/nota-ingreso.entity");
const detalle_ingreso_entity_1 = require("./entities/detalle-ingreso.entity");
const nota_egreso_entity_1 = require("./entities/nota-egreso.entity");
const detalle_egreso_entity_1 = require("./entities/detalle-egreso.entity");
const mermas_entity_1 = require("./entities/mermas.entity");
const detalle_merma_entity_1 = require("./entities/detalle-merma.entity");
const producto_almacen_entity_1 = require("../warehouse/entities/producto-almacen.entity");
const proveedor_entity_1 = require("../payments/entities/proveedor.entity");
const nota_compra_entity_1 = require("../payments/entities/nota-compra.entity");
const inventory_service_1 = require("./inventory.service");
const inventory_controller_1 = require("./inventory.controller");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                nota_ingreso_entity_1.NotaIngreso, detalle_ingreso_entity_1.DetalleIngreso,
                nota_egreso_entity_1.NotaEgreso, detalle_egreso_entity_1.DetalleEgreso,
                mermas_entity_1.Mermas, detalle_merma_entity_1.DetalleMerma,
                producto_almacen_entity_1.ProductoAlmacen,
                proveedor_entity_1.Proveedor, nota_compra_entity_1.NotaCompra,
            ]),
        ],
        controllers: [inventory_controller_1.InventoryController],
        providers: [inventory_service_1.InventoryService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map