import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

export interface ConsultaDeudaResult {
  pagado: boolean;
  estado: string;
  raw: any;
}

export interface GenerarQRPayload {
  monto: number;
  glosa: string;
  idTransaccion: string;
  email?: string;
}

export interface QRResponse {
  qrUrl?: string;
  pasarelaUrl?: string;
  idTransaccion: string;
  /** UUID asignado por Libélula en su respuesta al /registrar */
  idLibelula?: string;
  /** Código de recaudación numérico (12 dígitos) */
  codigoRecaudacion?: string;
}

export interface ConsultaParams {
  /** UUID de Libélula — prioridad 1 */
  idTransaccion?: string;
  /** Código numérico de 12 dígitos — prioridad 2 */
  codigoRecaudacion?: string;
  /** Nuestro PAY-... — último recurso */
  identificadorDeuda?: string;
}

@Injectable()
export class LibelulaService {
  private readonly logger = new Logger('LibelulaService');
  private readonly appKey: string;
  private readonly apiUrl: string;

  private readonly consultaUrl: string;

  constructor() {
    this.appKey = process.env.LIBELULA_APP_KEY ?? '';
    this.apiUrl =
      process.env.LIBELULA_API_URL ?? 'https://api.libelula.bo/rest/deuda/registrar';
    this.consultaUrl =
      process.env.LIBELULA_CONSULTA_URL ?? 'https://api.libelula.bo/rest/deuda/consultar';
  }

