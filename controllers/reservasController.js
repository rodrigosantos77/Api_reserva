// controllers/reservasController.js

const Reserva = require('../models/reserva');
const Usuario = require('../models/usuario');

// GET - Listar todas as reservas com os dados do usuário
const listarReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find()
      .populate('usuario');
    
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
  const {
    usuario,
    dataEntrada,
    dataSaida,
    numeroQuarto,
    status,
    valor,
    formaPagamento,
    numeroToalhas,
    numeroLencois,
    cafeDaManha,
    horarioEntrada
  } = req.body;

  // Validação manual de campos obrigatórios
  const camposObrigatorios = [
    'usuario', 'dataEntrada', 'dataSaida', 'numeroQuarto',
    'status', 'valor', 'formaPagamento',
    'numeroToalhas', 'numeroLencois', 'cafeDaManha', 'horarioEntrada'
  ];
  const faltando = camposObrigatorios.filter(c => req.body[c] == null);
  if (faltando.length > 0) {
    return res.status(400).json({
      erro: 'Campos obrigatórios faltando.',
      faltando
    });
  }

  try {
    // Verificar se o usuário existe
    const usuarioExistente = await Usuario.findById(usuario);
    if (!usuarioExistente) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Criar a nova reserva
    const novaReserva = new Reserva({
      usuario,
      dataEntrada,
      dataSaida,
      numeroQuarto,
      status,
      valor,
      formaPagamento,
      numeroToalhas,
      numeroLencois,
      cafeDaManha,
      horarioEntrada
    });

    const reservaSalva = await novaReserva.save();
    res.status(201).json(reservaSalva);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar reserva. Verifique os dados.' });
  }
};

// PUT - Atualizar uma reserva existente
const atualizarReserva = async (req, res) => {
  const {
    status,
    valor,
    formaPagamento,
    numeroToalhas,
    numeroLencois,
    cafeDaManha,
    horarioEntrada
  } = req.body;

  try {
    const reservaAtualizada = await Reserva.findByIdAndUpdate(
      req.params.id,
      {
        status,
        valor,
        formaPagamento,
        numeroToalhas,
        numeroLencois,
        cafeDaManha,
        horarioEntrada
      },
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
