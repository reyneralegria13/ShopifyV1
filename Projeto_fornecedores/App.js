const mongoose =require('mongoose')

const dbUri = "mongodb+srv://guerreiroleano:808Spinz@clusterteste.5s3qa.mongodb.net/?retryWrites=true&w=majority&appName=ClusterTeste"

module.exports = () => mongoose.connect(dbUri)
