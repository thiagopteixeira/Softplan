--Relatório de Processo da Cultura (assunto/classificação "Edital Cultura - Modelo"). Processos do fluxo "[CULT] Modelo - Editais Cultura - V2"--
SELECT *
FROM (
    SELECT
        N.NUPROCESSOFORMATADO,
        PR.DTENTRADA,
        AHV.NAME_ AS VAR_NAME,  -- Alterando o alias para evitar ambiguidade
        CASE 
            WHEN AHV.NAME_ = 'tipoPessoa_inscricao' AND AHV.TEXT_ = 'F' THEN 'Pessoa Física'
            WHEN AHV.NAME_ = 'tipoPessoa_inscricao' AND AHV.TEXT_ = 'J' THEN 'Pessoa Jurídica'
            ELSE AHV.TEXT_ -- Para outros valores, mantém o valor original
        END AS TEXT_MAPPED  -- Alterado o alias para TEXT_MAPPED
    FROM ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    WHERE P.NMPROCESSO = '[CULT] Modelo - Editais Cultura - V2'
) em_linha 
PIVOT (
    MAX(TEXT_MAPPED) FOR VAR_NAME IN ('propostaTitulo_1' AS "Projeto",
                                      'propostaModulo_1' AS "Modulo",
                                      'tipoPessoa_inscricao' AS "Tipo Pessoa", 
                                      'documento' AS "Documento",
                                      'nomeRazaoSocial' AS "Nome/Razão Social",
                                      'indutoresDescricao' AS "Indutores")
) em_colunas;