import { InventoryService } from './inventory.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { CreateMermaDto } from './dto/create-merma.dto';
export declare class InventoryController {
    private readonly invService;
    constructor(invService: InventoryService);
    getIngresos(): Promise<import("./entities/nota-ingreso.entity").NotaIngreso[]>;
    registrarIngreso(dto: CreateIngresoDto, req: any): Promise<{
        status: string;
        ID_Ingreso: number;
    }>;
    getEgresos(): Promise<import("./entities/nota-egreso.entity").NotaEgreso[]>;
    registrarEgreso(dto: CreateEgresoDto, req: any): Promise<{
        status: string;
        ID_Egreso: number;
        MontoTotal: number;
    }>;
    getMermas(): Promise<import("./entities/mermas.entity").Mermas[]>;
    registrarMerma(dto: CreateMermaDto, req: any): Promise<{
        status: string;
        ID_Merma: number;
    }>;
}
