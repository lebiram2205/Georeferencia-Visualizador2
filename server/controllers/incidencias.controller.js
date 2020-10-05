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
    const traficoJson = await incidencia.find(req.params);
    res.json(traficoJson);
    
};
module.exports=IncidenciasCtrl;

