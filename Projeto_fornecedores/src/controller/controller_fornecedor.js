const express = require('express');
const Loja = require('../Models/lojas');
const Fornecedor = require('../Models/fornecedor');
const Produto = require('../Models/produtos');
const mongoose = require('mongoose')

// Listar fornecedores
const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.find();
    res.render('fornecedores/index', {
      title: 'Fornecedores',
      style: 'fornecedor/estilos_fornecedores.css', 
      fornecedores
    });
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedores' });
  }
};

// Visualizar fornecedor (detalhes em modo leitura)
const visualizarFornecedor = async (req, res) => {
  try {
    // Use populate para carregar os dados relacionados
    const produtos = await Produto.find();
    console.log(produtos)
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id })
      .populate({
        path: 'pedidos.item', // Popula o campo item dentro de pedidos
        model: 'Produto' // Certifique-se de que Produto está registrado no Mongoose
      });

    console.log(fornecedor);

    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }

    res.render('fornecedores/get', {
      title: 'Visualizar Fornecedor',
      style: 'fornecedor/estilos_get.css',
      fornecedor
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedor:', error);
    res.status(500).json({ message: 'Erro ao carregar fornecedor' });
  }
};



// Formulário de criação
const criarFornecedor = async (req, res) => {
  const produtos = await Produto.find();
  
  if(!produtos) {
    return res.status(404).render('error', { message: 'Produtos nao encontrados' });
  }

  res.render('fornecedores/create', {
    title: 'Adicionar Fornecedor',
    style: 'fornecedor/estilos_adicionar.css',
    produtos: produtos
  });

  console.log(produtos)

};

// Adicionar fornecedor
const adicionarFornecedor = async (req, res) => {
  try {
      // Preparando os dados para o fornecedor, incluindo os pedidos corretamente formatados
      const fornecedorData = {
          nome: req.body.nome,
          contato: req.body.contato,
          endereco: req.body.endereco,
          dataEntregaInicio: req.body.dataEntregaInicio,
          dataEntregaFim: req.body.dataEntregaFim,
          // Aqui, garantimos que o campo 'item' dentro de 'pedidos' é o ObjectId do produto
          pedidos: req.body.produtos.map(produtoId => ({
            item: produtoId, // Aqui você deve garantir que está armazenando o ID do produto
            quantidade: req.body.quantidade // Caso a quantidade seja enviada pelo frontend
          }))
      };

      // Criando o fornecedor no banco de dados
      await Fornecedor.create(fornecedorData);
      
      // Redirecionando para a página de fornecedores
      res.redirect('/Home/fornecedore');
  } catch (error) {
      console.error('Erro ao adicionar fornecedor:', error);
      // Caso ocorra um erro, renderize a página de criação com a mensagem de erro
      res.status(400).render('fornecedores/create', {
          title: 'Adicionar Fornecedor',
          style: 'fornecedor/estilos_adicionar.css',
          error: 'Erro ao adicionar fornecedor. Por favor, tente novamente.'
      });
  }
};



// Formulário de edição
const editarFornecedor = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id });
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }
    res.render('fornecedores/edit', { 
      title: 'Editar Fornecedor',
      style: 'fornecedor/estilos_editar.css',
      fornecedor 
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedor para edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedor para edição' });
  }
};

// Atualizar fornecedor
const atualizarFornecedor = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }
    res.redirect('/Home/fornecedore');
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(400).render('fornecedores/edit', {
      title: 'Editar Fornecedor',
      style: 'fornecedor/estilos_editar.css',
      fornecedor: req.body,
      error: 'Erro ao atualizar fornecedor. Por favor, tente novamente.'
    });
  }
};

// Deletar fornecedor
const deletarFornecedor = async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('error', { message: 'ID inválido fornecido.' });
  }

  try {
    const fornecedor = await Fornecedor.findByIdAndDelete(id);
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado.' });
    }
    res.redirect('/Home/fornecedore');
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).render('error', { message: 'Erro ao deletar fornecedor. Tente novamente mais tarde.' });
  }
};

const gerarPDF = async (req, res) => {
    try {
      const fornecedor = await Fornecedor.findOne({ _id: req.params.id });
      if (!fornecedor) {
        return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
      }
      res.render('fornecedores/gegarPDF', {
        title: 'Visualizar Fornecedor',
        style: 'fornecedor/estilo_pdf.css',
        fornecedor
      });
    } catch (error) {
      console.error('Erro ao carregar fornecedor:', error);
      res.status(500).render('error', { message: 'Erro ao carregar fornecedor' });
    }
  };

  const vincularFornecedorCliente = async (req, res) => {
    try {
        const { id } = req.params; // ID do Fornecedor
        const { clienteId } = req.body; // ID da Loja

        // Valida os IDs
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID do fornecedor inválido." });
        }

        if (!mongoose.Types.ObjectId.isValid(clienteId)) {
            return res.status(400).json({ error: "ID da loja inválido." });
        }

        console.log('ID do fornecedor:', id);
        console.log('ID da loja:', clienteId);

        // Verifica se o fornecedor existe
        const fornecedor = await Fornecedor.findById(id);
        if (!fornecedor) {
            return res.status(404).json({ error: "Fornecedor não encontrado." });
        }

        // Verifica se a loja existe
        const loja = await Loja.findById(clienteId);
        if (!loja) {
            return res.status(404).json({ error: "Loja não encontrada." });
        }

        // Atualiza o fornecedor adicionando a loja sem duplicar
        const fornecedorAtualizado = await Fornecedor.findOneAndUpdate(
            { _id: id },
            { $addToSet: { clientes: clienteId } }, // Adiciona sem duplicar
            { new: true } // Retorna o documento atualizado
        ).populate('clientes'); // Popula as lojas

        res.status(200).json(fornecedorAtualizado);
    } catch (error) {
        console.error('Erro ao vincular fornecedor e cliente:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    listarFornecedores,
    visualizarFornecedor, 
    criarFornecedor, 
    adicionarFornecedor, 
    editarFornecedor, 
    atualizarFornecedor, 
    deletarFornecedor, 
    gerarPDF, 
    vincularFornecedorCliente};    