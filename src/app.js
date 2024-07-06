import express from 'express';
import ProductManager from './class/productManager.js';
import { __dirname } from './utils.js';
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js';

const app = express();
const router = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productManager =  new ProductManager(__dirname + '/data/product.json');

app.post('/', async (req, res)=>{
    const newProduct = req.body
    console.log("new product", newProduct)
    let ifValidate = await productManager.validateProduct(newProduct)
    console.log("ifValidate", ifValidate)
    if (ifValidate){
        await productManager.addProduct(newProduct)
    res.status(201).json({ message: 'Añadido!' })
    }
    else {
    res.status(400).json({ message: 'Faltan campos!' })
    }
})

app.put('/:id', (req, res) => {

})

app.get('/', async (req, res)=> {

})

app.get('/:id', async (req, res) => {

})

app.listen(8080, () =>{
    console.log("servidor ON")
})