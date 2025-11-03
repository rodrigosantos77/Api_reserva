// /home/devserudo/sistema-reservas/backend/routes/reservas.routes.js (FINAL)

const express = require('express');
const router = express.Router();

const reservasController = require('../controllers/reservasController'); // DESCOMENTE
const auth = require('../middlewares/auth'); 
const autorizaTipo = require('../middlewares/autorizaTipo'); 

// ROTA DE TESTE SIMPLES (REMOVER)

// ✅ Agora permite que tanto 'cliente' quanto 'atendente' criem reservas
router.post('/', auth, autorizaTipo(['cliente', 'atendente']), reservasController.criarReserva); // DESCOMENTE

// GET continua liberado pra ambos, mas com filtragem no controller
router.get('/', auth, reservasController.listarReservas); // <--- DESCOMENTE ESTA ROTA

// Essas ações seguem restritas só pro atendente
router.put('/:id', auth, autorizaTipo(['atendente']), reservasController.atualizarReserva); // DESCOMENTE
router.delete('/:id', auth, autorizaTipo(['atendente']), reservasController.deletarReserva); // DESCOMENTE

module.exports = router;