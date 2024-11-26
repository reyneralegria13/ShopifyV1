const express = require('express');
const router = express.Router();
const Fornecedor = require('../Models/fornecedor');
const mongoose = require('mongoose')

const{ listarFornecedores, visualizarFornecedor, criarFornecedor, adicionarFornecedor, editarFornecedor,
  atualizarFornecedor, deletarFornecedor, gerarPDF } = require('../controller/controller_fornecedor'); 

const {listarclientes, visualizarCliente, criarLojaForm, adicionarLoja, deletarCliente, editarCliente, atualizarCliente} = require('../controller/controller_clientes');

const { Home } = require('../controller/controller_inicial');
// tela inicial
router.get('/Home', Home);
// Fornecedores
router.get('/Home/fornecedore', listarFornecedores); // Listar fornecedores
router.get('/Home/fornecedores/get/:id', visualizarFornecedor); // Visualizar fornecedor (detalhes em modo leitura)
router.get('/Home/fornecedores/novo', criarFornecedor);// Formulário de criação
router.post('/Home/fornecedores', adicionarFornecedor); // Adicionar fornecedor
router.get('/Home/fornecedores/edit/:id', editarFornecedor);// Formulário de edição
router.post('/Home/fornecedores/edits/:id', atualizarFornecedor); // Atualizar fornecedor
router.get('/Home/fornecedores/delete/:id', deletarFornecedor); // Deletar fornecedor
router.get('/Home/fornecedores/pdf/:id', gerarPDF); // Gerar PDF


// Lojas

router.get('/Home/clientes', listarclientes);// Rota dos clientes
router.get('/Home/clientes/novo', criarLojaForm);// Formulário de criação de loja
router.get('/Home/clientes/get/:id', visualizarCliente);// Visualizar Cliente
router.post('/Home/clientes', adicionarLoja);// Adicionar loja
router.get('/Home/clientes/delete/:id', deletarCliente);// Deletar loja
router.get('/Home/clientes/edit/:id', editarCliente);// Formulário de edição de loja
router.post('/Home/clientes/edits/:id', atualizarCliente);// Atualizar loja

module.exports = router;