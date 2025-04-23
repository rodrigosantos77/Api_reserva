const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB(); // conecta no MongoDB Atlas

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota raiz para teste
app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Carregamento de rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

// Middleware de tratamento de erro – deve vir após as rotas
app.use(errorHandler);

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
