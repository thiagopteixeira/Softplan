// Alerta é mostrado imediatamente
$(".btn-primary")
    .parent()
    .parent()
    .append(
        '<div id="divAlerta" style="white-space: pre-line; padding: 25px 20px; background: linear-gradient(135deg, #f44336, #d32f2f); color: white; position: fixed; top: 100px; right: 10px; min-width: 250px; min-height: 80px; z-index: 9999; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: opacity 0.3s ease-in-out; opacity: 1;"><span onclick="escondeAlerta();" style="margin-left: 15px; color: white; font-weight: bold; float: right; font-size: 21px; line-height: 20px; cursor: pointer; transition: 0.3s;">&times;</span><strong style="font-size: 15px;">Atenção!</strong><div id="textoAlerta">' +
        form +
        '</div></div>'
    );

// Fechar o alerta após 7 segundos depois de aparecer, caso não queria que feche automaticamente retire o código abaixo:
// "setTimeout(escondeAlerta, 7000);
setTimeout(escondeAlerta, 7000);


// Alerta é mostrado após 3 segundos, caso deseje que inicie imediatamente remova os trechos
//"setTimeout(function () {" 
// e
// "}, 3000);"
setTimeout(function () {
    $(".btn-primary")
        .parent()
        .parent()
        .append(
            '<div id="divAlerta" style="white-space: pre-line; padding: 25px 20px; background: linear-gradient(135deg, #f44336, #d32f2f); color: white; position: fixed; top: 100px; right: 10px; min-width: 250px; min-height: 80px; z-index: 9999; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: opacity 0.3s ease-in-out; opacity: 1;"><span onclick="escondeAlerta();" style="margin-left: 15px; color: white; font-weight: bold; float: right; font-size: 21px; line-height: 20px; cursor: pointer; transition: 0.3s;">&times;</span><strong style="font-size: 15px;">Atenção!</strong><div id="textoAlerta">' +
            form +
            '</div></div>'
        );

    // Fechar o alerta após 7 segundos depois de aparecer, caso não queria que feche automaticamente retire o código abaixo:
    // "setTimeout(escondeAlerta, 7000);
    setTimeout(escondeAlerta, 7000);
}, 3000);