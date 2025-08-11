
// config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Garante que as variáveis de ambiente sejam carregadas
dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI não está definida no arquivo .env');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado com sucesso: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = connectDB;



