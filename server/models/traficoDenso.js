const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaTraficoDenso = new Schema({}, { collection: 'tradicodenso2' /*strict:false*/ });
module.exports = mongoose.model('traficoDenso', EsquemaTraficoDenso);