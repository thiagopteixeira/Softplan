import sys                            # importa o módulo `sys` para interoperar com o interpretador Python e I/O.
sys.stdout.reconfigure(encoding='utf-8')  # reconfigura a saída padrão (stdout) para usar UTF-8 — útil para imprimir acentos corretamente.

import pandas as pd                   # importa pandas (alias pd) para leitura/manipulação de planilhas e DataFrames.
import requests                       # importa requests para fazer requisições HTTP.
import json                           # importa json para serializar/desserializar JSON.
import numpy as np                    # importa numpy (alias np) — usado mais abaixo para tratar tipos numpy.
from datetime import datetime         # importa datetime para obter a data/hora atual.
import urllib3                        # importa urllib3 (biblioteca de baixo nível utilizada por requests).
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# desativa avisos de certificado inseguro (InsecureRequestWarning).
# OBS: isso apenas oculta o aviso; não corrige o problema de usar verify=False (inseguro).

# Configurações
file_name = "usuarioSaerpPOPP.xls"    # nome do arquivo Excel de entrada (espera existir no diretório de execução).
sheet_name = "user"                   # nome da aba dentro do arquivo Excel a ser lida.
url_setores = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/excluir-setor"
# URL da API para excluir setores de um usuário (substitua se necessário).

url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"
# URL de autenticação (note que aqui há credenciais embutidas na URL — isso é inseguro em produção).

user_auth = "JORGE.MAMANI"            # usuário que será informado no corpo da requisição de autenticação.

# Classe para serializar objetos numpy
class NpEncoder(json.JSONEncoder):     # cria um encoder JSON customizado para tipos numpy.
    def default(self, obj):
        if isinstance(obj, np.integer): return int(obj)   # converte numpy.integer para int padrão.
        if isinstance(obj, np.floating): return float(obj) # converte numpy.floating para float padrão.
        if isinstance(obj, np.ndarray): return obj.tolist() # converte ndarray para lista (serializável).
        return super().default(obj)  # delega para o comportamento padrão para outros tipos.

# Data para salvar o resultado
now = datetime.now()                  # captura data/hora atual.
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S")  # formata a data/hora para usar no nome do arquivo de saída.

# Leitura da planilha
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
# lê o arquivo Excel, na aba especificada. Força a coluna "CDUSUARIO" a ser string (evita perda de zeros à esquerda).

cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()
# pega a coluna "CDUSUARIO", remove valores NaN, garante tipo string e converte para lista Python de CD's de usuário.

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
# cabeçalho indicando que o corpo da requisição será form-urlencoded (texto: chave=valor&...).

raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
# monta o corpo da autenticação com grant_type=client_credentials e o cdUsuario definido acima.
# OBS: dependendo do provedor OAuth, normalmente também são necessários client_id/client_secret.

resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)
# faz POST para obter token. `verify=False` desativa verificação de SSL (inseguro).
# Se o endpoint exigir autenticação básica via URL (como aqui), requests tratará isso automaticamente.
# verify=False evita erro de certificado mas abre risco de MITM.

