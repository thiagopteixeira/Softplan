//Formulário: [PMRP][CGM] Manifestações para Ouvidoria - Elogio, Sugestão, Dúvida, Reclamação ou Denúncia
//Ambiente: Produção
//Projeto: Manifestações Ouvidoria Geral do Município - Alteração
//cadastrar anonimo

//Função para cadastrar processo de forma anonima
debugger //Pausa a execução do código no console do navegador para ajudar na depuração. 
function AguardeAlert() /*Define a função AguardeAlert, que cria um alerta visual de "Aguarde..." na tela.*/ {
    debugger; //Pausa a execução do código no console do navegador para ajudar na depuração. 
    const existingSection = document.querySelector('[key="section_1732915087018"]'); //Procura no DOM um elemento com o atributo key="section_1732915087018" e guarda na variável existingSection.

    if (existingSection) /*Verifica se o elemento foi encontrado.*/ {
        const loadingDiv = document.createElement("div"); //Cria uma <div> para o alerta, com id "loadingDiv".
        loadingDiv.id = "loadingDiv";
        loadingDiv.style.position = "fixed";
        loadingDiv.style.top = "0";
        loadingDiv.style.left = "0";
        loadingDiv.style.width = "100%";
        loadingDiv.style.height = "100%";
        loadingDiv.style.backgroundColor = "rgba(0, 0, 0, 0.50)";
        loadingDiv.style.display = "flex";
        loadingDiv.style.justifyContent = "center";
        loadingDiv.style.alignItems = "center";
        loadingDiv.style.zIndex = "9999";
        //Estiliza a div para ocupar toda a tela, com fundo semitransparente, e centraliza o conteúdo usando flexbox. zIndex alto para ficar sobreposto a outros elementos. 

        existingSection.appendChild(loadingDiv); //Adiciona essa div dentro do elemento encontrado.

        const loadingText = document.createElement("p");
        loadingText.textContent = "Aguarde...";
        loadingText.style.color = "#ffffff";
        loadingText.style.marginRight = "10px"; 
        loadingText.style.fontSize = "18px"; // Tamanho da fonte do texto ajustado
        //Cria um parágrafo com texto "Aguarde..." estilizado em branco e com margem à direita

        loadingDiv.appendChild(loadingText); //Adiciona esse parágrafo dentro da div "loadingDiv".

        const loader = document.createElement("div");
        loader.className = "loader";
        //Cria uma div para ser o "loader" (animação de carregamento) com classe "loader".

        loadingDiv.appendChild(loader); //Adiciona a div de animação de carregamento dentro da div "loadingDiv".

        // Adicione o CSS da animação
        const style = document.createElement("style");
        style.innerHTML = `
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px; /* Tamanho do loader ajustado */
          height: 30px; /* Tamanho do loader ajustado */
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Desativa o scroll */
        body.no-scroll {
          overflow: hidden;
        }
      `;
        document.head.appendChild(style);
        /*
        Cria dinamicamente um bloco de CSS que define:
          - Estilo do loader: círculo com borda animada girando (efeito spinner).
          - Animação spin para rotacionar o loader.
          - Classe no-scroll para o <body>, que desativa o scroll da página (overflow escondido).*/

        // Adiciona a classe para desativar o scroll
        document.body.classList.add("no-scroll");
        //Aplica a classe no-scroll no <body>, impedindo que o usuário faça scroll enquanto o alerta está ativo.
    }
}

  // Função para ocultar o alerta de "Aguarde..."
  function hideLoadingAlert() {
    debugger
    const loadingDiv = document.getElementById("loadingDiv"); //Função que procura o elemento loadingDiv.
    if (loadingDiv) {
        loadingDiv.parentNode.removeChild(loadingDiv); //Se existir, remove ele do DOM
  
        // Remove a classe para reativar o scroll
        document.body.classList.remove("no-scroll"); //Remove a classe no-scroll do body para reativar o scroll da página.
    }
  }

AguardeAlert(); //Executa a função AguardeAlert para exibir o alerta "Aguarde..." com o spinner.

const apiUrl = location.origin + '/solarbpm-integracao/processo'; //Define a URL da API (usando a origem atual da página)
const accessToken = model.token; //Obtém um token de acesso (model.token).

var jsonData = {
	"cdClasse": "4486",
	"deAssunto": model.concatena,
	"nusCpfCnpj": [
	  "56024581000156"
	],
	"sgOrgaoUnidadeAbertura": "PMRP",
	"sgUnidadeAbertura": "ADM"
  }
  //Monta o objeto JSON com dados para enviar na requisição. Alguns valores vêm de model.


const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
//Define os headers da requisição, incluindo autorização com o token.

fetch(apiUrl, {
  method: 'POST',
  headers: headers,
  body: JSON.stringify(jsonData)
}) //Envia uma requisição POST para a API com os dados em JSON.
  .then(response => {
    if (!response.ok) /*Se a resposta não for OK (status diferente de 2xx).*/ {
      hideLoadingAlert(); /*Esconde o alerta.*/
      alert('ERRO NA REQUISIÇÃO'); /*Mostra um alerta de erro.*/
      throw new Error('Erro na requisição.'); /*Interrompe a execução.*/
      
    }
    return response.json(); //Caso contrário, converte a resposta para JSON.
  })
  .then(data => /*Usa os dados retornados:*/ {
    console.log('Resposta:', data); /*Imprime no console.*/
    model.numeroProcesso = data.numeroProcesso /*Atualiza model.numeroProcesso com valor da resposta.*/
    hideLoadingAlert(); /*Esconde o alerta.*/
    ExibeProcesso(form, model, context); /*Chama a função ExibeProcesso (provavelmente para mostrar o resultado no UI).*/

  })
  .catch(error => /*Caso ocorra algum erro na requisição ou processamento.*/ {
    hideLoadingAlert(); /*Esconde o alerta.*/
    alert('ERRO NA REQUISIÇÃO'); /*Mostra uma mensagem de erro*/
    console.error('Erro:', error); /* Manipule o erro aqui no console.*/
  });