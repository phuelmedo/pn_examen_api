const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  ISBN: String,
  nombreLibro: String,
  autor: String,
  editorial: String,
  portada: String,
  paginas: Number
})

libroSchema.methods.setImgUrl = function setImgUrl(){
  
}

module.exports = mongoose.model('Libro', libroSchema)