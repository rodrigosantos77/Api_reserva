// /home/devserudo/sistema-reservas/backend/routes/usuarioRoutes.js (VERSÃO DE TESTE)

const express = require('express');
const router = express.Router();

// Apenas importamos as funções que queremos manter do controller.
// Removemos 'login' daqui para poder substituí-lo.
const { listarUsuarios, criarUsuario } = require('../controllers/usuarioController');


// Rotas existentes
router.get('/', listarUsuarios);
router.post('/', criarUsuario);

// ✅ ROTA DE LOGIN DE TESTE SIMPLES (NÃO CHAMA O CONTROLLER REAL)
router.post('/login', (req, res) => {
    console.log("ROTA DE LOGIN DE TESTE ATIVA!");
    
    // Testa se o e-mail é 'joao@gmail.com' e a senha é '123456'
    if (req.body.email === 'joao@gmail.com' && req.body.senha === '123456') { 
        // Resposta de sucesso simulada (Código 200)
        return res.status(200).json({ 
            token: 'TEST_TOKEN_XYZ', 
            nome: 'João Teste',
            tipo: 'cliente' // Simula o retorno de tipo para o Front-end
        });
    }
    
    // Resposta de erro simulada (Código 401)
    return res.status(401).json({ mensagem: 'Credenciais inválidas de teste' });
});

module.exports = router;