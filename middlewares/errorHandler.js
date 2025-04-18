

// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // log para debug
  
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Erro interno do servidor',
    });
  };
  
  module.exports = errorHandler;
  