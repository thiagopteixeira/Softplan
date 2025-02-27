--Consulta quem tem acesso a "Fila de Trabalho" do usuário indicado, coluna NUSEQAUTORIZ.--
SELECT * FROM SOLAR.ESWFAUTORIZFILA WHERE CDUSUARIO = 'thiago.teixeira'
-- Essa consulta mostra quais usuários tem acesso a "Fila de Trabalho" do usuário thiago.teixeira--


--Consulta quais "Fila de Trabalho" o usuário indicado tem acesso.--
SELECT * FROM SOLAR.ESWFAUTORIZFILA WHERE CDUSUARIOAUT = 'thiago.teixeira'
-- Essa consulta mostra quais "Fila de Trabalho" o usuário thiago.teixeira tem acesso--

