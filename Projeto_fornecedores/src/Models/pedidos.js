const mongoose = require('mongoose')

const PedidoSchema = new mongoose.Schema({
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Produto'},
    quantidade: {type: Number}
});

module.exports = PedidoSchema;