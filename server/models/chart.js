const mongoose =require ('mongoose');
const{Schema}= mongoose;

const EsquemaChart= new Schema(
    {},{collection: 'charts'/*strict:false*/}
);
module.exports= mongoose.model('Charts', EsquemaChart);