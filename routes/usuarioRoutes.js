const express = require('express');
const router = express.Router();
const { listarUsuarios, criarUsuario, login } = require('../controllers/usuarioController');

// Rotas existentes
router.get('/', listarUsuarios);
router.post('/', criarUsuario);

// ✅ Nova rota de login
router.post('/login', login);

module.exports = router;
