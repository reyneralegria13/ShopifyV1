const mongoose =require('mongoose')

const dbUri = "mongodb://localhost:27017/Fornecedores_db"

module.exports = () => mongoose.connect(dbUri)
