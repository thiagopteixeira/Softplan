//submit - Projeto "[PMRP][FAZ] Abertura de Contas GRO"

debugger

// verificar se existe algo obrigatório não preenchido, sinalizar o campo e chamar a mensagem
var mensagemErro = "Preencha os campos obrigatórios:\n\n";

// Função genérica para aplicar a obrigatoriedade
function aplicarObrigatoriedade(key) {
    var $divTexto = $("div[key='" + key + "']");
    if ($divTexto.next('.error-message').length === 0) {
        $divTexto.css("color", "rgb(169, 68, 66)")
            .after('<div class="error-message" style="color: rgb(169, 68, 66); margin-left: 15px; margin-top: -16px;"></div>');
    }
    $divTexto.on('click input', function () {
        $divTexto.css("color", "").next('.error-message').remove();
    });
}

// Validação dos campos obrigatórios
if (model.siglaUnidade == '' || model.siglaUnidade == null){
    $(document).ready(function () {
        aplicarObrigatoriedade('unidade');
    });
    mensagemErro += " 'Unidade Interessada - Sigla | Nome' do Solicitante\n";
}

if (
    model.codigoBanco == '' ||
    model.codigoBanco == null ||
    isNaN(model.codigoBanco) ||
    String(model.codigoBanco).length !== 3
) {
    $(document).ready(function () {
        aplicarObrigatoriedade('codigoBanco');
    });
    mensagemErro += ` Informar <a href="https://www.bcb.gov.br/Fis/CODCOMPE/Tabela.pdf" target="_blank" style="color:rgb(8, 37, 255); text-decoration: underline;">'Código do Banco'</a> válido de 3 dígitos<br>`;
}

if (model.nomeBanco == '' || model.nomeBanco == null){
    $(document).ready(function () {
        aplicarObrigatoriedade('nomeBanco');
    });
    mensagemErro += " 'Nome do Banco'\n";
}

if (model.agencia == '' || model.agencia == null){
    $(document).ready(function () {
        aplicarObrigatoriedade('agencia');
    });
    mensagemErro += " 'Agência'\n";
}

if (model.conta == '' || model.conta == null){
    $(document).ready(function () {
        aplicarObrigatoriedade('conta');
    });
    mensagemErro += " 'Nº Conta Corrente'\n";
}

//Monta descrição do processo
model.descricao = 'Abertura de Contas GRO' + '\n' +
                  'Solicitante: ' + model.siglaUnidade + ' - ' + model.nomeUnidade + '\n';

// Exibe a mensagem de erro ou submete o formulário
if (mensagemErro !== "Preencha os campos obrigatórios:\n\n") {
    exibeAlerta(mensagemErro);
    
} else {
    formFunctions.submitForm(form, model, context);
}