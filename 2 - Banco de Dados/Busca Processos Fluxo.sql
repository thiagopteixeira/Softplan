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
INNER JOIN ECPASERVPROCESSO SP ON BVI.deIdentificacao = SP.NUFORMATADO
INNER JOIN ECPATAREFA T ON T.IDEXTERNO = '64__' || TO_CHAR(SP.CDPROCESSO) -- Ajuste aqui
WHERE BVI.tpSituacao = 'R'
AND T.TPSITUACAOTAREFA = 'A'
)
AND TPSITUACAO = 'R';