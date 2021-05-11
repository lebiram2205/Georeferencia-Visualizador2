const express = require('express');
const app = express.Router();
//vamos a utilizarlo como nuestra api rest enviar y recibir datos en formato json
//app.use(express.static(__dirname+'semaforos_iztapalapa.json'));

const incidencia = require('../controllers/incidencias.controller');
app.get('/trafico', incidencia.gettrafico);
app.post('/trafico', incidencia.posttrafico);
app.get('/', incidencia.gettraficoById);

//Consultas implementadas para el formulario
app.get('/trafico/cities', incidencia.getCities);
app.get('/trafico/jams/:fecha/:ciudad', incidencia.getJams);
app.get('/trafico/jams/:fecha', incidencia.getAllJams);

app.get('/traffic/tipos', incidencia.incidenciaTipos);

app.get('/traffic', incidencia.getTraffic);
app.get('/semaforoizt', incidencia.semaforoIzt);
app.get('/semaforoizc', incidencia.semaforoIzc);
app.get('/semaforomh', incidencia.semaforoMh);
app.get('/callescerradas', incidencia.calleCerrada);
app.get('/roadclosed', incidencia.roadClose);
app.get('/alcaldias', incidencia.alcaldia);
app.get('/incidencias', incidencia.incidencia);
app.get('/traficoDenso', incidencia.diaTrafico);
module.exports = app;