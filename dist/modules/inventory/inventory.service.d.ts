import { OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NotaIngreso } from './entities/nota-ingreso.entity';
import { NotaEgreso } from './entities/nota-egreso.entity';
import { Mermas } from './entities/mermas.entity';
import { NotaCompra } from '../payments/entities/nota-compra.entity';
import { Proveedor } from '../payments/entities/proveedor.entity';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { CreateMermaDto } from './dto/create-merma.dto';
export declare class InventoryService implements OnApplicationBootstrap {
    private readonly dataSource;
    private readonly ingRepo;
    private readonly egrRepo;
    private readonly mermaRepo;
    private readonly provRepo;
    private readonly compraRepo;
    constructor(dataSource: DataSource, ingRepo: Repository<NotaIngreso>, egrRepo: Repository<NotaEgreso>, mermaRepo: Repository<Mermas>, provRepo: Repository<Proveedor>, compraRepo: Repository<NotaCompra>);
    onApplicationBootstrap(): Promise<void>;
    getIngresos(): Promise<NotaIngreso[]>;
    getEgresos(): Promise<NotaEgreso[]>;
    getMermas(): Promise<Mermas[]>;
    registrarIngreso(dto: CreateIngresoDto, userId: number): Promise<{
        status: string;
        ID_Ingreso: number;
    }>;
    registrarEgreso(dto: CreateEgresoDto, userId: number): Promise<{
        status: string;
        ID_Egreso: number;
        MontoTotal: number;
    }>;
    registrarMerma(dto: CreateMermaDto, userId: number): Promise<{
        status: string;
        ID_Merma: number;
    }>;
    private horaActual;
}
