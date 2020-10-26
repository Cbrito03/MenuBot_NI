const local_storage = require('../controllers/local_storage.js');
const horario = require('../controllers/validar_horario.js');
const moment_timezone = require('moment-timezone');
const msj_fb = require('../controllers/msj_FB.js');
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

router.post('/fb/message', async (req, res) => {

  console.log("[Brito] :: [Peticion POST NI /fb/message]");
  
  var horarios = horario.validarHorario_FB();
  var resultado, result_messages, result_action;
  var bandera = false, estatus = 200;
  var msj_buscar = "", msj_buscar_opcion = "", opcion = "";
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
        "text" :  msj_fb.mjs_horario,
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
                console.log("getStorage('clave_FB_'+conversationID) " + getStorage('clave_FB_'+conversationID));
                
                if(getStorage('clave_FB_'+conversationID) !== null)
                {
                  console.log('Hay dato');

                  cadena = cadena.text.toLowerCase();
                  cadena = cadena.trim();
                  msj_buscar_opcion = cadena;
                  cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,"");
                  cadena = cadena.split(" ");

                  for(var i = 0; i < cadena.length; i++)
                  {
                    for(var atr in msj_fb.palabras)
                    {
                      if(cadena[i] === "factura"){ localStorage.removeItem("msj_"+conversationID);}

                      if(atr.toLowerCase() === cadena[i])
                      {
                        localStorage.removeItem("msj_"+conversationID);
                        opcion = cadena[i];
                        //msj_buscar = cadena[i];
                        if(msj_fb.palabras[atr].action.queue === "" && msj_fb.palabras[atr].action.type !== "transfer")
                        {
                          result_action = msj_fb.palabras[atr].action;
                          result_messages = msj_fb.palabras[atr].messages;
                        }
                        else if(msj_fb.palabras[atr].action.queue !== "" && msj_fb.palabras[atr].action.type === "transfer")
                        {
                          if(horarios)
                          {
                            result_action = msj_fb.palabras[atr].action;
                            result_messages = msj_fb.palabras[atr].messages;                        
                            bandera_tranferido = true;                    
                          }
                          else
                          { 
                            console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);                       
                            msj_fuera_horario["action"].queue = msj_fb.colas[atr].fh;
                            result_messages = msj_fuera_horario.messages;
                            result_action = msj_fuera_horario.action;
                            bandera_fueraHorario = true;                                                                
                          }
                        }
                        
                        bandera = true;
                        bandera_opt = true;
                        break;
                      }
                    }      
                    if(bandera){ break; }
                  }

                  console.log("[Brito] :: [message] :: [msj_buscar_opcion] :: " + msj_buscar_opcion);

                  if(localStorage.getItem("msj_"+conversationID) == null) // No existe
                  {
                    console.log('Crea Storage :: ' + localStorage.getItem("msj_"+conversationID));

                    if( msj_buscar_opcion == "factura")
                    {
                      console.log("[Brito] :: [message] :: [Se crea LocalStrogae para factura] :: " + msj_buscar_opcion);
                      localStorage.setItem("msj_"+conversationID, msj_buscar_opcion);
                      console.log('[Brito] :: [message] ::', localStorage.getItem("msj_"+conversationID));
                    }
                    else if(!bandera)
                    {

                      console.log('[Azul] :: if ::' + bandera);
                      result_messages = msj_fb.msj_default.messages;
                      result_action = msj_fb.msj_default.action;
                    }          
                  }
                  else // esite localStorage
                  {
                    console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));
                    
                    var msj_storage = localStorage.getItem("msj_"+conversationID);

                    console.log('[Brito] :: [message] :: [msj_storage] :: ' + msj_storage + ' :: [msj_buscar_opcion] :: ' + msj_buscar_opcion);

                    if(msj_storage == "factura"  && msj_buscar_opcion == "asesor")
                    {
                      opcion = msj_storage + " - asesor";
                      
                      localStorage.removeItem("msj_"+conversationID);

                      if(horarios)
                      {
                        result_messages = msj_fb.msj_factura_asesor.messages;
                        result_action = msj_fb.msj_factura_asesor.action;                   
                        bandera_tranferido = true;                    
                      }
                      else
                      { 
                        console.log("[Brito] :: [No cumple horario Factura] :: [horarios] :: "+horarios);
                        msj_fuera_horario["action"].queue = msj_fb.colas[msj_storage].fh;                             
                        result_messages = msj_fuera_horario.messages;
                        result_action = msj_fuera_horario.action;
                        bandera_fueraHorario = true;                                                                
                      }

                      bandera = true;
                      bandera_opt = true;                   
                    }
                    else
                    {
                      if(!bandera)
                      {
                        result_messages = msj_fb.msj_default.messages;
                        result_action = msj_fb.msj_default.action;
                      }
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
                      "rrss" : "FB",
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
                  else
                  {
                    console.log("[Brito] :: [bandera] :: ", bandera);  
                    if(localStorage.getItem("msj_"+conversationID) !== "NOK")
                    {
                      console.log("[Brito] :: [bandera] :: ",bandera, " :: [IF] :: ",localStorage.getItem("msj_"+conversationID) );
                      localStorage.removeItem("msj_"+conversationID);
                      localStorage.setItem("msj_"+conversationID, "NOK");
                      result_messages = msj_fb.msj_default.messages;
                      result_action = msj_fb.msj_default.action;
                      console.log("[Brito] :: [bandera] :: ",bandera, " :: [IF] :: [Se crea local para msj alterno]:: ",localStorage.getItem("msj_"+conversationID) );
                    }
                    else if(localStorage.getItem("msj_"+conversationID) === "NOK")
                    {
                      console.log("[Brito] :: [bandera] :: ",bandera, " :: [ELSE] :: ",localStorage.getItem("msj_"+conversationID) );
                      result_messages = msj_fb.msj_no_opcion.messages;
                      result_action = msj_fb.msj_no_opcion.action;
                    }             
                    //localStorage.removeItem("msj_"+conversationID);
                  }

                  console.log("[Brito] :: [channel] :: ", channel, " :: [opcion] :: ", opcion);
                  
                  removeStorage('clave_FB_'+conversationID);
                  
                  if( result_action.type === "continue")
                  {
                    setStorage('clave_FB_'+conversationID, 'valor_'+conversationID);
                  }

                  resultado = {
                    "context": context,
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
                  console.log('NO Hay dato y se crea local storage');
                  setStorage('clave_FB_'+conversationID, 'valor_'+conversationID);

                  result_messages = msj_fb.msj_default.messages;
                  result_action = msj_fb.msj_default.action;

                  resultado = {
                    "context": context,
                    "action": result_action,
                    "messages": result_messages,
                    "additionalInfo": {
                      "key":"RUT",
                      "RUT":"1-9"
                    }
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