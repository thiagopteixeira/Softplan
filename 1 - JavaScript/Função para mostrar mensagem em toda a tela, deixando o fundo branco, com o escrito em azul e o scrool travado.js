//Formulário: [PMRP][JUS] DEFESA OU RECURSO DE AUTO DE INFRAÇÃO DA FISCALIZAÇÃO GERAL
//Ambiente: Homologação
//Assunto Interno: Auto de Infração - Fiscalização Geral
//Código da Classificação: 169
//Assunto Externo: DEFESA OU RECURSO DE AUTO DE INFRAÇÃO DA FISCALIZAÇÃO GERAL
//Código do Serviço: 178
//validaUsuario

//Função para mostrar mensagem "Procurando processo com auto de infração..." em toda a tela, deixando o fundo branco, com o escrito em azul e o scrool travado.

// Css de aguarde, enquanto busca os processos, nesse código não precisa criar um campo no formulário
function AguardeAlert() {
  const loadingDiv = document.createElement("div");
  loadingDiv.id = "loadingDiv";
  loadingDiv.style.position = "fixed";
  loadingDiv.style.top = "0";
  loadingDiv.style.left = "0";
  loadingDiv.style.width = "100%";
  loadingDiv.style.height = "100%";
  loadingDiv.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  loadingDiv.style.display = "flex";
  loadingDiv.style.justifyContent = "center";
  loadingDiv.style.alignItems = "center";
  loadingDiv.style.zIndex = "9999";

  const loadingContent = document.createElement("div");
  loadingContent.style.display = "flex";
  loadingContent.style.flexDirection = "column";
  loadingContent.style.alignItems = "center";
  loadingDiv.appendChild(loadingContent);

  const loadingText = document.createElement("p");
  loadingText.textContent = "Procurando processo com auto de infração...";
  loadingText.style.color = "#00838F";
  loadingText.style.marginBottom = "10px";
  loadingText.style.fontSize = "26px";
  loadingText.style.fontWeight = "bold";
  loadingContent.appendChild(loadingText);

  const loader = document.createElement("div");
  loader.className = "loader";
  loadingContent.appendChild(loader);

  const style = document.createElement("style");
  style.innerHTML = `
    .loader {
      border: 6px solid rgba(0, 0, 0, 0.1);
      border-top: 6px solid #00838F;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 2s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    body.no-scroll {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(loadingDiv);
  document.body.classList.add("no-scroll");
}

function hideLoadingAlert() {
  const loadingDiv = document.getElementById("loadingDiv");
  if (loadingDiv) {
    loadingDiv.remove();
    document.body.classList.remove("no-scroll");
  }
}

// Css para retornar uma mensagem assim que rodar o script, nesse código não precisa criar um campo no formulário
function showCustomAlert(processos) {
  document.body.style.overflow = 'hidden';

  const alertDiv = document.createElement("div");
  alertDiv.id = "customAlert";
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "0";
  alertDiv.style.left = "0";
  alertDiv.style.width = "100%";
  alertDiv.style.height = "100%";
  alertDiv.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  alertDiv.style.display = "flex";
  alertDiv.style.flexDirection = "column";
  alertDiv.style.justifyContent = "center";
  alertDiv.style.alignItems = "center";
  alertDiv.style.zIndex = "9999";

  const contentDiv = document.createElement("div");
  contentDiv.style.backgroundColor = "#00838F";
  contentDiv.style.padding = "30px";
  contentDiv.style.borderRadius = "8px";
  contentDiv.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
  contentDiv.style.maxWidth = "600px";
  contentDiv.style.width = "95%";
  contentDiv.style.textAlign = "left";

  const icon = document.createElement("i");
  icon.className = "fa fa-exclamation-triangle";
  icon.style.fontSize = "40px";
  icon.style.color = "#FFFFFF";
  icon.style.marginBottom = "15px";
  contentDiv.appendChild(icon);

  const title = document.createElement("h2");
  title.textContent = "Localizado Processo(s) em aberto com mesmo número de auto de infração";
  title.style = "font-size: 20px; margin-bottom: 10px; color: white;";
  contentDiv.appendChild(title);

  const alertText = document.createElement("div");
  alertText.style.fontSize = "16px";
  alertText.style.color = "#FFFFFF";
  alertText.style.lineHeight = "1.5";
  alertText.style.marginBottom = "25px";

  const listHtml = processos.map(p => `<li><strong>${p.numero}</strong> - ${p.deComplemento}</li>`).join('');
  alertText.innerHTML = `<ul style="padding-left: 20px;">${listHtml}</ul>`;
  contentDiv.appendChild(alertText);

  const fecharBtn = document.createElement("button");
  fecharBtn.textContent = "Fechar";
  fecharBtn.style.backgroundColor = "#FFFFFF";
  fecharBtn.style.color = "#00838F";
  fecharBtn.style.border = "none";
  fecharBtn.style.borderRadius = "4px";
  fecharBtn.style.padding = "12px 25px";
  fecharBtn.style.fontWeight = "bold";
  fecharBtn.style.cursor = "pointer";
  fecharBtn.style.transition = "all 0.3s";
  fecharBtn.style.fontSize = "14px";

  fecharBtn.addEventListener("click", function (e) {
    e.preventDefault();
    hideCustomAlert();
  });

  fecharBtn.onmouseover = function () {
    this.style.backgroundColor = "#f1f1f1";
    this.style.transform = "translateY(-2px)";
  };
  fecharBtn.onmouseout = function () {
    this.style.backgroundColor = "#FFFFFF";
    this.style.transform = "translateY(0)";
  };

  contentDiv.appendChild(fecharBtn);
  alertDiv.appendChild(contentDiv);
  document.body.appendChild(alertDiv);

  document.querySelectorAll('.pika-single').forEach(picker => {
    picker.style.display = 'none';
  });
}

function hideCustomAlert() {
  const alertDiv = document.getElementById("customAlert");
  if (alertDiv) alertDiv.remove();
  document.body.style.overflow = '';
}

async function fetchAllEmAndamento() {
  AguardeAlert();

  const storageKey = 'br.com.softplan.ungp.cpa.portal.solicitacoes';
  const storageData = localStorage.getItem(storageKey);
  let bearerToken = null;

  if (storageData) {
    try {
      const parsed = JSON.parse(storageData);
      bearerToken = parsed.usuario?.perfils?.[0]?.token || null;
    } catch (e) {
      console.error('Erro ao parsear localStorage:', e);
      hideLoadingAlert();
      return;
    }
  }

  if (!bearerToken) {
    console.error('Bearer token não encontrado.');
    hideLoadingAlert();
    return;
  }

  const allEmAndamento = [];
  let pagina = 0;
  const tamPagina = 50;

  while (true) {
    const url = `${location.origin}/externo-portal-backend/v1/minhas-solicitacoes?pagina=${pagina}&tamPagina=${tamPagina}&status=EM_ANDAMENTO`;

    let response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
    } catch (fetchError) {
      console.error('Erro na requisição fetch:', fetchError);
      break;
    }

    if (!response.ok) {
      console.error('Erro na requisição:', response.status, response.statusText);
      break;
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Erro ao converter resposta em JSON:', jsonError);
      break;
    }

    const solicitacoes = data.andamento?.solicitacoes || [];
    if (solicitacoes.length === 0) break;
    allEmAndamento.push(...solicitacoes);
    pagina++;
  }

  const processosEncontrados = allEmAndamento.filter(item =>
    typeof item.deComplemento === 'string' &&
    item.deComplemento.includes("Defesa ou Recurso de Auto de Infração") &&
    item.deComplemento.includes(model.numeroAutoInfracao)
  );

  const mensagemCampo = document.querySelector('#mensagem');
  const exibeCampo = document.querySelector('#exibeMensagem');

  if (processosEncontrados.length > 0) {
    let mensagem = `Foi encontrado ${processosEncontrados.length} processo(s) em aberto com o mesmo número de auto de infração:\n\n`;
    mensagem += processosEncontrados.map(p =>
      `• Nº ${p.numero} - ${p.deComplemento}`
    ).join('\n');

    model.mensagem = mensagem;
    model.exibeMensagem = 'Sim';

    if (mensagemCampo) {
      mensagemCampo.value = mensagem;
      mensagemCampo.dispatchEvent(new Event('input', { bubbles: true }));
      mensagemCampo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (exibeCampo) {
      exibeCampo.value = 'Sim';
      exibeCampo.dispatchEvent(new Event('input', { bubbles: true }));
      exibeCampo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 2500));
    hideLoadingAlert();
    showCustomAlert(processosEncontrados);

  } else {
    model.mensagem = '';
    model.exibeMensagem = 'Não';

    if (mensagemCampo) {
      mensagemCampo.value = '';
      mensagemCampo.dispatchEvent(new Event('input', { bubbles: true }));
      mensagemCampo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (exibeCampo) {
      exibeCampo.value = 'Não';
      exibeCampo.dispatchEvent(new Event('input', { bubbles: true }));
      exibeCampo.dispatchEvent(new Event('change', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 2500));
    hideLoadingAlert();
  }

  return allEmAndamento;
}

// Executa
console.log("Chamando fetchAllEmAndamento...");
fetchAllEmAndamento()
  .then(all => {
    console.log('Solicitações em andamento:', all);
    if (model.mensagem) {
      console.log('Mensagem do model:', model.mensagem);
    }
  })
  .catch(err => {
    console.error("Erro ao executar fetchAllEmAndamento:", err);
    hideLoadingAlert();
  });