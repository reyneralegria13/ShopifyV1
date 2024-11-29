const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
    produto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produto', // Referência ao modelo Produto
    },
    quantidade: {
      type: Number,
      required: true,
    },
  });
  
  module.exports = mongoose.model('Pedido', PedidoSchema);
  
