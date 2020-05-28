var pais = "NI", nomApp = "MenuBot_NI";

var OPEN_HOUR = 7;
var OPEN_MINUTE = 0;

var CLOSE_HOUR = 22;
var CLOSE_MINUTE = 0;

var offset = -6;

var dias = {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
};

var mjs_horario = "Hola, gracias por su mensaje. En este momento no estamos disponible, nuestro horario de atención es de Lunes a Domingo de 7am a 10pm. $cr $cr";
    mjs_horario += "Para su comodidad ahora puede utilizar nuestros menú digital de autogestión ingresando al link: https://bit.ly/3aaWUlF";

var cola_opc1 = "WhatsappTest";
var cola_opc1_FB = "NI_FB_MSS_SAC";
var cola_opc1_TW = "NI_TW_DM_SAC";

var palabras = {  
  "recarga": {
      "type": "text",
      "accion" : "continue",
      "queue" : "",
      "mensaje" : "Recarga fácil y rápido visitando nuestro portal: https://paquetes.miclaro.cr/ 😎",
      "mediaURL" : ""
  },
  "Paquete": {
      "type": "text",
      "accion" : "continue",
      "queue" : "",
      "mensaje" : "Compra el paquete que prefieras ingresando a https://paquetes.miclaro.cr/",
      "mediaURL" : ""
  },
  "pagar": {
      "type": "text",
      "accion" : "continue",
      "queue" : "",
      "mensaje" : "Para conocer el saldo, fecha de vencimiento y también poder pagar tu factura móvil y Claro Hogar, puedes ingresar al siguiente portal: https://cr.mipagoclaro.com/ 💳🧾",
      "mediaURL" : ""
  },
  "factura": {
    "type": "text",
    "accion" : "continue",
    "queue" : "",
    "mensaje" : "Regístrate en este enlace http://factura.miclaro.cr/ para recibir tu factura electrónica",
    "mediaURL" : ""
  },
  "club": {
      "type": "text",
      "accion" : "continue",
      "queue" : "",
      "mensaje" : "Si eres Claro 😉 eres parte del club con beneficios y descuentos. $cr ¡Descarga la App! 👇 $cr Android: http://bit.ly/ClaroClub-Android $cr iOS: http://bit.ly/ClaroClubiOS",
      "mediaURL" : ""
  },
  "asesor": {
      "type": "text",
      "accion" : "transfer",
      "queue" : cola_opc1,
      "mensaje" : "",
      "mediaURL" : ""
  }
};

var mensaje_df = "¡Bienvenido a CLARO Nicaragua! Estamos para servirle! $cr ";
 mensaje_df +="En un momento les estará atendiendo uno de nuestros ejecutivos.";
 

var msj_default = {
  "type": "text",
  "accion": "transfer",
  "queue" : "",
  "mensaje" : mensaje_df,
  "mediaURL" : ""
}

var contenedor = {
  "type": "",
  "accion" : "",
  "queue" : "",
  "mensaje" : "",
  "mediaURL" : ""
}

var msj_asesor = "";
var fecha_actual = "";
var hora_actual = "";

obtener_fecha = function()
{
    var now = new Date();

    var anio = now.getFullYear();
    var mes = now.getMonth() + 1;
    var dia = now.getDate();

    var hora = now.getHours();
    var minutos = now.getMinutes();
    var segundos = now.getSeconds();

    if(mes < 10){ mes = '0' + mes }
    if(dia < 10){ dia = '0' + dia }
    if(hora < 10){ hora = '0' + hora }
    if(minutos < 10){ minutos = '0' + minutos }
    if(segundos < 10){ segundos = '0' + segundos }

    fecha_actual = dia + "-" + mes + "-" + anio;

    hora_actual = hora + ":" + minutos + ":" + segundos;
    exports.fecha_actual = fecha_actual;
    exports.hora_actual = hora_actual;
}

exports.palabras = palabras;
exports.msj_default = msj_default;
exports.obtener_fecha = obtener_fecha;

exports.OPEN_HOUR = OPEN_HOUR;
exports.OPEN_MINUTE = OPEN_MINUTE;
exports.CLOSE_HOUR = CLOSE_HOUR;
exports.CLOSE_MINUTE = CLOSE_MINUTE;
exports.offset = offset;
exports.dias = dias;
exports.mjs_horario = mjs_horario;

exports.contenedor = contenedor;

/***************************************************/

exports.pais = pais;

exports.nomApp = nomApp;

exports.cola_opc1_FB = cola_opc1_FB;
exports.cola_opc1_TW = cola_opc1_TW;
