const express = require('express');
const path = require('path');
 
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars'); // Importando 'engine' corretamente
const app = express();

// Conexão com o MongoDB
const connectDb = require('./App');
const fornRoutes = require('./src/routes/fornecedores');
const { title } = require('process');

// Configuração do Handlebars
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fornRoutes)

// Teoricamente essas partes são para facilitar a estilização style
//app.use(express.static('assets'));
app.use(express.static(path.join(__dirname, 'src/assets')));

//essa rota vai para main.hbs (home)

app.get('/', fornRoutes);

// Middleware
app.set('views', path.join(__dirname, 'src/views'));

app.engine('hbs', engine({ 
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    defaultLayout: 'main.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'hbs');

// rota inicial de testes
/*
app.get('/', (req, res) => {
    res.send('Servidor funcionando corretamente');
});
*/

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
