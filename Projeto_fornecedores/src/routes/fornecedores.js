const express = require('express');
const router = express.Router();
const Fornecedor = require('../Models/fornecedor');

// Listar fornecedores
router.get('/', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.find();
    res.render('fornecedores/index', {
      title: 'Fornecedores',
      style: 'estilos_fornecedores.css', 
      fornecedores
    });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedores' });
  }
});

// Formulário de criação
router.get('/novo', (req, res) => {
  res.render('fornecedores/create', {
    title: 'Adicionar Fornecedor',
    style: 'estilos_adicionar.css'
  });
});

// Adicionar fornecedor
router.post('/', async (req, res) => {
  try {
      const fornecedorData = {
          nome: req.body.nome,
          contato: req.body.contato,
          endereco: req.body.endereco,
          dataEntregaInicio: req.body.dataEntregaInicio,
          dataEntregaFim: req.body.dataEntregaFim,
          pedidos: Array.isArray(req.body.pedidos) ? req.body.pedidos : [req.body.pedidos]
      };
      await Fornecedor.create(fornecedorData);
      res.redirect('/fornecedores');
  } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      res.status(400).render('fornecedores/create', {
          title: 'Adicionar Fornecedor',
          style: 'estilos_adicionar.css',
          error: 'Erro ao adicionar fornecedor. Por favor, tente novamente.'
      });
  }
});

// Formulário de edição
router.get('/edit/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id });
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }
    res.render('fornecedores/edit', { 
      title: 'Editar Fornecedor',
      style: 'estilos_editar.css',
      fornecedor 
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedor para edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedor para edição' });
  }
});

// Atualizar fornecedor
router.post('/edit/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }
    res.redirect('/fornecedores');
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(400).render('fornecedores/edit', {
      title: 'Editar Fornecedor',
      style: 'estilos_editar.css',
      fornecedor: req.body,
      error: 'Erro ao atualizar fornecedor. Por favor, tente novamente.'
    });
  }
});

// Deletar fornecedor
router.get('/delete/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByIdAndDelete(req.params.id);
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }
    res.redirect('/fornecedores');
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).render('error', { message: 'Erro ao deletar fornecedor' });
  }
});

module.exports = router;