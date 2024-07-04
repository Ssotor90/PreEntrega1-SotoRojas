import fs from 'node:fs'
import { title } from 'node:process';

class ProductManager {
    constructor(path){
        this.path = path;
        this.productList = [];
    }

    async getProductById(id){
        await this.getProductList();

        return this.productList.find(product => product.id == id);
    }

    async getProductList(){
        const list = await fs.promises.readFile(this.path, 'utf-8')
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
    }

    async addProduct(product){
        await this.getProductList();
        const newProduct = {
            id: 1000,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            status: product.status,
            stock: product.stock,
            category: product.category,
            thumbnails: product.thumbnails
        }

        this.productList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }))
    }

    async validateProduct(product){
        let ifValidate = true 
        if (product.title == null) ifValidate = false
        if (product.description == null) ifValidate = false
        if (product.code == null) ifValidate = false
        if (product.price == null) ifValidate = false
        if (product.status == null) ifValidate = false
        if (product.stock == null) ifValidate = false
        if (product.category == null) ifValidate = false
        if (product.thumbnails == null) ifValidate = false
        console.log("validateProduct", ifValidate)
        return ifValidate
    }


}




export default ProductManager