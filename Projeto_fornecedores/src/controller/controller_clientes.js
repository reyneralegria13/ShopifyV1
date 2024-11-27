const express = require('express');
const Loja = require('../Models/lojas'); // Importa o modelo de Loja
const mongoose = require('mongoose');

// Função para listar todas as lojas
const listarclientes = async (req, res) => {
    try {
        const lojas = await Loja.find().populate('fornecedores'); // Busca todas as lojas e popula os fornecedores
        res.render('clientes/index', {
            title: 'Lojas',
            style: 'clientes/estilos_clientes.css', // Estilo específico da página de lojas
            lojas,
            
        });} catch (error) {
        console.error('Erro ao listar lojas:', error);
        res.status(500).render('error', { message: 'Erro ao carregar lojas' });
    }
};

const visualizarCliente = async (req, res) => {
    try {
        const loja = await Loja.findOne({_id: req.params.id});
        if(!loja){
            return res.status(404).render('error', {message: 'Cliente não encontrado'});
        }

        res.render('clientes/get', {
            title: 'Visualizar Cliente',
            style: 'clientes/estilo_getcliente.css',
            loja
        });
        

    } catch (error) {
        console.error('Erro ao carregar cliente: ', error);
        res.status(500).render('error', {message: 'Erro ao carregar cliente'});
    }
};

// Função para renderizar a página de criação de loja
const criarLojaForm = (req, res) => {
    try {
        res.render('clientes/create', {
            title: 'Criar Loja',
            style: 'clientes/estilo_addCliente.css', // Estilo específico da página de criação
        });
    } catch (error) {
        console.error('Erro ao carregar formulário de criação:', error);
        res.status(500).render('error', { message: 'Erro ao carregar formulário' });
    }
};

// Função para adicionar uma nova loja ao banco de dados
const adicionarLoja = async (req, res) => {
    const {fornecedores } = req.body;

    try {
        const novaLoja = new Loja({
            nome: req.body.nome,
            contato: req.body.contato,
            filial: req.body.filial,
            fornecedores,
        });

        await novaLoja.save(); // Salva a nova loja no banco de dados
        res.redirect('/Home/clientes'); // Redireciona para a lista de lojas após salvar
    } catch (error) {
        console.error('Erro ao adicionar loja:', error);
        res.status(500).render('error', { message: 'Erro ao adicionar loja' });
    }
};


const deletarCliente = async (req, res) => {
    const { id } = req.params;

    // Validação do ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).render('error', { message: 'ID inválido fornecido.' });
    }

    try {
        // Tenta encontrar e deletar o cliente pelo ID
        const cliente = await Loja.findByIdAndDelete(id);
        if (!cliente) {
            return res.status(404).render('error', { message: 'Cliente não encontrado.' });
        }

        // Redireciona para a lista de clientes após a exclusão
        res.redirect('/Home/clientes'); // Ajuste o redirecionamento para a rota correta
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).render('error', { message: 'Erro ao deletar cliente. Tente novamente mais tarde.' });
    }
};

// Função para renderizar o formulário de edição de cliente
const editarCliente = async (req, res) => {
    try {
        const cliente = await Loja.findById(req.params.id); // Busca o cliente pelo ID
        if (!cliente) {
            return res.status(404).render('error', { message: 'Cliente não encontrado.' });
        }

        // Renderiza a página de edição com os dados do cliente
        res.render('clientes/edit', {
            title: 'Editar Cliente',
            style: 'clientes/estilo_editcliente.css', // Estilo específico da página de edição
            cliente,
        });
    } catch (error) {
        console.error('Erro ao carregar cliente para edição:', error);
        res.status(500).render('error', { message: 'Erro ao carregar cliente para edição.' });
    }
};

// Função para atualizar os dados do cliente no banco de dados
const atualizarCliente = async (req, res) => {
    const { id } = req.params;

    // Validação do ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).render('error', { message: 'ID inválido fornecido.' });
    }

    try {
        // Atualiza o cliente com os novos dados enviados no corpo da requisição
        const clienteAtualizado = await Loja.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!clienteAtualizado) {
            return res.status(404).render('error', { message: 'Cliente não encontrado.' });
        }

        // Redireciona para a lista de clientes após a atualização bem-sucedida
        res.redirect('/Home/clientes');
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        
        // Renderiza novamente a página de edição com os dados enviados e uma mensagem de erro
        res.status(400).render('clientes/edit', {
            title: 'Editar Cliente',
            style: 'clientes/estilos_editar.css',
            cliente: req.body,
            error: 'Erro ao atualizar cliente. Por favor, tente novamente.',
        });
    }
};

// Exporta as funções para serem usadas em rotas ou outros arquivos
module.exports = { listarclientes, visualizarCliente, criarLojaForm, adicionarLoja, deletarCliente, editarCliente, atualizarCliente };