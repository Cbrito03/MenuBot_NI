var info = 
{
  "pais" : "NI",
  "nomApp" : "MenuBot_NI",
  "version" : "1.0.0"
};

var horario_WA = {
  "OPEN_HOUR" : 7,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 22,
  "CLOSE_MINUTE" : 0,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

var horario_FB = {
  "OPEN_HOUR" : 8,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 20,
  "CLOSE_MINUTE" : 0,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

var horario_TW = {
  "OPEN_HOUR" : 8,
  "OPEN_MINUTE" : 0,
  "CLOSE_HOUR" : 20,
  "CLOSE_MINUTE" : 0,
  dias : {
    "0" : ["domingo",true],
    "1" : ["lunes",true],
    "2" : ["martes",true],
    "3" : ["miercoles",true],
    "4" : ["jeves",true],
    "5" : ["viernes",true],
    "6" : ["sabado",true]
  }
};

exports.horario_WA = horario_WA;
exports.horario_FB = horario_FB;
exports.horario_TW = horario_TW;
exports.info = info;