import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './Class/productManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager(path.join(__dirname, '../src/data/products.json'));

const hbs = expressHandlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/realtimeproducts', (await import('./routes/realtimeproducts.router.js')).default);

io.on('connection', async (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id}`);

    const productsList = await productManager.getProducts();
    socket.emit('realtime', productsList);

    socket.on('nuevo-producto', async (product) => {
        try {
            const products = await productManager.getProducts();
            const existingProduct = products.find(p => p.id === product.id);

            if (existingProduct) {
                await productManager.updateProduct(product.id, product);
            } else {
                await productManager.addProduct(product);
            }

            const updatedProductsList = await productManager.getProducts();
            io.emit('realtime', updatedProductsList);
        } catch (error) {
            console.error('Error agregando o actualizando producto:', error);
        }
    });

    socket.on('eliminar-producto', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const updatedProductsList = await productManager.getProducts();
            io.emit('realtime', updatedProductsList);
        } catch (error) {
            console.error('Error eliminando producto:', error);
        }
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Servidor está funcionando en puerto ${PORT}`);
});
