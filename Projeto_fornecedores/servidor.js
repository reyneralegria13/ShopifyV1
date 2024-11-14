const express = require('express');
const path = require('path');
 
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars'); // Importando 'engine' corretamente
const app = express();

// Conexão com o MongoDB
const connectDb = require('./App');
const fornRoutes = require('./src/routes/fornecedores');
// Configuração do Handlebars
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "assets")));

//essa rota vai para main.hbs (home)
app.use('/fornecedores', fornRoutes);

// Middleware
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({ 
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main.hbs' 
}));
app.set('view engine', 'hbs');

// rota inicial de testes
app.get('/', (req, res) => {
    res.send('Servidor funcionando corretamente');
});

// Rotas
connectDb()
.then(data=>{
    console.log('Conectado ao banco de dados\n');
    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000\n')
    }).on('error', err => {
        console.log('Erro ao iniciar o servidor\n',err);
    });
})
.catch(error=>{
    console.log('Erro ao conectar ao banco de dados');
    console.log(error);
});
