
// controllers/reservasController.js
const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario");

// ===============================
// ✅ GET - LISTAR RESERVAS
// Cliente vê só as dele
// Atendente vê todas
// ===============================
const listarReservas = async (req, res, next) => {
  try {
    let reservas;

    if (req.usuarioTipo === "atendente") {
      reservas = await Reserva.find().populate("usuario", "-senha");
    } else {
      reservas = await Reserva.find({
        usuario: req.usuarioId,
      }).populate("usuario", "-senha");
    }

    return res.status(200).json(reservas || []);
  } catch (error) {
    next(error);
  }
};

// ===============================
// ✅ POST - CRIAR RESERVA
// ===============================
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
    horarioEntrada,
    numeroPessoas,
  } = req.body;

  // ✅ Campos obrigatórios
  const camposObrigatorios = [
    "dataEntrada",
    "dataSaida",
    "numeroQuarto",
    "status",
    "valor",
    "formaPagamento",
    "numeroToalhas",
    "numeroLencois",
    "cafeDaManha",
    "horarioEntrada",
    "numeroPessoas",
  ];

  const faltando = camposObrigatorios.filter((c) => req.body[c] == null);

  if (faltando.length > 0) {
    return res.status(400).json({
      erro: "Campos obrigatórios faltando.",
      faltando,
    });
  }

  try {
    // ✅ Verifica usuário autenticado
    const usuarioExistente = await Usuario.findById(req.usuarioId);

    if (!usuarioExistente) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // ✅ Cria reserva
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
      horarioEntrada,
      numeroPessoas,
    });

    const reservaSalva = await novaReserva.save();

    res.status(201).json(reservaSalva);
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao criar reserva. Verifique os dados.",
    });
  }
};

// ===============================
// ✅ PUT - ATUALIZAR RESERVA
// Cliente edita SOMENTE:
// - dataEntrada
// - dataSaida
// - numeroPessoas
// - cancelar reserva
// Atendente edita tudo
// ===============================
const atualizarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ erro: "Reserva não encontrada." });
    }

    // ✅ Cliente só pode editar a própria reserva
    if (
      req.usuarioTipo === "cliente" &&
      reserva.usuario.toString() !== req.usuarioId
    ) {
      return res.status(403).json({ erro: "Acesso não autorizado." });
    }

    // ===============================
    // ✅ CLIENTE (restrito)
    // ===============================
    if (req.usuarioTipo === "cliente") {
      if (req.body.dataEntrada)
        reserva.dataEntrada = req.body.dataEntrada;

      if (req.body.dataSaida)
        reserva.dataSaida = req.body.dataSaida;

      if (req.body.numeroPessoas != null)
        reserva.numeroPessoas = req.body.numeroPessoas;

      // ✅ Cliente só pode CANCELAR
      if (req.body.status === "cancelada") {
        reserva.status = "cancelada";
      }
    }

    // ===============================
    // ✅ ATENDENTE (total)
    // ===============================
    if (req.usuarioTipo === "atendente") {
      reserva.status = req.body.status || reserva.status;
      reserva.valor = req.body.valor || reserva.valor;
      reserva.formaPagamento =
        req.body.formaPagamento || reserva.formaPagamento;

      reserva.numeroToalhas =
        req.body.numeroToalhas || reserva.numeroToalhas;

      reserva.numeroLencois =
        req.body.numeroLencois || reserva.numeroLencois;

      reserva.cafeDaManha =
        req.body.cafeDaManha != null
          ? req.body.cafeDaManha
          : reserva.cafeDaManha;

      reserva.horarioEntrada =
        req.body.horarioEntrada || reserva.horarioEntrada;

      reserva.dataEntrada =
        req.body.dataEntrada || reserva.dataEntrada;

      reserva.dataSaida =
        req.body.dataSaida || reserva.dataSaida;

      reserva.numeroPessoas =
        req.body.numeroPessoas || reserva.numeroPessoas;
    }

    // ✅ Salvar atualização
    const reservaAtualizada = await reserva.save();

    res.json({
      mensagem: "Reserva atualizada com sucesso!",
      reserva: reservaAtualizada,
    });
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar reserva. Verifique os dados.",
    });
  }
};

// ===============================
// ✅ DELETE - Apenas atendente
// ===============================
const deletarReserva = async (req, res) => {
  try {
    if (req.usuarioTipo !== "atendente") {
      return res.status(403).json({
        erro: "Apenas atendentes podem deletar reservas.",
      });
    }

    const reservaDeletada = await Reserva.findByIdAndDelete(req.params.id);

    if (!reservaDeletada) {
      return res.status(404).json({ erro: "Reserva não encontrada." });
    }

    res.json({ mensagem: "Reserva deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ erro: "Erro ao deletar reserva" });
  }
};

// ===============================
module.exports = {
  listarReservas,
  criarReserva,
  atualizarReserva,
  deletarReserva,
};
