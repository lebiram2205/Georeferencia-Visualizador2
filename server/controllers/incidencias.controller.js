const incidencia = require('../models/incidencia');
const IncidenciasCtrl= {};

IncidenciasCtrl.gettrafico=async(req, res)=>{
    const trafico= await incidencia.find({
        "startTime":"2020-01-14 05:57:00:000"
    });
    res.json(trafico);
};

IncidenciasCtrl.gettraficoById=async(req, res)=>{
    const trafico= await incidencia.findById(req.params.startTime);
    res.json(trafico);
};




IncidenciasCtrl.posttrafico=async(req, res)=>{
    const trafico=new incidencia(req.body);
    await trafico.save();
    res.json({
        'estado':'Archivo de trafico JSON Generado'
    })
};
module.exports=IncidenciasCtrl;

