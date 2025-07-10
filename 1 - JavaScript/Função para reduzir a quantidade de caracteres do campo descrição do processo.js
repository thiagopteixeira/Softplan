//submit
debugger
if (model.tipo_manifestacao == 1) {
  /* Função para reduzir a quantidade de caracteres, acima de 2.000 caracteres (em descrição pode ser enviado no máximo 2000), do campo descrição do processo - enviado em "descrição" no cadastro do processo, pela integração "[POST] -/s/processo/novo-processo" - Em "Detalhamento do assunto" e na "Folha Líder" a quantidade de caracteres é reduzida, mas no "Formulário de cadastro" e em seu PDF o valor do campo é mostrado na integra, ou seja, sem reduções.

  Função: if (model.concatena.length > 2000) {
    model.concatena = model.concatena.substring(0, 2000);
    }
    */
  if (model.concatena.length > 2000) {
    model.concatena = model.concatena.substring(0, 2000);
    }
	formFunctions.submitForm(form, model, context);
}
else if (model.tipo_manifestacao == 2 && (model.tipo_classificacao == 1 || model.tipo_classificacao == 2)) {
	if (model.tipo_classificacao != '' && model.informacao != null && model.informacao != '') {
		CadastroAnonimo(form, model, context)
	}
	else {
		alert("Verifique se todos os dados foram preenchidos!");
	}
}

else if (model.tipo_manifestacao == 2 && model.tipo_classificacao == 3) {
	if (model.tipo_classificacao != '' && model.tipo_reclamacao != null && model.tipo_reclamacao != '') {
		CadastroAnonimo(form, model, context)
	}
	else {
		alert("Verifique se todos os dados foram preenchidos!");
	}
}

else if (model.tipo_manifestacao == 2 && model.tipo_classificacao == 4) {
	if (model.tipo_classificacao != '' && model.local_fato != null && model.local_fato != '' && model.envolvidos_ocorrencia != null && model.envolvidos_ocorrencia != '' && model.informacao != null && model.informacao != '') {
		CadastroAnonimo(form, model, context)
	}
	else {
		alert("Verifique se todos os dados foram preenchidos!");
	}
}
else {
	alert("Verifique se todos os dados foram preenchidos!");
}