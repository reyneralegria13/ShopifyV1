const mongoose = require('mongoose');

const LojaSchema = new mongoose.Schema({
    nome: { type: String },
    contato: { type: String },
    filial: { type: String },
    fornecedores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fornecedor' }],
});

module.exports = mongoose.model('Loja', LojaSchema);
