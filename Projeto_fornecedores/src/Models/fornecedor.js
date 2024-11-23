const mongoose = require('mongoose');
const PedidoSchema = require('./pedidos')

const FornecedorSchema = new mongoose.Schema({
    nome: { type: String, index: true },
    contato: { type: String  },
    endereco: { type: String },
    pedidos: [PedidoSchema],
    //clientes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Loja'}],
});


module.exports = mongoose.model('Fornecedor', FornecedorSchema)

