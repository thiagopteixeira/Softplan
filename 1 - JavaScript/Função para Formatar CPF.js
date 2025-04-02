// Função para formatar CPF
function formatarCPF(cpf) {
    // Remove tudo que não é dígito
    cpf = cpf.replace(/\D/g, '');
    
    // Aplica a formatação do CPF (xxx.xxx.xxx-xx)
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Seu código com o CPF formatado
model.concatena = 'Solicitação de Serviço de Obras/Manutenção' + '\n' +
                  'Solicitante ' + model.nomeSolicitante + ' - CPF ' + formatarCPF(model.documentoSolicitante) + '\n' +
                  'Unidade Escolar ' + model.siglaUnidadeSolicitante + ' - ' + model.nomeUnidadeSolicitante + '\n';