const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
connectDB(); // ← conecta no MongoDB Atlas

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ...suas rotas aqui

app.use(errorHandler); // middleware de erro, se estiver configurado

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// carrega os models
require('./models/usuario'); // <-- Aqui está o que precisa

// Rotas
const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

// Middleware de tratamento de erro – DEIXE AQUI NO FINAL
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
