const express = require('express');
const app=express.Router();
//vamos a utilizarlo como nuestra api rest enviar y recibir datos en formato json
//app.use(express.static(__dirname+'semaforos_iztapalapa.json'));

const incidencia = require('../controllers/incidencias.controller');
app.get('/trafico',incidencia.gettrafico);
app.post('/trafico', incidencia.posttrafico);

//aquí va el nombre de la variable de fecha
//app.get('/trafico/:startTime',incidencia.getUnJson);
app.get('/trafico/:variable',incidencia.consultas);

app.get('/traffic', incidencia.getTraffic );
app.get('/semaforoizt', incidencia.semaforoIzt  );
app.get('/semaforoizc', incidencia.semaforoIzc );
app.get('/semaforomh', incidencia.semaforoMh );
app.get('/callescerradas', incidencia.calleCerrada  );
app.get('/roadclosed', incidencia.roadClose );
app.get('/alcaldias', incidencia.alcaldia);
app.get('/incidencias', incidencia.incidencia );

module.exports=app;