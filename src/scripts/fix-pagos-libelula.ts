/**
 * Script de fix único: vincula los códigos de recaudación de Libélula
 * con las compras históricas y fuerza la verificación de pago.
 *
 * Uso:
 *   npm run fix:pagos-libelula
 */

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PaymentsService } from '../modules/payments/payments.service';
import { LibelulaService } from '../modules/payments/libelula.service';
import type { ConsultaParams } from '../modules/payments/libelula.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotaCompra } from '../modules/payments/entities/nota-compra.entity';

// ── Datos reales de los comprobantes de pago ────────────────────────────────
// forceActivar: true → activa la compra aunque Libélula diga pagado=false
// (usar cuando el pago fue confirmado manualmente por el administrador)
const FIXES: Array<{ idCompra: number; codigoRecaudacion: string; forceActivar?: boolean }> = [
  { idCompra: 28, codigoRecaudacion: '729813409119', forceActivar: true },
  { idCompra: 29, codigoRecaudacion: '766013409194', forceActivar: true },
];

// ── Helpers visuales ────────────────────────────────────────────────────────
const sep  = () => console.log('─'.repeat(56));
const ok   = (msg: string) => console.log(`  ✅ ${msg}`);
const fail = (msg: string) => console.log(`  ✗  ${msg}`);
const info = (msg: string) => console.log(`     ${msg}`);

async function main() {
  console.log('\n' + '═'.repeat(56));
  console.log('  FIX: Vinculación de pagos Libélula — PARADISO');
  console.log('═'.repeat(56) + '\n');

  // Arranca el contexto de NestJS sin servidor HTTP
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const paymentsSrv = app.get(PaymentsService);
  const libelulaSrv = app.get(LibelulaService);
  const notaRepo: Repository<NotaCompra> = app.get(getRepositoryToken(NotaCompra));

  const activadas: number[] = [];

  for (const fix of FIXES) {
    sep();
    console.log(`\n  📦 Compra #${fix.idCompra}\n`);

    // ── 1. Leer estado actual desde BD ─────────────────────────────────────
    const compra = await notaRepo.findOne({ where: { ID_Compra: fix.idCompra } });

    if (!compra) {
      fail(`Compra #${fix.idCompra} no existe en la BD`);
      continue;
    }

    info(`Estado actual   : ${compra.Estado_Documento}`);
    info(`Ref_Libelula    : ${compra.Ref_Libelula ?? '—'}`);
    info(`Id_Libelula     : ${(compra as any).Id_Libelula ?? '—'}`);
    info(`Codigo_Recaudacion: ${(compra as any).Codigo_Recaudacion ?? '—'}`);

    if (compra.Estado_Documento === 'ACTIVO') {
      ok(`Compra #${fix.idCompra} ya está ACTIVO — sin cambios`);
      activadas.push(fix.idCompra);
      continue;
    }

    // ── 2. Persistir código de recaudación ─────────────────────────────────
    await notaRepo.update(
      { ID_Compra: fix.idCompra },
      { Codigo_Recaudacion: fix.codigoRecaudacion } as any,
    );
    ok(`Codigo_Recaudacion guardado: ${fix.codigoRecaudacion}`);

    // ── 3. Construir parámetros priorizando UUID y código de recaudación ───
    const params: ConsultaParams = {
      codigoRecaudacion: fix.codigoRecaudacion,
      idTransaccion:      (compra as any).Id_Libelula    ?? undefined,
      identificadorDeuda: compra.Ref_Libelula             ?? undefined,
    };

    console.log('\n  → Consultando Libélula...');
    const resultado = await libelulaSrv.consultarDeuda(params);

    info(`pagado=${resultado.pagado} | estado=${resultado.estado}`);

    if (!resultado.pagado) {
      if (!fix.forceActivar) {
        fail(`Libélula no confirma el pago. Estado: ${resultado.estado}`);
        info('Respuesta raw de Libélula:');
        console.log(JSON.stringify(resultado.raw, null, 4)
          .split('\n').map(l => '  ' + l).join('\n'));
        continue;
      }
      console.log('\n  ⚠️  Libélula reporta pagado=false, pero forceActivar=true');
      console.log('     Activando por confirmación administrativa manual.\n');
    }

    // ── 4. Activar la compra ───────────────────────────────────────────────
    try {
      await paymentsSrv.confirmarPagoQR(fix.idCompra);
    } catch {
      // Si confirmarPagoQR falla por estado inesperado, lo forzamos directo
      await notaRepo.update({ ID_Compra: fix.idCompra }, { Estado_Documento: 'ACTIVO' } as any);
    }

    ok(`Compra #${fix.idCompra} → Estado cambiado a ACTIVO`);
    activadas.push(fix.idCompra);
  }

  // ── Resumen final ─────────────────────────────────────────────────────────
  sep();
  console.log('');
  const todas = FIXES.map(f => f.idCompra);
  const pendientes = todas.filter(id => !activadas.includes(id));

  if (pendientes.length === 0) {
    console.log('✅ Compra #28 y #29 vinculadas y marcadas como PAGADAS con éxito');
  } else {
    if (activadas.length > 0) {
      console.log(`✅ Compras activadas: ${activadas.map(id => '#' + id).join(', ')}`);
    }
    if (pendientes.length > 0) {
      console.log(`⚠️  Compras sin confirmar: ${pendientes.map(id => '#' + id).join(', ')}`);
      console.log('   Revisa el AUDIT LOG de Libélula impreso arriba para más detalles.');
    }
  }
  console.log('');
  sep();
  console.log('');

  await app.close();
}

main().catch(err => {
  console.error('\n[FIX] Error fatal:', err?.message ?? err);
  process.exit(1);
});
