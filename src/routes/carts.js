import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const __dirname = path.resolve(); 

const cartsFilePath = path.join(__dirname, 'src', 'data', 'carts.json');
const productsFilePath = path.join(__dirname, 'src', 'data', 'products.json');

const getCarts = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

const getProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

router.post('/', (req, res) => {
    const carts = getCarts();
    const newCart = {
        id: carts.length ? carts[carts.length - 1].id + 1 : 1,
        products: []
    };
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const carts = getCarts();
    const cart = carts.find(c => c.id === parseInt(req.params.cid));
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const products = getProducts();
    const cartIndex = carts.findIndex(c => c.id === parseInt(req.params.cid));
    if (cartIndex >= 0) {
        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === parseInt(req.params.pid));
        const productExists = products.find(p => p.id === parseInt(req.params.pid));

        if (productExists) {
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: parseInt(req.params.pid), quantity: 1 });
            }
            fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
            res.json(cart);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

export default router;
