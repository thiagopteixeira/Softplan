// Obtém o elemento do input de data
 const dataNascimentoInput = document.getElementById('dataNascimento');
 // Cria um objeto Date com o limite superior (31 de dezembro de 1963)
 const limiteSuperior = new Date('1963-12-31');
 // Define o valor máximo do input de data
 dataNascimentoInput.max = limiteSuperior.toISOString().split('T')[0];

// Função para exibir o alerta personalizado
function exibeAlerta(mensagem) {
  const alerta = document.createElement("div");
  alerta.style.backgroundColor = "red";
  alerta.style.color = "white";
  alerta.style.padding = "18px";
  alerta.style.position = "fixed";
  alerta.style.top = "50%";
  alerta.style.left = "50%";
  alerta.style.transform = "translate(-50%, -50%)";
  alerta.style.zIndex = "9999";

  const mensagemDiv = document.createElement("div");
  mensagemDiv.innerText = mensagem;
  mensagemDiv.style.marginBottom = "6px"; // Adiciona margem para deixar espaço para o botão
  alerta.appendChild(mensagemDiv);

  const fecharBtn = document.createElement("button");
  fecharBtn.innerText = "x";
  fecharBtn.style.backgroundColor = "transparent";
  fecharBtn.style.border = "none";
  fecharBtn.style.color = "white";
  fecharBtn.style.fontSize = "20px";
  fecharBtn.style.position = "absolute";
  fecharBtn.style.top = "0px";
  fecharBtn.style.right = "0px";
  fecharBtn.style.cursor = "pointer";
  alerta.appendChild(fecharBtn);

  const fecharAlerta = () => {
    document.body.removeChild(alerta);
    document.removeEventListener("click", clickOutside);
  };

  const clickOutside = (event) => {
    if (!alerta.contains(event.target)) {
      fecharAlerta();
    }
  };

  fecharBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita a propagação do evento para o elemento pai (alerta)
    fecharAlerta();
  });

  document.body.appendChild(alerta);
  document.addEventListener("click", clickOutside);
}
function calcularIdade(data) {
  const [dia, mes, ano] = data.split("/");
  const dataNascimento = new Date(`${ano}-${mes}-${dia}`);
  const dataAtual = new Date();
  let idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
  
  const mesAtual = dataAtual.getMonth();
  const diaAtual = dataAtual.getDate();
  const mesNascimento = dataNascimento.getMonth();
  const diaNascimento = dataNascimento.getDate();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }
  
  return idade;
}

const dtaNascimento = model.dataNascimento; // Certifique-se de que model.dataNascimento tenha o valor correto (DDMMAAAA)
var idade = calcularIdade(dtaNascimento);

if (idade < 60) {
  exibeAlerta ("Requerente com idade inferior a 60 anos!");
  model.dataNascimento = ''
} else {
  
}