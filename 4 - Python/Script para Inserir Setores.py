import sys
sys.stdout.reconfigure(encoding='utf-8')

import pandas as pd
import requests
import json
import numpy as np
from datetime import datetime
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configurações
file_name = "usuariosPortal.xls"  # nome do arquivo Excel
sheet_name = "usuariosPortal"      # nome da aba do Excel
url_setores = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/inserir-setor"  # troque pelo correto
url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"  
user_auth = "JORGE.MAMANI"  # Substitua pelo seu usuário

# Classe para serializar objetos numpy
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer): return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.ndarray): return obj.tolist()
        return super().default(obj)

# Data para salvar o resultado
now = datetime.now()
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S")

# Leitura da planilha
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)

if resp_auth.status_code == 200:
    token = resp_auth.json()["access_token"]
    print("\n✅ Token obtido com sucesso")

    headers_api = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        "accept": "application/json"
    }

    resultados = []
    for cd in cdusuarios:
        payload = {
            "campos": ["UNIDADES", "UNIDADE_PADRAO"],
            "setoresUsuarios": [
                {
                    "cdUsuario": cd,
                    "unidadePadrao": {
                        "sgOrgao": "PMRP",
                        "sgUnidade": "PORTAL"
                    },
                    "unidades": [
                        {
                            "sgOrgao": "PMRP",
                            "sgUnidade": "PORTAL"
                        }
                    ]
                }
            ]
        }

        resp = requests.post(url_setores, data=json.dumps(payload, cls=NpEncoder), headers=headers_api, verify=False)
        if resp.status_code == 200:
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Sucesso"})
            print(f"✅ Setores atualizados para {cd}")
        else:
            try:
                erro = resp.json()
            except:
                erro = resp.text
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}")

    # Salva o resultado
    df_resultado = pd.DataFrame(resultados)
    output_file = f"resultado_setores_usuarios_{dt_string}.xlsx"
    df_resultado.to_excel(output_file, index=False)
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")

##############################################################################################################

import sys                                 # importa o módulo 'sys' (acesso a parâmetros e funções do interpretador)
sys.stdout.reconfigure(encoding='utf-8')   # reconfigura a saída padrão para usar codificação UTF-8 (útil em Windows para evitar problemas com acentuação)

import pandas as pd                        # importa pandas (leitura/manipulação de planilhas e tabelas)
import requests                            # importa requests (fazer requisições HTTP)
import json                                # importa json (serialização/deserialização JSON)
import numpy as np                         # importa numpy (arrays e tipos numéricos)
from datetime import datetime              # importa datetime (trabalhar com data e hora)
import urllib3                             # importa urllib3 (biblioteca usada por requests para conexões HTTP)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)  
# desativa avisos de segurança sobre conexões inseguras (quando verify=False). Atenção: isso só oculta o aviso, não torna a conexão segura.

# Configurações
file_name = "usuariosPortal.xls"           # nome do arquivo Excel a ser lido
sheet_name = "usuariosPortal"              # nome da aba (sheet) do Excel a ser lida
url_setores = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/inserir-setor"  
# endpoint da API para inserir/atualizar setores do usuário (substitua se necessário)
url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"  
# endpoint de autenticação (note que parece conter credenciais/host combinados — revisar formato por segurança)
user_auth = "JORGE.MAMANI"                 # usuário que será usado na autenticação (cdUsuario)

# Classe para serializar objetos numpy
class NpEncoder(json.JSONEncoder):         # define um encoder JSON customizado para lidar com tipos numpy
    def default(self, obj):                # método chamado quando o json padrão não sabe serializar 'obj'
        if isinstance(obj, np.integer): return int(obj)   # converte np.integer para int nativo
        if isinstance(obj, np.floating): return float(obj) # converte np.floating para float nativo
        if isinstance(obj, np.ndarray): return obj.tolist() # converte np.ndarray para lista
        return super().default(obj)        # para outros tipos, usa o comportamento padrão

# Data para salvar o resultado
now = datetime.now()                       # pega data/hora atual
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S")  # formata a data/hora para usar no nome do arquivo de saída (ex: 12_08_2025_08_50_30)

# Leitura da planilha
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
# lê o arquivo Excel e carrega a aba especificada em um DataFrame.
# dtype={"CDUSUARIO": str} força a coluna CDUSUARIO a ser lida como string (evita perder zeros à esquerda, por exemplo).

cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()
# seleciona a coluna CDUSUARIO, remove valores nulos (dropna), garante que são strings e transforma em lista de Python

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
# cabeçalho informando que o body será formulário urlencoded (padrão para grant_type=client_credentials em OAuth)
raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
# corpo da requisição de autenticação — aqui montado como string urlencoded contendo grant_type e cdUsuario

resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)
# envia POST para o endpoint de autenticação. verify=False desativa verificação de SSL (inseguro em produção).

if resp_auth.status_code == 200:           # se a autenticação retornou HTTP 200 OK
    token = resp_auth.json()["access_token"]  # extrai o access_token do JSON retornado (pode KeyError se a resposta for diferente)
    print("\n✅ Token obtido com sucesso")  # mensagem informando sucesso

    headers_api = {
        "Content-Type": "application/json",              # vamos enviar JSON no corpo das próximas requisições
        "Authorization": "Bearer " + token,               # cabeçalho de autenticação Bearer com o token obtido
        "accept": "application/json"                      # aceita JSON nas respostas
    }

    resultados = []                         # lista para armazenar os resultados por usuário (sucesso/erro)
    for cd in cdusuarios:                   # itera sobre cada código de usuário
        payload = {
            "campos": ["UNIDADES", "UNIDADE_PADRAO"],    # campos que a API espera — conforme contrato da API
            "setoresUsuarios": [
                {
                    "cdUsuario": cd,                     # cdUsuario atual do loop
                    "unidadePadrao": {                   # unidade padrão do usuário
                        "sgOrgao": "PMRP",
                        "sgUnidade": "PORTAL"
                    },
                    "unidades": [                       # lista de unidades do usuário
                        {
                            "sgOrgao": "PMRP",
                            "sgUnidade": "PORTAL"
                        }
                    ]
                }
            ]
        }

        resp = requests.post(url_setores, data=json.dumps(payload, cls=NpEncoder), headers=headers_api, verify=False)
        # faz POST para o endpoint de setores, serializando o payload com json.dumps e usando o encoder NpEncoder para tipos numpy.
        # nota: também poderia usar requests.post(..., json=payload) — mas aí não é possível passar um encoder customizado diretamente.
        # verify=False novamente faz a requisição sem verificar o certificado SSL (inseguro).

        if resp.status_code == 200:           # se a API respondeu com sucesso (200)
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Sucesso"})  # registra sucesso
            print(f"✅ Setores atualizados para {cd}")   # imprime mensagem de sucesso para console
        else:
            try:
                erro = resp.json()             # tenta interpretar o corpo da resposta como JSON (mensagem de erro estruturada)
            except:
                erro = resp.text               # se falhar, pega o texto bruto da resposta
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}") # imprime erro no console

    # Salva o resultado
    df_resultado = pd.DataFrame(resultados)   # converte a lista de resultados para DataFrame
    output_file = f"resultado_setores_usuarios_{dt_string}.xlsx"  # nome do arquivo de saída com timestamp
    df_resultado.to_excel(output_file, index=False)  # grava o DataFrame em Excel (sem coluna de índice)
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")  # informa onde o arquivo foi salvo

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")  # mensagem caso a autenticação não retorne 200