const Loja = require('../Models/lojas');
const Fornecedor = require('../Models/fornecedor');
const Produto = require('../Models/produtos');
const Pedido = require('../Models/pedidos')
const mongoose = require('mongoose');
const json = require('body-parser/lib/types/json');

// Listar fornecedores
const listarProdutos = async (req, res) => {
    try {
      const produtos = await Produto.find();
      console.log('Produtos encontrados:', produtos); // Adicione este log
  
      const produtosComImagens = produtos.map(produto => {
        let imagemBase64 = null;
        if (produto.imagem && produto.imagem.data) {
          imagemBase64 = `data:${produto.imagem.contentType};base64,${produto.imagem.data.toString('base64')}`;
        }
  
        return {
          ...produto._doc,
          imagem: imagemBase64
        };
      });
  
      res.render('produto/index', {
        title: 'Fornecedores',
        style: 'produto/estilo_produto.css',
        produtos: produtosComImagens
      });
    } catch (error) {
      console.error('Erro ao listar fornecedores:', error);
      res.status(500).render('error', { message: 'Erro ao carregar fornecedores' });
    }
  };




const criarProduto = (req, res) => {
    try {
        res.render('produto/create', {
            title: 'Criar Loja', 
            style: 'produto/estilo_addProduto.css', // Estilo específico da página de criação
        });
    } catch (error) {
        console.error('Erro ao carregar formulário de criação:', error);
        res.status(500).render('error', { message: 'Erro ao carregar formulário' });
    }
};

const addProduto = async (req, res) => {
    try {
        const novoproduto = new Produto({
            nome: req.body.nome,
            preco: req.body.preco,
            imagem: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        await novoproduto.save(); // Salva a nova loja no banco de dados
        res.redirect('/Home/produto'); // Redireciona para a lista de lojas após salvar
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        res.status(500).render('error', { message: 'Erro ao adicionar produto' });
    }
};


// Rota para exibir o formulário de edição
const EditarProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).render('error', { message: 'Produto não encontrado' });
    }
    res.render('produto/edit', {
      title: 'Editar Produto',
      style: 'produto/estilo_edit.css',
      produto });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).render('error', { message: 'Erro ao carregar produto' });
  }
};





// Rota para atualizar o produto
const AtualizarProduto = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).render('error', { message: 'Produto não encontrado' });
    }

    produto.nome = req.body.nome;
    produto.preco = req.body.preco;

    if (req.file) {
      produto.imagem.data = req.file.buffer;
      produto.imagem.contentType = req.file.mimetype;
    }

    await produto.save();
    res.redirect('/Home/produto');
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).render('error', { message: 'Erro ao atualizar produto' });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render('error', { message: 'ID inválido fornecido.' });
  }

  try {
    const produto = await Produto.findByIdAndDelete(id);
    if (!produto) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado.' });
    }
    res.redirect('/Home/produto');
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    res.status(500).render('error', { message: 'Erro ao deletar fornecedor. Tente novamente mais tarde.' });
  }
};


module.exports = {
    listarProdutos,
    criarProduto,
    addProduto,
    EditarProduto,
    AtualizarProduto, 
    deletarProduto
}; 