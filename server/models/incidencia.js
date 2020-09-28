const mongoose =require ('mongoose');
const{Schema}= mongoose;

const EsquemaIncidencias= new Schema(
    {},{strict:false}
);
module.exports= mongoose.model('Incidencia', EsquemaIncidencias);