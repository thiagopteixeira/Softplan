/*Busca no banco de dados para trazer os seguintes dados, dos processos digitais:
- "Nº Processo/Documento";
- "Descrição";
- "Interessado(s)";
- "Unidade Responsável";
- "Unidade Origem";
- "Situação";
*/
SELECT 
    N.NUPROCESSOFORMATADO AS NúmeroPrcesso,  -- Seleciona o número do processo formatado
    P.DECOMPLEMENTO AS DESCRIÇÃO,  -- Seleciona a descrição complementar do processo
    SUJ.NMSUJEITO AS Interessado,  -- Seleciona o nome do sujeito (interessado) no processo
    S.NMORGAOSETOR AS UnidadeOrigem,  -- Seleciona o nome da unidade de origem do processo
    SG.NMORGAOSETOR AS UnidadeResponsavel,  -- Seleciona o nome da unidade responsável pelo processo
    
    -- Usa uma estrutura CASE para determinar o status do processo com base na situação
    CASE 
        WHEN P.FLSITUACAO = 'A' THEN 'Arquivado'  -- Se a situação for 'A', o processo está Arquivado
        WHEN P.FLSITUACAO = 'A' THEN 'Arquivado'  -- Esta linha é redundante, pois já foi coberta acima (P.FLSITUACAO = 'A')
        WHEN P.FLSITUACAO = 'Q' THEN 'Rearquivado'  -- Se a situação for 'Q', o processo foi Rearquivado
        WHEN P.FLSITUACAO = 'R' THEN 'Desarquivado'  -- Se a situação for 'R', o processo foi Desarquivado
        WHEN P.FLSITUACAO = 'E' THEN 'Em andamento'  -- Se a situação for 'E', o processo está Em andamento
        ELSE 'Desconhecido'  -- Caso não se encaixe em nenhum dos casos acima, o status é Desconhecido
    END AS FLSITUACAO
    
FROM ECPAPROCESSO P  -- Tabela principal contendo os dados do processo

-- Realiza um JOIN com a tabela ECPAPROCESSONUMERO (relacionamento entre processo e número)
INNER JOIN ECPAPROCESSONUMERO N 
    ON N.CDORGAOSETOR = P.CDORGAOSETOR  -- Condição de junção baseada no código da unidade (CDORGAOSETOR)
    AND N.NUANO = P.NUANO  -- Condição de junção baseada no ano (NUANO)
    AND N.NUPROCESSO = P.NUPROCESSO  -- Condição de junção baseada no número do processo (NUPROCESSO)
    
-- Realiza um JOIN com a tabela ECPAORGAOSETOR (unidade de origem do processo)
INNER JOIN ECPAORGAOSETOR S 
    ON S.CDORGAOSETOR = P.CDSETORORIGEM  -- Condição de junção baseada no código da unidade de origem (CDSETORORIGEM)
    
-- Realiza um JOIN com a tabela ECPAORGAOSETOR (unidade responsável pela gestão do processo)
INNER JOIN ECPAORGAOSETOR SG 
    ON SG.CDORGAOSETOR = P.CDSETORGESTAO  -- Condição de junção baseada no código da unidade responsável (CDSETORGESTAO)
    
-- Realiza um JOIN com a tabela ECPAPROCINTER (relacionamento entre o processo e o interessado)
INNER JOIN ECPAPROCINTER CD 
    ON CD.CDORGAOSETOR = P.CDORGAOSETOR  -- Condição de junção baseada no código da unidade (CDORGAOSETOR)
    AND CD.NUANO = P.NUANO  -- Condição de junção baseada no ano (NUANO)
    AND CD.NUPROCESSO = P.NUPROCESSO  -- Condição de junção baseada no número do processo (NUPROCESSO)

-- Realiza um JOIN com a tabela ECPAINTERSUJEITO (relacionamento entre o processo e o sujeito/interessado)
INNER JOIN ECPAINTERSUJEITO SU  
    ON SU.CDINTERESSADO = CD.CDINTERESSADO  -- Condição de junção baseada no código do interessado (CDINTERESSADO)

