const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/fornecedores', { useNewUrlParser: true, useUnifiedTopology: true });

// Configuração do Handlebars
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: 'views/layouts' }));
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rotas
const fornecedoresRouter = require('./routes/fornecedores');
app.use('/fornecedores', fornecedoresRouter);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
