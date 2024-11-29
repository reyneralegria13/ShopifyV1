const Loja = require('../Models/lojas');
const Fornecedor = require('../Models/fornecedor');
const Produto = require('../Models/produtos');
const Pedido = require('../Models/pedidos')
const mongoose = require('mongoose');
const json = require('body-parser/lib/types/json');

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
    // Localizar fornecedor com pedidos populados
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id })
    .populate({
      path: 'pedidos', // Popula os pedidos
      populate: {
        path: 'produto', // Popula o produto dentro do pedido
        model: 'Produto',
      },
    });

    // Verifica se o fornecedor foi encontrado
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }

    // Filtrar pedidos com dados válidos
    const validPedidos = fornecedor.pedidos.map((pedido) => ({
      produto: pedido.produto ? pedido.produto : null,
      quantidade: pedido.quantidade || null,
    }));

    

    // Renderizar a página com os dados do fornecedor e pedidos filtrados
    res.render('fornecedores/get', {
      title: 'Visualizar Fornecedor',
      style: 'fornecedor/estilos_get.css',
      fornecedor: { ...fornecedor.toObject(), pedidos: validPedidos },
    });
  } catch (error) {
    console.error('Erro ao carregar fornecedor:', error);
    res.status(500).render('error', { message: 'Erro ao carregar fornecedor. Por favor, tente novamente mais tarde.' });
  }
};




// Formulário de criação
const criarFornecedor = async (req, res) => {
  const produtos = await Produto.find();

  if (!produtos) {
    return res.status(404).render('error', { message: 'Produtos nao encontrados' });
  }

  res.render('fornecedores/create', {
    title: 'Adicionar Fornecedor',
    style: 'fornecedor/estilos_adicionar.css',
    produtos: produtos
  });


};

// Adicionar fornecedor
const adicionarFornecedor = async (req, res) => {
  try {
    const { nome, contato, endereco, pedidos } = req.body;

    // Garantir que pedidos seja um array
    const pedidosArray = Array.isArray(pedidos) ? pedidos : [];

    // Criar pedidos no banco de dados e obter seus IDs
    const pedidosIds = await Promise.all(
      pedidosArray.map(async (pedido) => {
        // Verificar se os dados do pedido estão completos
        if (!pedido.produto || !pedido.quantidade) {
          throw new Error('Dados do pedido incompletos');
        }

        // Criar um novo pedido no banco de dados
        const novoPedido = new Pedido({
          produto: pedido.produto, // Usar o campo correto definido no modelo
          quantidade: parseInt(pedido.quantidade, 10),
        });

        // Salvar e retornar o ID do pedido
        const pedidoSalvo = await novoPedido.save();
        return pedidoSalvo._id;
      })
    );

    // Criar o fornecedor com os pedidos associados
    const novoFornecedor = new Fornecedor({
      nome,
      contato,
      endereco,
      pedidos: pedidosIds, // Associar os IDs dos pedidos criados
    });

    // Salvar o fornecedor no banco de dados
    await novoFornecedor.save();

    // Redirecionar para a página principal dos fornecedores
    res.redirect('/Home/fornecedore');
  } catch (error) {
    console.error('Erro ao adicionar fornecedor:', error);

    // Renderizar a página de criação com o erro
    res.status(400).render('fornecedores/create', {
      title: 'Adicionar Fornecedor',
      style: 'fornecedor/estilos_adicionar.css',
      error: error.message || 'Erro ao adicionar fornecedor. Por favor, tente novamente.',
    });
  }
};







// Formulário de edição
const editarFornecedor = async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id })
      .populate({
        path: 'pedidos', // Popula os pedidos
        populate: {
          path: 'produto', // Popula o produto dentro do pedido
          model: 'Produto',
        },
      });

    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }

    const validPedidos = fornecedor.pedidos.map((pedido) => ({
      produto: pedido.produto ? pedido.produto : null,
      quantidade: pedido.quantidade || null,
    }));

    console.log('Fornecedor:', JSON.stringify(fornecedor, null, 2));
      console.log('Pedidos válidos:', JSON.stringify(validPedidos, null, 2));
  

    res.render('fornecedores/edit', {
      title: 'Editar Fornecedor',
      style: 'fornecedor/estilos_editar.css',
      fornecedor: { ...fornecedor.toObject(), pedidos: validPedidos },
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
    const fornecedor = await Fornecedor.findOne({ _id: req.params.id })
    .populate({
      path: 'pedidos', // Popula os pedidos
      populate: {
        path: 'produto', // Popula o produto dentro do pedido
        model: 'Produto',
      },
    });
    if (!fornecedor) {
      return res.status(404).render('error', { message: 'Fornecedor não encontrado' });
    }

    const validPedidos = fornecedor.pedidos.map((pedido) => ({
      produto: pedido.produto ? pedido.produto : null,
      quantidade: pedido.quantidade || null,
    }));

    console.log('Fornecedor:', JSON.stringify(fornecedor, null, 2));
    console.log('Pedidos válidos:', JSON.stringify(validPedidos, null, 2));


    res.render('fornecedores/gegarPDF', {
      title: 'Visualizar Fornecedor',
      style: 'fornecedor/estilo_pdf.css',
      fornecedor: { ...fornecedor.toObject(), pedidos: validPedidos },
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
  vincularFornecedorCliente
};    