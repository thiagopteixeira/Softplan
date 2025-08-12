import sys                                 # Módulo para interagir com o interpretador Python
sys.stdout.reconfigure(encoding='utf-8')   # Configura a saída padrão (stdout) para UTF-8, evitando problemas com acentos

import pandas as pd                        # Biblioteca para manipulação de dados e leitura/escrita de Excel
import requests                            # Biblioteca para fazer requisições HTTP
import json                                # Biblioteca para trabalhar com dados no formato JSON
import numpy as np                         # Biblioteca para trabalhar com arrays e tipos numéricos
from datetime import datetime              # Classe datetime para trabalhar com datas e horas
import urllib3                             # Biblioteca usada pelo requests para conexões HTTP
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)  
# Desativa avisos de "InsecureRequestWarning" quando verify=False é usado (não recomendado em produção)

# Configurações
file_name = "usuariosPortal.xls"           # Nome do arquivo Excel, a ser lido, com os usuários
sheet_name = "usuariosPortal"              # Nome da aba (sheet) dentro do Excel a ser lida

# URL da API para excluir setor
url_excluir_setor = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/excluir-setor"
# Essa é a URL da API que será chamada para remover um setor específico de um usuário

# URL e credenciais de autenticação
url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"
# Endpoint de autenticação OAuth que retorna o token de acesso
user_auth = "JORGE.MAMANI"                  # Nome de usuário usado para autenticar

# Classe para serializar objetos do tipo numpy
class NpEncoder(json.JSONEncoder):          # Cria uma classe personalizada para converter tipos numpy para JSON
    def default(self, obj):                  # Método chamado quando json.dumps() encontra um objeto que não sabe converter
        if isinstance(obj, np.integer): return int(obj)        # Converte numpy inteiro para int do Python
        if isinstance(obj, np.floating): return float(obj)     # Converte numpy float para float do Python
        if isinstance(obj, np.ndarray): return obj.tolist()    # Converte numpy array para lista
        return super().default(obj)          # Para outros tipos, usa a implementação padrão

# Data/hora para nome do arquivo de resultado
now = datetime.now()                         # Obtém data e hora atual
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S") # Formata data/hora no formato DD_MM_AAAA_HH_MM_SS

# Leitura da planilha de usuários
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
# Lê o Excel na aba indicada e garante que a coluna "CDUSUARIO" seja lida como string (evita perda de zeros à esquerda)

cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()
# Seleciona a coluna "CDUSUARIO", remove valores nulos, converte para string e transforma em lista Python

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
# Cabeçalho HTTP para informar que os dados no corpo da requisição estarão no formato de formulário

raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
# Corpo da requisição de autenticação no formato esperado pela API OAuth

resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)
# Envia uma requisição POST para a URL de autenticação para obter o token de acesso
# verify=False significa que o certificado SSL não será verificado (inseguro em produção)

if resp_auth.status_code == 200:             # Verifica se a autenticação foi bem-sucedida (HTTP 200)
    token = resp_auth.json()["access_token"] # Extrai o token de acesso do JSON retornado
    print("\n✅ Token obtido com sucesso")   # Mensagem de confirmação no console

    headers_api = {
        "Content-Type": "application/json",   # Corpo das requisições seguintes será JSON
        "Authorization": "Bearer " + token,   # Cabeçalho de autorização com o token
        "accept": "application/json"          # Informa que aceitamos resposta em JSON
    }

    resultados = []                           # Lista para armazenar os resultados (sucesso ou erro) para cada usuário
    for cd in cdusuarios:                     # Loop para processar cada usuário da lista
        # Payload para remover o setor PORTAL do usuário atual
        payload = {
            "setoresUsuarios": [
                {
                    "cdUsuario": cd,          # Código do usuário
                    "unidades": [             # Lista de unidades a serem removidas
                        {
                            "sgOrgao": "PMRP",  # Sigla do órgão
                            "sgUnidade": "PORTAL"   # Sigla da unidade
                        }
                    ]
                }
            ]
        }

        # Envia a requisição para excluir o setor do usuário
        resp = requests.post(
            url_excluir_setor,                          # URL da API de exclusão
            data=json.dumps(payload, cls=NpEncoder),    # Serializa payload em JSON usando NpEncoder
            headers=headers_api,                        # Cabeçalhos com token de autenticação
            verify=False                                # Ignora verificação do SSL
        )

        if resp.status_code == 200:                     # Se a exclusão foi bem-sucedida
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Removido com sucesso"})
            print(f"✅ Setor PORTAL removido para {cd}")
        else:
            try:
                erro = resp.json()                      # Tenta ler a resposta como JSON
            except:
                erro = resp.text                        # Se falhar, lê como texto puro
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}")

    # Salva o resultado final em um arquivo Excel
    df_resultado = pd.DataFrame(resultados)              # Converte lista de resultados para DataFrame
    output_file = f"resultado_remocao_setor_{dt_string}.xlsx"  # Nome do arquivo de saída com data/hora
    df_resultado.to_excel(output_file, index=False)      # Salva o DataFrame no Excel sem índice
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")  
    # Mensagem caso a autenticação falhe

##############################################################################################################

