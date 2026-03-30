
const Reserva = require("../models/reserva");
const Usuario = require("../models/usuario");
const quartosHotel = require("../utils/quartosHotel");

// ===============================
// 🔎 BUSCAR QUARTOS DISPONÍVEIS
// ===============================
const buscarQuartosDisponiveis = async (req, res) => {
  try {
    const { dataEntrada, dataSaida } = req.query;

    if (!dataEntrada || !dataSaida) {
      return res.status(400).json({
        erro: "Informe dataEntrada e dataSaida.",
      });
    }

    const entrada = new Date(dataEntrada);
    const saida = new Date(dataSaida);

    if (isNaN(entrada.getTime()) || isNaN(saida.getTime())) {
      return res.status(400).json({
        erro: "Datas inválidas.",
      });
    }

    if (saida <= entrada) {
      return res.status(400).json({
        erro: "A data de saída deve ser posterior à data de entrada.",
      });
    }

    const reservas = await Reserva.find({
      dataEntrada: { $lt: saida },
      dataSaida: { $gt: entrada },
      status: { $ne: "cancelada" },
    });

    const quartosReservados = reservas.map((r) => r.numeroQuarto);

    const quartosDisponiveis = quartosHotel.filter(
      (quarto) => !quartosReservados.includes(quarto)
    );

    res.status(200).json({
      quartosDisponiveis,
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao buscar quartos disponíveis",
    });
  }
};

// ===============================
// ✅ GET - LISTAR RESERVAS
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
// 💰 CALCULAR VALOR BASE
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
// 📅 CALCULAR DIAS
// ===============================
const calcularDias = (entrada, saida) => {
  const data1 = new Date(entrada);
  const data2 = new Date(saida);

  const diffTime = data2 - data1;
  return diffTime / (1000 * 60 * 60 * 24);
};

// ===============================
// 🚫 VALIDAR CONFLITO DE RESERVA
// ===============================
const verificarConflitoReserva = async (
  numeroQuarto,
  dataEntrada,
  dataSaida,
  reservaIdIgnorar = null
) => {
  const filtro = {
    numeroQuarto,
    dataEntrada: { $lt: dataSaida },
    dataSaida: { $gt: dataEntrada },
    status: { $ne: "cancelada" },
  };

  if (reservaIdIgnorar) {
    filtro._id = { $ne: reservaIdIgnorar };
  }

  return await Reserva.findOne(filtro);
};

