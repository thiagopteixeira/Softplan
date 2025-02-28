// Função para remover acentos
function removerAcentos(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Itens de serviço e seus cdSetorResponsavel
const servicos = [
    { sigla: 'PMRP-ADM', nome: "Atestado de Residência", cdSetorResponsavel: "01" },
    { sigla: 'PMRP-SAERP', nome: "Solicitação de Alvará", cdSetorResponsavel: "02" },
    { sigla: 'PMRP-CULT', nome: "Certidão de Nascimento", cdSetorResponsavel: "03" },
    { sigla: 'PMRP-SEC', nome: "Emissão de Documento", cdSetorResponsavel: "04" },
    { sigla: 'PMRP-FAZ', nome: "Jorge Luis Lima Mayta Mamani, Livia Almeida Mamani, Raul Pericine Mamani", cdSetorResponsavel: "1010" }
];

// Criação do CSS
const style = document.createElement('style');
style.textContent = `
    .input-success {
        background-color: #d2f8c7; /* Fundo verde muito claro */
    }

    .input-error {
        background-color: #fde2e2; /* Fundo vermelho muito claro */
    }

    .suggestions {
            position: absolute; /* Ajuste conforme necessário */
            border: 1px solid #ccc;
            background-color: white;
            z-index: 1000; /* Certifique-se de que esteja acima de outros elementos */
            max-height: 150px; /* Limite a altura */
            overflow-y: auto; /* Habilitar rolagem vertical */
            width: calc(100% - 10px); /* Diminui a largura em relação ao input */
            left: 5px; /* Ajusta a posição à esquerda */
            box-sizing: border-box; /* Inclui borda e preenchimento no cálculo de largura */
    }

    .suggestion-item {
        padding: 8px;
        cursor: pointer;
    }

    .suggestion-item:hover {
        background-color: #f0f0f0; /* Efeito de hover */
    }

    .not-found {
        color: red; /* Estilo para a mensagem de não encontrado */
        padding: 8px;
    }
`;
document.head.appendChild(style);

// Função para disparar evento change com jQuery
function triggerChange(field) {
    $(`#${field}`).trigger('change');
}

// Função para exibir sugestões
function exibirSugestoes(suggestionsContainer, input) {
    const query = removerAcentos(input.value.toLowerCase());
    suggestionsContainer.innerHTML = "";

    // Limpa as classes de sucesso e erro
    input.classList.remove('input-success', 'input-error');

    // Filtra e ordena os serviços
    const filteredServicos = servicos
        .filter(servico => removerAcentos(servico.nome.toLowerCase()).includes(query))
        .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena em ordem alfabética

    if (filteredServicos.length > 0) {
        filteredServicos.forEach(servico => {
            const suggestionItem = document.createElement("div");
            suggestionItem.className = "suggestion-item";
            suggestionItem.textContent = servico.nome;

            suggestionItem.addEventListener("click", function () {
                input.value = servico.nome; // Preencher o input com o nome do serviço
                model.solicitacao = servico.nome // preencher o nome em outro campo
                model.cdSetorResponsavel = servico.cdSetorResponsavel; // Atribuir o cdSetorResponsavel
                model.siglaSetorResponsavel = servico.sigla; // Atribuir a siglaSetorResponsavel
                model.nomeSetorResponsavel = servico.nome; // Atribuir o nomeSetorResponsavel
                triggerChange('solicitacao');
                triggerChange('cdSetorResponsavel');
                triggerChange('siglaSetorResponsavel');
                triggerChange('nomeSetorResponsavel');
                suggestionsContainer.innerHTML = ""; // Limpar sugestões
                input.classList.add('input-success'); // Adiciona a classe de sucesso
            });

            suggestionsContainer.appendChild(suggestionItem);
        });
    } else {
        const notFoundMessage = document.createElement("div");
        notFoundMessage.className = "not-found";
        notFoundMessage.textContent = "Não encontrado";
        suggestionsContainer.appendChild(notFoundMessage);
        input.classList.add('input-error'); // Adiciona a classe de erro
        model.solicitacao = ""; // Limpar
        model.cdSetorResponsavel = ""; // Limpa o cdSetorResponsavel
        model.siglaSetorResponsavel = ""; // Limpa a siglaSetorResponsavel
        model.nomeSetorResponsavel = ""; // Limpa o nomeSetorResponsavel
        triggerChange('solicitacao');
        triggerChange('cdSetorResponsavel');
        triggerChange('siglaSetorResponsavel');
        triggerChange('nomeSetorResponsavel');
    }
}

// Criação do autocomplete
function criarAutocomplete() {
    const input = document.getElementById('inputPersonlizado');
    input.setAttribute('autocomplete', 'off'); // Desativar histórico de preenchimento automático
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'suggestions';
    input.parentNode.appendChild(suggestionsContainer); // Adiciona a div de sugestões após o input

    // Habilitar o campo
    input.disabled = false; // Ativar o campo se ele estiver desabilitado

    // Evento de input para filtrar sugestões
    input.addEventListener("input", function () {
        exibirSugestoes(suggestionsContainer, input);
    });

    // Evento de focus para exibir todas as sugestões quando o input está vazio
    input.addEventListener("focus", function () {
        if (!input.value) {
            exibirSugestoes(suggestionsContainer, input);
        }
    });

    // Autocompletar ao pressionar Tab
    input.addEventListener("keydown", function (event) {
        if (event.key === "Tab") {
            const suggestionItems = suggestionsContainer.getElementsByClassName("suggestion-item");
            if (suggestionItems.length === 1) {
                input.value = suggestionItems[0].textContent; // Preencher o input com o nome do serviço
                const servicoSelecionado = servicos.find(servico => servico.nome === suggestionItems[0].textContent);
                model.solicitacao = servicoSelecionado.nome // preencher o nome em outro campo
                model.cdSetorResponsavel = servicoSelecionado.cdSetorResponsavel; // Atribuir o cdSetorResponsavel
                model.siglaSetorResponsavel = servicoSelecionado.sigla; // Atribuir a siglaSetorResponsavel
                model.nomeSetorResponsavel = servicoSelecionado.nome; // Atribuir o nomeSetorResponsavel
                triggerChange('solicitacao');
                triggerChange('cdSetorResponsavel');
                triggerChange('siglaSetorResponsavel');
                triggerChange('nomeSetorResponsavel');
                suggestionsContainer.innerHTML = ""; // Limpar sugestões
                input.classList.add('input-success'); // Adiciona a classe de sucesso
                event.preventDefault(); // Evita que o foco saia do input
            }
        }
    });

    // Fechar sugestões ao clicar fora
    document.addEventListener("click", function (event) {
        if (!suggestionsContainer.contains(event.target) && event.target !== input) {
            suggestionsContainer.innerHTML = ""; // Limpa as sugestões
        }
    });
}

// Chamar a função para criar o autocomplete
criarAutocomplete();
