// Middleware para autorizar tipos específicos de usuário
module.exports = function autorizarTipo(...tiposPermitidos) {
  return (req, res, next) => {
    // Verifica se o usuário existe no request
    if (!req.user) {
      return res.status(401).json({ erro: 'Usuário não autenticado.' });
    }

    // Verifica se o tipo do usuário está entre os permitidos
    if (!tiposPermitidos.includes(req.user.tipoUsuario)) {
      return res.status(403).json({ erro: 'Acesso não autorizado.' });
    }

    next(); // autorizado
  };
};