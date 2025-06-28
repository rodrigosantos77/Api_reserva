const express = require('express');
const router = express.Router();
const { listarUsuarios, criarUsuario } = require('../controllers/usuarioController');

router.get('/', listarUsuarios);
router.post('/', criarUsuario);

module.exports = router;
