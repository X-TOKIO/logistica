import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageVisitCounter } from './entities/page-visit-counter.entity';

@Injectable()
export class CommonService {
  // key: `${ip}:${ruta}` → timestamp última petición
  private readonly dedupMap = new Map<string, number>();

  constructor(
    @InjectRepository(PageVisitCounter)
    private readonly pageRepo: Repository<PageVisitCounter>,
  ) {}

  async incrementarVisita(ip: string, ruta: string): Promise<number> {
    const key = `${ip}:${ruta}`;
    const now = Date.now();
    const last = this.dedupMap.get(key);

    // Anti-duplicidad: ignora si misma IP+ruta en menos de 3 segundos
    if (last !== undefined && now - last < 3000) {
      const record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
      return record?.total_visitas ?? 0;
    }

    this.dedupMap.set(key, now);

    // Limpieza periódica para evitar fuga de memoria
    if (this.dedupMap.size > 5000) {
      const cutoff = now - 60000;
      for (const [k, v] of this.dedupMap.entries()) {
        if (v < cutoff) this.dedupMap.delete(k);
      }
    }

    let record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
    if (!record) {
      record = this.pageRepo.create({ ruta_pagina: ruta, total_visitas: 0 });
    }
    record.total_visitas += 1;
    await this.pageRepo.save(record);
    return record.total_visitas;
  }

  async getVisitasPorRuta(ruta: string): Promise<number> {
    const record = await this.pageRepo.findOne({ where: { ruta_pagina: ruta } });
    return record?.total_visitas ?? 0;
  }
}
