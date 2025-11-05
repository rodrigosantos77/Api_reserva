
/*
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
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`)); */


// index.js (VERSÃO DE TESTE DE ROTA)

const express = require('express');
const cors = require('cors'); // Manter

// Rotas de teste: NÃO VAMOS IMPORTAR NADA ALÉM DO BÁSICO PARA NÃO QUEBRAR
// const dotenv = require('dotenv');
// const connectDB = require('./config/db'); // COMENTADO
// const errorHandler = require('./middlewares/errorHandler'); // COMENTADO

// const usuarioRoutes = require('./routes/usuarioRoutes'); // COMENTADO
// const reservasRoutes = require('./routes/reservas.routes'); // COMENTADO


// Não precisa carregar variáveis de ambiente para este teste
// dotenv.config();
// Não precisa de conexão com DB para este teste
// connectDB(); 

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================
// 🎯 CORS UNIVERSAL (TESTE EXTREMO)
// ======================================
// Permite que QUALQUER ORIGEM acesse o Back-end
app.use(cors({ origin: '*' }));
app.use(express.json());


// ======================================
// 🎯 ROTA DE TESTE ÚNICA
// Vamos mapear a rota de Login para um teste 200 simples
// ======================================

// URL COMPLETA ESPERADA: https://api-reservas-v3.onrender.com/api/usuarios/login
app.post('/api/usuarios/login', (req, res) => {
    // Retorna 200 para confirmar que a rota foi alcançada
    return res.status(200).json({ mensagem: 'Rota alcançada com sucesso!' });
});


// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor de TESTE rodando na porta ${PORT}`));


