const mongoose = require('mongoose');
const { Schema } = mongoose;

const EsquemaGeo = new Schema({}, { collection: 'geo' /*strict:false*/ });
module.exports = mongoose.model('Geo', EsquemaGeo);