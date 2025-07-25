/*Relatório de Processo da Astel que passaram pela infra. Processos dos fluxos "[ASTEL] REQUERIMENTO CÂMARA"
e "[ASTEL] INDICAÇÃO"*/
WITH RankedProcesses AS (
    SELECT
        N.NUPROCESSOFORMATADO AS PROCESSO,
        TU.DTENCAMINHA,
        TU.DTRECEBTO,
        OS.SGORGAOSETOR,
        AHV.NAME_,
        AHV.TEXT_,
-- Última data de encaminhamento válida (linha anterior)
(SELECT TU_ANT.DTENCAMINHA
 FROM ECPATRAMITACAO TU_ANT
 WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
   AND TU_ANT.NUANO = TU.NUANO
   AND TU_ANT.NUTRAMITE = (
       SELECT MAX(TU_PREV.NUTRAMITE)
       FROM ECPATRAMITACAO TU_PREV
       WHERE TU_PREV.NUPROCESSO = TU.NUPROCESSO
         AND TU_PREV.NUANO = TU.NUANO
         AND TU_PREV.NUTRAMITE < (
             SELECT MAX(TU_INFRA.NUTRAMITE)
             FROM ECPATRAMITACAO TU_INFRA
             LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
             WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
               AND TU_INFRA.NUANO = TU.NUANO
               AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         )
   )
 FETCH FIRST 1 ROWS ONLY) AS DTENCAMINHA_ANTERIOR,
        -- Último setor geral para o processo
        (SELECT OS_LATEST.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_LATEST
         LEFT JOIN ECPAORGAOSETOR OS_LATEST ON TU_LATEST.CDORGAOTRAMI = OS_LATEST.CDORGAOSETOR
         WHERE TU_LATEST.NUPROCESSO = TU.NUPROCESSO
           AND TU_LATEST.NUANO = TU.NUANO
         ORDER BY TU_LATEST.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_SGORGAOSETOR,
        -- Último setor do grupo INFRA
        (SELECT OS_INFRA.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_SETOR,
        -- Última data de recebimento válida para o setor INFRA
        (SELECT TU_INFRA.DTRECEBTO
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_RECEBIDO,
        PR.FLSITUACAO
    FROM 
        ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    LEFT JOIN ECPATRAMITACAO TU ON PR.NUANO = TU.NUANO 
        AND PR.NUPROCESSO = TU.NUPROCESSO
        AND TU.CDORGAOSETOR = PR.CDORGAOSETOR
    LEFT JOIN ECPAORGAOSETOR OS ON TU.CDORGAOTRAMI = OS.CDORGAOSETOR
    WHERE 
        P.NMPROCESSO IN ('[ASTEL] REQUERIMENTO CÂMARA', '[ASTEL] INDICAÇÃO')
        AND OS.SGORGAOSETOR LIKE '%INFRA%'
        AND (
            (TU.DTRECEBTO IS NULL AND TU.DTENCAMINHA >= TO_DATE('2025-06-09 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
            OR (TU.DTRECEBTO >= TO_DATE('2025-06-09 00:00:00', 'YYYY-MM-DD HH24:MI:SS')
                AND (SELECT TU_ANT.DTENCAMINHA
                     FROM ECPATRAMITACAO TU_ANT
                     WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
                       AND TU_ANT.NUANO = TU.NUANO
                       AND TU_ANT.NUTRAMITE = TU.NUTRAMITE - 1
                     FETCH FIRST 1 ROWS ONLY) >= TO_DATE('2025-06-09 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        )
)
SELECT 
    PROCESSO,
    MAX(DTENCAMINHA_ANTERIOR) AS ENCAMINHADO,
    MAX(LAST_INFRA_RECEBIDO) AS RECEBIDO, -- Data de recebimento apenas do setor INFRA
    MAX(LAST_INFRA_SETOR) AS SETOR,       -- Último setor INFRA
    MAX(CASE WHEN NAME_ = 'anoC' THEN TEXT_ END) AS Ano,
    MAX(CASE WHEN NAME_ = 'numeroC' THEN TEXT_ END) AS Requerimento,
    MAX(CASE WHEN NAME_ = 'autoriaC' THEN TEXT_ END) AS Vereador,
    MAX(CASE WHEN NAME_ = 'ementaC' THEN TEXT_ END) AS Assunto,
    MAX(CASE WHEN NAME_ = 'dataFinal' THEN TEXT_ END) AS Prazo,
    MAX(LAST_SGORGAOSETOR) AS ULTIMO_SETOR,
    MAX(CASE 
            WHEN FLSITUACAO = 'A' THEN 'ARQUIVADO'
            WHEN FLSITUACAO = 'E' THEN 'EM ANDAMENTO'
            WHEN FLSITUACAO = 'C' THEN 'CANCELADO'
            WHEN FLSITUACAO = 'R' THEN 'DESARQUIVADO'
            WHEN FLSITUACAO = 'Q' THEN 'REARQUIVADO'
            ELSE 'DESCONHECIDO'
        END) AS FLSITUACAO
FROM RankedProcesses
GROUP BY PROCESSO
ORDER BY PROCESSO;

--Relatório de Processo da Astel que passaram pela infra. Processos do fluxo "[ASTEL] REQUERIMENTO CÂMARA"--
WITH RankedProcesses AS (
    SELECT
        N.NUPROCESSOFORMATADO AS PROCESSO,
        TU.DTENCAMINHA,
        TU.DTRECEBTO,
        OS.SGORGAOSETOR,
        AHV.NAME_,
        AHV.TEXT_,
-- Última data de encaminhamento válida (linha anterior)
(SELECT TU_ANT.DTENCAMINHA
 FROM ECPATRAMITACAO TU_ANT
 WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
   AND TU_ANT.NUANO = TU.NUANO
   AND TU_ANT.NUTRAMITE = (
       SELECT MAX(TU_PREV.NUTRAMITE)
       FROM ECPATRAMITACAO TU_PREV
       WHERE TU_PREV.NUPROCESSO = TU.NUPROCESSO
         AND TU_PREV.NUANO = TU.NUANO
         AND TU_PREV.NUTRAMITE < (
             SELECT MAX(TU_INFRA.NUTRAMITE)
             FROM ECPATRAMITACAO TU_INFRA
             LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
             WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
               AND TU_INFRA.NUANO = TU.NUANO
               AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         )
   )
 FETCH FIRST 1 ROWS ONLY) AS DTENCAMINHA_ANTERIOR,
        -- Último setor geral para o processo
        (SELECT OS_LATEST.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_LATEST
         LEFT JOIN ECPAORGAOSETOR OS_LATEST ON TU_LATEST.CDORGAOTRAMI = OS_LATEST.CDORGAOSETOR
         WHERE TU_LATEST.NUPROCESSO = TU.NUPROCESSO
           AND TU_LATEST.NUANO = TU.NUANO
         ORDER BY TU_LATEST.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_SGORGAOSETOR,
        -- Último setor do grupo INFRA
        (SELECT OS_INFRA.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_SETOR,
        -- Última data de recebimento válida para o setor INFRA
        (SELECT TU_INFRA.DTRECEBTO
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_RECEBIDO,
        PR.FLSITUACAO
    FROM 
        ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    LEFT JOIN ECPATRAMITACAO TU ON PR.NUANO = TU.NUANO 
        AND PR.NUPROCESSO = TU.NUPROCESSO
        AND TU.CDORGAOSETOR = PR.CDORGAOSETOR
    LEFT JOIN ECPAORGAOSETOR OS ON TU.CDORGAOTRAMI = OS.CDORGAOSETOR
    WHERE 
        P.NMPROCESSO = '[ASTEL] REQUERIMENTO CÂMARA'
        AND OS.SGORGAOSETOR LIKE '%INFRA%'
        AND (
            (TU.DTRECEBTO IS NULL AND TU.DTENCAMINHA >= TO_DATE('2025-02-03 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
            OR (TU.DTRECEBTO >= TO_DATE('2025-02-03 00:00:00', 'YYYY-MM-DD HH24:MI:SS')
                AND (SELECT TU_ANT.DTENCAMINHA
                     FROM ECPATRAMITACAO TU_ANT
                     WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
                       AND TU_ANT.NUANO = TU.NUANO
                       AND TU_ANT.NUTRAMITE = TU.NUTRAMITE - 1
                     FETCH FIRST 1 ROWS ONLY) >= TO_DATE('2025-02-03 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        )
)
SELECT 
    PROCESSO,
    MAX(DTENCAMINHA_ANTERIOR) AS ENCAMINHADO,
    MAX(LAST_INFRA_RECEBIDO) AS RECEBIDO, -- Data de recebimento apenas do setor INFRA
    MAX(LAST_INFRA_SETOR) AS SETOR,       -- Último setor INFRA
    MAX(CASE WHEN NAME_ = 'anoC' THEN TEXT_ END) AS Ano,
    MAX(CASE WHEN NAME_ = 'numeroC' THEN TEXT_ END) AS Requerimento,
    MAX(CASE WHEN NAME_ = 'autoriaC' THEN TEXT_ END) AS Vereador,
    MAX(CASE WHEN NAME_ = 'ementaC' THEN TEXT_ END) AS Assunto,
    MAX(CASE WHEN NAME_ = 'dataFinal' THEN TEXT_ END) AS Prazo,
    MAX(LAST_SGORGAOSETOR) AS ULTIMO_SETOR,
    MAX(CASE 
            WHEN FLSITUACAO = 'A' THEN 'ARQUIVADO'
            WHEN FLSITUACAO = 'E' THEN 'EM ANDAMENTO'
            WHEN FLSITUACAO = 'C' THEN 'CANCELADO'
            WHEN FLSITUACAO = 'R' THEN 'DESARQUIVADO'
            WHEN FLSITUACAO = 'Q' THEN 'REARQUIVADO'
            ELSE 'DESCONHECIDO'
        END) AS FLSITUACAO
FROM RankedProcesses
GROUP BY PROCESSO
ORDER BY PROCESSO;

--Relatório de Processo da Astel que passaram pela infra. Processos do fluxo "[ASTEL] INDICAÇÃO"--
WITH RankedProcesses AS (
    SELECT
        N.NUPROCESSOFORMATADO AS PROCESSO,
        TU.DTENCAMINHA,
        TU.DTRECEBTO,
        OS.SGORGAOSETOR,
        AHV.NAME_,
        AHV.TEXT_,
-- Última data de encaminhamento válida (linha anterior)
(SELECT TU_ANT.DTENCAMINHA
 FROM ECPATRAMITACAO TU_ANT
 WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
   AND TU_ANT.NUANO = TU.NUANO
   AND TU_ANT.NUTRAMITE = (
       SELECT MAX(TU_PREV.NUTRAMITE)
       FROM ECPATRAMITACAO TU_PREV
       WHERE TU_PREV.NUPROCESSO = TU.NUPROCESSO
         AND TU_PREV.NUANO = TU.NUANO
         AND TU_PREV.NUTRAMITE < (
             SELECT MAX(TU_INFRA.NUTRAMITE)
             FROM ECPATRAMITACAO TU_INFRA
             LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
             WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
               AND TU_INFRA.NUANO = TU.NUANO
               AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         )
   )
 FETCH FIRST 1 ROWS ONLY) AS DTENCAMINHA_ANTERIOR,
        -- Último setor geral para o processo
        (SELECT OS_LATEST.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_LATEST
         LEFT JOIN ECPAORGAOSETOR OS_LATEST ON TU_LATEST.CDORGAOTRAMI = OS_LATEST.CDORGAOSETOR
         WHERE TU_LATEST.NUPROCESSO = TU.NUPROCESSO
           AND TU_LATEST.NUANO = TU.NUANO
         ORDER BY TU_LATEST.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_SGORGAOSETOR,
        -- Último setor do grupo INFRA
        (SELECT OS_INFRA.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_SETOR,
        -- Última data de recebimento válida para o setor INFRA
        (SELECT TU_INFRA.DTRECEBTO
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_RECEBIDO,
        PR.FLSITUACAO
    FROM 
        ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    LEFT JOIN ECPATRAMITACAO TU ON PR.NUANO = TU.NUANO 
        AND PR.NUPROCESSO = TU.NUPROCESSO
        AND TU.CDORGAOSETOR = PR.CDORGAOSETOR
    LEFT JOIN ECPAORGAOSETOR OS ON TU.CDORGAOTRAMI = OS.CDORGAOSETOR
    WHERE 
        P.NMPROCESSO = '[ASTEL] INDICAÇÃO'
        AND OS.SGORGAOSETOR LIKE '%INFRA%'
        AND (
            (TU.DTRECEBTO IS NULL AND TU.DTENCAMINHA >= TO_DATE('2025-01-27 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
            OR (TU.DTRECEBTO >= TO_DATE('2025-01-27 00:00:00', 'YYYY-MM-DD HH24:MI:SS')
                AND (SELECT TU_ANT.DTENCAMINHA
                     FROM ECPATRAMITACAO TU_ANT
                     WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
                       AND TU_ANT.NUANO = TU.NUANO
                       AND TU_ANT.NUTRAMITE = TU.NUTRAMITE - 1
                     FETCH FIRST 1 ROWS ONLY) >= TO_DATE('2025-01-27 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))
        )
)
SELECT 
    PROCESSO,
    MAX(DTENCAMINHA_ANTERIOR) AS ENCAMINHADO,
    MAX(LAST_INFRA_RECEBIDO) AS RECEBIDO, -- Data de recebimento apenas do setor INFRA
    MAX(LAST_INFRA_SETOR) AS SETOR,       -- Último setor INFRA
    MAX(CASE WHEN NAME_ = 'anoC' THEN TEXT_ END) AS Ano,
    MAX(CASE WHEN NAME_ = 'numeroC' THEN TEXT_ END) AS Requerimento,
    MAX(CASE WHEN NAME_ = 'autoriaC' THEN TEXT_ END) AS Vereador,
    MAX(CASE WHEN NAME_ = 'ementaC' THEN TEXT_ END) AS Assunto,
    MAX(CASE WHEN NAME_ = 'dataFinal' THEN TEXT_ END) AS Prazo,
    MAX(LAST_SGORGAOSETOR) AS ULTIMO_SETOR,
    MAX(CASE 
            WHEN FLSITUACAO = 'A' THEN 'ARQUIVADO'
            WHEN FLSITUACAO = 'E' THEN 'EM ANDAMENTO'
            WHEN FLSITUACAO = 'C' THEN 'CANCELADO'
            WHEN FLSITUACAO = 'R' THEN 'DESARQUIVADO'
            WHEN FLSITUACAO = 'Q' THEN 'REARQUIVADO'
            ELSE 'DESCONHECIDO'
        END) AS FLSITUACAO
FROM RankedProcesses
GROUP BY PROCESSO
ORDER BY PROCESSO;

/*Relatório de Processo da Astel que passaram pela infra. Processos dos fluxos "[ASTEL] REQUERIMENTO CÂMARA"
e "[ASTEL] INDICAÇÃO". Processos sem fluxo*/
WITH RankedProcesses AS (
    SELECT
      P.NMPROCESSO AS NOME_PROCESSO,
      CL.NMCLASSE AS ASSUNTO,
        N.NUPROCESSOFORMATADO AS PROCESSO,
        TU.DTENCAMINHA,
        TU.DTRECEBTO,
        OS.SGORGAOSETOR,
        AHV.NAME_,
        AHV.TEXT_,
-- Última data de encaminhamento válida (linha anterior)
(SELECT TU_ANT.DTENCAMINHA
 FROM ECPATRAMITACAO TU_ANT
 WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
   AND TU_ANT.NUANO = TU.NUANO
   AND TU_ANT.NUTRAMITE = (
       SELECT MAX(TU_PREV.NUTRAMITE)
       FROM ECPATRAMITACAO TU_PREV
       WHERE TU_PREV.NUPROCESSO = TU.NUPROCESSO
         AND TU_PREV.NUANO = TU.NUANO
         AND TU_PREV.NUTRAMITE < (
             SELECT MAX(TU_INFRA.NUTRAMITE)
             FROM ECPATRAMITACAO TU_INFRA
             LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
             WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
               AND TU_INFRA.NUANO = TU.NUANO
               AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         )
   )
 FETCH FIRST 1 ROWS ONLY) AS DTENCAMINHA_ANTERIOR,
        -- Último setor geral para o processo
        (SELECT OS_LATEST.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_LATEST
         LEFT JOIN ECPAORGAOSETOR OS_LATEST ON TU_LATEST.CDORGAOTRAMI = OS_LATEST.CDORGAOSETOR
         WHERE TU_LATEST.NUPROCESSO = TU.NUPROCESSO
           AND TU_LATEST.NUANO = TU.NUANO
         ORDER BY TU_LATEST.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_SGORGAOSETOR,
        -- Último setor do grupo INFRA
        (SELECT OS_INFRA.SGORGAOSETOR
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_SETOR,
        -- Última data de recebimento válida para o setor INFRA
        (SELECT TU_INFRA.DTRECEBTO
         FROM ECPATRAMITACAO TU_INFRA
         LEFT JOIN ECPAORGAOSETOR OS_INFRA ON TU_INFRA.CDORGAOTRAMI = OS_INFRA.CDORGAOSETOR
         WHERE TU_INFRA.NUPROCESSO = TU.NUPROCESSO
           AND TU_INFRA.NUANO = TU.NUANO
           AND OS_INFRA.SGORGAOSETOR LIKE '%INFRA%'
         ORDER BY TU_INFRA.NUTRAMITE DESC
         FETCH FIRST 1 ROWS ONLY) AS LAST_INFRA_RECEBIDO,
        PR.FLSITUACAO
    FROM 
        ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    LEFT JOIN ECPATRAMITACAO TU ON PR.NUANO = TU.NUANO 
        AND PR.NUPROCESSO = TU.NUPROCESSO
        AND TU.CDORGAOSETOR = PR.CDORGAOSETOR
    LEFT JOIN ECPAORGAOSETOR OS ON TU.CDORGAOTRAMI = OS.CDORGAOSETOR
    LEFT JOIN ECPAPROCASSUNTO S ON S.NUANO = N.NUANO AND S.NUPROCESSO = N.NUPROCESSO AND S.CDORGAOSETOR = N.CDORGAOSETOR
    LEFT JOIN EPCLCLASSE CL ON CL.CDCLASSE  = S.CDASSUNTO
   WHERE 
(
  P.NMPROCESSO IN ('[ASTEL] REQUERIMENTO CÂMARA', '[ASTEL] INDICAÇÃO')
  OR S.CDASSUNTO = 1451 OR S.CDASSUNTO = 1452
)	 AND OS.SGORGAOSETOR LIKE '%INFRA%'
        AND (
            (TU.DTRECEBTO IS NULL AND TU.DTENCAMINHA >= TO_DATE('2025-07-14 00:00:00', 'YYYY-MM-DD HH24:MI:SS')) -- Alterar data para primeira segunda-feira passada
            OR (TU.DTRECEBTO >= TO_DATE('2025-07-14 00:00:00', 'YYYY-MM-DD HH24:MI:SS')-- Alterar data para primeira segunda-feira passada
                AND (SELECT TU_ANT.DTENCAMINHA
                     FROM ECPATRAMITACAO TU_ANT
                     WHERE TU_ANT.NUPROCESSO = TU.NUPROCESSO
                       AND TU_ANT.NUANO = TU.NUANO
                       AND TU_ANT.NUTRAMITE = TU.NUTRAMITE - 1
                     FETCH FIRST 1 ROWS ONLY) >= TO_DATE('2025-07-14 00:00:00', 'YYYY-MM-DD HH24:MI:SS'))-- Alterar data para primeira segunda-feira passada
        )
)
SELECT 
    NOME_PROCESSO,
    ASSUNTO,
    PROCESSO,
    MAX(DTENCAMINHA_ANTERIOR) AS ENCAMINHADO,
    MAX(LAST_INFRA_RECEBIDO) AS RECEBIDO, -- Data de recebimento apenas do setor INFRA
    MAX(LAST_INFRA_SETOR) AS SETOR,       -- Último setor INFRA
    MAX(CASE WHEN NAME_ = 'anoC' THEN TEXT_ END) AS Ano,
    MAX(CASE WHEN NAME_ = 'numeroC' THEN TEXT_ END) AS Requerimento,
    MAX(CASE WHEN NAME_ = 'autoriaC' THEN TEXT_ END) AS Vereador,
    MAX(CASE WHEN NAME_ = 'ementaC' THEN TEXT_ END) AS Assunto,
    MAX(CASE WHEN NAME_ = 'dataFinal' THEN TEXT_ END) AS Prazo,
    MAX(LAST_SGORGAOSETOR) AS ULTIMO_SETOR,
    MAX(CASE 
            WHEN FLSITUACAO = 'A' THEN 'ARQUIVADO'
            WHEN FLSITUACAO = 'E' THEN 'EM ANDAMENTO'
            WHEN FLSITUACAO = 'C' THEN 'CANCELADO'
            WHEN FLSITUACAO = 'R' THEN 'DESARQUIVADO'
            WHEN FLSITUACAO = 'Q' THEN 'REARQUIVADO'
            ELSE 'DESCONHECIDO'
        END) AS FLSITUACAO
FROM RankedProcesses
GROUP BY NOME_PROCESSO, ASSUNTO, PROCESSO
ORDER BY PROCESSO; 
 
/* Foi criado esse script para pegar todos processos dos fluxos '[ASTEL] REQUERIMENTO CÂMARA', '[ASTEL] INDICAÇÃO', e pega tambéms o assuntos aberto de forma manual que não foi por fluxo que passaram na ultima semana em algum setor da Secretaria de Infraestrutura ( geramos ele toda segunda feira, pegando de segunda passada a segunda atual ).
 
NOME_PROCESSO - Nome do assunto/Fluxo
PROCESO - Processo formatado 
ENCAMINHAMENTO - Quando esse processo foi encaminhado para um setor da Infraestrutura
RECEBIDO - Se esse processo foi recebido já na Infraestrutura 
SETOR - Qual setor da infra passou ( o ultimo no periodo informado ) 
ANO - Ano do Requerimento ou Indicação da câmara
REQUERIMENTO - Requerimento da câmara 
VERADOR - Vereador da câmara 
ASSUNTO - Ementa da Câmara 
PRAZO - Prazo que a Astel deu de Resposta para o processo. 
ULTIMO_SETOR - Setor que está, ou que passou antes de ser arquivado. 
FLSITUAÇÃO - Situação do processo.