
// routes/reservas.routes.js

const express = require('express');
const router = express.Router();


const reservasController = require('../controllers/reservasController');
const auth = require('../middlewares/auth'); // autentica se o token é válido
const autorizaTipo = require('../middlewares/autorizaTipo'); // autoriza com base no tipo de usuário



// ✅ Agora permite que tanto 'cliente' quanto 'atendente' criem reservas
router.post('/', auth, autorizaTipo(['cliente', 'atendente']), reservasController.criarReserva);

// GET continua liberado pra ambos, mas com filtragem no controller
router.get('/', auth, reservasController.listarReservas);

// Essas ações seguem restritas só pro atendente
router.put('/:id', auth, autorizaTipo(['atendente']), reservasController.atualizarReserva);
router.delete('/:id', auth, autorizaTipo(['atendente']), reservasController.deletarReserva);

module.exports = router;