if resp_auth.status_code == 200:
    token = resp_auth.json()["access_token"]
    # extrai o access_token do JSON de resposta. Pode lançar KeyError se a resposta não contiver essa chave.
    print("\n✅ Token obtido com sucesso")

    headers_api = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        "accept": "application/json"
    }
    # cabeçalhos a serem usados nas chamadas da API: conteúdo JSON e Authorization Bearer.

    resultados = []                   # lista para acumular resultados (sucesso/erro) por usuário.
    for cd in cdusuarios:             # itera cada CD de usuário lido da planilha.
        payload = {
        "setoresUsuarios": [
                {
                "cdUsuario": cd,      # define o usuário a ser alterado
                "unidades": [
                    {
                    "sgOrgao": "PMRP",       # sigla do órgão (fixa no seu payload)
                    "sgUnidade": "SAERP-POP" # sigla da unidade/setor que será excluído
                    }
                ]
                }
            ]
        }
        # payload montado como dicionário Python. Será serializado para JSON.

        resp = requests.delete(url_setores, data=json.dumps(payload, cls=NpEncoder), headers=headers_api, verify=False)
        # faz requisição DELETE enviando o payload serializado.
        # Observação: alguns servidores não aceitam body em DELETE; confirmar contrato da API.
        # Usa NpEncoder para garantir serialização de tipos numpy caso existam.
        # verify=False novamente desativa verificação de certificado (inseguro).

        if resp.status_code == 200:
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Sucesso"})
            print(f"✅ Setor excluido de  {cd}")
        else:
            try:
                erro = resp.json()     # tenta transformar a resposta em JSON para obter detalhes do erro.
            except:
                erro = resp.text       # se não for JSON, pega o texto cru da resposta.
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}")

    # Salva o resultado
    df_resultado = pd.DataFrame(resultados)    # cria DataFrame com os resultados acumulados.
    output_file = f"resultado_setores_usuarios_{dt_string}.xlsx"  # monta nome do arquivo de saída com timestamp.
    df_resultado.to_excel(output_file, index=False) # salva o DataFrame em Excel (sem índice).
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")
    # caso a autenticação não retorne 200, imprime mensagem de erro simples.


##############################################################################################################

import sys                            # importa o módulo `sys` para interoperar com o interpretador Python e I/O.
sys.stdout.reconfigure(encoding='utf-8')  # reconfigura a saída padrão (stdout) para usar UTF-8 — útil para imprimir acentos corretamente.

import pandas as pd                   # importa pandas (alias pd) para leitura/manipulação de planilhas e DataFrames.
import requests                       # importa requests para fazer requisições HTTP.
import json                           # importa json para serializar/desserializar JSON.
import numpy as np                    # importa numpy (alias np) — usado mais abaixo para tratar tipos numpy.
from datetime import datetime         # importa datetime para obter a data/hora atual.
import urllib3                        # importa urllib3 (biblioteca de baixo nível utilizada por requests).
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
# desativa avisos de certificado inseguro (InsecureRequestWarning).
# OBS: isso apenas oculta o aviso; não corrige o problema de usar verify=False (inseguro).

# Configurações
file_name = "usuarioSaerpPOPP.xls"    # nome do arquivo Excel de entrada (espera existir no diretório de execução).
sheet_name = "user"                   # nome da aba dentro do arquivo Excel a ser lida.
url_setores = "https://processodigital.ribeiraopreto.sp.gov.br/solarbpm-integracao/usuario/excluir-setor"
# URL da API para excluir setores de um usuário (substitua se necessário).

url_auth = "https://pmribeirao-services-pro:46281f9f-f1f8-450e-97b9-dee7772cc94b-pro@processodigital.ribeiraopreto.sp.gov.br/ungp-server-oauth/oauth/token"
# URL de autenticação (note que aqui há credenciais embutidas na URL — isso é inseguro em produção).

user_auth = "JORGE.MAMANI"            # usuário que será informado no corpo da requisição de autenticação.

# Classe para serializar objetos numpy
class NpEncoder(json.JSONEncoder):     # cria um encoder JSON customizado para tipos numpy.
    def default(self, obj):
        if isinstance(obj, np.integer): return int(obj)   # converte numpy.integer para int padrão.
        if isinstance(obj, np.floating): return float(obj) # converte numpy.floating para float padrão.
        if isinstance(obj, np.ndarray): return obj.tolist() # converte ndarray para lista (serializável).
        return super().default(obj)  # delega para o comportamento padrão para outros tipos.

# Data para salvar o resultado
now = datetime.now()                  # captura data/hora atual.
dt_string = now.strftime("%d_%m_%Y_%H_%M_%S")  # formata a data/hora para usar no nome do arquivo de saída.

