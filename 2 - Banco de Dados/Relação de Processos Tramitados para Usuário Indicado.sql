/*Relação de Processos Tramitados para Usuário Indicado*/
-- Inicia a CTE (Common Table Expression) chamada "UltimoEncaminhamento"
WITH UltimoEncaminhamento AS (
    -- Seleciona as colunas desejadas para identificar os encaminhamentos
    SELECT 
        P.NUPROCESSOFORMATADO,  -- Número do processo formatado
        T.DTENCAMINHA,  -- Data de encaminhamento
        T.CDUSUARIORECEB,  -- Código do usuário que recebe o encaminhamento
        A.CDUSUARIO,  -- Código do usuário que faz o encaminhamento
        U.NMUSUARIO,  -- Nome do usuário que faz o encaminhamento
        B.SGORGAOSETOR,  -- Sigla do órgão setor que faz o encaminhamento
        B.NMORGAOSETOR,  -- Nome do órgão setor que faz o encaminhamento
        -- A função ROW_NUMBER cria um número sequencial para cada processo, particionado por NUPROCESSOFORMATADO,
        -- e ordenado pela data de encaminhamento de forma decrescente
        ROW_NUMBER() OVER (
            PARTITION BY P.NUPROCESSOFORMATADO  -- Agrupamento por número de processo
            ORDER BY T.DTENCAMINHA DESC  -- Ordenação pela data de encaminhamento, do mais recente para o mais antigo
        ) AS RN  -- Número da linha para cada grupo (encaminhamento mais recente)
    FROM SOLAR.ECPAPROCESSONUMERO P  -- Tabela que contém o número do processo
        -- Join com a tabela ECPATRAMITACAO para obter os detalhes do encaminhamento
        INNER JOIN SOLAR.ECPATRAMITACAO T ON P.CDORGAOSETOR = T.CDORGAOSETOR
            AND P.NUANO = T.NUANO  -- Filtro para garantir que o ano do processo seja o mesmo do encaminhamento
            AND P.NUPROCESSO = T.NUPROCESSO  -- Filtro para garantir que o número do processo seja o mesmo
        -- Join com a tabela ECPAORGAOSETOR para obter informações sobre o órgão que realiza o encaminhamento
        INNER JOIN SOLAR.ECPAORGAOSETOR S ON S.CDORGAOSETOR = T.CDORGAOTRAMI
        -- Join com a tabela ESEGUSRSETORSIST para associar o sistema de usuários com o órgão
        INNER JOIN SOLAR.ESEGUSRSETORSIST A ON A.CDORGAOSETOR = T.CDORGAOTRAMI 
            AND A.CDSISTEMA = 64  -- Filtro para o sistema específico (número 64)
        -- Join novamente com a tabela ECPAORGAOSETOR para obter informações do órgão que realiza o encaminhamento
        INNER JOIN SOLAR.ECPAORGAOSETOR B ON A.CDORGAOSETOR = B.CDORGAOSETOR
        -- Join com a tabela ESEGUSUARIO para obter o nome do usuário que faz o encaminhamento
        INNER JOIN SOLAR.ESEGUSUARIO U ON A.CDUSUARIO = U.CDUSUARIO
    -- Filtro para selecionar apenas os encaminhamentos recebidos pelo usuário com código '28080116873'
    WHERE T.CDUSUARIORECEB = '28080116873'
)

-- Seleciona os dados da CTE "UltimoEncaminhamento"
SELECT 
    U.NUPROCESSOFORMATADO AS "Número_do_Processo",  -- Número do processo
    TO_CHAR(U.DTENCAMINHA, 'DD/MM/YYYY - HH24:MI:SS.FF3') AS "Encaminhado em",  -- Formatação da data de encaminhamento
    U.CDUSUARIO AS "Usuário_de_Encaminhamento",  -- Código do usuário que fez o encaminhamento
    U.NMUSUARIO AS "Nome_do_Usuário_de_Encaminhamento",  -- Nome do usuário que fez o encaminhamento
    U.SGORGAOSETOR AS "Sigla_da_Unidade_Setor_Recebimento",  -- Sigla da unidade setor de recebimento
    U.NMORGAOSETOR AS "Nome_da_Unidade_Setor_Recebimento"  -- Nome da unidade setor de recebimento
-- Filtra os registros da CTE, mantendo apenas o encaminhamento mais recente para cada processo
FROM UltimoEncaminhamento U
WHERE U.RN = 1  -- Apenas os registros com RN = 1, ou seja, o último encaminhamento de cada processo
-- Ordena os resultados pela data de encaminhamento, do mais antigo para o mais recente
ORDER BY U.DTENCAMINHA ASC;