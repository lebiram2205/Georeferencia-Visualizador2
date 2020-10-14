
const express = require("express");
const morgan = require("morgan");
const cors= require("cors");
const bodyParser = require('body-parser'); //cargar objeto bodyParser
const app = express();
//Conexion a la base de datos
const{mongoose}=require('./baseDeDatos');
//Settings
app.set('port', process.env.PORT||3000);

//Midlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({origin:'http://localhost:4200'}));
app.use(bodyParser.json()); //convierte cualquier dato que llegue a json

//Routes the server
app.use('/',require('./routes/incidencias.routes'));
app.use(express.static(__dirname+'/routes'));


//Starting the serve
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});
