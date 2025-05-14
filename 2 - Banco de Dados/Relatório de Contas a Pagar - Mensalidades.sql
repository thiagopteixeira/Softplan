/*Relatório do Fluxo "[PMRP][FAZ] CONTAS A PAGAR - MENSALIDADES" de "Contas a Pagar - Mensalidades"*/
SELECT *
FROM (
    SELECT
        N.NUPROCESSOFORMATADO,
        AHV.NAME_ AS VAR_NAME,  
        CASE 
            WHEN AHV.NAME_ = 'nomeDoServico' THEN 
                CASE AHV.TEXT_ 
                    WHEN '1' THEN 'Aluguel'
                    WHEN '2' THEN 'Energia_Eletrica'
                    WHEN '3' THEN 'Agua_e_Esgoto'
                    WHEN '4' THEN 'Internet'
                    WHEN '5' THEN 'Telefone_Fixo_Movel'
                    WHEN '6' THEN 'Gas'
                    WHEN '7' THEN 'Condominio'
                    WHEN '8' THEN 'IPTU_Parcelado'
                    WHEN '9' THEN 'TV_Assinatura_Streaming'
                    ELSE AHV.TEXT_ 
                END
            WHEN AHV.NAME_ LIKE 'envioDeBoleto%' THEN 
                CASE 
                    WHEN AHV.TEXT_ = '1' THEN 'Sim'
                    WHEN AHV.TEXT_ = '2' THEN 'Reagendado'
                    WHEN AHV.TEXT_ = '3' THEN 'Não'
                    ELSE AHV.TEXT_ 
                END 
            WHEN AHV.NAME_ LIKE 'liquida%' THEN 
                CASE 
                    WHEN AHV.TEXT_ = '1' THEN 'Liquidado'
                    WHEN AHV.TEXT_ = '2' THEN 'Solicitado_Correcao'
                    ELSE AHV.TEXT_
                END
            ELSE AHV.TEXT_ 
        END AS TEXT_MAPPED
    FROM ECPAPROCESSONUMERO N
    LEFT JOIN EBPMVINCULOINST VI ON VI.DEIDENTIFICACAO = N.NUPROCESSOFORMATADO
    LEFT JOIN EBPMDEFINICAO D ON D.CDDEFINICAO = VI.CDDEFINICAO
    LEFT JOIN EBPMPROCESSO P ON P.CDPROCESSO = D.CDPROCESSO
    LEFT JOIN ECPAPROCESSO PR ON PR.CDORGAOSETOR = N.CDORGAOSETOR
        AND PR.NUANO = N.NUANO 
        AND PR.NUPROCESSO = N.NUPROCESSO
    LEFT JOIN ACT_HI_VARINST AHV ON AHV.PROC_INST_ID_ = VI.ProcInstId
    WHERE P.NMPROCESSO = '[PMRP][FAZ] CONTAS A PAGAR - MENSALIDADES'
) em_linha 
PIVOT (
    MAX(TEXT_MAPPED) FOR VAR_NAME IN (
        'nomeDoServico' AS nomeDoServico,
        'envioDeBoletoJANEIRO' AS envioDeBoleto_Janeiro,
        'liquidaJANEIRO' AS liquida_Janeiro,
        'envioDeBoletoFEVEREIRO' AS envioDeBoleto_Fevereiro, 
        'liquidaFEVEREIRO' AS liquida_Fevereiro,
        'envioDeBoletoMARCO' AS envioDeBoleto_Marco, 
        'liquidaMARCO' AS liquida_Marco,
        'envioDeBoletoABRIL' AS envioDeBoleto_Abril,
        'liquidaABRIL' AS liquida_Abril,
        'envioDeBoletoMAIO' AS envioDeBoleto_Maio,
        'liquidaMAIO' AS liquida_Maio
    )
) em_colunas;