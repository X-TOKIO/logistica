import { AuthService } from './auth.service';
export declare class EmpleadosController {
    private readonly authService;
    constructor(authService: AuthService);
    getEmpleados(): Promise<import("./entities/empleado.entity").Empleado[]>;
    createEmpleado(body: any): Promise<import("./entities/empleado.entity").Empleado>;
    updateEmpleado(id: number, body: any): Promise<import("./entities/empleado.entity").Empleado | null>;
    deleteEmpleado(id: number): Promise<{
        success: boolean;
    }>;
}
