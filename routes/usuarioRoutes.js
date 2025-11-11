// /home/devserudo/sistema-reservas/backend/routes/usuarioRoutes.js (FINAL)

const express = require('express');
const router = express.Router();
// ✅ Importa TODAS as funções do controller, incluindo 'login'
const { listarUsuarios, criarUsuario, login } = require('../controllers/usuarioController');

// Rotas existentes
router.get('/', listarUsuarios);
router.post('/', criarUsuario);

// ✅ Rota de login de produção
router.post('/login', login); 

module.exports = router;