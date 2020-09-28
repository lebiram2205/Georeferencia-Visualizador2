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
module.exports=IncidenciasCtrl;