-- Realiza um JOIN com a tabela ECDTSUJEITO (obtém o nome do sujeito/interessado)
INNER JOIN ECDTSUJEITO SUJ      
    ON SUJ.CDSUJEITO = SU.CDSUJEITO  -- Condição de junção baseada no código do sujeito (CDSUJEITO)


/*Busca no banco de dados para trazer os seguintes dados, dos processos digitais:
- "Nº Processo/Documento";
- "Descrição";
- "Interessado(s)";
- "Unidade Responsável";
- "Unidade Origem";
- "Unidade Atual"
- "Situação";

Retornando os processos que estão atualmente na unidade/setor e no período indicado.
*/

-- Definição de uma CTE (Common Table Expression) chamada 'ProcessosUnicos'
WITH ProcessosUnicos AS (

    -- Seleção de colunas e cálculos necessários para os processos
    SELECT
        N.NUPROCESSOFORMATADO AS Numero_Processo, -- Número do processo formatado
        P.DECOMPLEMENTO AS DESCRIÇÃO,  -- Descrição do processo
        SUJ.NMSUJEITO AS Interessado, -- Nome do interessado (sujeito) no processo
        SUJ.NUIDENTSUJEITO AS CPF_CNPJ_Interessado, -- CPF ou CNPJ do interessado
        S.SGORGAOSETOR AS Sigla_Setor_Origem, -- Sigla do setor de origem do processo
        S.NMORGAOSETOR AS Unidade_Origem, -- Nome da unidade de origem do processo
        SG.SGORGAOSETOR AS Sigla_Setor_Responsavel, -- Sigla do setor responsável pelo processo
        SG.NMORGAOSETOR AS Unidade_Responsavel, -- Nome da unidade responsável pelo processo
        SGA.SGORGAOSETOR AS Sigla_Setor_Atual, -- Sigla do setor atual onde o processo se encontra
        SGA.NMORGAOSETOR AS Unidade_Atual, -- Nome da unidade atual onde o processo se encontra   
        P.DTENTRADA AS Data_Entrada, -- Data de entrada do processo
        T.DTRECEBTO AS Data_Recebimento, -- Data de recebimento do processo
        T.CDUSUARIORECEB AS Usuário_Recebimento, -- Usuário que recebeu o processo
        US.NMUSUARIO AS Nome_Usuário_Recebimento, -- Nome do usuário que recebeu o processo
        
        -- Condicional para determinar a situação do processo
        CASE 
            WHEN P.FLSITUACAO = 'A' THEN 'Arquivado' -- 'A' indica que o processo está Arquivado
            WHEN P.FLSITUACAO = 'Q' THEN 'Rearquivado' -- 'Q' indica que o processo foi Rearquivado
            WHEN P.FLSITUACAO = 'R' THEN 'Desarquivado' -- 'R' indica que o processo foi Desarquivado
            WHEN P.FLSITUACAO = 'E' THEN 'Em andamento' -- 'E' indica que o processo está em andamento
        END AS FLSITUACAO,

        -- Função ROW_NUMBER para numerar as linhas de forma única por processo, ordenando pela data de entrada
        ROW_NUMBER() OVER (PARTITION BY N.NUPROCESSOFORMATADO ORDER BY P.DTENTRADA DESC) AS rn

    -- Seleção das tabelas relacionadas aos processos
    FROM ECPAPROCESSO P
    INNER JOIN ECPAPROCESSONUMERO N 
        ON N.CDORGAOSETOR = P.CDORGAOSETOR 
        AND N.NUANO = P.NUANO 
        AND N.NUPROCESSO = P.NUPROCESSO

    -- Relaciona a tabela de órgãos/setores de origem
    INNER JOIN ECPAORGAOSETOR S 
        ON S.CDORGAOSETOR = P.CDSETORORIGEM

    -- Relaciona a tabela de órgãos/setores de gestão
    INNER JOIN ECPAORGAOSETOR SG 
        ON SG.CDORGAOSETOR = P.CDSETORGESTAO

    -- Relaciona a tabela de processos e sujeitos
    INNER JOIN ECPAPROCINTER PI
        ON PI.CDORGAOSETOR = P.CDORGAOSETOR 
        AND PI.NUANO = P.NUANO 
        AND PI.NUPROCESSO = P.NUPROCESSO

    -- Relaciona a tabela de sujeitos interessados
    INNER JOIN ECPAINTERSUJEITO SU 
        ON SU.CDINTERESSADO = PI.CDINTERESSADO

    -- Relaciona a tabela de dados dos sujeitos
    INNER JOIN ECDTSUJEITO SUJ 
        ON SUJ.CDSUJEITO = SU.CDSUJEITO

    -- Relaciona a tabela de usuários do sistema
    INNER JOIN ESEGUSUARIO US
        ON US.CDUSUARIO = US.CDUSUARIO

    -- Relaciona a tabela de tramitação do processo
    INNER JOIN ECPATRAMITACAO T 
        ON T.CDORGAOSETOR = P.CDORGAOSETOR 
        AND T.NUANO = P.NUANO 
        AND T.NUPROCESSO = P.NUPROCESSO
        AND T.CDUSUARIORECEB = US.CDUSUARIO

    -- Relaciona novamente a tabela de usuários (possivelmente erro, pois já foi relacionada acima)
    INNER JOIN ESEGUSUARIO US
        ON US.CDUSUARIO = T.CDUSUARIORECEB

    -- Relaciona a tabela de órgãos/setores de tramitação
    INNER JOIN ECPAORGAOSETOR SGA 
        ON SGA.CDORGAOSETOR = T.CDORGAOTRAMI

    -- Filtra os processos de acordo com o intervalo de datas de recebimento
    WHERE T.DTRECEBTO BETWEEN TO_DATE('01/01/2024 00:00:00', 'DD/MM/YYYY HH24:MI:SS') 
        AND TO_DATE('10/01/2025 23:59:59', 'DD/MM/YYYY HH24:MI:SS')

        -- Filtra os processos de acordo com a tramitação por setores específicos
        AND (
            T.CDORGAOTRAMI = 601 -- "ADM-30" (DEPARTAMENTO DE RECURSOS HUMANOS)
            OR T.CDORGAOTRAMI = 2325 -- "ADM-30.2 ANALISE" (DEPARTAMENTO DE RECURSOS HUMANOS ANALISE)
            OR T.CDORGAOTRAMI = 3324 -- 'ADM-30.1 CONTRATOS'
            OR T.CDORGAOTRAMI = 3034 -- 'ADM-30 (IPM)' 
            OR T.CDORGAOTRAMI = 3386 -- 'ADM-30.2 READAPTAÇÃO/APOSENTADORIA' 
            OR T.CDORGAOTRAMI = 610 -- 'ADM-31' 
            OR T.CDORGAOTRAMI = 3063 -- 'ADM-31 (IPM)'
            OR T.CDORGAOTRAMI = 3358 -- 'ADM-31 ANALISE'  
            OR T.CDORGAOTRAMI = 2326 --'ADM-31 CADASTROS' 
            OR T.CDORGAOTRAMI = 2226 -- 'ADM-31 CHAMAMENTOS' 
            OR T.CDORGAOTRAMI = 2225 --'ADM-31 CONCURSOS'
            OR T.CDORGAOTRAMI = 3357 --'ADM-31 EDITAIS' 
            OR T.CDORGAOTRAMI = 2448 -- 'ADM-31 PROCESSO SELETIVO' 
            OR T.CDORGAOTRAMI = 2436 --'ADM-31 PRORROGACOES' 
            OR T.CDORGAOTRAMI = 3391 --'ADM-31 TRIBUNAL'
            OR T.CDORGAOTRAMI = 602 --'ADM-34' 
            OR T.CDORGAOTRAMI = 2074 --'ADM-34 ABONADA' 
            OR T.CDORGAOTRAMI = 2073 --'ADM-34 FERIAS' 
            OR T.CDORGAOTRAMI = 603 --'ADM-34 REGISTRO' 
            OR T.CDORGAOTRAMI = 604 --'ADM-34 CADASTRO'
            OR T.CDORGAOTRAMI = 2223 --'ADM-34 ALTERACAO DE JORNADA' 
            OR T.CDORGAOTRAMI = 2071 --'ADM-34 LICENCA PREMIO' 
            OR T.CDORGAOTRAMI = 2072 --'ADM-34 ARQUIVO DO CADASTRO' 
            OR T.CDORGAOTRAMI = 2446 --'ADM-34 LANCAMENTOS'
            OR T.CDORGAOTRAMI = 2454 --'ADM-34 ANALISE' 
            OR T.CDORGAOTRAMI = 3315 --'ADM-34 I.R.' 
            OR T.CDORGAOTRAMI = 3064 --'ADM-34 (IPM)' 
            OR T.CDORGAOTRAMI = 2519 -- 'ADM-34 LP DIGITACAO' 
            OR T.CDORGAOTRAMI = 2518 -- 'ADM-34 LP INFORMACAO'
            OR T.CDORGAOTRAMI = 3204 -- 'ADM-34 INFORMACAO FUNCIONAL' 
            OR T.CDORGAOTRAMI = 3360 -- 'ADM-34 PCCR CADASTRO' 
            OR T.CDORGAOTRAMI = 3361 -- 'ADM-34 PCCR ARQUIVO CADASTRO' 
            OR T.CDORGAOTRAMI = 606 -- 'ADM-37' 
            OR T.CDORGAOTRAMI = 2196 -- 'ADM-37 PLANILHA FERIAS'
            OR T.CDORGAOTRAMI = 2056 -- 'ADM-37 SAUDE' 
            OR T.CDORGAOTRAMI = 2057 -- 'ADM-37 EDUC' 
            OR T.CDORGAOTRAMI = 2058 -- 'ADM-37 SEC I' 
            OR T.CDORGAOTRAMI = 2059 -- 'ADM-37 SEC II' 
            OR T.CDORGAOTRAMI = 2218 --'ADM-37 BENEF' 
            OR T.CDORGAOTRAMI = 3296 --'ADM-37 CONVENIOS E CONTRATOS'
            OR T.CDORGAOTRAMI = 3293 --'ADM-37 CARGOS E SALARIOS' 
            OR T.CDORGAOTRAMI = 3065 -- 'ADM-37 (IPM)' 
            OR T.CDORGAOTRAMI = 605 -- 'ADM-39' 
            OR T.CDORGAOTRAMI = 2350 -- 'ADM-39.1 DMST' 
            OR T.CDORGAOTRAMI = 2352 -- 'ADM-39.3 DMST' 
            OR T.CDORGAOTRAMI = 2351 -- 'ADM-39.2 DMST'
            OR T.CDORGAOTRAMI = 2353 -- 'ADM-39.4 DMST' 
            OR T.CDORGAOTRAMI = 2354 -- 'ADM-39.5 DMST' 
            OR T.CDORGAOTRAMI = 2391 -- 'ADM-39.8 DMST' 
            OR T.CDORGAOTRAMI = 2390 -- 'ADM-39.7 DMST' 
            OR T.CDORGAOTRAMI = 2370 -- 'ADM-39.6 DMST' 
            OR T.CDORGAOTRAMI = 2392 -- 'ADM-39.9 DMST'
            OR T.CDORGAOTRAMI = 2393 -- 'ADM-39.10 DMST' 
            OR T.CDORGAOTRAMI = 3251 -- 'ADM-39.11 READAPTACAO' 
            OR T.CDORGAOTRAMI = 3066 --'ADM-39 (IPM)'
        )
)
-- Seleção final dos dados da CTE, considerando apenas os processos mais recentes (com rn = 1)
SELECT DISTINCT
    Numero_Processo,
    DESCRIÇÃO,
    CPF_CNPJ_Interessado,
    Interessado,
    Sigla_Setor_Origem,
    Unidade_Origem,
    Sigla_Setor_Responsavel,
    Unidade_Responsavel,
    Sigla_Setor_Atual,
    Unidade_Atual, 
    Data_Entrada,
    Data_Recebimento,
    Usuário_Recebimento,
    Nome_Usuário_Recebimento,
    FLSITUACAO
