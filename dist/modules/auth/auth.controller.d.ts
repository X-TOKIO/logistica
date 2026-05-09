import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateSelfProfileDto } from './dto/update-usuario.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterAuthDto): Promise<import("./entities/usuario.entity").Usuario>;
    login(loginDto: LoginAuthDto): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    refresh(req: any): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            fullName: string;
            roles: string[];
            permissions: string[];
        };
    }>;
    updateMe(req: any, dto: UpdateSelfProfileDto): Promise<{
        success: boolean;
        message: string;
        updatedUser: {
            id: number;
            username: string;
            email: string;
            fullName: string;
        };
    }>;
    getAdminDashboard(req: any): {
        message: string;
        user: any;
    };
}
