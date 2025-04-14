
// routes/reservas.routes.js

const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');

router.get('/', reservasController.listarReservas);
router.post('/', reservasController.criarReserva);
router.put('/:id', reservasController.atualizarReserva);
router.delete('/:id', reservasController.deletarReserva);

module.exports = router;