FROM ProcessosUnicos
WHERE rn = 1 -- Filtra para pegar apenas a linha mais recente (com rn = 1)
ORDER BY Data_Entrada DESC -- Ordena os resultados pela data de entrada de forma decrescente (processos mais recentes primeiro)


/*Busca no banco de dados para trazer os seguintes dados, dos processos digitais:
- "Nº Processo/Documento";
- "Data de Cadastro";
- "Unidade Atual";
- "Situação";

.Retornando os processos que seja do assunto, classificação "Cm Requerimento" (cdAssunto = 86) do período indicado.
*/

SELECT 
    N.NUPROCESSOFORMATADO AS PROCESSO,  -- Seleciona o número do processo formatado da tabela ECPAPROCESSONUMERO e o nomeia como PROCESSO
    P.DTCADASTRO AS DATA_CADASTRO,     -- Seleciona a data de cadastro do processo da tabela ECPAPROCESSO e a nomeia como DATA_CADASTRO
    O.NMORGAOSETOR AS NOME_SETOR,      -- Seleciona o nome do órgão/setor da tabela ECPAORGAOSETOR e o nomeia como NOME_SETOR
    O.SGORGAOSETOR AS SIGLA_SETOR,     -- Seleciona a sigla do órgão/setor da tabela ECPAORGAOSETOR e a nomeia como SIGLA_SETOR
    CASE P.flSituacao                  -- Realiza uma conversão do código de situação para um valor legível
        WHEN 'A' THEN 'ARQUIVADO'      -- Se a situação for 'A', o processo será 'ARQUIVADO'
        WHEN 'E' THEN 'EM ANDAMENTO'   -- Se a situação for 'E', o processo estará 'EM ANDAMENTO'
        WHEN 'C' THEN 'CANCELADO'      -- Se a situação for 'C', o processo será 'CANCELADO'
        WHEN 'R' THEN 'DESARQUIVADO'   -- Se a situação for 'R', o processo será 'DESARQUIVADO'
        WHEN 'Q' THEN 'REARQUIVADO'    -- Se a situação for 'Q', o processo será 'REARQUIVADO'
    END AS Situacao                    -- Nomeia a coluna resultante como Situacao
