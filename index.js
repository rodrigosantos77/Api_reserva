
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
// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

//const reservasRoutes = require('./routes/reservas.routes');
//app.use('/api/reservas', reservasRoutes);


// ADICIONE A ROTA DE TESTE DIRETO NO INDEX.JS
app.get('/api/reservas', (req, res) => {
    // Não precisa de auth nem nada, apenas responda OK
    res.status(200).json({ mensagem: 'Rota de reservas FINALMENTE FUNCIONANDO!' });
});

// Health check
//app.get('/', (req, res) => res.send('API funcionando!'));

// Middleware de tratamento de erros
//app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
