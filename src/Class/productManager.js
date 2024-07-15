import fs from 'fs/promises';

class ProductManager {
    constructor(path) {
    this.path = path;
    }

    async addProduct(product) {
    const products = await this.getProducts();
    if (!this.validateProduct(product)) {
        throw new Error('Producto inválido');
    }
    const newProduct = {
        id: this.generateId(products),
        ...product,
        status: product.status ?? true
    };
    products.push(newProduct);
    await this.saveProducts(products);
    return newProduct;
    }

    validateProduct(product) {
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    return requiredFields.every(field => product[field] != null);
    }

    generateId(products) {
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }

    async getProducts() {
    try {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
    }

    async saveProducts(products) {
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    async updateProduct(id, updatedProduct) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }
    products[index] = { ...products[index], ...updatedProduct };
    await this.saveProducts(products);
    return products[index];
    }

    async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
        throw new Error('Producto no encontrado');
    }
    const deletedProduct = products.splice(index, 1);
    await this.saveProducts(products);
    return deletedProduct[0];
    }
}

export default ProductManager;