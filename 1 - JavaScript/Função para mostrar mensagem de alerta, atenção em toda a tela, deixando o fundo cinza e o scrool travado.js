//Formulário: [PMRP][ADM] FOLHA DE FREQUÊNCIA (AUTOAVALIAÇÃO) - INTERNO
//Ambiente: Produção
//Projeto: Avaliação Estágio Probatório
//Fluxo: [ADM] FLUXO DE AUTOAVALIAÇÃO (3 ciclos)
//validaUsuario

//Função para mostrar mensagem de alerta, atenção em toda a tela, deixando o fundo cinza e o scrool travado.
var usuarioLiberados = [
    { "usuario": "36881585802",       "nome": "Daniel Alves Martins" },
    { "usuario": "21579948820",       "nome": "FABIANA CRISTINA DUTRA DE OLIVEIRA BUSA" }
];

// Verifica se o usuário logado está na lista de liberados
var usuarioEncontrado = usuarioLiberados.find(function(user) {
    return user.usuario === model.usuarioLogado;
});

// Se o usuário NÃO estiver na lista, mostra o alerta
if (!usuarioEncontrado) {
    showCustomAlert();
}


function showCustomAlert() {
    debugger;
    const existingSection = document.querySelector('[key="section_1744061782815"]');

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
        alertDiv.style.backgroundColor = "rgba(0, 0, 0, 0.85)"; // Fundo mais escuro (aumentamos para 0.85)
        alertDiv.style.display = "flex";
        alertDiv.style.flexDirection = "column";
        alertDiv.style.justifyContent = "center";
        alertDiv.style.alignItems = "center";
        alertDiv.style.zIndex = "9999";
        
        // Container principal
        const contentDiv = document.createElement("div");
        contentDiv.style.backgroundColor = "#00838F";
        contentDiv.style.padding = "30px";
        contentDiv.style.borderRadius = "8px";
        contentDiv.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
        contentDiv.style.maxWidth = "450px";
        contentDiv.style.width = "90%";
        contentDiv.style.textAlign = "center";
        
        // Ícone de atenção
        const icon = document.createElement("i");
        icon.className = "fa fa-exclamation-triangle";
        icon.style.fontSize = "40px";
        icon.style.color = "#FFFFFF";
        icon.style.marginBottom = "15px";
        contentDiv.appendChild(icon);
        
        // Mensagem de texto
        const alertText = document.createElement("p");
        alertText.style.fontSize = "16px";
        alertText.style.color = "#FFFFFF";
        alertText.style.lineHeight = "1.5";
        alertText.style.margin = "0 0 25px 0";
        alertText.textContent = "Este formulário está disponível apenas para usuários específicos, conforme solicitado pelo setor ADM-CPAD!";
        contentDiv.appendChild(alertText);
        
        // Botão de ação - CORREÇÃO AQUI
        const fecharBtn = document.createElement("button");
        fecharBtn.textContent = "Voltar";
        fecharBtn.style.backgroundColor = "#FFFFFF";
        fecharBtn.style.color = "#00838F";
        fecharBtn.style.border = "none";
        fecharBtn.style.borderRadius = "4px";
        fecharBtn.style.padding = "12px 25px";
        fecharBtn.style.fontWeight = "bold";
        fecharBtn.style.cursor = "pointer";
        fecharBtn.style.transition = "all 0.3s";
        fecharBtn.style.fontSize = "14px";
        
        // CORREÇÃO: Evento de clique melhorado
        fecharBtn.addEventListener("click", function(e) {
            e.preventDefault(); // Impede comportamentos padrão
            hideCustomAlert();
            window.history.back(); // Forma mais explícita de voltar
        });

        // Efeito hover
        fecharBtn.onmouseover = function() {
            this.style.backgroundColor = "#f1f1f1";
            this.style.transform = "translateY(-2px)";
        };
        fecharBtn.onmouseout = function() {
            this.style.backgroundColor = "#FFFFFF";
            this.style.transform = "translateY(0)";
        };
        
        contentDiv.appendChild(fecharBtn);
        alertDiv.appendChild(contentDiv);
        document.body.appendChild(alertDiv);
        
        // Esconde datepickers abertos
        document.querySelectorAll('.pika-single').forEach(picker => {
            picker.style.display = 'none';
        });
    }
}

function hideCustomAlert() {
    const alertDiv = document.getElementById("customAlert");
    if (alertDiv) {
        alertDiv.parentNode.removeChild(alertDiv);
    }
    // Reativa o scroll
    document.body.style.overflow = '';
}