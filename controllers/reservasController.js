
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
// 💰 Função para calcular valor da reserva
// ===============================
const calcularValorReserva = (numeroPessoas) => {

  if (numeroPessoas === 1) return 100;
  if (numeroPessoas === 2) return 120;
  if (numeroPessoas === 3) return 140;
  if (numeroPessoas === 4) return 150;

  if (numeroPessoas > 4) {
    const adicional = (numeroPessoas - 4) * 20;
    return 150 + adicional;
  }

  return 100;
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

  // ❌ Removido "valor" dos obrigatórios
  const camposObrigatorios = [
    "dataEntrada",
    "dataSaida",
    "numeroQuarto",
    "status",
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

  // ✅ Função para calcular dias
  const calcularDias = (entrada, saida) => {
    const data1 = new Date(entrada);
    const data2 = new Date(saida);

    const diffTime = data2 - data1;
    const diffDias = diffTime / (1000 * 60 * 60 * 24);

    return diffDias;
  };

  try {
    // ✅ Verifica usuário autenticado
    const usuarioExistente = await Usuario.findById(req.user.id);

    if (!usuarioExistente) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    // ✅ Validação básica
    if (numeroPessoas < 1) {
      return res.status(400).json({
        erro: "Número de pessoas deve ser pelo menos 1.",
      });
    }

    const dias = calcularDias(dataEntrada, dataSaida);

    if (dias <= 0) {
      return res.status(400).json({
        erro: "Data de saída deve ser posterior à data de entrada.",
      });
    }

      // ===============================
      // 🚫 Verificar conflito de reservas
      // ===============================
const conflitoReserva = await Reserva.findOne({
  numeroQuarto: numeroQuarto,
  dataEntrada: { $lt: dataSaida },
  dataSaida: { $gt: dataEntrada },
});

if (conflitoReserva) {
  return res.status(400).json({
    erro: "Este quarto já está reservado para o período selecionado.",
  });
}

    let valorFinal;

    // ===============================
    // 👤 CLIENTE
    // ===============================
    if (req.user.tipoUsuario === "cliente") {

      if (numeroPessoas > 4) {
        return res.status(400).json({
          erro: "Cliente só pode reservar até 4 pessoas.",
        });
      }

      const valorDiaria = 100 + ((numeroPessoas - 1) * 20);
      valorFinal = valorDiaria * dias;
    }

    // ===============================
    // 🧑‍💼 ATENDENTE
    // ===============================
    if (req.user.tipoUsuario === "atendente") {

      if (numeroPessoas > 6) {
        return res.status(400).json({
          erro: "Máximo permitido é 6 pessoas.",
        });
      }

      if (numeroPessoas <= 4) {
        const valorDiaria = 100 + ((numeroPessoas - 1) * 20);
        valorFinal = valorDiaria * dias;
      } else {
        // 5 ou 6 pessoas → valor manual obrigatório
        if (!valor) {
          return res.status(400).json({
            erro: "Para 5 ou 6 pessoas o valor deve ser informado.",
          });
        }
        valorFinal = valor;
      }
    }

    const novaReserva = new Reserva({
      usuario: req.user.id,
      dataEntrada,
      dataSaida,
      numeroQuarto,
      status,
      valor: valorFinal, // 🔒 valor vem do backend
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