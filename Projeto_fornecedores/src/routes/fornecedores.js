const express = require('express');
const router = express.Router();
const Fornecedor = require('../Models/fornecedor');

// Listar fornecedores
router.get('/', async (req, res) => {
  const fornecedores = await Fornecedor.find();
  res.render('fornecedores/index', {
    title: 'Fornecedores',
    style: 'main.css', 
    fornecedores
  });
});


// Formulário de criação
router.get('/novo', (req, res) => {
  res.render('fornecedores/create');
});

// Adicionar fornecedor
router.post('/', async (req, res) => {
  await Fornecedor.create(req.body);
  res.redirect('/fornecedores');
});

// Formulário de edição
router.get('/edit/:id', async (req, res) => {
  const fornecedor = await Fornecedor.findById(req.params.id);
  res.render('fornecedores/edit', { fornecedor });
});

// Atualizar fornecedor
router.post('/edit/:id', async (req, res) => {
  await Fornecedor.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/fornecedores');
});

// Deletar fornecedor
router.get('/delete/:id', async (req, res) => {
  await Fornecedor.findByIdAndDelete(req.params.id);
  res.redirect('/fornecedores');
});

module.exports = router;
