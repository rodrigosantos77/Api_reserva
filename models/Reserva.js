
const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  email: { type: String, required: true },
  dataEntrada: { type: Date, required: true },
  dataSaida: { type: Date, required: true },
  numeroQuarto: { type: Number, required: true },
});

module.exports = mongoose.model('Reserva', reservaSchema);
