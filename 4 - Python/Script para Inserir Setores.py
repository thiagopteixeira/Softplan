<<<<<<< HEAD
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
=======
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
>>>>>>> 1c875536b45818db3f2bb14a9f3a5c6a2aa33f0a
