-- Busca quantidade de processos que está com o fluxo em execução, mas não tem tarefa ativa
SELECT COUNT(DISTINCT deIdentificacao) AS qtd
FROM ebpmVinculoInst
WHERE deIdentificacao NOT IN (
    SELECT DISTINCT BVI.deIdentificacao
    FROM ebpmVinculoInst BVI
        INNER JOIN ECPASERVPROCESSO SP
        ON BVI.deIdentificacao = SP.NUFORMATADO
        INNER JOIN ECPATAREFA T
        ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO)
    WHERE BVI.tpSituacao = 'R'
    AND T.TPSITUACAOTAREFA = 'A'
)
AND TPSITUACAO = 'R';

-- Busca processos que estão com o fluxo em execução, mas não tem tarefa ativa
SELECT DISTINCT deIdentificacao
FROM ebpmVinculoInst
WHERE deIdentificacao NOT IN (
    SELECT DISTINCT BVI.deIdentificacao
    FROM ebpmVinculoInst BVI
        INNER JOIN ECPASERVPROCESSO SP
        ON BVI.deIdentificacao = SP.NUFORMATADO
        INNER JOIN ECPATAREFA T
        ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO) -- Ajuste aqui
    WHERE BVI.tpSituacao = 'R'
    AND T.TPSITUACAOTAREFA = 'A'
)
AND TPSITUACAO = 'R';

-- Busca processos que estão com o fluxo em execução, mas não tem tarefa ativa (traz o nome da classificação)
SELECT DISTINCT EBPM.deIdentificacao , C.NMCLASSECOMPLETO
FROM ebpmVinculoInst EBPM
INNER JOIN ECPAPROCESSONUMERO N ON n.NUPROCESSOFORMATADO = EBPM.DEIDENTIFICACAO
INNER JOIN ECPAPROCESSO a ON N.NUANO = a.NUANO AND N.NUPROCESSO = a.NUPROCESSO AND N.CDORGAOSETOR = A.CDORGAOSETOR 
INNER JOIN ECPAPROCASSUNTO ASS ON ASS.NUANO = A.NUANO AND ASS.CDORGAOSETOR = A.CDORGAOSETOR AND ASS.NUPROCESSO = A.NUPROCESSO
INNER JOIN EPCLCLASSE c ON ASS.CDASSUNTO = c.CDCLASSE
WHERE deIdentificacao NOT IN (
    SELECT DISTINCT BVI.deIdentificacao
    FROM ebpmVinculoInst BVI
        INNER JOIN ECPASERVPROCESSO SP
        ON BVI.deIdentificacao = SP.NUFORMATADO
        INNER JOIN ECPATAREFA T
        ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO) -- Ajuste aqui
    WHERE BVI.tpSituacao = 'R'
    AND T.TPSITUACAOTAREFA = 'A'
)
AND TPSITUACAO = 'R';

-- Busca quantidade de processos que está com o fluxo em execução, mas não tem tarefa ativa e nem timer para ser executado
SELECT COUNT(DISTINCT BVI.deIdentificacao) AS total_processos
FROM ebpmVinculoInst BVI
WHERE BVI.tpSituacao = 'R'
  -- 1) NÃO TEM tarefa ativa
  AND NOT EXISTS (
      SELECT 1
      FROM ECPASERVPROCESSO SP
      INNER JOIN ECPATAREFA T  ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO)
      INNER JOIN ECPAPROCASSUNTO A ON a.CDORGAOSETOR = sp.CDORGAOSETOR AND a.NUANO = sp.NUANO AND a.NUPROCESSO = sp.NUPROCESSO
      WHERE SP.NUFORMATADO = BVI.deIdentificacao
        AND T.TPSITUACAOTAREFA = 'A'
  )
  -- 2) NÃO tem job future do tipo timer
  AND NOT EXISTS (
      SELECT 1
      FROM ACT_RU_JOB TM
      WHERE TM.PROCESS_INSTANCE_ID_ = BVI.PROCINSTID
        AND TM.TYPE_ = 'timer'
        AND TM.DUEDATE_ > SYSDATE
  );

-- Busca processos que estão com o fluxo em execução, mas não tem tarefa ativa e nem timer para ser executado
SELECT DISTINCT BVI.deIdentificacao
FROM ebpmVinculoInst BVI
WHERE BVI.tpSituacao = 'R'
  -- 1) NÃO TEM tarefa ativa
  AND NOT EXISTS (
      SELECT 1
      FROM ECPASERVPROCESSO SP
      INNER JOIN ECPATAREFA T ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO)
      WHERE SP.NUFORMATADO = BVI.deIdentificacao
        AND T.TPSITUACAOTAREFA = 'A'
  )
  -- 2) OU não tem job, ou tem job mas NÃO é timer futuro
  AND NOT EXISTS (
      SELECT 1
      FROM ACT_RU_JOB TM
      WHERE TM.PROCESS_INSTANCE_ID_ = BVI.PROCINSTID
        AND TM.TYPE_ = 'timer'
        AND TM.DUEDATE_ > SYSDATE
  );