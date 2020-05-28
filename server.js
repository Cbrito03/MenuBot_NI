var express = require('express')
var http = require('http')
var app = express()
var request = require('request')
var async = require('async')
var bodyParser = require('body-parser');
var localStorage = require('localStorage')
let fs = require('fs');
var util = require('util');
var config = require('./config.js');
var horario = require('./controllers/validar_horario.js');
var port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static('img'));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

var palabras = config.palabras;
var msj_default = config.msj_default;
var menu_opciones = config.menu_opciones;
var mjs_horario = config.mjs_horario;
var contenedor = config.contenedor;

var pais = config.pais;
var nomApp = config.nomApp;

app.post('/message', (req, res) => {
  config.obtener_fecha();

  console.log("[Brito] :: [message] :: [Peticion POST]");

  var horarios = horario.validarHorario(config.OPEN_HOUR, config.OPEN_MINUTE, config.CLOSE_HOUR, config.CLOSE_MINUTE);
  
  var result, resultado;
  var bandera = false , estatus = 200 , menu_dos = 0;
  var msj_buscar = "", msj_buscar_opcion = "";

  var apiVersion = req.body.apiVersion;
  var conversationID = req.body.conversationId;
  var authToken = req.body.authToken;
  //var RRSS = req.body.RRSS;
  var channel = req.body.channel;
  var user = req.body.user;
  var context = req.body.context;
  var cadena = req.body.message;
  var bandera_asesor = false;

  var bandera_tranferido = false;
  var bandera_fueraHorario = false;
  var nom_grupoACD = "";
  var opcion = "";
  var bandera_opt = true;

  if(apiVersion !== '' && typeof apiVersion !== "undefined")
  {
    if(authToken !== '' && typeof authToken !== "undefined")
    {
      if(channel !== '' && typeof channel !== "undefined")
      {
        if(user !== '' && typeof user !== "undefined")
        {
          if(context !== '' && typeof context !== "undefined")
          {
            if(cadena !== '' && typeof cadena !== "undefined")
            {
              opcion = "Default_NI";

              if(horarios)
              {
                console.log("[Brito] :: [Cumple horario habil] :: [horarios] :: " + horarios); 
                result = msj_default;
                nom_grupoACD = obtener_ACD(channel);
                bandera_tranferido = true;
              }
              else
              {
                console.log("[Brito] :: [No cumple horario habil] :: [horarios] :: " + horarios);                    
                contenedor.type = "text";
                contenedor.accion = "end";
                contenedor.queue = "";
                contenedor.mensaje = mjs_horario;
                result = contenedor;
                bandera_fueraHorario = true;
              }

              var options = {
                'method': 'POST',
                'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
                'headers': {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                  "conversacion_id": conversationID,
                  "pais": pais,
                  "app": nomApp,
                  "opcion": opcion,
                  "transferencia": bandera_tranferido,
                  "fueraHorario": bandera_fueraHorario,
                  "grupoACD": nom_grupoACD
                })
              };

              console.log(options);
              request(options, function (error, response)
              { 
                if (error) throw new Error(error);
                console.log(response.body);
              });
              

              estatus = 200;

              resultado = {
                "context":{
                  "agent":false,
                  "callback":false,
                  "video":false
                },
                "action":{
                  "type": result.accion,
                  "queue": nom_grupoACD
                },
                "messages":[
                  {
                    "type": result.type,
                    "text": result.mensaje,
                    "mediaURL": result.mediaURL
                  }
                ],
                "additionalInfo": {
                  "key":"RUT",
                  "RUT":"1-9"
                }
              }
            }
            else
            {
              estatus = 400;
              resultado = {
                "estado": "El valor de mensaje es requerido"
              }
            }
          }
          else
          {
            estatus = 400;
            resultado = {
              "estado": "El valor de contexto es requerido"
            }
          }
        }
        else
        {
          estatus = 400;
          resultado = {
            "estado": "El valor de user es requerido"
          }
        }
      }
      else
      {
        estatus = 400;
        resultado = {
          "estado": "El valor de channel es requerido"
        }
      }
    }
    else
    {
      estatus = 400;
      resultado = {
        "estado": "El valor de authToken es requerido"
      }
    }
  }
  else
  {
    estatus = 400;
    resultado = {
      "estado": "El valor de apiVersion es requerido"
    }
  }

  res.status(estatus).json(resultado);
});

function obtener_ACD(rs)
{
  switch (rs)
  {
    case "messenger":
      return config.cola_opc1_FB; // NI_FB_MSS_SAC      
    break;
    case "twitterDM":      
      return config.cola_opc1_TW; // NI_TW_DM_SAC      
    break;
    default:
      return config.cola_opc1_FB;
    break;
  }
}

app.get('/', (req, res) => {
  var d = new Date();
  var offset = config.offset;
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  var nd = new Date(utc + (3600000*offset));

  var respuesta = "Bienvenido al menú Bot de <strong>Nicaragua</strong>, las opciones disponibles son:   <strong>/message</strong> <br> ";
  respuesta += " <strong>Sixbell</strong> "+ nd.getFullYear() +" - Versión: 1.0.0 <br>";
  res.status(200).send(respuesta);
})

http.createServer(app).listen(port, () => {
  console.log('Server started at http://localhost:' + port);
});
