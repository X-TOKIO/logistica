-- ============================================================
-- Limpieza de Despachos Sin Actividad GPS (últimas 24 horas)
-- Ejecutar en psql o cualquier cliente PostgreSQL
-- Estados válidos: PENDIENTE | EN_RUTA | DETENIDO | ENTREGADO
-- ============================================================

-- 1. Ver despachos candidatos antes de modificar
SELECT
  d."ID_Despacho",
  d."Estado_Despacho",
  d."FechaSalida",
  MAX(t."FechaHora") AS ultima_senal_gps
FROM "Despacho" d
LEFT JOIN "TrackingGPS" t ON t."ID_Despacho" = d."ID_Despacho"
WHERE d."Estado_Despacho" NOT IN ('ENTREGADO')
GROUP BY d."ID_Despacho", d."Estado_Despacho", d."FechaSalida"
HAVING MAX(t."FechaHora") < NOW() - INTERVAL '24 hours'
   OR MAX(t."FechaHora") IS NULL
ORDER BY d."ID_Despacho";

-- 2. Marcar como ENTREGADO los despachos sin señal GPS en las últimas 24 horas
--    (Descomenta el UPDATE cuando hayas verificado los resultados del SELECT anterior)
/*
UPDATE "Despacho"
SET "Estado_Despacho" = 'ENTREGADO',
    "Progreso_Porcentaje" = 1.0
WHERE "ID_Despacho" IN (
  SELECT d."ID_Despacho"
  FROM "Despacho" d
  LEFT JOIN "TrackingGPS" t ON t."ID_Despacho" = d."ID_Despacho"
  WHERE d."Estado_Despacho" NOT IN ('ENTREGADO')
  GROUP BY d."ID_Despacho"
  HAVING MAX(t."FechaHora") < NOW() - INTERVAL '24 hours'
     OR MAX(t."FechaHora") IS NULL
);
*/

-- 3. Sincronizar DespachoCamion para los despachos marcados como ENTREGADO
--    (Descomenta después del UPDATE anterior)
/*
UPDATE despacho_camion
SET "EstadoDeEnvio" = 'ENTREGADO'
WHERE "ID_Despacho" IN (
  SELECT "ID_Despacho" FROM "Despacho"
  WHERE "Estado_Despacho" = 'ENTREGADO'
    AND "EstadoDeEnvio" != 'ENTREGADO'
);
*/
