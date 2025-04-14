
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB(); // ← Faz a conexão com o MongoDB

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas
const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
