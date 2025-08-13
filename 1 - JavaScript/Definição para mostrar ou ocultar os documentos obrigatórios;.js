debugger;

// Validação para mostrar ou ocultar os documentos obrigatórios
//show(); Mostrar
//.hide(); Ocultar

//Formulário: [RPMOBI]REQUERIMENTO DO DEPARTAMENTO DE ENGENHARIA - PORTAL EXTERNO
//Tipo de Solicitação: Documentos Geral
//Qualificação do Usuário Logado: "Procurador"
if ( (model.qualificacao == 2) && (model.solicitacao !== null && model.solicitacao !== '')) {
    $("div[key=section_1737652151505]").show(); //Alerta DOCUMENTAÇÃO
    $("div[key=section_1737652840078]").show(); //CNPJ ou Identificação
    $("div[key=section_1742408416871]").show(); //Procuração
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").hide(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
    } else {
        $("div[key=section_1737652151505]").show(); //Alerta DOCUMENTAÇÃO
        $("div[key=section_1737652840078]").show(); //CNPJ ou Identificação
        $("div[key=section_1742408416871]").hide(); //Procuração
    };

//Tipo de Solicitação: Aprovação de Orçamento
if (model.solicitacao == 1) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").show(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").show(); //Orçamento Assinado
    $("div[key=section_1742333955156]").show(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").show(); //Cópia do Projeto de Sinalização Aprovado;
}

//Tipo de Solicitação: Aprovação de Projeto de Redutores de Velocidade
if (model.solicitacao == 2) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").show(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").show(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").show(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Aprovação de Projeto de Redutores de Velocidade em Condomínios
if (model.solicitacao == 3) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").show(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").show(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").show(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").show(); //Ata de Assembléia
    $("div[key=section_1742332651781]").show(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Aprovação de Projeto de Sinalização Viária
if (model.solicitacao == 4) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").show(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").show(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Aprovação de Projeto de Sinalização Viária em Condomínios
if (model.solicitacao == 5) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").show(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").show(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").show(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").show(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Projeto de Implantação Emissão do Termo de Compromisso (TEC)
if (model.solicitacao == 6) {
    $("div[key=section_1737653141464]").show(); //Projeto de Implantação
    $("div[key=section_1737653198864]").show(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").show(); //Matrícula
    $("div[key=section_1737653229295]").show(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
};

//Tipo de Solicitação: Emissão do Termo de Conclusão do TEC (TC)
if (model.solicitacao == 7) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").show(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Emissão do Termo de Doação
if (model.solicitacao == 8) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").show(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").show(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").hide(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").hide(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").hide(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Emissão do Termo de Recebimento de Redutores de Velocidade
if (model.solicitacao == 9) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").show(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").show(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").show(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Emissão do Termo de Recebimento de Redutores de Velocidade em Condomínios
if (model.solicitacao == 10) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").show(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").show(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").show(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Emissão do Termo de Recebimento de Sinalização Viária (TRS)
if (model.solicitacao == 11) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").show(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").show(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").show(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado
}

//Tipo de Solicitação: Emissão do Termo de Recebimento de Sinalização Viária em Condomínios
if (model.solicitacao == 12) {
    $("div[key=section_1737653141464]").hide(); //Projeto de Implantação
    $("div[key=section_1737653198864]").hide(); //ART/RRT do Projeto
    $("div[key=section_1737653216610]").hide(); //Matrícula
    $("div[key=section_1737653229295]").hide(); //Via do EIV
    $("div[key=section_1742330190781]").hide(); //Comprovação do Cumprimento do Termo
    $("div[key=section_1742329633392]").hide(); //Cópia do TEC com Anexos
    $("div[key=section_1742329866871]").hide(); //Cópia da Nota Fiscal
    $("div[key=section_1737654337817]").show(); //Anexos
    $("div[key=section_1742330747533]").hide(); //Projeto de Sinalização
    $("div[key=section_1742331201964]").show(); //Cópia do Projeto Aprovado
    $("div[key=section_1742331333853]").show(); //Cópia do Termo de Aprovação do Projeto
    $("div[key=section_1742331412707]").show(); //Relatório Técnico Fotográfico
    $("div[key=section_1742331759902]").hide(); //Ata de Eleição do Presidente/Síndico/Diretor
    $("div[key=section_1742331850860]").hide(); //Ata de Assembléia
    $("div[key=section_1742332651781]").hide(); //Fichas Técnicas com Indicação de Inclinação das Vias
    $("div[key=section_1742333780974]").hide(); //Orçamento Assinado
    $("div[key=section_1742333955156]").hide(); //ART/RRT do Orçamento
    $("div[key=section_1742334135082]").hide(); //Cópia do Projeto de Sinalização Aprovado

    // Verifica se model.solicitacao está definido antes de chamar a função
    if (model.solicitacao !== null && model.solicitacao !== '') {
        atualizarExibicao(model.solicitacao);
    }
}