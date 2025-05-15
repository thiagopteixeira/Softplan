-- Buscar todos os assuntos(Portal Interno)que estão disponiveis. Junto trazer o setor Responsavel e o Formulário vinculado 
SELECT c.NMASSUNTO, se.SGORGAOSETOR, se.NMORGAOSETOR, f.NMFORMULARIO
FROM EPCLCLASSE c
INNER JOIN EGPECLASSEORGAOCONFIGURACAO s ON c.CDCLASSE = s.CDCLASSE
INNER JOIN ECPAORGAOSETOR se ON s.CDSETORRESP = se.CDORGAOSETOR
INNER JOIN ECPAFORMULARIO f ON s.CDFORMULARIO = f.CDFORMULARIO
WHERE se.SGORGAOSETOR LIKE 'INFRA%'
AND c.FLFORAUSO = 'N'


-- explicação da montagem 
SELECT * FROM EPCLCLASSE c
WHERE c.NUCLASSE  = 1151-- teste jorge a classificação cd 410

SELECT * FROM EGPECLASSEORGAOCONFIGURACAO s
WHERE s.CDCLASSE = 410 -- aqui jogando o cdclasse 410 consingo pegar que o  é o setor responsavel 38 e o CDFORMULARIO  é 261

SELECT * FROM ecpaformulario f
--WHERE f.CDFORMULARIO = 261 -- consigo pegar o nome do form interno
WHERE f.CDFORMULARIO  = 609  -- esse é o formulário externo do mesom assunto, peguei o CDFORM NO ECPASERVICO

SELECT * FROM ECPAORGAOSETOR o
WHERE o.CDORGAOSETOR  = 38 -- aqui consigo pegar o nome do setor

SELECT * FROM ECPAASSUNTO a  -- aqui fica as informações internas da classificação para uso interno
WHERE a.NUCLASSE = 1151

SELECT * FROM ECPASERVICO t  -- aqui fica AS infromações do portal de servicos
WHERE t.NMSERVICO = 'Teste Jorge'



-- Buscar assuntos disponivel no portal interno
SELECT c.NMASSUNTO, se.SGORGAOSETOR, se.NMORGAOSETOR, f.NMFORMULARIO
FROM EPCLCLASSE c
INNER JOIN EGPECLASSEORGAOCONFIGURACAO s ON c.CDCLASSE = s.CDCLASSE
INNER JOIN ECPAORGAOSETOR se ON s.CDSETORRESP = se.CDORGAOSETOR
INNER JOIN ECPAFORMULARIO f ON s.CDFORMULARIO = f.CDFORMULARIO
WHERE c.NMASSUNTO = 'Teste Jorge'

-- Buscar assuntos disponivel  no portal de atendimento, de acordo com o setor
SELECT e.NMSERVICO , se.SGORGAOSETOR , se.NMORGAOSETOR , f.NMFORMULARIO 
FROM ECPASERVICO e
INNER JOIN ECPAORGAOSETOR se ON e.CDSETORRESPONSAVEL = se.CDORGAOSETOR  
INNER JOIN ECPAFORMULARIO f ON e.CDFORMULARIO  = f.CDFORMULARIO
WHERE se.SGORGAOSETOR LIKE 'INFRA%'
AND e.FLPUBLICADO = 'S'