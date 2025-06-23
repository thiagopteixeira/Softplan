$(".btn-primary")
    .parent()
    .parent()
    .append(
        '<div id="divAlertaUsuario" style="white-space: pre-line; padding: 25px 20px; background: linear-gradient(135deg,rgb(85,139,47),rgb(95, 149, 57)); color: white; position: fixed; top: 100px; right: 10px; min-width: 250px; min-height: 80px; z-index: 9999; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); transition: opacity 0.3s ease-in-out; opacity: 1;"><span onclick="escondeAlerta();" style="margin-left: 15px; color: white; font-weight: bold; float: right; font-size: 21px; line-height: 20px; cursor: pointer; transition: 0.3s;">&times;</span><strong style="font-size: 15px;">Atenção!</strong><div id="textoAlerta">' +
        form +
        '</div></div>'
    );

// fecha ao alerta após 7 segundos , caso não queria que feche automaticamente retire o código abaixo:
// "setTimeout(escondeAlerta, 7000);
setTimeout(escondeAlerta, 7000);