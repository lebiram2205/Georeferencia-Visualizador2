const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaTraficoDenso = new Schema({}, { collection: 'traficodenso17' /*strict:false*/ });
module.exports = mongoose.model('traficodenso', EsquemaTraficoDenso);