FROM ECPAPROCESSO P                   -- A tabela principal é ECPAPROCESSO, que contém as informações dos processos
INNER JOIN ECPAPROCASSUNTO A ON A.NUANO = P.NUANO AND A.NUPROCESSO = P.NUPROCESSO 
                                    -- Faz um INNER JOIN com a tabela ECPAPROCASSUNTO usando NUANO e NUPROCESSO para filtrar os assuntos relacionados ao processo
INNER JOIN ECPAPROCESSONUMERO N ON N.NUANO  = P.NUANO AND N.NUPROCESSO  = P.NUPROCESSO
                                    -- Faz um INNER JOIN com a tabela ECPAPROCESSONUMERO usando NUANO e NUPROCESSO para obter o número do processo
INNER JOIN (
    SELECT NUANO, NUPROCESSO, MAX(NUTRAMITE) AS ULTIMO_TRAMITE  -- Seleciona o último trâmite para cada processo
    FROM ECPATRAMITACAO                -- A tabela ECPATRAMITACAO contém informações sobre os trâmites dos processos
    GROUP BY NUANO, NUPROCESSO          -- Agrupa pelos campos NUANO e NUPROCESSO para garantir que pegamos o último trâmite para cada processo
) T_MAX ON T_MAX.NUANO = P.NUANO AND T_MAX.NUPROCESSO = P.NUPROCESSO
                                    -- Faz um INNER JOIN com a subconsulta T_MAX para obter o último trâmite de cada processo
