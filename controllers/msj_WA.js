var colas = {
  "opcion_1" : "NI_Wa_Movil",
  "opcion_2" : "NI_Wa_Ventas",
  "opcion_3" : "NI_Wa_Corpo"
};

var mjs_horario = "Hola, gracias por su mensaje. En este momento no estamos disponible, nuestro horario de atención es de Lunes a Domingo de 7am a 10pm. $cr $cr";
    mjs_horario += "Para su comodidad ahora puede utilizar nuestros menú digital de autogestión ingresando al link: https://bit.ly/3aaWUlF";

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
    "type" : "end",
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