
  // controllers/reservasController.js

const Reserva = require('../models/Reserva');

// GET - Listar todas as reservas
const listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar reservas' });
  }
};

// POST - Criar uma nova reserva
const criarReserva = async (req, res) => {
  try {
    const novaReserva = new Reserva(req.body);
    const reservaSalva = await novaReserva.save();
    res.status(201).json(reservaSalva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar reserva' });
  }
};

// PUT - Atualizar uma reserva existente
const atualizarReserva = async (req, res) => {
  try {
    const reservaAtualizada = await Reserva.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(reservaAtualizada);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar reserva' });
  }
};

// DELETE - Remover uma reserva
const deletarReserva = async (req, res) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Reserva deletada com sucesso' });
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao deletar reserva' });
  }
};

module.exports = {
  listarReservas,
  criarReserva,
  atualizarReserva,
  deletarReserva,
};
