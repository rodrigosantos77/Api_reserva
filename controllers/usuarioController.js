// controllers/usuarioController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

// Listar todos os usuários
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ erro: 'Nenhum usuário encontrado.' });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};

// Criar um novo usuário
const criarUsuario = async (req, res) => {
  console.log('REQ.BODY em criarUsuario:', req.body);
  const { nome, email, senha, tipoUsuario } = req.body;

  if (!nome || !email || !senha || !tipoUsuario) {
    return res.status(400).json({ erro: 'Nome, email, senha e tipo de usuário são obrigatórios.' });
  }

  try {
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaCriptografada,
      tipoUsuario // ✅ agora bate com o model
    });

    const usuarioSalvo = await novoUsuario.save();
    res.status(201).json(usuarioSalvo);
  }catch (error) {
  console.error("Erro real ao salvar no banco:", error); // ADICIONAR ISSO
  res.status(500).json({ erro: 'Erro ao criar usuário.' });
}
};

// Login com JWT
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha inválida' });
    }

    const token = jwt.sign(
  { id: usuario._id, tipo: usuario.tipoUsuario }, // ← corrigido aqui!
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
  );

    // 🔍 Aqui você vê o token no terminal:
    console.log('TOKEN GERADO:', token);

   res.json({
  token,
  usuario: {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    tipoUsuario: usuario.tipoUsuario
  }
});


  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
};

module.exports = {
  listarUsuarios,
  criarUsuario,
  login
};
