var times = ["00_00", "00_05", "00_10", "00_15", "00_20", "00_25", "00_30", "00_35", "00_40", "00_45", "00_50", "00_55",
    "01_00", "01_05", "01_10", "01_15", "01_20", "01_25", "01_30", "01_35", "01_40", "01_45", "01_50", "01_55",
    "02_00", "02_05", "02_10", "02_15", "02_20", "02_25", "02_30", "02_35", "02_40", "02_45", "02_50", "02_55",
    "03_00", "03_05", "03_10", "03_15", "03_20", "03_25", "03_30", "03_35", "03_40", "03_45", "03_50", "03_55",
    "04_00", "04_05", "04_10", "04_15", "04_20", "04_25", "04_30", "04_35", "04_40", "04_45", "04_50", "04_55",
    "05_00", "05_05", "05_10", "05_15", "05_20", "05_25", "05_30", "05_35", "05_40", "05_45", "05_50", "05_55",
    "06_00", "06_05", "06_10", "06_15", "06_20", "06_25", "06_30", "06_35", "06_40", "06_45", "06_50", "06_55",
    "07_00", "07_05", "07_10", "07_15", "07_20", "07_25", "07_30", "07_35", "07_40", "07_45", "07_50", "07_55",
    "08_00", "08_05", "08_10", "08_15", "08_20", "08_25", "08_30", "08_35", "08_40", "08_45", "08_50", "08_55",
    "09_00", "09_05", "09_10", "09_15", "09_20", "09_25", "09_30", "09_35", "09_40", "09_45", "09_50", "09_55",
    "10_00", "10_05", "10_10", "10_15", "10_20", "10_25", "10_30", "10_35", "10_40", "10_45", "10_50", "10_55",
    "11_00", "11_05", "11_10", "11_15", "11_20", "11_25", "11_30", "11_35", "11_40", "11_45", "11_50", "11_55",
    "12_00", "12_05", "12_10", "12_15", "12_20", "12_25", "12_30", "12_35", "12_40", "12_45", "12_50", "12_55",
    "13_00", "13_05", "13_10", "13_15", "13_20", "13_25", "13_30", "13_35", "13_40", "13_45", "13_50", "13_55",
    "14_00", "14_05", "14_10", "14_15", "14_20", "14_25", "14_30", "14_35", "14_40", "14_45", "14_50", "14_55",
    "15_00", "15_05", "15_10", "15_15", "15_20", "15_25", "15_30", "15_35", "15_40", "15_45", "15_50", "15_55",
    "16_00", "16_05", "16_10", "16_15", "16_20", "16_25", "16_30", "16_35", "16_40", "16_45", "16_50", "16_55",
    "17_00", "17_05", "17_10", "17_15", "17_20", "17_25", "17_30", "17_35", "17_40", "17_45", "17_50", "17_55",
    "18_00", "18_05", "18_10", "18_15", "18_20", "18_25", "18_30", "18_35", "18_40", "18_45", "18_50", "18_55",
    "19_00", "19_05", "19_10", "19_15", "19_20", "19_25", "19_30", "19_35", "19_40", "19_45", "19_50", "19_55",
    "20_00", "20_05", "20_10", "20_15", "20_20", "20_25", "20_30", "20_35", "20_40", "20_45", "20_50", "20_55",
    "21_00", "21_05", "21_10", "21_15", "21_20", "21_25", "21_30", "21_35", "21_40", "21_45", "21_50", "21_55",
    "22_00", "22_05", "22_10", "22_15", "22_20", "22_25", "22_30", "22_35", "22_40", "22_45", "22_50", "22_55",
    "23_00", "23_05", "23_10", "23_15", "23_20", "23_25", "23_30", "23_35", "23_40", "23_45", "23_50", "23_55"
];
/*var times = ["07_00","08_00","09_00","10_00","11_00","12_00","13_00","14_00","15_00","16_00"];*/
var i = 0;
///////////////////////////////////////////////////////////////////////////////////////////////////////////
const incidencia = require('../models/incidencia');
const semaforo = require('../models/semaforo');
const geo = require('../models/geo');
const chart = require('../models/chart');
const traficodenso2 = require('../models/traficoDenso');
const IncidenciasCtrl = {};

IncidenciasCtrl.gettrafico = async(req, res) => {
    const trafico = await incidencia.find({}).limit(1);
    res.json(trafico);
};

IncidenciasCtrl.gettraficoById = async(req, res) => {
    const trafico = await incidencia.findById(req.params.startTime);
    res.json(trafico);
};




