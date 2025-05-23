// --- Variables globales para reutilizar ---
const queryParams = new URLSearchParams(window.location.search);
const totalPrice = queryParams.get('prices'); // string
const productsString = queryParams.get('products'); // string
const idsString = queryParams.get('ids'); // <-- Nuevo: ids separados por coma

// Convierte los IDs a un array de números
const productIds = idsString ? idsString.split(',').map(id => parseInt(id)) : [];

document.addEventListener('DOMContentLoaded', function() {
    // Show the total price in the corresponding field
    document.getElementById('totalPrice').value = `$${totalPrice || "0.00"}`;

    // Display the products and quantities in the cart table
    if (productsString) {
        const products = productsString.split('|');
        const cartTableBody = document.getElementById('cartItems');
        let total = 0;

        products.forEach(product => {
            const [name, quantity] = product.split('=');
            const decodedName = decodeURIComponent(name);
            const productItem = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = decodedName;
            const quantityCell = document.createElement('td');
            quantityCell.textContent = quantity;
            const priceCell = document.createElement('td');
            priceCell.textContent = `$${(parseFloat(totalPrice) / products.length).toFixed(2)}`;

            productItem.appendChild(nameCell);
            productItem.appendChild(quantityCell);
            productItem.appendChild(priceCell);

            cartTableBody.appendChild(productItem);

            total += parseFloat(totalPrice) / products.length;
        });

        document.getElementById('cartTotal').textContent = `Total: $${total.toFixed(2)}`;
    }
});

// Function to handle the "Go Back" button
function goBack() {
    window.history.back();
}

document.getElementById('checkoutForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // 1. Obtener datos del usuario autenticado
    const token = localStorage.getItem('token');
    let user_id = null;
    if (token) {
        try {
            const res = await fetch('https://final-backend2-20lz.onrender.com/app1/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                user_id = user.id;
            }
        } catch (err) {
            alert('No se pudo obtener el usuario. Inicia sesión.');
            return;
        }
    } else {
        alert('Debes iniciar sesión para hacer un pedido.');
        return;
    }

    // 2. Obtener productos y cantidades de la URL
    let items = [];
    if (!productsString || !idsString) {
        alert('El carrito está vacío o faltan los IDs.');
        return;
    }

    const products = productsString.split('|').filter(Boolean);

    products.forEach((product, idx) => {
        const [, quantity] = product.split('=');
        const qty = parseInt(quantity);
        const menu_item_id = productIds[idx]; // El ID viene de la URL
        if (menu_item_id) {
            items.push({
                menu_item_id: menu_item_id,
                quantity: qty
            });
        }
    });

    // 3. Construir el objeto del pedido en el formato solicitado
    const pedido = {
        user_id: user_id,
        datetime: new Date().toISOString(),
        items: items
    };

    // 4. Enviar el pedido al backend
    try {
        const res = await fetch('https://final-backend2-20lz.onrender.com/app1/ordenes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(pedido)
        });
        if (res.ok) {
            alert('¡Pedido realizado con éxito!');
            window.location.href = 'pedidos.html';
        } else {
            alert('Error al enviar el pedido.');
        }
    } catch (err) {
        alert('Error de red al enviar el pedido.');
    }
});
