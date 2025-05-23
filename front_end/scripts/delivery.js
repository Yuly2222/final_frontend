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

    // 2. Obtener productos únicamente de la URL
    let items = [];
    let total_price = 0;

    const queryParams = new URLSearchParams(window.location.search);
    const productsString = queryParams.get('products');
    const totalPrice = parseFloat(queryParams.get('prices') || "0");

    // Si tienes los IDs de los productos, ponlos aquí en el mismo orden que en el string del URL
    const productIds = [/* 5, 6, ... */];

    if (!productsString) {
        alert('El carrito está vacío.');
        return;
    }

    const products = productsString.split('|').filter(Boolean);

    products.forEach((product, idx) => {
        const [name, quantity] = product.split('=');
        const decodedName = decodeURIComponent(name);
        const qty = parseInt(quantity);
        const unitPrice = parseFloat((totalPrice / products.length).toFixed(2));
        const subtotal = parseFloat((unitPrice * qty).toFixed(2));
        items.push({
            menu_item_id: productIds[idx] || null, // Si tienes el ID, lo pone, si no, null
            menu_item_name: decodedName,
            menu_item_price: unitPrice,
            quantity: qty,
            subtotal: subtotal
        });
    });
    total_price = items.reduce((sum, item) => sum + item.subtotal, 0);

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
            window.location.href = 'pedidos.html';
        } else {
            alert('Error al enviar el pedido.');
        }
    } catch (err) {
        alert('Error de red al enviar el pedido.');
    }
});
