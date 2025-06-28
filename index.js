const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
console.log('MongoDB URI:', process.env.MONGODB_URI);  // Verifique se a URI está correta

connectDB();
const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);
const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

// Health check
app.get('/', (req, res) => res.send('API funcionando!'));

// Error handler
app.use(errorHandler);

// Apenas um listen no final
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
