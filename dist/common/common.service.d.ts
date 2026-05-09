import { Repository } from 'typeorm';
import { PageVisitCounter } from './entities/page-visit-counter.entity';
export declare class CommonService {
    private readonly pageRepo;
    private readonly dedupMap;
    constructor(pageRepo: Repository<PageVisitCounter>);
    incrementarVisita(ip: string, ruta: string): Promise<number>;
    getVisitasPorRuta(ruta: string): Promise<number>;
}
