import { Despacho } from './despacho.entity';
import { Camion } from './camion.entity';
export declare class DespachoCamion {
    ID_Despacho: number;
    ID_Camion: number;
    EstadoDeEnvio: string;
    despacho: Despacho;
    camion: Camion;
    deleted_at: Date;
}
