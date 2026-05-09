"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const payments_service_1 = require("../modules/payments/payments.service");
const libelula_service_1 = require("../modules/payments/libelula.service");
const typeorm_1 = require("@nestjs/typeorm");
const nota_compra_entity_1 = require("../modules/payments/entities/nota-compra.entity");
const FIXES = [
    { idCompra: 28, codigoRecaudacion: '729813409119', forceActivar: true },
    { idCompra: 29, codigoRecaudacion: '766013409194', forceActivar: true },
];
const sep = () => console.log('─'.repeat(56));
const ok = (msg) => console.log(`  ✅ ${msg}`);
const fail = (msg) => console.log(`  ✗  ${msg}`);
const info = (msg) => console.log(`     ${msg}`);
async function main() {
    console.log('\n' + '═'.repeat(56));
    console.log('  FIX: Vinculación de pagos Libélula — PARADISO');
    console.log('═'.repeat(56) + '\n');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn'],
    });
    const paymentsSrv = app.get(payments_service_1.PaymentsService);
    const libelulaSrv = app.get(libelula_service_1.LibelulaService);
    const notaRepo = app.get((0, typeorm_1.getRepositoryToken)(nota_compra_entity_1.NotaCompra));
    const activadas = [];
    for (const fix of FIXES) {
        sep();
        console.log(`\n  📦 Compra #${fix.idCompra}\n`);
        const compra = await notaRepo.findOne({ where: { ID_Compra: fix.idCompra } });
        if (!compra) {
            fail(`Compra #${fix.idCompra} no existe en la BD`);
            continue;
        }
        info(`Estado actual   : ${compra.Estado_Documento}`);
        info(`Ref_Libelula    : ${compra.Ref_Libelula ?? '—'}`);
        info(`Id_Libelula     : ${compra.Id_Libelula ?? '—'}`);
        info(`Codigo_Recaudacion: ${compra.Codigo_Recaudacion ?? '—'}`);
        if (compra.Estado_Documento === 'ACTIVO') {
            ok(`Compra #${fix.idCompra} ya está ACTIVO — sin cambios`);
            activadas.push(fix.idCompra);
            continue;
        }
        await notaRepo.update({ ID_Compra: fix.idCompra }, { Codigo_Recaudacion: fix.codigoRecaudacion });
        ok(`Codigo_Recaudacion guardado: ${fix.codigoRecaudacion}`);
        const params = {
            codigoRecaudacion: fix.codigoRecaudacion,
            idTransaccion: compra.Id_Libelula ?? undefined,
            identificadorDeuda: compra.Ref_Libelula ?? undefined,
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
        try {
            await paymentsSrv.confirmarPagoQR(fix.idCompra);
        }
        catch {
            await notaRepo.update({ ID_Compra: fix.idCompra }, { Estado_Documento: 'ACTIVO' });
        }
        ok(`Compra #${fix.idCompra} → Estado cambiado a ACTIVO`);
        activadas.push(fix.idCompra);
    }
    sep();
    console.log('');
    const todas = FIXES.map(f => f.idCompra);
    const pendientes = todas.filter(id => !activadas.includes(id));
    if (pendientes.length === 0) {
        console.log('✅ Compra #28 y #29 vinculadas y marcadas como PAGADAS con éxito');
    }
    else {
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
//# sourceMappingURL=fix-pagos-libelula.js.map