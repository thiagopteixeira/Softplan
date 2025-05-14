function atualizarCampo(id, valor) {
    var campo = document.getElementById(id);
    if (campo) {
      campo.value = valor; // Atualiza o valor do campo
      campo.dispatchEvent(new Event('change')); // Dispara o evento de mudança
    }
  }

let bankCode = model.codigoBanco;
let url = `https://brasilapi.com.br/api/banks/v1/${bankCode}`;
let request = new XMLHttpRequest();
request.responseType = 'json';

request.open("GET", url, true);
request.send();

request.onloadend = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
            atualizarCampo("nomeBanco", request.response.fullName);
        } else {
            atualizarCampo("nomeBanco", '');
            model.codigoBanco = '';
            exibeAlerta("Código bancário não encontrado");
            return
        }
    }
};