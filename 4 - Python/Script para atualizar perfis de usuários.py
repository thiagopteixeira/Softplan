import pandas as pd
import requests
import json
import numpy as np
from datetime import datetime
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configurações
file_name = "usuariosAtualizadoss.xls" # trocar o nome para o nome do seu documento
sheet_name = "usuariosAtualizados" # aqui é o nome da aba do seu documento
url_api = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/inserir-perfil" 
url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"  
user_auth = "JORGE.MAMANI"  # Substitua pelo seu usuário

# Perfis a serem atribuídos
lista_perfis = ["CPA_VISU_PROC_CADAST", "CPA_DOC_SIGILO"]

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
df = pd.read_excel(file_name, sheet_name=sheet_name)
cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)

if resp_auth.status_code == 200:
    token = resp_auth.json()["access_token"]
    print("\nToken obtido com sucesso")

    headers_api = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        "accept": "application/json"
    }

    resultados = []

    for cd in cdusuarios:
        payload = {
            "usuarioPerfis": [
                {
                    "cdUsuario": cd,
                    "cdsPerfis": lista_perfis
                }
            ]
        }

        resp = requests.post(url_api, data=json.dumps(payload, cls=NpEncoder), headers=headers_api, verify=False)
        if resp.status_code == 200:
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Sucesso"})
            print(f"Perfil adicionado para {cd}")
        else:
            try:
                erro = resp.json()
            except:
                erro = resp.text
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"Erro para {cd}: {erro}")

    # Salva os resultados em planilha
    df_resultado = pd.DataFrame(resultados)
    output_file = f"resultado_insercao_perfil_{dt_string}.xlsx"
    df_resultado.to_excel(output_file, index=False)
    print(f"\nArquivo de resultado salvo como: {output_file}")

else:
    print("Falha na autenticação. Verifique o link ou o usuário.")
