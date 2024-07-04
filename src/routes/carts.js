import express from 'express';
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';

const router = express.Router();

const productManager =  new ProductManager(__dirname + '/data/product.json');


router.get("/:cid", (req, res) => {

})
router.post("/", async (req, res) => {

})

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    //mi metodo cartManager.addProductOnCart
})

export default router;