import sys                                 # Módulo para interagir com o interpretador Python
sys.stdout.reconfigure(encoding='utf-8')   # Configura a saída padrão (stdout) para UTF-8, evitando problemas com acentos
import os                                  # Módulo para interagir com o sistema operacional (manipulação de arquivos e diretórios)
import pandas as pd                        # Biblioteca para manipulação de dados e leitura/escrita de Excel
import requests                            # Biblioteca para fazer requisições HTTP
import json                                # Biblioteca para trabalhar com dados no formato JSON
import numpy as np                         # Biblioteca para trabalhar com arrays e tipos numéricos
from datetime import datetime              # Classe datetime para trabalhar com datas e horas
import urllib3                             # Biblioteca usada pelo requests para conexões HTTP
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)  
# Desativa avisos de "InsecureRequestWarning" quando verify=False é usado (não recomendado em produção)

# Configurações
file_name = r"C:\Users\thiago.teixeira\Downloads\usuariosSaerp.xls"       # Nome do arquivo Excel, a ser lido, com os usuários
sheet_name = "usuariosSaerp"             # Nome da aba (sheet) dentro do Excel a ser lida

# URL da API para excluir setor
url_excluir_setor = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/excluir-setor"
# Essa é a URL da API que será chamada para remover um setor específico de um usuário

# Verifica se o arquivo existe
if not os.path.isfile(file_name):
    print(f"❌ ERRO: O arquivo '{file_name}' não foi encontrado no diretório '{os.getcwd()}'")
    print("➡ Soluções possíveis:")
    print("1. Coloque o arquivo na mesma pasta deste script.")
    print("2. Informe o caminho completo do arquivo na variável file_name.")
    print("3. Verifique se a extensão está correta (.xls ou .xlsx).")
    exit()  # encerra o programa

# Lê o arquivo Excel

# URL e credenciais de autenticação
url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"
# Endpoint de autenticação OAuth que retorna o token de acesso
user_auth = "THIAGO.TEIXEIRA"                  # Nome de usuário usado para autenticar

# Classe para serializar objetos do tipo numpy
class NpEncoder(json.JSONEncoder):          # Cria uma classe personalizada para converter tipos numpy para JSON
    def default(self, obj):                  # Método chamado quando json.dumps() encontra um objeto que não sabe converter
        if isinstance(obj, np.integer): return int(obj)        # Converte numpy inteiro para int do Python
        if isinstance(obj, np.floating): return float(obj)     # Converte numpy float para float do Python
        if isinstance(obj, np.ndarray): return obj.tolist()    # Converte numpy array para lista
        return super().default(obj)          # Para outros tipos, usa a implementação padrão

# Data/hora para nome do arquivo de resultado
now = datetime.now()                         # Obtém data e hora atual
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S") # Formata data/hora no formato DD_MM_AAAA_HH_MM_SS

# Leitura da planilha de usuários
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
# Lê o Excel na aba indicada e garante que a coluna "CDUSUARIO" seja lida como string (evita perda de zeros à esquerda)

cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()
# Seleciona a coluna "CDUSUARIO", remove valores nulos, converte para string e transforma em lista Python

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
# Cabeçalho HTTP para informar que os dados no corpo da requisição estarão no formato de formulário

raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
# Corpo da requisição de autenticação no formato esperado pela API OAuth

resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)
# Envia uma requisição POST para a URL de autenticação para obter o token de acesso
# verify=False significa que o certificado SSL não será verificado (inseguro em produção)

if resp_auth.status_code == 200:             # Verifica se a autenticação foi bem-sucedida (HTTP 200)
    token = resp_auth.json()["access_token"] # Extrai o token de acesso do JSON retornado
    print("\n✅ Token obtido com sucesso")   # Mensagem de confirmação no console

    headers_api = {
        "Content-Type": "application/json",   # Corpo das requisições seguintes será JSON
        "Authorization": "Bearer " + token,   # Cabeçalho de autorização com o token
        "accept": "application/json"          # Informa que aceitamos resposta em JSON
    }

    resultados = []                           # Lista para armazenar os resultados (sucesso ou erro) para cada usuário
    for cd in cdusuarios:                     # Loop para processar cada usuário da lista
        # Payload para remover o setor SAERP-POP do usuário atual
        payload = {
            "setoresUsuarios": [
                {
                    "cdUsuario": cd,          # Código do usuário
                    "unidades": [             # Lista de unidades a serem removidas
                        {
                            "sgOrgao": "PMRP",  # Sigla do órgão
                            "sgUnidade": "SAERP-POP"   # Sigla da unidade
                        }
                    ]
                }
            ]
        }

        # Envia a requisição para excluir o setor do usuário
        resp = requests.post(
            url_excluir_setor,                          # URL da API de exclusão
            data=json.dumps(payload, cls=NpEncoder),    # Serializa payload em JSON usando NpEncoder
            headers=headers_api,                        # Cabeçalhos com token de autenticação
            verify=False                                # Ignora verificação do SSL
        )

        if resp.status_code == 200:                     # Se a exclusão foi bem-sucedida
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Removido com sucesso"})
            print(f"✅ Setor SAERP-POP removido para {cd}")
        else:
            try:
                erro = resp.json()                      # Tenta ler a resposta como JSON
            except:
                erro = resp.text                        # Se falhar, lê como texto puro
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}")

    # Salva o resultado final em um arquivo Excel
    df_resultado = pd.DataFrame(resultados)              # Converte lista de resultados para DataFrame
    output_file = f"resultado_remocao_setor_{dt_string}.xlsx"  # Nome do arquivo de saída com data/hora
    df_resultado.to_excel(output_file, index=False)      # Salva o DataFrame no Excel sem índice
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")  
    # Mensagem caso a autenticação falhe