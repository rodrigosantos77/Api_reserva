// controllers/reservasController.js
const Reserva = require('../models/reserva');
const Usuario = require('../models/usuario');

// GET - Listar reservas (cliente vê só as dele, atendente vê todas)
const listarReservas = async (req, res, next) => {
  try {
    let reservas;

    if (req.usuarioTipo === 'atendente') {
      // Atendente vê todas as reservas
      reservas = await Reserva.find().populate('usuario');
    } else {
      // Cliente vê só as dele
      reservas = await Reserva.find({ usuario: req.usuarioId }).populate('usuario');
    }

    if (!reservas || reservas.length === 0) {
      return res.status(404).json({ erro: 'Nenhuma reserva encontrada' });
    }

    res.status(200).json(reservas);
  } catch (error) {
    next(error);
  }
};

// POST - Criar uma nova reserva (cliente pode criar a sua, atendente também)
const criarReserva = async (req, res) => {
  const {
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

  // Campos obrigatórios
  const camposObrigatorios = [
    'dataEntrada', 'dataSaida', 'numeroQuarto',
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
    // Verifica se o usuário existe (pelo ID do token)
    const usuarioExistente = await Usuario.findById(req.usuarioId);
    if (!usuarioExistente) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    console.log('📦 Dados recebidos no body:', req.body);
    // Cria a reserva associando automaticamente o usuário do token
    const novaReserva = new Reserva({
      usuario: req.usuarioId,
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

// PUT - Atualizar uma reserva (cliente só pode editar a própria, atendente pode tudo)
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
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    // Se for cliente, só pode editar se for dono da reserva
    if (req.usuarioTipo === 'cliente' && reserva.usuario.toString() !== req.usuarioId) {
      return res.status(403).json({ erro: 'Acesso não autorizado.' });
    }

    // Atualiza os campos
    reserva.status = status || reserva.status;
    reserva.valor = valor || reserva.valor;
    reserva.formaPagamento = formaPagamento || reserva.formaPagamento;
    reserva.numeroToalhas = numeroToalhas || reserva.numeroToalhas;
    reserva.numeroLencois = numeroLencois || reserva.numeroLencois;
    reserva.cafeDaManha = cafeDaManha != null ? cafeDaManha : reserva.cafeDaManha;
    reserva.horarioEntrada = horarioEntrada || reserva.horarioEntrada;

    const reservaAtualizada = await reserva.save();
    res.json(reservaAtualizada);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar reserva. Verifique os dados.' });
  }
};

// DELETE - Apenas atendente pode deletar reservas
const deletarReserva = async (req, res) => {
  try {
    // Verifica se é atendente
    if (req.usuarioTipo !== 'atendente') {
      return res.status(403).json({ erro: 'Apenas atendentes podem deletar reservas.' });
    }

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
  deletarReserva
};
