
// routes/reservas.routes.js

const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController');
const auth = require('../middlewares/auth'); // middleware de autenticação

// Rotas protegidas com middleware
router.get('/', auth, reservasController.listarReservas);
router.post('/', auth, reservasController.criarReserva);
router.put('/:id', auth, reservasController.atualizarReserva);
router.delete('/:id', auth, reservasController.deletarReserva);

module.exports = router;