# Leitura da planilha
df = pd.read_excel(file_name, sheet_name=sheet_name, dtype={"CDUSUARIO": str})
# lê o arquivo Excel, na aba especificada. Força a coluna "CDUSUARIO" a ser string (evita perda de zeros à esquerda).

cdusuarios = df["CDUSUARIO"].dropna().astype(str).tolist()
# pega a coluna "CDUSUARIO", remove valores NaN, garante tipo string e converte para lista Python de CD's de usuário.

# Autenticação
headers_auth = {"Content-Type": "application/x-www-form-urlencoded"}
# cabeçalho indicando que o corpo da requisição será form-urlencoded (texto: chave=valor&...).

raw_auth = f"grant_type=client_credentials&cdUsuario={user_auth}"
# monta o corpo da autenticação com grant_type=client_credentials e o cdUsuario definido acima.
# OBS: dependendo do provedor OAuth, normalmente também são necessários client_id/client_secret.

resp_auth = requests.post(url_auth, data=raw_auth, headers=headers_auth, verify=False)
# faz POST para obter token. `verify=False` desativa verificação de SSL (inseguro).
# Se o endpoint exigir autenticação básica via URL (como aqui), requests tratará isso automaticamente.
# verify=False evita erro de certificado mas abre risco de MITM.

if resp_auth.status_code == 200:
    token = resp_auth.json()["access_token"]
    # extrai o access_token do JSON de resposta. Pode lançar KeyError se a resposta não contiver essa chave.
    print("\n✅ Token obtido com sucesso")

    headers_api = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
        "accept": "application/json"
    }
    # cabeçalhos a serem usados nas chamadas da API: conteúdo JSON e Authorization Bearer.

    resultados = []                   # lista para acumular resultados (sucesso/erro) por usuário.
    for cd in cdusuarios:             # itera cada CD de usuário lido da planilha.
        payload = {
        "setoresUsuarios": [
                {
                "cdUsuario": cd,      # define o usuário a ser alterado
                "unidades": [
                    {
                    "sgOrgao": "PMRP",       # sigla do órgão (fixa no seu payload)
                    "sgUnidade": "SAERP-POP" # sigla da unidade/setor que será excluído
                    }
                ]
                }
            ]
        }
        # payload montado como dicionário Python. Será serializado para JSON.

        resp = requests.delete(url_setores, data=json.dumps(payload, cls=NpEncoder), headers=headers_api, verify=False)
        # faz requisição DELETE enviando o payload serializado.
        # Observação: alguns servidores não aceitam body em DELETE; confirmar contrato da API.
        # Usa NpEncoder para garantir serialização de tipos numpy caso existam.
        # verify=False novamente desativa verificação de certificado (inseguro).

        if resp.status_code == 200:
            resultados.append({"CDUSUARIO": cd, "RESULTADO": "Sucesso"})
            print(f"✅ Setor excluido de  {cd}")
        else:
            try:
                erro = resp.json()     # tenta transformar a resposta em JSON para obter detalhes do erro.
            except:
                erro = resp.text       # se não for JSON, pega o texto cru da resposta.
            resultados.append({"CDUSUARIO": cd, "RESULTADO": f"Erro: {erro}"})
            print(f"❌ Erro para {cd}: {erro}")

    # Salva o resultado
    df_resultado = pd.DataFrame(resultados)    # cria DataFrame com os resultados acumulados.
    output_file = f"resultado_setores_usuarios_{dt_string}.xlsx"  # monta nome do arquivo de saída com timestamp.
    df_resultado.to_excel(output_file, index=False) # salva o DataFrame em Excel (sem índice).
    print(f"\n📄 Arquivo de resultado salvo como: {output_file}")

else:
    print("❌ Falha na autenticação. Verifique o link ou o usuário.")
    # caso a autenticação não retorne 200, imprime mensagem de erro simples.