INNER JOIN ECPATRAMITACAO T ON T.NUANO = P.NUANO AND T.NUPROCESSO = P.NUPROCESSO AND T.NUTRAMITE = T_MAX.ULTIMO_TRAMITE
                                    -- Faz um INNER JOIN com a tabela ECPATRAMITACAO para pegar os dados do trâmite mais recente de cada processo
INNER JOIN ECPAORGAOSETOR O ON O.CDORGAOSETOR = T.CDORGAOTRAMI 
                                    -- Faz um INNER JOIN com a tabela ECPAORGAOSETOR para obter os dados do órgão/setor do último trâmite
WHERE A.CDASSUNTO = 86               -- Filtra os resultados para processos que estão associados ao assunto de código 86
AND P.DTCADASTRO BETWEEN TO_DATE('2025-02-06', 'YYYY-MM-DD') AND TO_DATE('2025-02-07', 'YYYY-MM-DD')
                                    -- Filtra os processos cadastrados entre as datas especificadas (de 2025-02-06 a 2025-02-07)
AND P.FLSITUACAO != 'C'             -- Exclui processos cuja situação seja 'CANCELADO'
AND O.NMORGAOSETOR != 'DIGITAL'     -- Exclui processos relacionados ao setor 'DIGITAL'


-- Quantidade de Processos por nuclasse (numeroDaClassificação) --
SELECT c.NUCLASSE, c.NMCLASSE, COUNT(b.NUPROCESSO) AS QuantidadeDeProcessos
FROM ECPAPROCASSUNTO b
INNER JOIN ECPAPROCESSO a ON b.NUANO = a.NUANO AND b.NUPROCESSO = a.NUPROCESSO
INNER JOIN EPCLCLASSE c ON b.CDASSUNTO = c.CDCLASSE
WHERE c.NUCLASSECOMPLETO  IN ('3537','3591','3812:1480' , '3812:1620', '3812:1830','3812:1930', '3812:2280', '3812:2670', '3812:2920', '3812:3050' , '3812:3409','3812:3498', '3812:3770' , '3812:650', '39' )
AND A.NUANO = 2024
AND A.FLSITUACAO != 'C'
    /* STATUS DO PROCESSO
        WHEN 'A' THEN 'ARQUIVADO'      -- Se a situação for 'A', o processo será 'ARQUIVADO'
        WHEN 'E' THEN 'EM ANDAMENTO'   -- Se a situação for 'E', o processo estará 'EM ANDAMENTO'
        WHEN 'C' THEN 'CANCELADO'      -- Se a situação for 'C', o processo será 'CANCELADO'
        WHEN 'R' THEN 'DESARQUIVADO'   -- Se a situação for 'R', o processo será 'DESARQUIVADO'
        WHEN 'Q' THEN 'REARQUIVADO'    -- Se a situação for 'Q', o processo será 'REARQUIVADO'
    */
