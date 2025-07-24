function calcularIdade(dataNascimento) {
    // Separa a data em dia, mês e ano
    var partesData = dataNascimento.split('/');
    var dia = parseInt(partesData[0]);
    var mes = parseInt(partesData[1]);
    var ano = parseInt(partesData[2]);

    // Obtém a data atual
    var dataAtual = new Date();

    // Obtém o dia, mês e ano da data atual
    var diaAtual = dataAtual.getDate();
    var mesAtual = dataAtual.getMonth() + 1; // Meses são indexados de 0 a 11
    var anoAtual = dataAtual.getFullYear();

    // Calcula a idade
    var idade = anoAtual - ano;

    // Verifica se já fez aniversário este ano
    if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
        idade--;
    }

    return idade;
}

model.idade = calcularIdade(model.dataNascimento)