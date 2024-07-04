import express from 'express';
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';

const router = express.Router();

const productManager =  new ProductManager(__dirname + '/data/product.json');


router.get("/", async (req, res) => {
    console.log("get")
    const productList = await productManager.getProductList();
    res.status(201).json({ payload: productList })
})
router.get("/:pid", async (req, res) => {
    const { id } = req.params

    const productFind = await productManager.getProductById(id)

    res.status(201).json({ resultado: productFind })

})
router.post("/", async (req, res) => {

    //sacar los datos del producto desde el objeto REQUEST (req)
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
router.put("/", async (req, res) => {
    const { id } = req.params
    const productoActualizar = req.body

    res.status(203).json({ message: 'Actualizando' })
})
router.delete("/", (req, res) => {

})

export default router;