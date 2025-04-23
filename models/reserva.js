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
  },
  status: {
    type: String,
    enum: ['pendente', 'confirmada', 'cancelada'],
    default: 'pendente',
    required: [true, 'O status da reserva é obrigatório']
  },
  valor: {
    type: Number,
    required: [true, 'O valor da reserva é obrigatório']
  },
  formaPagamento: {
    type: String,
    required: [true, 'A forma de pagamento é obrigatória']
  },
  numeroToalhas: {
    type: Number,
    required: [true, 'O número de toalhas é obrigatório']
  },
  numeroLencois: {
    type: Number,
    required: [true, 'O número de lençóis é obrigatório']
  },
  cafeDaManha: {
    type: Boolean,
    required: [true, 'A informação sobre café da manhã é obrigatória']
  },
  horarioEntrada: {
    type: String,
    enum: ['manha', 'tarde', 'noite', 'madrugada'],
    required: [true, 'O horário de entrada é obrigatório']
  }
});

module.exports = mongoose.model('Reserva', reservaSchema);
