const local_storage = require('../controllers/local_storage.js');
const horario = require('../controllers/validar_horario.js');
const moment_timezone = require('moment-timezone');
const msj_tw = require('../controllers/msj_TW.js');
const config = require('../controllers/config.js');
const localStorage = require('localStorage');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const async = require('async');

const router = express.Router();

const setStorage = local_storage.setStorage;
const getStorage = local_storage.getStorage;
const removeStorage = local_storage.removeStorage;

router.post('/tw/message', async (req, res) => {
  
  console.log("[Brito] :: [Peticion POST NI /tw/message]");
  
  var horarios = horario.validarHorario_TW();

  var resultado, result_messages, result_action;
  var bandera = false , estatus = 200;
  var opcion = "", msj_buscar_opcion = "";
  var bandera_tranferido = false, bandera_fueraHorario = false, bandera_opt = false;

  var apiVersion = req.body.apiVersion;
  var conversationID = req.body.conversationId;
  var authToken = req.body.authToken;
  var channel = req.body.channel;
  var user = req.body.user;
  var context = req.body.context;
  var cadena = req.body.message;

  var bandera_TIMEOUT = false;

  var now = moment();
  var fechaStamp = moment(context.lastInteractionFinishTime).format("YYYY-MM-DD HH:mm:ss");
  var fecha_actual = now.tz("America/Costa_Rica").format("YYYY-MM-DD HH:mm:ss");
  var fecha2 = moment(fecha_actual, "YYYY-MM-DD HH:mm:ss");

  console.log("fechaStamp :: " + fechaStamp);

  var diff = fecha2.diff(fechaStamp, 'h'); 
  console.log("diff :: " + diff);
  console.log(typeof diff);

  var msj_fuera_horario =
  {
    "action" : {
      "type" : "transfer",
      "queue" : ""
    },
    "messages" : [
      {
        "type" : "text",
        "text" :  msj_tw.mjs_horario,
        "mediaURL" : ""
      }
    ]
  };

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
              if(context.lastInteractionFinishType !== "CLIENT_TIMEOUT")
              {             
                bandera_TIMEOUT = true;
              }             
              else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT" && diff <= 24)
              {
                bandera_TIMEOUT = false;
              }
              else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT" && diff > 24)
              {
                bandera_TIMEOUT = true;
              }

              if(bandera_TIMEOUT)
              {
                cadena = cadena.text.toLowerCase(); // minusculas
                cadena = cadena.trim();
                cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
                msj_buscar_opcion = cadena;                   

                console.log("[Brito] :: [message] :: [msj_buscar_opcion] :: " + msj_buscar_opcion);

                if(localStorage.getItem("msj_"+conversationID) == null) // No existe
                {
                  console.log('Crea Storage :: ' + localStorage.getItem("msj_"+conversationID));
                  
                  console.log("[Brito] :: [message] :: [Se crea LocalStrogae] :: [twitter]");

                  localStorage.setItem("msj_"+conversationID, "twitter");

                  result_messages = msj_tw.msj_default.messages;

                  result_action = msj_tw.msj_default.action;

                  // bandera = true;

                  console.log('[Brito] :: [message] :: [Valor del LocalStrogae] :: ', localStorage.getItem("msj_"+conversationID));
                }
                else // existe localStorage
                {
                  console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));

                  if(msj_buscar_opcion == "1"  && localStorage.getItem("msj_"+conversationID) == "twitter")
                  {
                    console.log("[Brito] :: [message] :: [Entro a opción 1] :: " + msj_buscar_opcion + " :: " + localStorage.getItem("msj_"+conversationID));
                    
                    localStorage.removeItem("msj_"+conversationID);

                    opcion = "Ventas y Renovaciones";

                    if(horarios)
                    {
                      result_messages = msj_tw.msj_opcion["opcion_1"].messages;

                      result_action = msj_tw.msj_opcion["opcion_1"].action;
                      
                      bandera_tranferido = true;                    
                    }
                    else
                    { 
                      console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);

                      localStorage.removeItem("msj_"+conversationID);

                      msj_fuera_horario["action"].queue = msj_tw.colas["1"].fh;
                      
                      result_messages = msj_fuera_horario.messages;

                      result_action = msj_fuera_horario.action;

                      bandera_fueraHorario = true;                                                                
                    }

                    bandera = true;
                    bandera_opt = true;                               
                  }
                  else if(msj_buscar_opcion == "2"  && localStorage.getItem("msj_"+conversationID) == "twitter")
                  {
                    console.log("[Brito] :: [message] :: [Entro a opción 2] :: " + msj_buscar_opcion + " :: " + localStorage.getItem("msj_"+conversationID));
                    
                    localStorage.removeItem("msj_"+conversationID);

                    opcion = "Servicio al Cliente";

                    if(horarios)
                    {
                      result_messages = msj_tw.msj_opcion["opcion_2"].messages;

                      result_action = msj_tw.msj_opcion["opcion_2"].action;
                      
                      bandera_tranferido = true;                    
                    }
                    else
                    { 
                      console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);

                      localStorage.removeItem("msj_"+conversationID);

                      msj_fuera_horario["action"].queue = msj_tw.colas["2"].fh;
                      
                      result_messages = msj_fuera_horario.messages;

                      result_action = msj_fuera_horario.action;

                      bandera_fueraHorario = true;                                                                
                    }

                    bandera = true;
                    bandera_opt = true;
                  }                 
                  else
                  {
                    localStorage.removeItem("msj_"+conversationID);

                    result_messages = msj_tw.msj_default.messages;

                    result_action = msj_tw.msj_default.action;
                  }
                }

                var options = {
                  method : 'post',
                  url : config.url_estd,
                  headers : { 'Content-Type': 'application/json'},
                  data: JSON.stringify({
                    "conversacion_id" : conversationID,
                    "pais" : config.info.pais,
                    "app" : config.info.nomApp,
                    "opcion" : opcion,
                    "rrss" : "TW",
                    "transferencia" : bandera_tranferido,
                    "fueraHorario" : bandera_fueraHorario,
                    "grupoACD" : result_action.queue        
                  })
                };          

                if(bandera == true)
                {
                  if(bandera_opt)
                  {
                    console.log(options);
                    var resultado_axios = await axios(options);
                    console.log("[Resultado AXIOS] :: ");
                    console.log(resultado_axios);
                  }                 
                }
                //else{result = msj_dafault; localStorage.removeItem("msj_"+conversationID);}

                console.log("[Brito] :: [channel] :: ", channel, " :: [opcion] :: ", opcion);

                resultado = {
                  "context":context,
                  "action": result_action,
                  "messages": result_messages,
                  "additionalInfo": {
                    "key":"RUT",
                    "RUT":"1-9"
                  }
                }
              }
              else
              {
                resultado = {
                  "context": context,
                  "action": {
                    "type" : "transfer",
                    "queue" : context.lastInteractionQueue,
                  },
                  "messages": [],
                  "additionalInfo": {
                    "key":"RUT",
                    "RUT":"1-9"
                  }
                }
              }

              console.log("[Brito] :: [RESULTADO] :: [resultado] :: ", resultado);
              console.log("[Brito] :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: [Brito]");
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


module.exports = router