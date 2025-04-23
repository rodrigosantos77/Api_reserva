
// controllers/usuarioController.js
const Usuario = require('../models/usuario');

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Buscar todos os usuários
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ erro: 'Nenhum usuário encontrado.' });
    }
    res.status(200).json(usuarios); // Retorna todos os usuários
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};

// Criar um novo usuário
const criarUsuario = async (req, res) => {
    console.log('REQ.BODY em criarUsuario:', req.body);
  const { nome, email, tipoUsuario } = req.body;

  if (!nome || !email || !tipoUsuario) {
    return res.status(400).json({ erro: 'Nome, email e tipo de usuário são obrigatórios.' });
  }

  try {
    const novoUsuario = new Usuario({
      nome,
      email,
      tipoUsuario,
    });

    const usuarioSalvo = await novoUsuario.save();
    res.status(201).json(usuarioSalvo);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
};

module.exports = {
  listarUsuarios,
  criarUsuario,
};
