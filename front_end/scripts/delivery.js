document.addEventListener('DOMContentLoaded', function() {
    // Get the query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const totalPrice = queryParams.get('prices'); // Total price
    const productsString = queryParams.get('products'); // Products and quantities

    // Show the total price in the corresponding field
    document.getElementById('totalPrice').value = `$${totalPrice || "0.00"}`;

    // Display the products and quantities in the cart table
    if (productsString) {
        const products = productsString.split('|');  // Split products by "|"
        const cartTableBody = document.getElementById('cartItems'); // The table body where items will be displayed

        let total = 0;

        products.forEach(product => {
            const [name, quantity] = product.split('=');  // Split each product into name and quantity
            const decodedName = decodeURIComponent(name);  // Decode any URL-encoded characters (like %20 for spaces)
            const productItem = document.createElement('tr'); // Create a new table row

            // Create table cells for Product, Quantity, and Price (Price is passed as totalPrice)
            const nameCell = document.createElement('td');
            nameCell.textContent = decodedName;  // Set the product name in the table
            const quantityCell = document.createElement('td');
            quantityCell.textContent = quantity;  // Set the quantity in the table
            const priceCell = document.createElement('td');
            priceCell.textContent = `$${(parseFloat(totalPrice) / products.length).toFixed(2)}`; // Distribute the total price

            // Append the cells to the row
            productItem.appendChild(nameCell);
            productItem.appendChild(quantityCell);
            productItem.appendChild(priceCell);

            // Append the row to the table body
            cartTableBody.appendChild(productItem);

            // Add the price to the total for the cart (you can adjust this logic if needed)
            total += parseFloat(totalPrice) / products.length; // Simplified price distribution
        });

        // Update the total price in the table (if needed)
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
    let user_name = null;
    if (token) {
        try {
            const res = await fetch('https://final-backend2-20lz.onrender.com/app1/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                user_id = user.id;
                user_name = user.name;
            }
        } catch (err) {
            alert('No se pudo obtener el usuario. Inicia sesión.');
            return;
        }
    } else {
        alert('Debes iniciar sesión para hacer un pedido.');
        return;
    }

    // 2. Obtener productos del carrito (localStorage o query string)
    let items = [];
    let total_price = 0;
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length > 0) {
        // Si hay carrito en localStorage, úsalo
        items = cart.map(item => ({
            menu_item_id: item.menu_item_id,
            menu_item_name: item.menu_item_name,
            menu_item_price: item.menu_item_price,
            quantity: item.quantity,
            subtotal: item.menu_item_price * item.quantity
        }));
        total_price = items.reduce((sum, item) => sum + item.subtotal, 0);
    } else {
        // Si el carrito está vacío, intenta leer de la URL
        const queryParams = new URLSearchParams(window.location.search);
        const totalPrice = parseFloat(queryParams.get('prices')) || 0;
        const productsString = queryParams.get('products');
        if (!productsString) {
            alert('El carrito está vacío.');
            return;
        }
        // Ejemplo de productsString: "Veggie=3"
        const products = productsString.split('|');
        items = products.map(product => {
            const [name, quantity] = product.split('=');
            // Aquí debes poner el precio real del producto, si lo tienes.
            // Si solo tienes el precio total, distribúyelo entre los productos.
            // Mejor aún: si puedes pasar el precio de cada producto en el query string, ¡hazlo!
            // Por ahora, lo distribuimos:
            const pricePerUnit = totalPrice / products.length / parseInt(quantity);
            return {
                menu_item_id: null, // Si tienes el ID, agrégalo aquí
                menu_item_name: decodeURIComponent(name),
                menu_item_price: pricePerUnit,
                quantity: parseInt(quantity),
                subtotal: pricePerUnit * parseInt(quantity)
            };
        });
        total_price = items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    if (items.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // 3. Construir el objeto del pedido
    const pedido = {
        user_id: user_id,
        user_name: user_name,
        datetime: new Date().toISOString(),
        total_price: total_price,
        status: "pending",
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
            // Limpia el carrito si quieres
            localStorage.removeItem('cart');
            window.location.href = 'pedidos.html';
        } else {
            alert('Error al enviar el pedido.');
        }
    } catch (err) {
        alert('Error de red al enviar el pedido.');
    }
});
