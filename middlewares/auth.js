const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('❌ Token não enviado no header');
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1]; // pega o que vem depois de "Bearer"
  console.log('🔐 Token recebido no middleware:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);// deve ser a mesma chave usada no login
    console.log('✅ Token decodificado com sucesso:', decoded);

    req.usuarioId = decoded.id;
    req.usuarioTipo = decoded.tipo;
    next(); // permite continuar para a rota protegida
  } catch (err) {
    console.log('❌ Erro ao verificar token:', err.message);
    return res.status(401).json({ erro: 'Token inválido.' });
  }
};

module.exports = authMiddleware;

