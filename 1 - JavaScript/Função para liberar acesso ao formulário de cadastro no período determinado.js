//Formulário: [PMRP] [ADM] RECURSO ADMINISTRATIVO - PCCS
//Ambiente: Produção

//Função para liberar acesso ao formulário de cadastro no período determinado, nesse caso de 00:00 do dia 08/08/2025 a 23:59:00 do dia 12/08/2025.
debugger

var agora = new Date(); // Obtém a data e hora atuais
console.log

var inicioDisponibilidade = new Date('2025-08-08T00:00:00'); // Disponível a partir de 00:00 do dia 08/08/2025 (CONFIGURACAO)
var fimDisponibilidade = new Date('2025-08-12T23:59:00'); // Fechamento às 23:59:00 do dia 12/08/2025 (CONFIGURACAO)

// Verifica se a data e hora atuais estão fora do período de disponibilidade
if (agora < inicioDisponibilidade || agora > fimDisponibilidade) {
    // Oculta os elementos com base no atributo key
    /* $("div[key='section_1636604516559']").hide(); */
    
    // Chama a função para exibir o alerta personalizado
    showCustomAlert();
}

// Função para exibir o alerta personalizado
function showCustomAlert() {
    debugger
    const existingSection = document.querySelector('[key="section_1723655605322"]'); // Key da Div do formulário, ajuste conforme necessário

    if (existingSection) {
        // Desativa o scroll
        document.body.style.overflow = 'hidden';

        const alertDiv = document.createElement("div");
        alertDiv.id = "customAlert";
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "0";
        alertDiv.style.left = "0";
        alertDiv.style.width = "100%";
        alertDiv.style.height = "100%";
        alertDiv.style.backgroundColor = "rgb(0, 91, 149, 1)";
        alertDiv.style.display = "flex";
        alertDiv.style.flexDirection = "column"; // Para quebrar a linha se necessário
        alertDiv.style.justifyContent = "center";
        alertDiv.style.alignItems = "center";
        existingSection.appendChild(alertDiv);

        const alertText = document.createElement("p");
        alertText.style.fontSize = "15px";
        alertText.style.color = "#ffffff";
        alertText.style.textAlign = "center"; // Centraliza o texto
        alertText.textContent = "Este formulário estará disponível somente entre 00:00 do dia 08/08/2025 e 23:59 do dia 12/08/2025."
        alertDiv.appendChild(alertText);

        // Adicione o botão de Voltar
        const fecharBtn = document.createElement("button");
        fecharBtn.textContent = "Voltar";
        fecharBtn.style.backgroundColor = "#ffffff"; // Cor de fundo branca
        fecharBtn.style.color = "#000000"; // Texto preto
        fecharBtn.style.border = "none";
        fecharBtn.style.borderRadius = "5px";
        fecharBtn.style.padding = "10px";
        fecharBtn.style.marginTop = "10px";
        fecharBtn.addEventListener("click", function () {
            hideCustomAlert();
            history.back(); // Esta linha substitui location.reload()
        });
        
        alertDiv.appendChild(fecharBtn);
    }
}

// Função para ocultar o alerta customizado
function hideCustomAlert() {
    const alertDiv = document.getElementById("customAlert");
    if (alertDiv) {
        alertDiv.parentNode.removeChild(alertDiv);
    }
    // Reativa o scroll
    document.body.style.overflow = '';
}