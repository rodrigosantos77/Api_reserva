// controllers/reservasController.js

const Reserva = require('../models/Reserva');

const listarReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find(); // Listar todas as reservas

    if (!reservas || reservas.length === 0) {
      const error = new Error('Nenhuma reserva encontrada');
      error.statusCode = 404;
      throw error; // Pode usar next(error) também
    }

    res.status(200).json(reservas);
  } catch (error) {
    next(error); // envia o erro pro middleware de erro global
  }
};


// POST - Criar uma nova reserva
const criarReserva = async (req, res) => {
  const { nomeCliente, email, dataEntrada, dataSaida, numeroQuarto } = req.body;

  // Validação manual: garantir que todos os campos obrigatórios foram preenchidos
  if (!nomeCliente || !email || !dataEntrada || !dataSaida || !numeroQuarto) {
    return res.status(400).json({
      erro: 'Todos os campos são obrigatórios.',
      campos: ['nomeCliente', 'email', 'dataEntrada', 'dataSaida', 'numeroQuarto']
    });
  }

  try {
    const novaReserva = new Reserva(req.body);
    const reservaSalva = await novaReserva.save();
    res.status(201).json(reservaSalva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar reserva. Verifique os dados.' });
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
    if (!reservaAtualizada) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }
    res.json(reservaAtualizada);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar reserva. Verifique os dados.' });
  }
};

// DELETE - Remover uma reserva
const deletarReserva = async (req, res) => {
  try {
    const reservaDeletada = await Reserva.findByIdAndDelete(req.params.id);
    if (!reservaDeletada) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }
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
