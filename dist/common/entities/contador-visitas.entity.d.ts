import { Usuario } from '../../modules/auth/entities/usuario.entity';
export declare class ContadorVisitas {
    ID_Visita: number;
    NombrePagina: string;
    Contador: number;
    UltimaVisita: Date;
    ID_Usuario: number;
    usuario: Usuario;
    deleted_at: Date;
}
