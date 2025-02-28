var diasUteisTarefa = 1;
var diasUteisFinal = 1;
var dataAbertura = model.dtInicial;

// Lista de feriados (exemplo de datas, ajuste conforme necessário)
function getFeriadosAnoAtual() {
  var anoAtual = new Date().getFullYear();
  var feriados = [
    "01/01/" + anoAtual, // Confraternização Universal - Ano Novo
    "20/01/" + anoAtual, // Dia de São Sebastião
    "03/03/" + anoAtual, // Carnaval
    "04/03/" + anoAtual, // Carnaval
    "05/03/" + anoAtual, // Quarta-feira de Cinzas
    "19/03/" + anoAtual, // São José (padroeiro da cidade) 
    "18/04/" + anoAtual, // Paixão de Cristo
    "21/04/" + anoAtual, // Tiradentes
    "01/05/" + anoAtual, // Dia Mundial do Trabalho
    "19/06/" + anoAtual, // Aniversário de Ribeirão Preto e Corpus Christi
    "09/07/" + anoAtual, // Revolução Constitucionalista de 1932
    "16/08/" + anoAtual, // Fundação de Ribeirão Preto
    "07/09/" + anoAtual, // Independência do Brasil
    "12/10/" + anoAtual, // Nossa Senhora Aparecida
    "28/10/" + anoAtual, // Dia do Servidor Público
    "02/11/" + anoAtual, // Finados
    "15/11/" + anoAtual, // Proclamação da República 
    "25/12/" + anoAtual, // Natal
    // Adicione mais feriados conforme necessário
  ];
  return feriados;
}

// Substituir a declaração original por:
var feriados = getFeriadosAnoAtual();

function retornaData(data) {
  if (!data || typeof data !== "string") {
    return data;
  }
  var split = data.split("/");
  return new Date(split[2], split[1] - 1, split[0]);
}

function formataData(data) {
  var dia = data.getDate().toString();
  var diaF = dia.length === 1 ? "0" + dia : dia;
  var mes = (data.getMonth() + 1).toString();
  var mesF = mes.length === 1 ? "0" + mes : mes;
  var anoF = data.getFullYear();
  return diaF + "/" + mesF + "/" + anoF;
}

// Função para verificar se a data é um feriado
function verificaFeriado(data) {
  var dataFormatada = formataData(data);
  return feriados.includes(dataFormatada); // Verifica se a data é um feriado
}

var inicioData = retornaData(dataAbertura);

var dataAberturaDate = retornaData(dataAbertura);

// Variáveis para identificar o tipo de problema
var mensagemProblema = [];
var dataAberturaDia = dataAberturaDate.getDay();

// Verifica se a data de abertura é um final de semana ou feriado
if (dataAberturaDia === 0 || dataAberturaDia === 6) {
  mensagemProblema.push("A data selecionada (" + formataData(dataAberturaDate) + ") é um final de semana.");
}

if (verificaFeriado(dataAberturaDate)) {
  mensagemProblema.push("A data selecionada (" + formataData(dataAberturaDate) + ") é um feriado.");
}

// Exibe alerta se houver problema, detalhando o tipo de problema
if (mensagemProblema.length > 0) {
  // Se houver mais de um problema, cria uma mensagem conjunta
  var alertaMensagem = mensagemProblema.join(" ");
  ExibeAlerta(alertaMensagem);

  // Limpa o campo da data (aqui se assume que model.dtInicial é o campo de data)
  model.dtInicial = ""; // Limpa o campo da data selecionada
  return;
}