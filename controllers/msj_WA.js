var local_storage = require('./local_storage.js');

var colas = {
  "cotizar" : {
      "timeout" : 900000,// 15 min - 300000, // 5 minutos
      "acd" : "NI_Wa_Ventas",
      "fh" : "NI_Wa_Ventas"
  },
  "factura" : {
      "timeout" : 900000,// 15 min - 300000,
      "acd" : "NI_Wa_Corpo",
      "fh" : "NI_Wa_Corpo"
  },
  "op1" : {
      "timeout" : 900000,// 15 min - 300000,
      "acd" : "NI_Wa_Movil",
      "fh" : "NI_Wa_Movil"
  },
  "op2" : {
      "timeout" : 900000,// 15 min - 300000,
      "acd" : "NI_Wa_Corpo",
      "fh" : "NI_Wa_Corpo"
  }  
};

var mensaje_df = "¡Hola! \n Soy *Avi*, tu asistente virtual 🤖 de Claro \n ";
    mensaje_df +="¡Este es el nuevo menú de opciones con las que te puedo apoyar más rápido!  Solo envía una de las palabras que aparecen resaltadas según tu consulta. \n \n ";
    mensaje_df +="➡️ Envía ASISTENCIA si presentas inconvenientes con tu servicios móvil 📱, línea , Internet residencial o televisión claro  🖥. \n \n ";
    mensaje_df +="➡️ Envía COTIZAR para conocer nuestros planes móviles y residenciales si deseas renovar o contratar nuevos servicios. 😎  😎 \n \n ";
    mensaje_df +="➡️ Envía FACTURA para conocer el detalle de tu factura, monto y fecha de vencimiento.  📥 \n \n ";
    mensaje_df +="➡️ Envía AYUDA para conocer todo lo que puedes hacer en un mismo lugar. ¡Puedes consultar tu saldo, tus paquetes contratados, tu consumo de internet móvil y mucho más!  😎 \n \n ";
    mensaje_df +="➡️ Envía PAGAR para ver el saldo, fecha de vencimiento y pagar tu factura móvil y residencial. 💳 \n \n ";
    mensaje_df +="➡️ Envía RECARGA para hacer una recarga.  \n \n ";
    mensaje_df +="➡️ Envía PAQUETE para compra de paquete. \n \n ";
    mensaje_df +="➡️ Envía CLUB para conocer los establecimientos con promociones especiales solo por ser cliente Claro. 😎 💰  \n \n ";
    //mensaje_df +="➡️ Envía *asesor* si aún deseas ser atendido por uno de nuestros agentes de servicio al cliente o ventas. 👩💻👨💻 \n \n ";

var mjs_horario = "¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención! \n \n \n ";
    mjs_horario += "Whatsapp \n \n ";
    mjs_horario += "Lunes a Domingo 8:00 a 21:00 horas \n \n \n ";
    mjs_horario += "⌚Facebook y Twitter \n \n ";
    mjs_horario += "Lunes a Domingo \n \n ";
    mjs_horario += "7:00 a 22:00 horas \n \n ";
    mjs_horario += "Te invitamos a ingresar a https://miclaro.com.ni/ disponible 24/7 para que puedas hacer tus autogestiones. \n \n ";
    mjs_horario += "¡Claro que sí! ";

var msj_facturar = "Puedes descargar tu factura móvil ingresando al siguiente portal: https://bit.ly/FacturaClaroNI \n \n ";
    msj_facturar += "Puedes pagar fácil y rápido aquí: ni.mipagoclaro.com 💳🧾 \n \n ";
    msj_facturar += "Si tienes consultas sobre algún detalle específico en tu factura, envía ASESOR 👩💻👨💻 ";

var msj_ayuda = "Descarga nuestra App renovada para ti  \n \n ";
    msj_ayuda += "Android 👉🏼 https://play.google.com/store/apps/details?id=com.claro.miclaro&hl=es \n \n ";
    msj_ayuda += "Apple 👉🏼 https://apps.apple.com/gt/app/mi-claro-centroam%C3%A9rica/id953328601 ";

