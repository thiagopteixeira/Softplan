//Formulário: [PMRP][POUPATEMPO]Consulta de Usuários por Interessado
//Projeto: Criar Formulário para Verificar dados de Usuário
//Ambiente: Produção

//Função para consultar se existe usuário para aquele CPF/CNPJ
debugger;

// Verifica se model.cdUsuario é um array válido
if (Array.isArray(model.cdUsuario)) {

    // Verifica se está vazio
    if (model.cdUsuario.length === 0) {
        // Exibe mensagem de alerta
        $timeout(() => {
            exibeAlerta('Usuário não encontrado!');
        }, 0);

        // Inicializa com objeto vazio para evitar erro posterior
        model.dadosUsuario = [{}];
        return; // Interrompe a execução do restante do código
    }

    // Verifica se model.dadosUsuario não é um array; se não for, inicializa com um objeto vazio
    if (!Array.isArray(model.dadosUsuario)) {
        model.dadosUsuario = [{}];
    }

    // Percorre o array model.cdUsuario
    for (let i = 0; i < model.cdUsuario.length; i++) {
        const usuario = model.cdUsuario[i]; // Armazena o usuário atual da iteração

        // Se for o primeiro item (índice 0), popula o primeiro objeto já existente em dadosUsuario
        if (i === 0) {
            model.dadosUsuario[0].cdUsuarioTab = usuario.cdUsuario;
            model.dadosUsuario[0].nmUsuarioTab = usuario.nmUsuario;
            model.dadosUsuario[0].deEmailTab = usuario.deEmail;
        } else {
            // Para os demais usuários, adiciona novos objetos no array dadosUsuario
            model.dadosUsuario.push({
                cdUsuarioTab: usuario.cdUsuario,
                nmUsuarioTab: usuario.nmUsuario,
                deEmailTab: usuario.deEmail,
            });
        }
    }

    // Aguarda brevemente para garantir que o DOM foi atualizado antes de manipular elementos da tela
    setTimeout(() => {
        
        // Seleciona todos os botões de exclusão (cujo atributo key começa com "remove_line_dadosUsuario") e os oculta
        document.querySelectorAll('button[key^="remove_line_dadosUsuario"]').forEach(btn => {
            btn.style.display = 'none';
        });

        // Seleciona o botão de adicionar linha (com key="add_dadosUsuario") e o oculta, se existir
        const addBtn = document.querySelector('a[key="add_dadosUsuario"]');
        if (addBtn) addBtn.style.display = 'none';
    }, 50); // Executa após 50ms (0,05 segundos)

} else {
    // Se model.cdUsuario não for um array, inicializa dadosUsuario com um objeto vazio
    model.dadosUsuario = [{}];
}