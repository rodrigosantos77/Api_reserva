const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Carregar variáveis de ambiente
dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error('❌ Erro: MONGODB_URI não encontrada no arquivo .env');
    process.exit(1);
}

console.log('MongoDB URI carregada com sucesso.');
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;


// ======================================
// ✅ CORREÇÃO DE CORS FINAL
// ======================================

const allowedOrigins = [
  'http://localhost:5173', 
  'https://frontend-sistema-reservas.vercel.app', 
  // Coloque aqui TODOS os domínios do seu Front-end Vercel, como na imagem:
  'https://frontend-sistema-reservas-dfc5t3tq.vercel.app', 
  'https://frontend-sistema-reservas-ncx2.vercel.app', 
  'https://frontend-sistema-reservas-7t078sxxu.vercel.app' 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
};


// Middlewares
app.use(cors(corsOptions)); 
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

// Tratamento de erros
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));