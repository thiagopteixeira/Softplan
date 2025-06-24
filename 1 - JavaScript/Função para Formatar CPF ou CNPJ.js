// Função para formatar CPF ou CNPJ
function formatarDocumento(valor) {
    // Remove tudo que não é dígito
    const numeros = valor.replace(/\D/g, '');

    if (numeros.length === 11) {
        // Formatação CPF: xxx.xxx.xxx-xx
        return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numeros.length === 14) {
        // Formatação CNPJ: xx.xxx.xxx/0001-xx
        return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else {
        // Retorna valor original caso não tenha 11 ou 14 dígitos
        return valor;
    }
}

// Seu código com o CPF/CNPJ formatado
model.concatena = 'Solicitação de Serviço de Obras/Manutenção' + '\n' +
                  'Solicitante ' + model.nomeSolicitante + ' - CPF/CNPJ ' + formatarDocumento(model.documentoSolicitante) + '\n' +
                  'Unidade Escolar ' + model.siglaUnidadeSolicitante + ' - ' + model.nomeUnidadeSolicitante + '\n';