GROUP BY c.NUCLASSE, c.NMCLASSE;


-- Quantidade Total de Processos, Somando os Assuntos, Classificações (numeroDaClassificação) --
SELECT COUNT(b.NUPROCESSO) AS QuantidadeDeProcessos
FROM ECPAPROCASSUNTO b
INNER JOIN ECPAPROCESSO a ON b.NUANO = a.NUANO AND b.NUPROCESSO = a.NUPROCESSO
INNER JOIN EPCLCLASSE c ON b.CDASSUNTO = c.CDCLASSE
INNER JOIN ECPAORGAOSETOR O ON O.CDORGAOSETOR = A.CDSETORGESTAO
WHERE c.NUCLASSECOMPLETO  IN ('3812:3070', '2980', '3534', '3562', '3563', '3564', '3812:2950', '3812:2970' )
AND A.NUANO = 2024
AND A.FLSITUACAO != 'C'
    /* STATUS DO PROCESSO
        WHEN 'A' THEN 'ARQUIVADO'      -- Se a situação for 'A', o processo será 'ARQUIVADO'
        WHEN 'E' THEN 'EM ANDAMENTO'   -- Se a situação for 'E', o processo estará 'EM ANDAMENTO'
        WHEN 'C' THEN 'CANCELADO'      -- Se a situação for 'C', o processo será 'CANCELADO'
        WHEN 'R' THEN 'DESARQUIVADO'   -- Se a situação for 'R', o processo será 'DESARQUIVADO'
        WHEN 'Q' THEN 'REARQUIVADO'    -- Se a situação for 'Q', o processo será 'REARQUIVADO'
    */