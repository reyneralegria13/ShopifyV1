const mongoose = require('mongoose')

const ProdutoSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
    imagem: { data: Buffer, contentType: String }
  });
  
const Produto = mongoose.model('Produto', ProdutoSchema);
module.exports = Produto