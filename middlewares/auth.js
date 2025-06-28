
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // pega o que vem depois de "Bearer"

  try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET); //modificacao igual do token
    req.usuarioId = decoded.id; // salva o ID do usuário autenticado pra uso futuro
    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido.' });
  }
};

module.exports = authMiddleware;
