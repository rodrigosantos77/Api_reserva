
const express = require('express');
const router = express.Router();

const reservasController = require('../controllers/reservasController');
const auth = require('../middlewares/auth');
const autorizaTipo = require('../middlewares/autorizaTipo');

router.post(
  '/',
  auth,
  autorizaTipo('cliente', 'atendente'),
  reservasController.criarReserva
);

router.get(
  '/',
  auth,
  reservasController.listarReservas
);

router.get(
  "/quartos-disponiveis",
  auth,
  reservasController.buscarQuartosDisponiveis
);

router.put(
  '/:id',
  auth,
  autorizaTipo('cliente', 'atendente'),
  reservasController.atualizarReserva
);

router.patch(
  '/:id/cancelar',
  auth,
  autorizaTipo('cliente', 'atendente'),
  reservasController.cancelarReserva
);

router.delete(
  '/:id',
  auth,
  autorizaTipo('atendente'),
  reservasController.deletarReserva
);

router.patch(
  "/:id/checkin",
  auth,
  autorizaTipo("atendente"),
  reservasController.realizarCheckin
);

router.patch(
  "/:id/checkout",
  auth,
  autorizaTipo("atendente"),
  reservasController.realizarCheckout
);

router.get(
  "/ocupacao-hoje",
  auth,
  reservasController.ocupacaoHoje
);

module.exports = router;