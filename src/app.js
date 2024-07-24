import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url'; // Importar fileURLToPath para obtener la ruta del archivo
import ProductManager from './class/productManager.js';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar el servidor de Express y Socket.IO
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Crear una instancia de ProductManager con la ruta correcta
const productManager = new ProductManager(path.join(__dirname, '../src/data/products.json'));

// Configuración de Handlebars
const hbs = expressHandlebars.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/realtimeproducts', (await import('./routes/realtimeproducts.router.js')).default);

// WebSocket
io.on('connection', async (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Enviar lista de productos al nuevo cliente
    const productsList = await productManager.getProducts();
    socket.emit('realtime', productsList);

    // Manejar la adición de nuevos productos
    socket.on('nuevo-producto', async (product) => {
        try {
            await productManager.addProduct(product);
            const updatedProductsList = await productManager.getProducts();
            io.emit('realtime', updatedProductsList);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    // Manejar la eliminación de productos
    socket.on('eliminar-producto', async (id) => {
        try {
            await productManager.deleteProduct(id);
            const updatedProductsList = await productManager.getProducts();
            io.emit('realtime', updatedProductsList);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
