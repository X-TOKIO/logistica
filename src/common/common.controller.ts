import { Controller, Get, Post, Body, Ip, Query } from '@nestjs/common';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // Incrementa el contador de la ruta recibida (con dedup anti-duplicidad)
  @Post('visitas/incrementar')
  async incrementarVisita(
    @Ip() ip: string,
    @Body('ruta') ruta: string,
  ) {
    const total_visitas = await this.commonService.incrementarVisita(
      ip || 'unknown',
      ruta || '/',
    );
    return { status: 'ok', total_visitas };
  }

  // Consulta el contador actual de una ruta (sin incrementar)
  @Get('visitas')
  async getVisitas(@Query('path') path?: string) {
    const total_visitas = path
      ? await this.commonService.getVisitasPorRuta(path)
      : 0;
    return { status: 'ok', total_visitas };
  }
}
