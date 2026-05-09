import { CommonService } from './common.service';
export declare class CommonController {
    private readonly commonService;
    constructor(commonService: CommonService);
    incrementarVisita(ip: string, ruta: string): Promise<{
        status: string;
        total_visitas: number;
    }>;
    getVisitas(path?: string): Promise<{
        status: string;
        total_visitas: number;
    }>;
}
