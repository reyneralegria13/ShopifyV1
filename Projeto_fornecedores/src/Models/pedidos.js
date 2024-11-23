const mongoose = require('mongoose')

const PedidoSchema = new mongoose.Schema({
    item: {type: String},
    quantidade: {type: Number}
});

module.exports = PedidoSchema;