// ===============================
// 🏨 CRIAR RESERVA
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
    const usuarioExistente = await Usuario.findById(req.user.id);

    if (!usuarioExistente) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (!quartosHotel.includes(Number(numeroQuarto))) {
      return res.status(400).json({
        erro: "Número de quarto inválido.",
      });
    }

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

    const conflitoReserva = await verificarConflitoReserva(
      numeroQuarto,
      dataEntrada,
      dataSaida
    );

    if (conflitoReserva) {
      return res.status(400).json({
        erro: "Este quarto já está reservado para o período selecionado.",
      });
    }

    let valorFinal;

    if (req.user.tipoUsuario === "cliente") {
      if (numeroPessoas > 4) {
        return res.status(400).json({
          erro: "Cliente só pode reservar até 4 pessoas.",
        });
      }

      const valorDiaria = calcularValorReserva(numeroPessoas);
      valorFinal = valorDiaria * dias;
    }

    if (req.user.tipoUsuario === "atendente") {
      if (numeroPessoas > 6) {
        return res.status(400).json({
          erro: "Máximo permitido é 6 pessoas.",
        });
      }

      if (numeroPessoas <= 4) {
        const valorDiaria = calcularValorReserva(numeroPessoas);
        valorFinal = valorDiaria * dias;
      } else {
        if (valor == null) {
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
      valor: valorFinal,
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
// ✏️ ATUALIZAR RESERVA
// ===============================
const atualizarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ erro: "Reserva não encontrada." });
    }

    if (
      req.user.tipoUsuario === "cliente" &&
      reserva.usuario.toString() !== req.user.id
    ) {
      return res.status(403).json({ erro: "Acesso não autorizado." });
    }

    if (reserva.status === "cancelada") {
      return res.status(400).json({
        erro: "Reservas canceladas não podem ser atualizadas.",
      });
    }

    if (reserva.status === "checkout") {
      return res.status(400).json({
        erro: "Reservas finalizadas não podem ser atualizadas.",
      });
    }

    if (req.user.tipoUsuario === "cliente") {
      if (reserva.status === "checkin") {
        return res.status(400).json({
          erro: "Não é permitido alterar uma reserva após o check-in.",
        });
      }

      const novaDataEntrada = req.body.dataEntrada ?? reserva.dataEntrada;
      const novaDataSaida = req.body.dataSaida ?? reserva.dataSaida;
      const novoNumeroPessoas = req.body.numeroPessoas ?? reserva.numeroPessoas;

      const dias = calcularDias(novaDataEntrada, novaDataSaida);

      if (dias <= 0) {
        return res.status(400).json({
          erro: "Data de saída deve ser posterior à data de entrada.",
        });
      }

      if (novoNumeroPessoas < 1 || novoNumeroPessoas > 4) {
        return res.status(400).json({
          erro: "Cliente só pode manter reservas entre 1 e 4 pessoas.",
        });
      }

      const conflitoReserva = await verificarConflitoReserva(
        reserva.numeroQuarto,
        novaDataEntrada,
        novaDataSaida,
        reserva._id
      );

      if (conflitoReserva) {
        return res.status(400).json({
          erro: "Já existe conflito de reserva para esse quarto no período informado.",
        });
      }

      reserva.dataEntrada = novaDataEntrada;
      reserva.dataSaida = novaDataSaida;
      reserva.numeroPessoas = novoNumeroPessoas;

      if (req.body.status === "cancelada") {
        reserva.status = "cancelada";
      }
    }

    if (req.user.tipoUsuario === "atendente") {
      const novaDataEntrada = req.body.dataEntrada ?? reserva.dataEntrada;
      const novaDataSaida = req.body.dataSaida ?? reserva.dataSaida;
      const novoNumeroQuarto = req.body.numeroQuarto ?? reserva.numeroQuarto;
      const novoNumeroPessoas = req.body.numeroPessoas ?? reserva.numeroPessoas;
      const novoStatus = req.body.status ?? reserva.status;
      const novoValor = req.body.valor ?? reserva.valor;

      if (!quartosHotel.includes(Number(novoNumeroQuarto))) {
        return res.status(400).json({
          erro: "Número de quarto inválido.",
        });
      }

      const dias = calcularDias(novaDataEntrada, novaDataSaida);

      if (dias <= 0) {
        return res.status(400).json({
          erro: "Data de saída deve ser posterior à data de entrada.",
        });
      }

      if (novoNumeroPessoas < 1 || novoNumeroPessoas > 6) {
        return res.status(400).json({
          erro: "Número de pessoas deve estar entre 1 e 6.",
        });
      }

      const conflitoReserva = await verificarConflitoReserva(
        novoNumeroQuarto,
        novaDataEntrada,
        novaDataSaida,
        reserva._id
      );

      if (conflitoReserva) {
        return res.status(400).json({
          erro: "Já existe conflito de reserva para esse quarto no período informado.",
        });
      }

      if ((novoStatus === "checkin" || novoStatus === "checkout") && reserva.status !== novoStatus) {
        return res.status(400).json({
          erro: "Use as rotas específicas de check-in e check-out para alterar esse status.",
        });
      }

      if (novoNumeroPessoas > 4 && novoValor == null) {
        return res.status(400).json({
          erro: "Para 5 ou 6 pessoas o valor deve ser informado.",
        });
      }

      reserva.status = novoStatus;
      reserva.valor = novoValor;
      reserva.formaPagamento = req.body.formaPagamento ?? reserva.formaPagamento;
      reserva.numeroToalhas = req.body.numeroToalhas ?? reserva.numeroToalhas;
      reserva.numeroLencois = req.body.numeroLencois ?? reserva.numeroLencois;
      reserva.cafeDaManha =
        req.body.cafeDaManha != null ? req.body.cafeDaManha : reserva.cafeDaManha;
      reserva.horarioEntrada = req.body.horarioEntrada ?? reserva.horarioEntrada;
      reserva.dataEntrada = novaDataEntrada;
      reserva.dataSaida = novaDataSaida;
      reserva.numeroPessoas = novoNumeroPessoas;
      reserva.numeroQuarto = novoNumeroQuarto;
    }

    const reservaAtualizada = await reserva.save();

    res.json({
      mensagem: "Reserva atualizada com sucesso!",
      reserva: reservaAtualizada,
    });
  } catch (error) {
    res.status(400).json({
      erro: "Erro ao atualizar reserva.",
    });
  }
};

