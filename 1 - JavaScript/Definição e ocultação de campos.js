//defineOcultaCampos- Projeto "[PMRP][FAZ] Abertura de Contas GRO - Formulário Abertura de Conta"

//Definição e ocultação de campos "RECEITA"

const receita = Array.isArray(model.receita) ? model.receita : [String(model.receita)]; // Garante que receita seja sempre tratado como um array de strings, mesmo que o valor original de model.receita seja um único valor (número ou string).

//model.receita = 1 (Opção "Receita Principal")
//model.receita = 2 (Opção "Receita Juros")

function tornarObrigatorio(campo, obrigatorio) {
    const $campo = $(`div[key='${campo}']`);
    if (obrigatorio) {
        $campo.addClass('required'); // Ou use a função do framework, como setRequired(campo, true)
    } else {
        $campo.removeClass('required'); // Ou setRequired(campo, false)
    }
}

if (receita.includes('1') /*Se apenas a opção "Receita Principal" (1) estiver selecionada*/ && !receita.includes('2'))
//Verifica se apenas a opção '1' está presente no array receita, e a opção '2' (Receita Juros) não está.

//Opção "Receita Principal"
{   
    $("div[key='element_73928']").show(); //Mostra título "Receita Principal".
    $("div[key='vinculoReceitaPrincipal']").show(); //Mostra campo "Vínculo" do título "Receita Principal"
    $("div[key='nomeContaReceitaPrincipal']").show(); //Mostra o campo "Nome da Conta Contábil" do título "Receita Principal"
    $("div[key='element_58984']").hide(); // Oculta título "Receita Juros"
    model.vinculoReceitaJuros = null; //Valor do campo "Vínculo" do título "Receita Juros" nulo
    $("div[key='vinculoReceitaJuros']").hide(); //Oculta campo "Vínculo" do título "Receita Juros"
    model.nomeContaReceitaJuros = null; //Valor do campo "Nome da Conta Contábil" do título "Receita Juros" nulo
    $("div[key='nomeContaReceitaJuros']").hide(); //Oculta o campo "Nome da Conta Contábil" do título "Receita Juros"

    // Tornar obrigatórios os campos da Receita Principal
    tornarObrigatorio('vinculoReceitaPrincipal', true); //Obrigatório o campo "Vínculo" do título "Receita Principal"
    tornarObrigatorio('nomeContaReceitaPrincipal', true); //Obrigatório o campo "Nome da Conta Contábil" do título "Receita Principal"
    tornarObrigatorio('vinculoReceitaJuros', false); //Não obrigatório o campo "Vínculo" do título "Receita Juros"
    tornarObrigatorio('nomeContaReceitaJuros', false); //Não obrigatório o campo "Nome da Conta Contábil" do título "Receita Juros"
}
    
if (receita.includes('2') /*Se apenas a opção "Receita Juros" (2) estiver selecionada*/ && !receita.includes('1')) //Verifica se apenas a opção '2' está presente no array receita, e a opção '1' (Receita Principal) não está.
    {
    //Opção "Receita Juros"
    $("div[key='element_73928']").hide(); // Oculta título "Receita Principal"
    model.vinculoReceitaPrincipal = null; //Valor do campo "Vínculo" do título "Receita Principal" nulo
    $("div[key='vinculoReceitaPrincipal']").hide(); //Oculta campo "Vínculo" do título "Receita Principal"
    model.nomeContaReceitaPrincipal = null; //Valor do campo "Nome da Conta Contábil" do título "Receita Principal" nulo
    $("div[key='nomeContaReceitaPrincipal']").hide(); //Oculta o campo "Nome da Conta Contábil" do título "Receita Principal"
    $("div[key='element_58984']").show(); //Mostra título "Receita Juros"
    $("div[key='vinculoReceitaJuros']").show(); //Mostra campo "Vínculo" do título "Receita Juros"
    $("div[key='nomeContaReceitaJuros']").show(); //Mostra o campo "Nome da Conta Contábil" do título "Receita Juros"

    // Tornar obrigatórios os campos da Receita Juros
    tornarObrigatorio('vinculoReceitaPrincipal', false); //Não obrigatório o campo "Vínculo" do título "Receita Principal"
    tornarObrigatorio('nomeContaReceitaPrincipal', false); //Não obrigatório o campo "Nome da Conta Contábil" do título "Receita Principal"
    tornarObrigatorio('vinculoReceitaJuros', true); //Obrigatório o campo "Vínculo" do título "Receita Juros"
    tornarObrigatorio('nomeContaReceitaJuros', true); //Obrigatório o campo "Nome da Conta Contábil" do título "Receita Juros"
}

if (receita.includes('1') && receita.includes('2')) /*Se ambas as opções "Receita Principal" (1) e "Receita Juros" (2) estiverem selecionadas */ {
    $("div[key='element_73928']").show(); //Mostra título "Receita Principal".
    $("div[key='vinculoReceitaPrincipal']").show(); //Mostra campo "Vínculo" do título "Receita Principal"
    $("div[key='nomeContaReceitaPrincipal']").show(); //Mostra o campo "Nome da Conta Contábil" do título "Receita Principal"
    $("div[key='element_58984']").show(); //Mostra título "Receita Juros"
    $("div[key='vinculoReceitaJuros']").show(); //Mostra campo "Vínculo" do título "Receita Juros"
    $("div[key='nomeContaReceitaJuros']").show(); //Mostra o campo "Nome da Conta Contábil" do título "Receita Juros"

    // Tornar obrigatórios todos os campos
    tornarObrigatorio('vinculoReceitaPrincipal', true); //Obrigatório o campo "Vínculo" do título "Receita Principal"
    tornarObrigatorio('nomeContaReceitaPrincipal', true); //Obrigatório o campo "Nome da Conta Contábil" do título "Receita Principal"
    tornarObrigatorio('vinculoReceitaJuros', true); //Obrigatório o campo "Vínculo" do título "Receita Juros"
    tornarObrigatorio('nomeContaReceitaJuros', true); //Obrigatório o campo "Nome da Conta Contábil" do título "Receita Juros"
}