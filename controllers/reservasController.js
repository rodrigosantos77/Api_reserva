


// controllers/reservasController.js

const listarReservas = (req, res) => {
    res.json({ mensagem: 'Listando todas as reservas' });
  };
  
  const criarReserva = (req, res) => {
    const novaReserva = req.body;
    res.status(201).json({ mensagem: 'Reserva criada com sucesso', dados: novaReserva });
  };
  
  const atualizarReserva = (req, res) => {
    const { id } = req.params;
    res.json({ mensagem: `Reserva ${id} atualizada com sucesso` });
  };
  
  const deletarReserva = (req, res) => {
    const { id } = req.params;
    res.json({ mensagem: `Reserva ${id} deletada com sucesso` });
  };
  
  module.exports = {
    listarReservas,
    criarReserva,
    atualizarReserva,
    deletarReserva,
  };
  