var msj_club = "Si eres Claro 😉 eres parte del club con beneficios y descuentos. \n \n ";
    msj_club += "¡Descarga la App! 👇 \n \n ";
    msj_club += "Android: http://bit.ly/ClaroClub-Android \n \n ";
    msj_club += "iOS: http://bit.ly/ClaroClubiOS \n \n ";

var msj_asistencia_asesor = "“¡Gracias por comunicarte a Claro!” \n \n ";
    msj_asistencia_asesor += "Ingresa el NUMERO de la opción con la que necesitas apoyo para ser atendido por uno de nuestros ejecutivos. \n \n ";
    msj_asistencia_asesor += "1. Servicio al cliente \n ";
    msj_asistencia_asesor += "2. Atención a Empresas \n \n ";

var palabras = {
  "cotizar": {
    "action" : {
      "type" : "transfer",
      "queue" : colas.cotizar["acd"],
      "timeoutInactivity" : colas.cotizar["timeout"]
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "*¡Hola!🤗 Bienvenido a nuestro servicio de ventas Claro.*  En un momento uno de nuestros representantes te atenderá",
        "mediaURL" : ""
      }
    ]
  },
  "factura": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_facturar,
        "mediaURL" : ""
      }
    ]
  },
  "ayuda": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_ayuda,
        "mediaURL" : ""
      }
    ]
  },
  "asistencia": {
   "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_asistencia_asesor,
        "mediaURL" : ""
      }
    ]
  },
  "pagar": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Para conocer el saldo, fecha de vencimiento y también poder pagar tu factura móvil y residencial, puedes ingresar al siguiente portal: https://ni.mipagoclaro.com/ 💳🧾",
        "mediaURL" : ""
      }
    ]
  },
  "recarga": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Recarga fácil y rápido visitando nuestro portal: https://paquetes.miclaro.com.ni/ 😎",
        "mediaURL" : ""
      }
    ]
  },
  "Paquete": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  "Compra el paquete que prefieras ingresando a https://paquetes.miclaro.com.ni",
        "mediaURL" : ""
      }
    ]
  },
  "club": {
    "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_club,
        "mediaURL" : ""
      }
    ]
  },
  "asesor": {
   "action" : {
      "type" : "continue",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_asistencia_asesor,
        "mediaURL" : ""
      }
    ]
  },
};

var msj_no_opcion = 
{
  "action" : {
    "type" : "continue",
    "queue" : ""
  },
  "messages" : [
    {
      "type" : "text",
      "text" : "➡️ Envía ASISTENCIA si presentas inconvenientes con tu internet de celular, llamadas o mensajes de texto📱. \n \n ",
      "mediaURL" : ""
    }
  ]
};

/****************************Sub menu *************************************************/
var menu_asis_asesor = {
  "1": {
    "action" : {
      "type" : "transfer",
      "queue" : colas.op1["acd"],
      "timeoutInactivity" : colas.op1["timeout"]
    },
    "messages" : []
  },
  "2": {
    "action" : {
      "type" : "transfer",
      "queue" : colas.op2["acd"],
      "timeoutInactivity" : colas.op2["timeout"]
    },
    "messages" : []
  }
};

/**************************************************************************************/
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

var msj_factura_asesor = {
  "action" : {
    "type" : "transfer",
    "queue" : colas.factura["acd"],
    "timeoutInactivity" : colas.factura["timeout"]
  },
  "messages" : []
};

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

exports.palabras = palabras;

exports.msj_default = msj_default;

exports.mjs_horario = mjs_horario;

exports.msj_fuera_horario = msj_fuera_horario;

exports.msj_factura_asesor = msj_factura_asesor;

exports.menu_asis_asesor = menu_asis_asesor;

exports.msj_no_opcion = msj_no_opcion;

exports.contenedor = contenedor;

exports.colas = colas;