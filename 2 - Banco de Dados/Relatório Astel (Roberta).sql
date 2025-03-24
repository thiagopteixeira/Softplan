SELECT 
    PROCESSO,
    TO_CHAR(DATA_CADASTRO, 'DD-MM-YYYY') AS DATA_CADASTRO,
    SIGLA_SETOR,
    PRAZO,  
    DEINFOPROCESSO 
FROM (
    SELECT 
        N.NUPROCESSOFORMATADO AS PROCESSO, 
        TRUNC(P.DTCADASTRO) AS DATA_CADASTRO,
        AHV.NAME_,
        AHV.TEXT_ AS PRAZO,
        O.SGORGAOSETOR AS SIGLA_SETOR, 
        DBMS_LOB.SUBSTR(I.DEINFOPROCESSO, 4000, 1) AS DEINFOPROCESSO,
        CASE P.flSituacao 
            WHEN 'A' THEN 'ARQUIVADO'
            WHEN 'E' THEN 'EM ANDAMENTO'
            WHEN 'C' THEN 'CANCELADO'
            WHEN 'R' THEN 'DESARQUIVADO'
            WHEN 'Q' THEN 'REARQUIVADO'
        END AS Situacao
    FROM ECPAPROCESSO P
    INNER JOIN ECPAPROCASSUNTO A ON A.NUANO = P.NUANO AND A.NUPROCESSO = P.NUPROCESSO 
    INNER JOIN ECPAPROCESSONUMERO N ON N.NUANO = P.NUANO AND N.NUPROCESSO = P.NUPROCESSO
    INNER JOIN (
        SELECT NUANO, NUPROCESSO, MAX(NUTRAMITE) AS ULTIMO_TRAMITE
        FROM ECPATRAMITACAO
        GROUP BY NUANO, NUPROCESSO
    ) T_MAX ON T_MAX.NUANO = P.NUANO AND T_MAX.NUPROCESSO = P.NUPROCESSO
    INNER JOIN ECPATRAMITACAO T ON T.NUANO = P.NUANO AND T.NUPROCESSO = P.NUPROCESSO AND T.NUTRAMITE = T_MAX.ULTIMO_TRAMITE
    INNER JOIN ECPAORGAOSETOR O ON O.CDORGAOSETOR = T.CDORGAOTRAMI 
    LEFT JOIN ECPAINFOPROCESSO I ON I.NUANO = P.NUANO AND I.NUPROCESSO = P.NUPROCESSO 
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO E ON E.CDPROCESSO = D.CDPROCESSO 
    LEFT JOIN (
        SELECT PROC_INST_ID_, NAME_, TEXT_
        FROM ACT_HI_VARINST
        WHERE NAME_ IS NOT NULL AND TEXT_ IS NOT NULL
    ) AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    WHERE E.NMPROCESSO = '[ASTEL] REQUERIMENTO CÂMARA'
    AND A.CDASSUNTO = 86
    AND P.FLSITUACAO IN ('E', 'R')
    AND O.NMORGAOSETOR != 'DIGITAL'
    AND I.CDUSUARIO = 'SISTEMA'
) em_linha 
PIVOT (
    MAX(PRAZO) FOR NAME_ IN (
        'dataFinal' AS PRAZO
    )
)
WHERE DATA_CADASTRO = TO_DATE('21-03-2025', 'DD-MM-YYYY') -- essa é a DATA de entrada do processo, alterar para a DATA solicitada.
ORDER BY PROCESSO;