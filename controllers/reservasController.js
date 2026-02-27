
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

    if (req.user.tipoUsuario === "atendente") {
      reservas = await Reserva.find().populate("usuario", "-senha");
    } else {
      reservas = await Reserva.find({
        usuario: req.user.id,
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
    const usuarioExistente = await Usuario.findById(req.user.id);

    if (!usuarioExistente) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const novaReserva = new Reserva({
      usuario: req.user.id,
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
// Cliente edita parcialmente
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
      req.user.tipoUsuario === "cliente" &&
      reserva.usuario.toString() !== req.user.id
    ) {
      return res.status(403).json({ erro: "Acesso não autorizado." });
    }

    // ===============================
    // ✅ CLIENTE (restrito)
    // ===============================
    if (req.user.tipoUsuario === "cliente") {
      if (req.body.dataEntrada)
        reserva.dataEntrada = req.body.dataEntrada;

      if (req.body.dataSaida)
        reserva.dataSaida = req.body.dataSaida;

      if (req.body.numeroPessoas != null)
        reserva.numeroPessoas = req.body.numeroPessoas;

      if (req.body.status === "cancelada") {
        reserva.status = "cancelada";
      }
    }

    // ===============================
    // ✅ ATENDENTE (total)
    // ===============================
    if (req.user.tipoUsuario === "atendente") {
      reserva.status = req.body.status ?? reserva.status;
      reserva.valor = req.body.valor ?? reserva.valor;
      reserva.formaPagamento =
        req.body.formaPagamento ?? reserva.formaPagamento;

      reserva.numeroToalhas =
        req.body.numeroToalhas ?? reserva.numeroToalhas;

      reserva.numeroLencois =
        req.body.numeroLencois ?? reserva.numeroLencois;

      reserva.cafeDaManha =
        req.body.cafeDaManha != null
          ? req.body.cafeDaManha
          : reserva.cafeDaManha;

      reserva.horarioEntrada =
        req.body.horarioEntrada ?? reserva.horarioEntrada;

      reserva.dataEntrada =
        req.body.dataEntrada ?? reserva.dataEntrada;

      reserva.dataSaida =
        req.body.dataSaida ?? reserva.dataSaida;

      reserva.numeroPessoas =
        req.body.numeroPessoas ?? reserva.numeroPessoas;
    }

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
    if (req.user.tipoUsuario !== "atendente") {
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

module.exports = {
  listarReservas,
  criarReserva,
  atualizarReserva,
  deletarReserva,
};