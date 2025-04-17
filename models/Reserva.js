
const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
 
  nomeCliente: { type: String, required: [true, 'O nome do cliente é obrigatório'] },



  email: { type: String, required:  [true,'O e-mail do cliente é obrigatório']},

  dataEntrada: { type: Date, required:[true,'A data de entrada é obrigatória'] },

  dataSaida: { type: Date, required: [true,'A data de saída é obrigatória'] },

  numeroQuarto: { type: Number, required: [true,'O número do quarto é obrigatório']},
});

module.exports = mongoose.model('Reserva', reservaSchema);

