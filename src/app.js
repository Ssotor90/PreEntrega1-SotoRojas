import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create(); 
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('updateProducts', (products) => {
    io.emit('productList', products);
});

socket.on('disconnect', () => {
    console.log('Usuario desconectado');
});
});

server.listen(8080, () => {
    console.log(`Servidor ON`);
});
