
// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');



// Rota de teste para confirmar que as requisições chegam aqui
router.get('/ping', (req, res) => {
    return res.json({ msg: 'pong' });
  });

// Rota para listar todos os usuários
router.get('/usuarios', usuarioController.listarUsuarios);

// Rota para criar um novo usuário (cliente ou atendente)
router.post('/usuarios', usuarioController.criarUsuario);

module.exports = router;
