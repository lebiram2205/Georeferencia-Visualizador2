
const express = require("express");
const morgan = require("morgan");
const cors= require("cors");
const app = express();

//Settings
app.set('port', process.env.PORT||3000);

//Midlewares

app.use(morgan('dev'));
app.use(cors({origin:'http://localhost:4200'}));
//Routes the server
app.use('/',require('./routes/incidencias.routes'));
app.use(express.static(__dirname+'/routes'));


//Starting the serve
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});
