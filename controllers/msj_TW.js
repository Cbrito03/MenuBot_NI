var colas = {
  "1" : "NI_TW_DM_Ventas",
  "2" : "NI_TW_DM_SAC"
};

var mensaje_df = "¡Hola! $cr Soy *Avi*, tu asistente virtual 🤖 de Claro, ";
	mensaje_df +="¡Échale un vistazo a mi nuevo menú de opciones con las que te puedo apoyar más rápido!  $cr $cr ";
	mensaje_df +="Ingresa el número de la opción con la que necesitas apoyo.  $cr $cr ";
	mensaje_df +="1. Ventas y Renovaciones $cr ";
	mensaje_df +="2. Servicio al Cliente $cr ";


var mjs_horario = "¡Hola, gracias por comunicarte a Claro, te informamos nuestros horarios de atención! $cr $cr $cr ";
    mjs_horario += "⌚Facebook y Twitter $cr $cr ";
    mjs_horario += "Lunes a Domingo $cr $cr ";
    mjs_horario += "7:00 a 22:00 horas $cr $cr ";
    mjs_horario += "Te invitamos a ingresar a https://miclaro.com.ni/ disponible 24/7 para que puedas hacer tus autogestiones. $cr $cr ";
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
			"queue" : colas["1"]
		},
		"messages" : []
	},
	"opcion_2" : {
		"action" : {
			"type" : "transfer",
			"queue" : colas["2"]
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

exports.msj_default = msj_default;

exports.mjs_horario = mjs_horario;

exports.msj_opcion = msj_opcion;

exports.msj_fuera_horario = msj_fuera_horario;

exports.contenedor = contenedor;

exports.colas = colas;