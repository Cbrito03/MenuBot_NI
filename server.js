var express = require('express')
var http = require('http')
var app = express()
var request = require('request')
var async = require('async')
var bodyParser = require('body-parser');
var localStorage = require('localStorage');
let fs = require('fs');
var util = require('util');
var config = require('./controllers/config.js');
var msj_wa = require('./controllers/msj_WA.js');
var msj_fb = require('./controllers/msj_FB.js');
var msj_tw = require('./controllers/msj_TW.js');
var horario = require('./controllers/validar_horario.js');
var local_storage = require('./controllers/local_storage.js');
var moment = require('moment');
var moment_timezone = require('moment-timezone');
var port = 8080;

const setStorage = local_storage.setStorage;
const getStorage = local_storage.getStorage;
const removeStorage = local_storage.removeStorage;

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

app.post('/wa/message', (req, res) => {
	console.log("[Brito] :: [Peticion POST NI /wa/message]");
	
	var horarios = horario.validarHorario_WA();

	var resultado;
	var bandera = false , estatus = 200;
	var opcion = "", msj_buscar = "", msj_buscar_opcion = "";

	var result_messages, result_action;

	var apiVersion = req.body.apiVersion;
	var conversationID = req.body.conversationId;
	var authToken = req.body.authToken;
	var channel = req.body.channel;
	var user = req.body.user;
	var context = req.body.context;
	var cadena = req.body.message;

	var bandera_tranferido = false;
	var bandera_fueraHorario = false;
	var bandera_opt = false;

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
								cadena = cadena.text.toLowerCase(); // minusculas
								cadena = cadena.trim();
								cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
								msj_buscar_opcion = cadena;										

								console.log("[Brito] :: [message] :: [msj_buscar_opcion] :: " + msj_buscar_opcion);

								if(localStorage.getItem("msj_"+conversationID) == null) // No existe
								{
									console.log('Crea Storage :: ' + localStorage.getItem("msj_"+conversationID));
									
									console.log("[Brito] :: [message] :: [Se crea LocalStrogae] :: [whatsapp]");

									localStorage.setItem("msj_"+conversationID, "whatsapp");

									result_messages = msj_wa.msj_default.messages;

									result_action = msj_wa.msj_default.action;

									// bandera = true;

									console.log('[Brito] :: [message] :: [Valor del LocalStrogae] :: ', localStorage.getItem("msj_"+conversationID));
								}
								else // existe localStorage
								{
									console.log('[Brito] :: [message] :: [Borra Storage] :: ' + localStorage.getItem("msj_"+conversationID));

									if(msj_buscar_opcion == "1"  && localStorage.getItem("msj_"+conversationID) == "whatsapp")
									{
										console.log("[Brito] :: [message] :: [Entro a opción 1] :: " + msj_buscar_opcion + " :: " + localStorage.getItem("msj_"+conversationID));
										
										localStorage.removeItem("msj_"+conversationID);

										opcion = "Servicio al Cliente - " + msj_buscar_opcion;

										if(horarios)
										{
											result_messages = msj_wa.msj_opcion["opcion_1"].messages;

											result_action = msj_wa.msj_opcion["opcion_1"].action;
											
											bandera_tranferido = true;										
										}
										else
										{	
											console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);

											localStorage.removeItem("msj_"+conversationID);
											
											result_messages = msj_wa.msj_fuera_horario.messages;

											result_action = msj_wa.msj_fuera_horario.action;

											bandera_fueraHorario = true;				                        				                        
										}

										bandera = true;
										bandera_opt = true;																
									}
									else if(msj_buscar_opcion == "2"  && localStorage.getItem("msj_"+conversationID) == "whatsapp")
									{
										console.log("[Brito] :: [message] :: [Entro a opción 2] :: " + msj_buscar_opcion + " :: " + localStorage.getItem("msj_"+conversationID));
										
										localStorage.removeItem("msj_"+conversationID);

										opcion = "Ventas - " + msj_buscar_opcion;

										if(horarios)
										{
											result_messages = msj_wa.msj_opcion["opcion_2"].messages;

											result_action = msj_wa.msj_opcion["opcion_2"].action;
											
											bandera_tranferido = true;										
										}
										else
										{	
											console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);

											localStorage.removeItem("msj_"+conversationID);
											
											result_messages = msj_wa.msj_fuera_horario.messages;

											result_action = msj_wa.msj_fuera_horario.action;

											bandera_fueraHorario = true;				                        				                        
										}

										bandera = true;
										bandera_opt = true;
									}
									else if(msj_buscar_opcion == "3"  && localStorage.getItem("msj_"+conversationID) == "whatsapp")
									{
										console.log("[Brito] :: [message] :: [Entro a opción 3] :: " + msj_buscar_opcion + " :: " + localStorage.getItem("msj_"+conversationID));
										
										localStorage.removeItem("msj_"+conversationID);

										opcion = "Atención a Empresas - " + msj_buscar_opcion;

										if(horarios)
										{
											result_messages = msj_wa.msj_opcion["opcion_3"].messages;

											result_action = msj_wa.msj_opcion["opcion_3"].action;
											
											bandera_tranferido = true;										
										}
										else
										{	
											console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);

											localStorage.removeItem("msj_"+conversationID);
											
											result_messages = msj_wa.msj_fuera_horario.messages;

											result_action = msj_wa.msj_fuera_horario.action;

											bandera_fueraHorario = true;				                        				                        
										}

										bandera = true;
										bandera_opt = true;
									}
									else
									{
										localStorage.removeItem("msj_"+conversationID);

										result_messages = msj_wa.msj_default.messages;

										result_action = msj_wa.msj_default.action;
									}
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
										"pais": config.info.pais,
										"app": config.info.nomApp,
										"opcion": opcion,
										"transferencia": bandera_tranferido,
										"fueraHorario": bandera_fueraHorario,
										"grupoACD": result_action.queue
									})
								};           

								if(bandera == true)
								{
									if(bandera_opt)
									{
										console.log(options);
										request(options, function (error, response)
										{ 
											if (error) throw new Error(error);
											console.log(response.body);
										});
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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

app.post('/tw/message', (req, res) => {

	console.log("[Brito] :: [Peticion POST NI /tw/message]");
	
	var horarios = horario.validarHorario_TW();
	var resultado;
	var bandera = false , estatus = 200;
	var msj_buscar = "", msj_buscar_opcion = "";

	var result_messages, result_action;

	var apiVersion = req.body.apiVersion;
	var conversationID = req.body.conversationId;
	var authToken = req.body.authToken;
	var channel = req.body.channel;
	var user = req.body.user;
	var context = req.body.context;
	var cadena = req.body.message;

	var bandera_tranferido = false;
	var bandera_fueraHorario = false;
	var opcion = "";
	var bandera_opt = false;

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
								console.log("getStorage('clave_FB_'+conversationID) " + getStorage('clave_FB_'+conversationID));

								if(getStorage('clave_TW_'+conversationID) !== null)
								{
									cadena = cadena.text.toLowerCase(); // minusculas
									cadena = cadena.trim();
									msj_buscar_opcion = cadena;
									cadena = cadena.replace(/,/g,"").replace(/;/g,"").replace(/:/g,"").replace(/\./g,""); // borramos ,;.:
									cadena = cadena.split(" "); // lo convertimo en array mediante los espacios

									for(var i = 0; i < cadena.length; i++)
									{
										for(var atr in msj_tw.palabras)
										{
											if(cadena[i] === "factura"){ localStorage.removeItem("msj_"+conversationID);}

											if(atr.toLowerCase() === cadena[i])
											{
												localStorage.removeItem("msj_"+conversationID);
												opcion = cadena[i];
												//msj_buscar = cadena[i];
												if(msj_tw.palabras[atr].action.queue === "" && msj_tw.palabras[atr].action.type !== "transfer")
												{
													result_action = msj_tw.palabras[atr].action;
													result_messages = msj_tw.palabras[atr].messages;
												}
												else if(msj_tw.palabras[atr].action.queue !== "" && msj_tw.palabras[atr].action.type === "transfer")
												{
													if(horarios)
													{
														result_action = msj_tw.palabras[atr].action;
														result_messages = msj_tw.palabras[atr].messages;												
														bandera_tranferido = true;										
													}
													else
													{	
														console.log("[Brito] :: [No cumple horario] :: [horarios] :: "+horarios);												
														
														result_messages = msj_tw.msj_fuera_horario.messages;
														result_action = msj_tw.msj_fuera_horario.action;
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

									if(localStorage.getItem("msj_"+conversationID) == null) // No existe localStorage
									{								

										if( msj_buscar_opcion == "factura")
										{									
											console.log("[Brito] :: [message] :: [Se crea LocalStrogae para factura] :: " + msj_buscar_opcion);
											localStorage.setItem("msj_"+conversationID, msj_buscar_opcion);
											console.log('Crea Storage :: ' + localStorage.getItem("msj_"+conversationID));
										}
										else if(!bandera)
										{
											result_messages = msj_tw.msj_default.messages;
											result_action = msj_tw.msj_default.action;
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
												result_messages = msj_tw.msj_factura_asesor.messages;
												result_action = msj_tw.msj_factura_asesor.action;										
												bandera_tranferido = true;										
											}
											else
											{	
												console.log("[Brito] :: [No cumple horario Factura] :: [horarios] :: "+horarios);			                        
												result_messages = msj_tw.msj_fuera_horario.messages;
												result_action = msj_tw.msj_fuera_horario.action;
												bandera_fueraHorario = true;				                        				                        
											}

											bandera = true;
											bandera_opt = true;										
										}								
										else
										{
											if(!bandera)
											{
												result_messages = msj_tw.msj_default.messages;
												result_action = msj_tw.msj_default.action;
											}
										}
									}

									console.log('[Azul] :: [bandera]' + bandera);

									var options = {
										'method': 'POST',
										'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
										'headers': {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify(
										{
											"conversacion_id": conversationID,
											"pais": config.info.pais,
											"app": config.info.nomApp,
											"opcion": opcion,
											"transferencia": bandera_tranferido,
											"fueraHorario": bandera_fueraHorario,
											"grupoACD": result_action.queue
										})
									};           

									if(bandera == true)
									{
										if(bandera_opt)
										{
											console.log(options);
											request(options, function (error, response)
											{ 
												if (error) throw new Error(error);
												console.log(response.body);
											});
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
											result_messages = msj_tw.msj_default.messages;
											result_action = msj_tw.msj_default.action;
											console.log("[Brito] :: [bandera] :: ",bandera, " :: [IF] :: [Se crea local para msj alterno]:: ",localStorage.getItem("msj_"+conversationID) );
										}
										else if(localStorage.getItem("msj_"+conversationID) === "NOK")
										{
											console.log("[Brito] :: [bandera] :: ",bandera, " :: [ELSE] :: ",localStorage.getItem("msj_"+conversationID) );
											result_messages = msj_tw.msj_no_opcion.messages;
											result_action = msj_tw.msj_no_opcion.action;
										}							
										//localStorage.removeItem("msj_"+conversationID);
									}

									console.log("[Brito] :: [channel] :: ", channel, " :: [opcion] :: ", opcion);
									
									
									removeStorage('clave_tW_'+conversationID);
									
									if( result_action.type === "continue")
									{
										setStorage('clave_tW_'+conversationID, 'valor_'+conversationID);
									}

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
									console.log('NO Hay dato TW y se crea local storage');
									setStorage('clave_tW_'+conversationID, 'valor_'+conversationID);

									result_messages = msj_tw.msj_default.messages;
									result_action = msj_tw.msj_default.action;

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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

app.post('/fb/message', (req, res) => {

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
														
														result_messages = msj_fb.msj_fuera_horario.messages;
														result_action = msj_fb.msj_fuera_horario.action;
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
												result_messages = msj_fb.msj_fuera_horario.messages;
												result_action = msj_fb.msj_fuera_horario.action;
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
										'method': 'POST',
										'url': 'https://estadisticasmenubot.mybluemix.net/opcion/insert',
										'headers': {
											'Content-Type': 'application/json'
										},
										body: JSON.stringify(
										{
											"conversacion_id": conversationID,
											"pais": config.info.pais,
											"app": config.info.nomApp,
											"opcion": opcion,
											"transferencia": bandera_tranferido,
											"fueraHorario": bandera_fueraHorario,
											"grupoACD": result_action.queue
										})
									};           

									if(bandera == true)
									{
										if(bandera_opt)
										{
											console.log(options);
											request(options, function (error, response)
											{ 
												if (error) throw new Error(error);
												console.log(response.body);
											});
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
							else if(context.lastInteractionFinishType == "CLIENT_TIMEOUT")
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

app.post('/terminate', (req, res) => {
	var result, resultado;
	var bandera = false , estatus = 200;

	var conversationID = req.body.conversationId;
	var RRSS = req.body.RRSS;
	var canal = req.body.channel;
	var contexto = req.body.context;

	if(RRSS !== '' && typeof RRSS !== "undefined") 
	{
	    if(canal !== '' && typeof canal !== "undefined") 
	    {
	      if(contexto !== '' && typeof contexto !== "undefined") 
	      {
	        estatus = 200;
	        resultado = {
	          "estado": "OK"
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
	        "estado": "El valor de canal es requerido"
	      }
	    } 
	}
	else
	{
		estatus = 400;
	    resultado = {
	      "estado": "El valor de RRSS es requerido"
	    }
	} 

  res.status(estatus).json(resultado);
});

app.get('/', (req, res) => {
	var horario_WA = horario.validarHorario_WA();
	var horario_FB = horario.validarHorario_FB();
	var horario_TW = horario.validarHorario_TW();

	var now = moment();
	var fecha_actual = now.tz("America/Guatemala").format("YYYY-MM-DD HH:mm:ss");
	var anio = now.tz("America/Guatemala").format("YYYY");

	var respuesta = "Bienvenido al menú Bot de <strong>Nicaragua</strong>, las opciones disponibles son: <br>";
		respuesta += '<ul> <li> <strong> WhastApp: "/wa/message" </strong> </li>';
		respuesta += '<li> <strong> Facebbok MSS: "/fb/message" </strong> </li>';
		respuesta += '<li> <strong> Twitter DM: "/tw/message" </strong> </li> </ul>';
		respuesta += "Horario de atención para <strong>WhastApp</strong> es: <br> ";
		respuesta += "Hora inicio: " + config.horario_WA.OPEN_HOUR + " - Hora Fin: " + config.horario_WA.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_WA + " <br> <br> ";
		respuesta += "Horario de atención para <strong>Facebook Messenger</strong> es: <br> ";		
		respuesta += "Hora inicio: " + config.horario_FB.OPEN_HOUR + " - Hora Fin: " + config.horario_FB.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_FB + " <br> <br> ";
		respuesta += "Horario de atención para <strong>Twitter DM</strong> es: <br> ";		
		respuesta += "Hora inicio: " + config.horario_TW.OPEN_HOUR + " - Hora Fin: " + config.horario_TW.CLOSE_HOUR + " <br> ";
		respuesta += "Respuesta del Horario: " + horario_TW + " <br> <br> ";
		respuesta += "Hora actual de <strong>Nicaragua</strong>:  " + fecha_actual +" <br>";
		respuesta += "<strong> Sixbell "+anio+" - Versión: "+config.info.version+" </strong><br>";

	res.status(200).send(respuesta);
});

http.createServer(app).listen(port, () => {
	console.log('Server started at http://localhost:' + port);
});
