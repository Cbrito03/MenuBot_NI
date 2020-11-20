var colas = {
	"1" : {
		"acd" : "NI_TW_DM_Ventas",
		"fh" : "NI_TW_DM_Ventas"
	},
	"2" : {
		"acd" : "NI_TW_DM_SAC",
		"fh" : "NI_TW_DM_SAC"
	}
};

var mensaje_df = "¡Hola! \n Soy *Avi*, tu asistente virtual 🤖 de Claro, ";
	mensaje_df +="¡Échale un vistazo a mi nuevo menú de opciones con las que te puedo apoyar más rápido!  \n \n ";
	mensaje_df +="Ingresa el número de la opción con la que necesitas apoyo.  \n \n ";
	mensaje_df +="1. Ventas y Renovaciones \n ";
	mensaje_df +="2. Servicio al Cliente \n ";

var mjs_horario = "¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención! \n \n \n ";
    mjs_horario += "⌚Facebook y Twitter \n \n ";
    mjs_horario += "Lunes a Domingo \n \n ";
    mjs_horario += "7:00 a 22:00 horas \n \n ";
    mjs_horario += "Te invitamos a ingresar a https://miclaro.com.ni/ disponible 24/7 para que puedas hacer tus autogestiones. \n \n ";
    mjs_horario += "¡Claro que sí! ";
    
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

var msj_opcion = {
	"opcion_1" : {
		"action" : {
			"type" : "transfer",
			"queue" : colas["1"].acd
		},
		"messages" : []
	},
	"opcion_2" : {
		"action" : {
			"type" : "transfer",
			"queue" : colas["2"].acd
		},
		"messages" : []
	}
}

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
    "type" : "end", // "transfer",
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

exports.msj_default = msj_default;

exports.mjs_horario = mjs_horario;

exports.msj_opcion = msj_opcion;

exports.msj_fuera_horario = msj_fuera_horario;

exports.contenedor = contenedor;

exports.colas = colas;