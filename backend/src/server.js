const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectedUsers = {};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next)=> {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
})

//get,post,put, delete

//req.query = Acessar query params (para filtros)
//req.params = Acessar route params (para edição, delete)
//req.body = Acessar corpo da requisição (para criação, edição)

/*
app.post('/users', (req, res)=> {
    return res.json({ idade : req.query.idade });
});
*/

/*
app.put('/users/:id', (req, res)=> {
    return res.json({ id : req.params.id });
});
*/

//por padrao o express entende, porém não é 100% inteligente no json
//assim para habilitar que o retorno da ferramenta seja em json
app.use(cors());
app.use(express.json());
app.use('/files', express.static( path.resolve(__dirname, '..', 'uploads' ) ) );
app.use(routes);

server.listen(3333);