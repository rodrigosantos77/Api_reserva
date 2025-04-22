// controllers/reservasController.js

const Reserva = require('../models/Reserva');

// GET - Listar todas as reservas com os dados do usuário
const listarReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find().populate('usuario'); // Aqui é o ponto chave!

    if (!reservas || reservas.length === 0) {
      const error = new Error('Nenhuma reserva encontrada');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};


// POST - Criar uma nova reserva
const criarReserva = async (req, res) => {
  const { usuario, dataEntrada, dataSaida, numeroQuarto } = req.body;

  // Validação manual: garantir que todos os campos obrigatórios foram preenchidos
  if (!usuario || !dataEntrada || !dataSaida || !numeroQuarto) {
    return res.status(400).json({
      erro: 'Todos os campos são obrigatórios.',
      campos: ['usuario', 'dataEntrada', 'dataSaida', 'numeroQuarto']
    });
  }

  try {
    // Criar a nova reserva com o ID do usuário
    const novaReserva = new Reserva({
      usuario,
      dataEntrada,
      dataSaida,
      numeroQuarto
    });

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
