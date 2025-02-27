-- Busca processos tramitados de um determinado setor para outro determinado setor, do t1 para o t2  
WITH TramitacoesOrdenadas AS (
    SELECT 
        t.nutramite,
        t.cdorgaotrami,
        t.dtrecebto,
        t.hrrecebto,
        t.dtencaminha,
        t.hrencaminha,
        t.nutramianterior,
        t.NUANO,
        t.NUPROCESSO,
        t.CDORGAOSETOR,
        ROW_NUMBER() OVER (PARTITION BY t.NUANO, t.NUPROCESSO ORDER BY t.dtrecebto, t.hrrecebto) AS rn
    FROM 
        ecpatramitacao t
)
SELECT 
    t1.NUANO AS "Ano",
    t1.NUPROCESSO AS "Numero Processo",
    t2.dtencaminha AS "Encaminhado em",
    t2.hrencaminha AS "Hora Encaminhado",
    s.SGORGAOSETOR AS "Setor Recebido",
    t1.nutramite AS "Numero Tramitacao",
    t1.dtrecebto AS "Recebido em",
    t1.hrrecebto AS "Hora Recebido"
FROM 
    TramitacoesOrdenadas t1
INNER JOIN 
    TramitacoesOrdenadas t2 
    ON t2.NUANO = t1.NUANO 
    AND t2.NUPROCESSO = t1.NUPROCESSO 
    AND t2.nutramite = t1.nutramianterior
INNER JOIN 
    ECPASERVPROCESSO p 
    ON p.cdorgaosetor = t1.CDORGAOSETOR  
    AND p.nuano = t1.NUANO 
    AND p.nuprocesso = t1.NUPROCESSO
INNER JOIN 
    ECPAORGAOSETOR S
    ON S.CDORGAOSETOR = t1.cdorgaotrami
WHERE 
    t1.cdorgaotrami = 587
    AND t2.cdorgaotrami = 1566
ORDER BY
    t1.NUANO, t1.NUPROCESSO, t1.dtrecebto, t1.hrrecebto;
