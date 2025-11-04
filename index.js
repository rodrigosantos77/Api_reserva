
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Carregar variáveis de ambiente
dotenv.config();

// Verificar se a URI do MongoDB está carregada
if (!process.env.MONGODB_URI) {
    console.error('❌ Erro: MONGODB_URI não encontrada no arquivo .env');
    process.exit(1);
}

console.log('MongoDB URI carregada com sucesso.');
// Conectar ao MongoDB Atlas
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;


// ======================================
// 🎯 CORREÇÃO DE CORS (COM MÚLTIPLAS ORIGENS VERCEL)
// ======================================

const allowedOrigins = [
  'http://localhost:5173', // Para teste local
  'https://frontend-sistema-reservas.vercel.app', // Alias principal
  'https://frontend-sistema-reservas-dfc5t3tq.vercel.app', // URL de deploy atual
  'https://frontend-sistema-reservas-ncx2.vercel.app', // Outra URL de deploy
  'https://frontend-sistema-reservas-7t078sxxu.vercel.app' // Outra URL do seu painel
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permite requisições sem 'origin' (como apps ou testes) OU que estejam na lista
    if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
};


// Middlewares
app.use(cors(corsOptions)); // APLICA O CORS CORRIGIDO
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const reservasRoutes = require('./routes/reservas.routes');
app.use('/api/reservas', reservasRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));