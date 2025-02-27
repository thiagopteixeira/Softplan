--altera a classificação (utilizar no fluxo)
UPDATE ECPAPROCASSUNTO 
SET CDASSUNTO = :cdAssuntoNovo -- 438
WHERE NUANO = :anoProcesso -- inserido no código
AND CDORGAOSETOR = :cdOrgaoProcesso -  2
AND NUPROCESSO = :nuProcesso -- numero do processo