-- Relatório de apontamentos no Solar, para apresentar a Prefeitura 
WITH Metadados AS (
    SELECT 
        SP.NUFORMATADO AS Processo,
        p.dtentrada,
        p.CDUSUARIO,
        M.NMMETADADO AS nomeMetadado,
        MV.DEMETADADO AS sivalor
    FROM SOLAR.ECPASERVPROCESSO SP
    INNER JOIN SOLAR.ECPAMETADADOVALORPROCESSO MVP ON MVP.CDPROCESSO = SP.CDPROCESSO
    INNER JOIN SOLAR.ECPAMETADADOVALOR MV ON MV.CDMETADADOVALOR = MVP.CDMETADADOVALOR
    INNER JOIN SOLAR.ECPAMETADADO M ON M.CDMETADADO = MV.CDMETADADO
    INNER JOIN SOLAR.ECPAPROCESSO P ON P.CDORGAOSETOR = SP.CDORGAOSETOR 
        AND P.NUANO = SP.NUANO 
        AND P.NUPROCESSO = SP.NUPROCESSO
    INNER JOIN SOLAR.ECPAPROCASSUNTO PA ON PA.CDORGAOSETOR = P.CDORGAOSETOR 
        AND PA.NUANO = P.NUANO 
        AND PA.NUPROCESSO = P.NUPROCESSO 
        AND PA.FLPRINCIPAL = 'S'
    INNER JOIN SOLAR.ECPAORGAOSETOR OS ON OS.CDORGAOSETOR = P.CDSETORORIGEM
    WHERE PA.CDASSUNTO IN (793)
    AND P.FLCANCELADO = 'N'
)
, Filtros AS (
    SELECT DISTINCT Processo
    FROM Metadados
    WHERE nomeMetadado = 'Data do atendimento'
    AND REGEXP_LIKE(sivalor, '^\d{2}/\d{2}/\d{4}$')  -- Periodo que quero puxar o relatório
    AND TO_DATE(sivalor, 'DD/MM/YYYY') BETWEEN TO_DATE('01/10/2024', 'DD/MM/YYYY') AND TO_DATE('08/10/2024', 'DD/MM/YYYY')
)
SELECT * FROM (
    SELECT 
        m.Processo,
        m.dtentrada,
        m.CDUSUARIO,
        m.nomeMetadado,
        m.sivalor
    FROM Metadados m
    JOIN Filtros f ON m.Processo = f.Processo
) PIVOT (
    MAX(sivalor)
    FOR nomeMetadado IN ('Atividade', 'Data do atendimento', 'detalhes', 'Resolução')
)
ORDER BY CDUSUARIO;
