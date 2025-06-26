# Monta Select para consultar processos da Drielle (Meio Ambiente)
import pandas as pd
import re

# Caminho para o arquivo Excel
arquivo_excel = r'C:\Users\thiago.teixeira\Downloads\Processos.xlsx'

# Carrega a aba "Planilha1" do arquivo
df = pd.read_excel(arquivo_excel, sheet_name='Planilha1')

# Garante que a coluna está em string e limpa caracteres inválidos/invisíveis
df['Processos'] = df['Processos'].astype(str).apply(lambda x: re.sub(r'[^a-zA-Z0-9/ ]', '', x).strip())
# O trecho "df['Processos'] = df['Processos']..." indica que o nome da coluna é "Processos" (o valor da primeira linha tem que ser esse). No excel só pode existir uma coluna ("Processos").

# Remove valores vazios ou nulos após limpeza
processos = df['Processos'].dropna().loc[lambda x: x != ''].tolist()

# Gera os SELECTs da CTE
processos_cte = "\n    UNION ALL\n    ".join(
    [f"SELECT '{proc}' AS NUFORMATADO FROM DUAL" for proc in processos]
)

# Monta o SQL completo
sql = f"""
WITH Processos AS (
    {processos_cte}
)
 SELECT 
    sp.NUFORMATADO AS "PROCESSO", 
    LISTAGG(interessado.DEDESCRICAO, ', ') 
        WITHIN GROUP (ORDER BY interessado.DEDESCRICAO) AS INTERESSADOS, 
    c.NMCLASSE AS ASSUNTO,
    PR.DECOMPLEMENTO AS DETALHAMENTO
FROM 
    SOLAR.ECPASERVPROCESSO sp
INNER JOIN  SOLAR.ECPAPROCESSO pr  ON sp.CDORGAOSETOR = pr.CDORGAOSETOR   AND sp.NUANO = pr.NUANO  AND sp.NUPROCESSO = pr.NUPROCESSO
INNER JOIN 	SOLAR.ECPAPROCASSUNTO a ON a.CDORGAOSETOR = sp.CDORGAOSETOR AND a.NUANO = sp.NUANO AND a.NUPROCESSO = sp.NUPROCESSO
INNER JOIN SOLAR.EPCLCLASSE c ON c.CDCLASSE = a.CDASSUNTO
INNER JOIN  SOLAR.VCPAVAASINTERESSADOPROCESSO interessado  ON sp.CDPROCESSO = interessado.CDPROCESSO
INNER JOIN  Processos p  ON sp.NUFORMATADO = p.NUFORMATADO
GROUP BY sp.NUFORMATADO, c.NMCLASSE, pr.DECOMPLEMENTO
ORDER BY sp.NUFORMATADO
"""

# Caminho para salvar o arquivo .sql
arquivo_sql = r'C:\Users\thiago.teixeira\Downloads\consulta_processos.sql'

# Salva o SQL no arquivo com codificação UTF-8
with open(arquivo_sql, 'w', encoding='utf-8') as f:
    f.write(sql)

print(f"Arquivo SQL gerado com sucesso: {arquivo_sql}")