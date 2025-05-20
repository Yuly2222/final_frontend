window.addEventListener('DOMContentLoaded', async () => {
    const mensaje = document.getElementById('mensaje-pedidos');
    const tbody = document.querySelector('#tabla-pedidos tbody');

    // Petición al backend para obtener pedidos del usuario
    const token = localStorage.getItem('token');
    if (!token) {
        mensaje.textContent = 'Debes iniciar sesión para ver tus pedidos.';
        return;
    }

    try {
        const res = await fetch('https://final-backend2-20lz.onrender.com/app1/ordenes/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('No se pudieron obtener los pedidos');
        const pedidos = await res.json();

        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            mensaje.textContent = 'No tienes pedidos registrados.';
            return;
        }

        // Limpiar mensaje y tabla
        mensaje.textContent = '';
        tbody.innerHTML = '';

        pedidos.forEach((pedido, idx) => {
            const tr = document.createElement('tr');
            // Productos: puede ser un array o string, ajusta según tu backend
            let productos = '';
            if (Array.isArray(pedido.productos)) {
                productos = pedido.productos.map(p => `${p.nombre} x${p.cantidad}`).join(', ');
            } else {
                productos = pedido.productos; // Si ya es string
            }
            tr.innerHTML = `
                <td>${pedido.numero || idx + 1}</td>
                <td>${productos}</td>
                <td>$${pedido.precio ? pedido.precio.toFixed(2) : '0.00'}</td>
                <td>${pedido.estado === 'atendido' ? 'Atendido' : 'Pendiente'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        mensaje.textContent = 'Error al cargar tus pedidos.';
    }
});

