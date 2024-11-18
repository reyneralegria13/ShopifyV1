const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    item: { type: String, required: true },
    quantidade: { type: Number, required: true }
});

const FornecedorSchema = new mongoose.Schema({
    nome: { type: String, required: true, index: true },
    contato: { type: String, required: true },
    endereco: { type: String, required: true },
    pedidos: [PedidoSchema],
    status: { type: String, enum: ['Ativo', 'Inativo'], default: 'Ativo' },
}, { timestamps: true });

module.exports = mongoose.model('Fornecedor', FornecedorSchema);
