

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório']
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true
  }
  // senha pode vir depois, se for implementar login/autenticação
});

module.exports = mongoose.model('Usuario', usuarioSchema);