// ===============================
// 🚫 CANCELAR RESERVA
// ===============================
const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        erro: "Reserva não encontrada.",
      });
    }

    if (
      req.user.tipoUsuario === "cliente" &&
      reserva.usuario.toString() !== req.user.id
    ) {
      return res.status(403).json({
        erro: "Acesso não autorizado.",
      });
    }

    if (reserva.status === "cancelada") {
      return res.status(400).json({
        erro: "Esta reserva já está cancelada.",
      });
    }

    if (reserva.status === "checkin") {
      return res.status(400).json({
        erro: "Não é permitido cancelar uma reserva com check-in realizado.",
      });
    }

    if (reserva.status === "checkout") {
      return res.status(400).json({
        erro: "Não é permitido cancelar uma reserva já finalizada.",
      });
    }

    reserva.status = "cancelada";
    await reserva.save();

    return res.status(200).json({
      mensagem: "Reserva cancelada com sucesso!",
      reserva,
    });
  } catch (error) {
    return res.status(500).json({
      erro: "Erro ao cancelar reserva.",
    });
  }
};

// ===============================
// ❌ DELETAR RESERVA
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
      return res.status(404).json({
        erro: "Reserva não encontrada.",
      });
    }

    return res.status(200).json({
      mensagem: "Reserva deletada com sucesso",
    });
  } catch (error) {
    return res.status(400).json({
      erro: "Erro ao deletar reserva",
    });
  }
};

// ===============================
// 🏨 REALIZAR CHECK-IN
// ===============================
const realizarCheckin = async (req, res) => {
  try {
    if (req.user.tipoUsuario !== "atendente") {
      return res.status(403).json({
        erro: "Apenas atendentes podem realizar check-in.",
      });
    }

    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        erro: "Reserva não encontrada.",
      });
    }

    if (reserva.status === "cancelada") {
      return res.status(400).json({
        erro: "Não é possível realizar check-in em uma reserva cancelada.",
      });
    }

    if (reserva.status === "checkin") {
      return res.status(400).json({
        erro: "Check-in já realizado para esta reserva.",
      });
    }

    if (reserva.status === "checkout") {
      return res.status(400).json({
        erro: "Não é possível realizar check-in em uma reserva já finalizada.",
      });
    }

    reserva.status = "checkin";
    await reserva.save();

    res.json({
      mensagem: "Check-in realizado com sucesso!",
      reserva,
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao realizar check-in",
    });
  }
};

// ===============================
// 🏁 REALIZAR CHECK-OUT
// ===============================
const realizarCheckout = async (req, res) => {
  try {
    if (req.user.tipoUsuario !== "atendente") {
      return res.status(403).json({
        erro: "Apenas atendentes podem realizar check-out.",
      });
    }

    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        erro: "Reserva não encontrada.",
      });
    }

    if (reserva.status === "cancelada") {
      return res.status(400).json({
        erro: "Não é possível realizar check-out em uma reserva cancelada.",
      });
    }

    if (reserva.status === "checkout") {
      return res.status(400).json({
        erro: "Check-out já realizado para esta reserva.",
      });
    }

    if (reserva.status !== "checkin") {
      return res.status(400).json({
        erro: "Só é possível fazer checkout de reservas com check-in realizado.",
      });
    }

    reserva.status = "checkout";
    await reserva.save();

    res.json({
      mensagem: "Check-out realizado com sucesso!",
      reserva,
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao realizar check-out",
    });
  }
};

// ===============================
// 📊 OCUPAÇÃO DO HOTEL (HOJE)
// ===============================
const ocupacaoHoje = async (req, res) => {
  try {
    const hoje = new Date();

    const reservasAtivas = await Reserva.find({
      dataEntrada: { $lte: hoje },
      dataSaida: { $gt: hoje },
      status: { $nin: ["cancelada", "checkout"] },
    });

    const quartosOcupados = reservasAtivas.length;
    const totalQuartos = quartosHotel.length;
    const quartosDisponiveis = totalQuartos - quartosOcupados;

    res.json({
      quartosOcupados,
      quartosDisponiveis,
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao calcular ocupação do hotel",
    });
  }
};

module.exports = {
  buscarQuartosDisponiveis,
  listarReservas,
  criarReserva,
  atualizarReserva,
  cancelarReserva,
  deletarReserva,
  realizarCheckin,
  realizarCheckout,
  ocupacaoHoje,
};