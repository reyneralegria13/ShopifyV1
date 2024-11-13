const mongoose = require('mongoose');

const FornecedorSchema = new mongoose.Schema({
  nome: String,
  contato: String,
  endereco: String,
  categoria: String,
  status: { type: String, default: 'Ativo' },
});

module.exports = mongoose.model('Fornecedor', FornecedorSchema);
