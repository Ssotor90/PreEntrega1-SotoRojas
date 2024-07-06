import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const __dirname = path.resolve(); 

const productsFilePath = path.join(__dirname, 'src', 'data', 'products.json');

const getProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};

router.get('/', (req, res) => {
    const products = getProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

router.get('/:pid', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(req.params.pid));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.post('/', (req, res) => {
    const products = getProducts();
    const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true
    };
    products.push(newProduct);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (productIndex >= 0) {
        const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
        products[productIndex] = updatedProduct;
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.json(updatedProduct);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

router.delete('/:pid', (req, res) => {
    let products = getProducts();
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.pid));
    if (productIndex >= 0) {
        products = products.filter(p => p.id !== parseInt(req.params.pid));
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
        res.status(204).send();
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

export default router;
