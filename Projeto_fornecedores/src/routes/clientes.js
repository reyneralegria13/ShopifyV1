const express = require('express');
const router = express.Router();
const { Home } = require('../controllers/controller_inicial'); // Corrigido o caminho do controlador inicial
const fornRoutes = require('./fornecedores'); // Rotas dos fornecedores
const { listarClientes } = require('../controllers/controller_clientes'); // Corrigido o caminho do controlador de clientes

// Rota da página inicial
router.get('/', Home);

// Rota dos fornecedores (sub-rotas)
router.use('/fornecedores', fornRoutes);

// Rota dos clientes
router.get('/clientes', listarClientes);

module.exports = router;