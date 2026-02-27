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

router.put(
  '/:id',
  auth,
  autorizaTipo('cliente', 'atendente'),
  reservasController.atualizarReserva
);

router.delete(
  '/:id',
  auth,
  autorizaTipo('atendente'),
  reservasController.deletarReserva
);
module.exports = router;