//desabilitaCampos - Formulário "[PMRP][FAZ] Abertura de Contas GRO - Formulário Abertura de Conta"
// Função para desabilitar campos do formulário "[PMRP][FAZ] Abertura de Contas GRO - Formulário Abertura de Conta"
    setTimeout(function() {
        // Lista de IDs dos campos que devem ser desabilitados
        $("[id=setorAceita]").attr("disabled",true) //Desabilita as opções do campo "Formulário para abertura de conta pertence a esse setor?"
        $("[id=motivoRecusa]").attr("disabled",true) //Desabilita o campo "Motivo da Recusa"
        $("[id=vinculoPrincipal]").attr("disabled",true) //Desabilita o campo "Vínculo Principal Numérico"
        $("[id=vinculoSecundario]").attr("disabled",true) //Desabilita o campo "Vínculo Secundário"
        $("[id=cnpj]").attr("disabled",true) //Desabilita o campo "CNPJ"
        $("[id=nomeConta]").attr("disabled",true) //Desabilita o campo "Nome da Conta"
        $("[id=codigoBanco]").attr("disabled",true) //Desabilita o campo "Código do Banco"
        $("[id=nomeBanco]").attr("disabled",true) //Desabilita o campo "Nome do Banco"
        $("[id=agencia]").attr("disabled",true) //Desabilita o campo "Agência"
        $("[id=conta]").attr("disabled",true) //Desabilita o campo "Nº Conta Corrente"
        $("[id=receita]").attr("disabled",true) //Desabilita as opções do campo "Receita"
        $("[id=vinculoReceita]").attr("disabled",true) //Desabilita o campo "Vínculo"
        $("[id=nomeContaReceita]").attr("disabled",true) //Desabilita o campo "Nome da Conta"
        $("[id=tipoReceita]").attr("disabled",true) //Desabilita as opções do campo "Tipo de Receita"
        $("[id=element_03601]").attr("disabled",true) //Desabilita as opções do campo "Conta Comum / Movimento"
        /*
        $("div[key='element_03601'] select, div[key='element_03601'] input").prop("disabled", true); *Desabilita os campos <select> e <input> dentro da div com key 'element_03601', impedindo que o usuário altere a opção "Tesouro" do título "Conta Comum / Movimento".
        */
        $("[id=element_66890]").attr("disabled",true) //Desabilita as opções do campo "Conta Vinculada"
        $("[id=numeroDemanda]").attr("disabled",true) //Desabilita o campo "Número da Demanda/Convênio"

    }, 300);

// Lista de IDs dos campos que devem ser desabilitados
$("[id=setorAceita]").attr("disabled",true); //Desabilita as opções do campo "Formulário para abertura de conta pertence a esse setor?"
$("[id=motivoRecusa]").attr("disabled",true); //Desabilita o campo "Motivo da Recusa"
$("[id=vinculoPrincipal]").attr("disabled",true); //Desabilita o campo "Vínculo Principal Numérico"
$("[id=vinculoSecundario]").attr("disabled",true); //Desabilita o campo "Vínculo Secundário"
$("[id=cnpj]").attr("disabled",true); //Desabilita o campo "CNPJ"
$("[id=nomeConta]").attr("disabled",true); //Desabilita o campo "Nome da Conta"
$("[id=codigoBanco]").attr("disabled",true); //Desabilita o campo "Código do Banco"
$("[id=nomeBanco]").attr("disabled",true); //Desabilita o campo "Nome do Banco"
$("[id=agencia]").attr("disabled",true); //Desabilita o campo "Agência"
$("[id=conta]").attr("disabled",true); //Desabilita o campo "Nº Conta Corrente"
$("[id=receita]").attr("disabled",true) //Desabilita as opções do campo "Receita"
$("[id=vinculoReceita]").attr("disabled",true); //Desabilita o campo "Vínculo"
$("[id=nomeContaReceita]").attr("disabled",true); //Desabilita o campo "Nome da Conta"
$("[id=tipoReceita]").attr("disabled",true); //Desabilita as opções do campo "Tipo de Receita"
$("[id=element_03601]").attr("disabled",true); //Desabilita as opções do campo "Conta Comum / Movimento"
    /*
    $("div[key='element_03601'] select, div[key='element_03601'] input").prop("disabled", true); *Desabilita os campos <select> e <input> dentro da div com key 'element_03601', impedindo que o usuário altere a opção "Tesouro" do título "Conta Comum / Movimento".
    */
$("[id=element_66890]").attr("disabled",true); //Desabilita as opções do campo "Conta Vinculada"
$("[id=numeroDemanda]").attr("disabled",true); //Desabilita o campo "Número da Demanda/Convênio"





    // Função para desabilitar campos do formulário "[PMRP][FAZ] Abertura de Contas GRO - Gerar Conta"
function desabilitaCamposFormularioGRO() {
    // Dispara clique no elemento com atributo key="setorAceita"
    $("[key=element_08915]").click();

    // Lista de IDs dos campos que devem ser desabilitados
    const idsParaDesabilitar = [
        "setorAceita",
        "motivoRecusa",
        "vinculoPrincipal",
        "vinculoSecundario",
        "cnpj",
        "nomeConta",
        "codigoBanco",
        "nomeBanco",
        "agencia",
        "conta",
        "receita",
        "vinculoReceita",
        "nomeContaReceita",
        "tipoReceita",
        "element_03601",
        "element_66890",
        "numeroDemanda"
    ];

    // Desabilita todos os campos com os IDs listados
    idsParaDesabilitar.forEach(function(id) {
        $("#" + id).attr("disabled", true);
    });