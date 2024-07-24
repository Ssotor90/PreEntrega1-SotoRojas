document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById('productForm');
    const productsList = document.getElementById('productsList');
    const templateScript = document.getElementById('product-template').innerHTML;
    const template = Handlebars.compile(templateScript);

    // Manejar envío del formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const product = Object.fromEntries(formData.entries());
        if (product.id) {
            socket.emit('modificar-producto', { id: parseInt(product.id), info: product });
        } else {
            socket.emit('nuevo-producto', product);
        }
        form.reset();
    });

    // Manejar click en botones de editar y eliminar
    productsList.addEventListener('click', (event) => {
        const button = event.target;
        const id = button.dataset.id;

        if (button.classList.contains('edit-btn')) {
            // Cargar producto en el formulario para edición
            const productElement = button.closest('.product-card');
            form.querySelector('#productId').value = id;
            form.querySelector('#title').value = productElement.querySelector('h2').innerText;
            form.querySelector('#description').value = productElement.querySelector('p:nth-of-type(1)').innerText;
            form.querySelector('#code').value = productElement.querySelector('p:nth-of-type(2)').innerText.split(': ')[1];
            form.querySelector('#price').value = productElement.querySelector('p:nth-of-type(3)').innerText.split('$')[1];
            form.querySelector('#stock').value = productElement.querySelector('p:nth-of-type(4)').innerText.split(': ')[1];
            form.querySelector('#status').checked = productElement.querySelector('p:nth-of-type(5)').innerText === 'Available';
            form.querySelector('#category').value = productElement.querySelector('p:nth-of-type(6)').innerText.split(': ')[1];
        }

        if (button.classList.contains('delete-btn')) {
            // Eliminar producto
            socket.emit('eliminar-producto', parseInt(id));
        }
    });

    // Actualizar la lista de productos
    socket.on('realtime', (products) => {
        productsList.innerHTML = template({ products });
    });

    // Cargar productos iniciales
    socket.emit('get-products');
});
