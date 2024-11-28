const mongoose = require('mongoose')
const ProdutoSchema = new mongoose.Schema({
    nome: String,
    preco: Number
  });
  
const Produto = mongoose.model('Produto', ProdutoSchema);
module.exports = Produto