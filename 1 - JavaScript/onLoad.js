//onLoad
// Função para dar clique automático no campo oculto "desabilitaCampos", iniciando assim o código associado a esse.
$(document).ready(function() {

    var recebe = setTimeout(function() {
        $("div[key=desabilitaCampos]").click();
    }, 1);

});