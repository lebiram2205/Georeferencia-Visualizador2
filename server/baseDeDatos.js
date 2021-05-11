const mongoose=require ('mongoose');
const URI= 'mongodb://localhost:27017/incidencias';

mongoose.connect(URI)
    .then(db => console.log('La base de datos esta conectada'))
    .catch(err=>console.error(err));

module.exports=mongoose;