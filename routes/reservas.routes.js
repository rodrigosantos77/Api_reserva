// /home/devserudo/sistema-reservas/backend/routes/reservas.routes.js (VERSÃO FINAL DE PRODUÇÃO)

const express = require('express');
const router = express.Router();
const reservasController = require('../controllers/reservasController'); // DEIXAR ATIVA
const auth = require('../middlewares/auth'); // DEIXAR ATIVA
const autorizaTipo = require('../middlewares/autorizaTipo'); // DEIXAR ATIVA

// REMOVER ROTA DE TESTE (router.get('/', (req, res) => { ... }));

// Rotas de Produção Descomentadas:
router.post('/', auth, autorizaTipo(['cliente', 'atendente']), reservasController.criarReserva);
router.get('/', auth, reservasController.listarReservas); 

//Cancelar reserva deveria ser permitido para: cliente (cancelar a própria reserva) e atendente (cancelar qualquer reserva) 
router.put('/:id', auth, autorizaTipo(['cliente', 'atendente']), reservasController.atualizarReserva);

router.delete('/:id', auth, autorizaTipo(['atendente']), reservasController.deletarReserva);

module.exports = router;