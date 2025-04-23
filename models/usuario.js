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
  tipoUsuario: {
    type: String,
    enum: ['cliente', 'atendente'],  // Definindo os dois tipos possíveis
    required: [true, 'O tipo de usuário é obrigatório']
  },
  telefone: {  // Campo adicional para telefone
    type: String,
    required: false
  },
  documento: {  // Campo para documentos do cliente
    type: String,
    required: false
  }
  // senha pode vir depois, se for implementar login/autenticação
});

module.exports = mongoose.model('Usuario', usuarioSchema);
