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
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória']
  },
  tipoUsuario: {
  type: String,
  enum: ['cliente', 'atendente'],
  default: 'cliente',
  required: true
},
  telefone: {
    type: String,
    required: false
  },
  documento: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