IncidenciasCtrl.posttrafico = async(req, res) => {
    const trafico = new incidencia(req.body);
    await trafico.save();
    res.json({
        'estado': 'Archivo de trafico JSON Generado'
    })
};

IncidenciasCtrl.getCities = async(req, res) => {
    //En req.params se encuentra el dato recibido por URL en formato JSON
    const traficoJson = await incidencia.distinct('jams.city');
    res.json(traficoJson);
    console.log(req.params.startTime);
};

//Obtiene los jams de una determinada fecha y lugar
IncidenciasCtrl.getJams = async(req, res) => {
    //const traficoJson = await incidencia.find({"alerts.reportBy":"Corichido"},{"startTime":1, "_id":0});
    //const traficoJson = await incidencia.distinct("alerts.city");
    //const traficoJson = await incidencia.distinct("alerts.reportBy");
    //const traficoJson = await incidencia.find({"startTime":{"$regex": "2020-01-14 06"}},{"startTime":1, "endTime":1, "_id":0});
    //const traficoJson = await incidencia.find({"startTime":{"$regex": req.params.variable}}).limit(1);
    const traficoJson = await incidencia.aggregate([
        { $match: { "startTime": { "$regex": req.params.fecha } } },
        { $unwind: '$alerts' },
        { $match: { 'alerts.city': { "$regex": req.params.ciudad } } },
        { $group: { _id: '$alerts.id', location: { $first: '$alerts.location' }, Type: { $first: '$alerts.type' } } }
    ]);
    console.log(req.params.fecha);
    res.json(traficoJson);
}

//Obtiene los jams de una determinada fecha solamente
IncidenciasCtrl.getAllJams = async(req, res) => {
        const traficoJson = await incidencia.aggregate([
            { $match: { "startTime": { "$regex": req.params.fecha } } },
            { $unwind: '$alerts' },
            //{$match: {'jams.city':{"$regex": req.params.ciudad}}},
            { $group: { _id: '$alerts.id', location: { $first: '$alerts.location' }, Type: { $first: '$alerts.type' } } }
        ]);

        res.json(traficoJson);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
IncidenciasCtrl.getTraffic = async(req, res) => {
    var file;
    const fs = require('fs');
    file = __dirname + '/../routes/trafico/CDMX_2020-01-14-' + times[i] + '.json'
    console.log("File: " + file);
    let rawdata = fs.readFileSync(file);
    i = (i + 1) % times.length;
    let trafico = JSON.parse(rawdata);
    // res.send(''+trafico.jams[0].line);
    res.json(trafico);
};

IncidenciasCtrl.semaforoIzt = async(req, res) => {
    const semJson = await semaforo.findById("5f84d6dcdc95dac4f736d7a8");
    res.json(semJson);
}

IncidenciasCtrl.semaforoIzc = async(req, res) => {
    const semJson = await semaforo.findById("5f84d6f11ada8bad6f29dde1");
    res.json(semJson);
}

IncidenciasCtrl.semaforoMh = async(req, res) => {
    const semJson = await semaforo.findById("5f84d6e6c3596758fe948230");
    res.json(semJson);
}

IncidenciasCtrl.calleCerrada = async(req, res) => {
    const trafico = await incidencia.find({}, { "_id": 0, "alerts": 1, "jams": 1 }).limit(1);
    res.json(trafico);
}

IncidenciasCtrl.roadClose = async(req, res) => {
    var file;
    const fs = require('fs');
    file = __dirname + '/../routes/trafico/CDMX_2020-01-14-' + times[i] + '.json'
    console.log("File: " + file);
    let rawdata = fs.readFileSync(file);
    i = (i + 1) % times.length;
    let trafico = JSON.parse(rawdata);
    res.json(trafico);
}

IncidenciasCtrl.alcaldia = async(req, res) => {
    const trafico = await geo.find().limit();
    res.json(trafico);
}

IncidenciasCtrl.incidencia = async(req, res) => {
    const trafico = await chart.find().limit();
    res.json(trafico);
}

IncidenciasCtrl.incidenciaTipos = async(req, res) => {
    const trafico = await incidencia.distinct('alerts.type');
    res.json(trafico);
}
IncidenciasCtrl.diaTrafico = async(req, res) => {
    const trafico = await traficodenso2.find().sort({ 'tiempo': 1 }).limit();
    res.json(trafico);
}
module.exports = IncidenciasCtrl;