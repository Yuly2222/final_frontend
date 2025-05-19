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

document.getElementById('checkoutForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting to itself

    // Capture form data
    const name = document.getElementById('name').value; // Ensure there's a field with id="name"
    const phone = document.getElementById('tel').value; // Ensure there's a field with id="tel"
    const payment = document.getElementById('paymentMethod').value; // Ensure there's a field with id="paymentMethod"
    const price = document.getElementById('totalPrice').value.replace('$', ''); // Remove the "$" symbol

    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("payment", payment);
    formData.append("price", price);

    const apiUrl = 'https://script.google.com/macros/s/AKfycbwWVbaeifHC5-xYzqdZYj6au25nKct-5x8ve5u0SPt4SaPlZMALdA3_gm6krk0YUcS3/exec';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
    })
    .then(response => {
        if (response.ok) {
            alert('Datos enviados correctamente a Google Sheet.');
            goBack(); // Llama a la función para regresar a la página anterior
        } else {
            alert('Error al enviar los datos. Verifique la URL o los datos enviados.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al enviar los datos.');
    });
});
