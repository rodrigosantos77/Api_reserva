// Esse middleware verifica se o tipo do usuário tem permissão de acesso à rota

module.exports = function (tiposPermitidos) {
  return (req, res, next) => {
    const tipo = req.usuarioTipo; // pega o tipo do usuário que veio do token

    if (!tiposPermitidos.includes(tipo)) {
      return res.status(403).json({ erro: 'Acesso não autorizado' }); // bloqueia se o tipo não for permitido
    }

    next(); // continua a execução se o tipo for autorizado
  };
};
