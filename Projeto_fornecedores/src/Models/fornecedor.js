const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    item: String,
    quantidade: Number
});

const FornecedorSchema = new mongoose.Schema({
    nome: String,
    contato: String,
    endereco: String,
    dataEntregaInicio: Date,
    dataEntregaFim: Date,
    pedidos: [PedidoSchema],
    status: { type: String, default: 'Ativo' },
});

module.exports = mongoose.model('Fornecedor', FornecedorSchema);