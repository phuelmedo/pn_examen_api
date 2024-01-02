const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  rut: String,
  nombre: String,
  edad: Number,
  sexo: String,
  fotoPersonal: String,
  fechaIngreso: { type: Date, default: Date.now },
  enfermedad: String,
  revisado: { type: Boolean, default: false }
})

pacienteSchema.methods.setImgUrl = function setImgUrl(){
  
}

module.exports = mongoose.model('Paciente', pacienteSchema)