  async generarPagoQR(payload: GenerarQRPayload): Promise<QRResponse> {
    const body = {
      appkey: this.appKey,
      email_cliente: payload.email ?? 'emailflores4@gmail.com',
      identificador_deuda: payload.idTransaccion,
      descripcion: payload.glosa,
      callback_url: `${process.env.PUBLIC_API_URL}/payments/webhook/qr-confirm`,
      url_retorno: 'http://localhost:5173',
      lineas_detalle_deuda: [
        {
          cantidad: 1,
          concepto: payload.glosa,
          costo_unitario: parseFloat(payload.monto.toFixed(2)),
        },
      ],
    };

    console.log('Cuerpo enviado a Libélula:', JSON.stringify(body, null, 2));
    this.logger.log(`Solicitando QR — identificador_deuda: ${payload.idTransaccion}`);

    let rawText = '';
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      rawText = await response.text();
      console.log(`Respuesta Libélula [${response.status}]:`, rawText);

      let data: any = {};
      try { data = JSON.parse(rawText); } catch { /* texto plano */ }

      // existente:1 o error:2 → deuda ya registrada; Libélula devuelve la URL existente
      const esExistente =
        Number(data?.existente) === 1 ||
        data?.existente === true ||
        Number(data?.error) === 2;

      if (esExistente) {
        const qrUrl = data?.qr_simple_url ?? undefined;
        const pasarelaUrl = data?.url_pasarela_pagos ?? undefined;
        this.logger.log(
          `[Libélula] Deuda existente (existente=${data?.existente} / error=${data?.error}) ` +
          `para ${payload.idTransaccion} — qr_simple_url=${qrUrl ?? 'N/A'}`,
        );
        return {
          idTransaccion: payload.idTransaccion, qrUrl, pasarelaUrl,
          idLibelula: data?.id_transaccion ?? undefined,
          codigoRecaudacion: data?.codigo_recaudacion?.toString() ?? undefined,
        };
      }

      if (!response.ok) {
        const msg = data?.mensaje ?? data?.error ?? rawText.slice(0, 200);
        this.logger.error(`Error Libélula [${response.status}]: ${rawText.slice(0, 500)}`);
        throw new InternalServerErrorException(
          `Libélula respondió con error ${response.status}: ${msg}`,
        );
      }

      this.logger.log(`QR generado OK — identificador_deuda: ${payload.idTransaccion}`);

      return {
        idTransaccion: payload.idTransaccion,
        qrUrl: data?.qr_simple_url ?? undefined,
        pasarelaUrl: data?.url_pasarela_pagos ?? undefined,
        idLibelula: data?.id_transaccion ?? undefined,
        codigoRecaudacion: data?.codigo_recaudacion?.toString() ?? undefined,
      };
    } catch (err) {
      if (err instanceof InternalServerErrorException) throw err;
      console.log('Respuesta cruda de Libélula (catch):', rawText);
      this.logger.error(`Fallo de conexión con Libélula: ${(err as Error).message}`);
      throw new InternalServerErrorException('No se pudo conectar con la pasarela Libélula.');
    }
  }

  async consultarDeuda(params: ConsultaParams): Promise<ConsultaDeudaResult> {
    const { idTransaccion, codigoRecaudacion, identificadorDeuda } = params;

    this.logger.log(
      `[Consulta Libélula] id_transaccion=${idTransaccion ?? '—'} | ` +
      `codigo_recaudacion=${codigoRecaudacion ?? '—'} | ` +
      `identificador_deuda=${identificadorDeuda ?? '—'}`,
    );

    // Estrategias en orden de prioridad según confirmación de Libélula Bolivia
    type Strategy = { label: string; qs: Record<string, string>; body: Record<string, string> };
    const strategies: Strategy[] = [];

    if (idTransaccion) {
      strategies.push({
        label: `id_transaccion=${idTransaccion}`,
        qs:   { appkey: this.appKey, id_transaccion: idTransaccion },
        body: { appkey: this.appKey, id_transaccion: idTransaccion },
      });
    }
    if (codigoRecaudacion) {
      strategies.push({
        label: `codigo_recaudacion=${codigoRecaudacion}`,
        qs:   { appkey: this.appKey, codigo_recaudacion: codigoRecaudacion },
        body: { appkey: this.appKey, codigo_recaudacion: codigoRecaudacion },
      });
    }
    // Estrategia combinada: algunos endpoints de Libélula exigen ambos parámetros juntos
    if (codigoRecaudacion && identificadorDeuda) {
      strategies.push({
        label: `combinado: codigo=${codigoRecaudacion}+identificador=${identificadorDeuda}`,
        qs:   { appkey: this.appKey, codigo_recaudacion: codigoRecaudacion, identificador_deuda: identificadorDeuda },
        body: { appkey: this.appKey, codigo_recaudacion: codigoRecaudacion, identificador_deuda: identificadorDeuda },
      });
    }
    if (identificadorDeuda) {
      // Último recurso: envía el PAY-... con todos los nombres de campo conocidos
      strategies.push({
        label: `identificador_deuda=${identificadorDeuda}`,
        qs:   { appkey: this.appKey, identificador_deuda: identificadorDeuda, id_transaccion: identificadorDeuda, id: identificadorDeuda },
        body: { appkey: this.appKey, identificador_deuda: identificadorDeuda, id_transaccion: identificadorDeuda, id: identificadorDeuda },
      });
    }

    if (strategies.length === 0) {
      throw new InternalServerErrorException('consultarDeuda: se requiere al menos un identificador.');
    }

    const doRequest = async (qs: Record<string, string>, body: Record<string, string>, fmt: 'json' | 'form') => {
      const url = new URL(this.consultaUrl);
      for (const [k, v] of Object.entries(qs)) url.searchParams.set(k, v);

      const headers: Record<string, string> = fmt === 'json'
        ? { 'Content-Type': 'application/json' }
        : { 'Content-Type': 'application/x-www-form-urlencoded' };
      const reqBody: BodyInit = fmt === 'json'
        ? JSON.stringify(body)
        : new URLSearchParams(body).toString();

      console.log(`[Consulta Libélula] ${fmt.toUpperCase()} → ${url.toString()} | ${reqBody}`);
      const res = await fetch(url.toString(), { method: 'POST', headers, body: reqBody });
      const rawText = await res.text();
      let data: any = {};
      try { data = JSON.parse(rawText); } catch { /* texto plano */ }
      return { rawText, data, ok: res.ok, status: res.status };
    };

    const indicaFaltante = (raw: string, status: number) =>
      status >= 400 && (
        raw.toLowerCase().includes('faltante') ||
        raw.toLowerCase().includes('missing') ||
        raw.toLowerCase().includes('requerido') ||
        raw.toLowerCase().includes('required') ||
        raw.toLowerCase().includes('identificador')
      );

    const extraerPagado = (data: any): { pagado: boolean; estado: string } => {
      const estadoRaw: string = (
        data?.estado_deuda ?? data?.estado ?? data?.Estado ?? data?.status ?? ''
      ).toString().toUpperCase().trim();

      const datosPagados = Array.isArray(data?.datos) && data.datos.some(
        (d: any) =>
          d?.pagado === true || Number(d?.pagado) === 1 ||
          ['PAGADO', 'PAGADA', 'COMPLETED', 'APROBADO'].includes(
            (d?.estado ?? d?.Estado ?? '').toString().toUpperCase().trim(),
          ),
      );

      const PAGADOS = new Set(['PAGADO', 'PAGADA', 'COMPLETED', 'APROBADO']);
      const pagado =
        PAGADOS.has(estadoRaw) || estadoRaw === '1' ||
        Number(data?.estado) === 1 ||
        data?.pagado === true || Number(data?.pagado) === 1 ||
        datosPagados;

      return { pagado, estado: estadoRaw || 'PENDIENTE' };
    };

    try {
      for (const strategy of strategies) {
        let { rawText, data, ok, status } = await doRequest(strategy.qs, strategy.body, 'json');

        if (indicaFaltante(rawText, status)) {
          this.logger.warn(`[Consulta Libélula] "${strategy.label}" JSON → ${status}, reintentando form-urlencoded…`);
          ({ rawText, data, ok, status } = await doRequest(strategy.qs, strategy.body, 'form'));
        }

        console.log(`\n===== [Libélula AUDIT] ${strategy.label} [${status}] =====`);
        console.log(JSON.stringify(data, null, 2));
        console.log(`===== [Libélula AUDIT END] =====\n`);

        // Libélula a veces devuelve HTTP 200 con error:1 indicando parámetro faltante
        const esParametroFaltante =
          Number(data?.error) === 1 &&
          (data?.mensaje ?? '').toLowerCase().includes('identificador');

        if ((!ok && status >= 400) || esParametroFaltante) {
          this.logger.warn(`[Consulta Libélula] Estrategia "${strategy.label}" → ${esParametroFaltante ? 'error:1 parámetro faltante' : status}, probando siguiente…`);
          continue;
        }

        const { pagado, estado } = extraerPagado(data);
        this.logger.log(`[Consulta Libélula] "${strategy.label}" → pagado=${pagado} estado=${estado}`);
        return { pagado, estado, raw: data };
      }

      // Todas las estrategias agotadas sin éxito
      this.logger.warn('[Consulta Libélula] Todas las estrategias fallaron, devolviendo PENDIENTE');
      return { pagado: false, estado: 'PENDIENTE', raw: {} };
    } catch (err) {
      this.logger.error(`[Consulta Libélula] Error de conexión: ${(err as Error).message}`);
      throw new InternalServerErrorException('No se pudo consultar el estado con Libélula.');
    }
  }
}
