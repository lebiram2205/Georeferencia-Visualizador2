const incidencia = require('../models/incidencia');
const IncidenciasCtrl= {};

IncidenciasCtrl.gettrafico=async(req, res)=>{
    const trafico= await incidencia.find();
    res.json(trafico);
};

IncidenciasCtrl.posttrafico=async(req, res)=>{
    const trafico=new incidencia(req.body);
    await trafico.save();
    res.json({
        'estado':'Archivo de trafico JSON Generado'
    })
};

IncidenciasCtrl.getUnJson=async(req, res)=>{
    //En req.params se encuentra el dato recibido por URL en formato JSON
   const traficoJson = await incidencia.find({'startTime': req.params.startTime}, {'_id':0});
   res.json(traficoJson);
   console.log(req.params.startTime);
};

IncidenciasCtrl.consultas=async(req, res)=>{
   const traficoJson = await incidencia.count({'user':{'$elemMatch':{'city':'Coyoacán', 'street':'Álvaro Gálvez y Fuentes', 'blockType':'ROAD_CLOSED_EVENT'}}});
   res.json(traficoJson);
   console.log(req.params.startTime);
}

module.exports=IncidenciasCtrl;

