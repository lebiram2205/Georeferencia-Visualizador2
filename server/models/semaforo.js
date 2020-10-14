const mongoose =require ('mongoose');
const{Schema}= mongoose;

const EsquemaSemaforos= new Schema(
    {},{collection: 'semaforos'/*strict:false*/}
);
module.exports= mongoose.model('Semaforos', EsquemaSemaforos);