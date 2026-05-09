import { AuthService } from './auth.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosController {
    private readonly authService;
    constructor(authService: AuthService);
    getAll(): Promise<import("./entities/usuario.entity").Usuario[]>;
    updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<{
        success: boolean;
        message: string;
    }>;
    desbloquear(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    updateEstado(id: number, estado: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
