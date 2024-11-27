const mongoose = require('mongoose')

const ProdutoSchema = new mongoose.Schema({
    nome: {type: String},
    preco: {type: Number},
});

const Produto = mongoose.model('Produto', ProdutoSchema)

module.exports = Produto;