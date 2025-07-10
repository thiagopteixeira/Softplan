//Função para mostrar mensagem de alerta, atenção, exibindo a quantidade de caracteres limite do campo
function limitarEntrada(id, limite) {
  // Seleciona o campo de input
  const inputField = document.getElementById(id);

  let contadorCriado = false;
  let contador;

  function atualizarContador() {
    let digitados = inputField.value.length;
    const restantes = limite - digitados;

    // Define o texto inicial do contador
    contador.textContent = `${digitados}/${limite} caracteres (${restantes} restantes)`;

    // Verifica se o número de caracteres ultrapassou o limite
    if (digitados > limite) {
      // Exibe um alerta informando que o limite foi excedido
      alert(`Você pode digitar no máximo ${limite} caracteres.`);

      // Corta o texto para manter apenas os primeiros 'limite' caracteres
      inputField.value = inputField.value.slice(0, limite);

      // Atualiza a contagem para refletir o limite
      digitados = limite;
    }
  }

  // Cria contador apenas quando o campo recebe foco pela primeira vez
  inputField.addEventListener("focus", function onFocus() {

    if (!contadorCriado) {
      contador = document.createElement("div");
      // Define um ID para o contador com base no ID do campo
      contador.id = `contador_${id}`;
      // Adiciona um pequeno espaçamento acima do contador
      contador.style.marginTop = "4px";
      // Aplica espaçamento 0 na margen esquerda do contador
      contador.style.marginLeft = "0px";
      // Aplica um tamanho de fonte menor ao contador
      contador.style.fontSize = "10px";
      // Aplica cor na fonte do contador
      contador.style.color = "#666";

      inputField.parentNode.insertBefore(contador, inputField.nextSibling);
      atualizarContador();
      contadorCriado = true;
    }

    inputField.removeEventListener("focus", onFocus);
  });

  // Atualiza o contador durante a digitação, se já criado
  inputField.addEventListener("input", function () {
    if (contadorCriado) {
      atualizarContador();
    }
  });
}
// Chamada da função para cada campo, com o limite específico
limitarEntrada("tipo_reclamacao", 12000); // 12.000 caracteres
limitarEntrada("local_fato", 200); // 200 caracteres
limitarEntrada("envolvidos_ocorrencia", 200); // 200 caracteres
limitarEntrada("informacao", 2000);// 2.000 caracteres