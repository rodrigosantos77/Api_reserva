

const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'O usuário é obrigatório']
  },
  dataEntrada: {
    type: Date,
    required: [true, 'A data de entrada é obrigatória']
  },
  dataSaida: {
    type: Date,
    required: [true, 'A data de saída é obrigatória']
  },
  numeroQuarto: {
    type: Number,
    required: [true, 'O número do quarto é obrigatório']
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);
