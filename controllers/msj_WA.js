var local_storage = require('./local_storage.js');

var colas = {
  "opcion_1" : "NI_Wa_Movil",
  "opcion_2" : "NI_Wa_Ventas",
  "opcion_3" : "NI_Wa_Corpo"
};

var mjs_horario = "¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención! $cr $cr $cr ";
    mjs_horario += "Whatsapp $cr $cr ";
    mjs_horario += "Lunes a Domingo 8:00 a 21:00 horas $cr $cr $cr ";
    mjs_horario += "⌚Facebook y Twitter $cr $cr ";
    mjs_horario += "Lunes a Domingo $cr $cr ";
    mjs_horario += "7:00 a 22:00 horas $cr $cr ";
    mjs_horario += "Te invitamos a ingresar a https://miclaro.com.ni/ disponible 24/7 para que puedas hacer tus autogestiones. $cr $cr ";
    mjs_horario += "¡Claro que sí! ";
    
var mensaje_df = "¡Bienvenido a Claro Nicaragua! Estamos para servirle! $cr $cr ";
    mensaje_df +="Elija la opción que necesita para ser atendido por uno de nuestros ejecutivos. $cr $cr ";
    mensaje_df +="1- Servicio al Cliente $cr ";
    mensaje_df +="2- Ventas $cr ";
    mensaje_df +="3- Atención a Empresas $cr ";

var msj_default = 
{
  "action" : {
    "type" : "continue",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "text",
      "text" :  mensaje_df,
      "mediaURL" : ""
    }
  ]
};

var msj_opcion = {
  "opcion_1" : {
    "action" : {
      "type" : "transfer",
      "queue" : colas.opcion_1
    },
    "messages" : []
  },
  "opcion_2" : {
    "action" : {
      "type" : "transfer",
      "queue" : colas.opcion_2
    },
    "messages" : []
  },
  "opcion_3" : {
    "action" : {
      "type" : "transfer",
      "queue" : colas.opcion_3
    },
    "messages" : []
  }
}

var msj_fuera_horario =
{
  "action" : {
    "type" : "transfer",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "text",
      "text" :  mjs_horario,
      "mediaURL" : ""
    }
  ]
}

var contenedor = {
  "action" : {
    "type" : "",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "",
      "text" :  "",
      "mediaURL" : ""
    }
  ]
};

exports.msj_default = msj_default;

exports.mjs_horario = mjs_horario;

exports.msj_fuera_horario = msj_fuera_horario;

exports.contenedor = contenedor;

exports.colas = colas;

exports.msj_opcion = msj_opcion;