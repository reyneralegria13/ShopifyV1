const mongoose = require('mongoose');
const PedidoSchema = require('./pedidos'); 

const FornecedorSchema = new mongoose.Schema({
    nome: String,
    contato: String,
    endereco: String,
    pedidos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Pedido'}], // Array de pedidos
    clientes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }]
  });
  
  const Fornecedor = mongoose.model('Fornecedor', FornecedorSchema);
  module.exports = Fornecedor
