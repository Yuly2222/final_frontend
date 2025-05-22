window.addEventListener('DOMContentLoaded', async () => {
    const mensaje = document.getElementById('mensaje-pedidos');
    const tbody = document.querySelector('#tabla-pedidos tbody');
    const token = localStorage.getItem('token');
    if (!token) {
        mensaje.textContent = 'Debes iniciar sesión para ver tus pedidos.';
        return;
    }

    try {
        const res = await fetch('https://final-backend2-20lz.onrender.com/app1/ordenes/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        if (!res.ok) throw new Error('No se pudieron obtener los pedidos');
        const pedidos = await res.json();

        if (!Array.isArray(pedidos) || pedidos.length === 0) {
            mensaje.textContent = 'No tienes pedidos registrados.';
            return;
        }

        mensaje.textContent = '';
        tbody.innerHTML = '';

        pedidos.forEach((pedido, idx) => {
            const tr = document.createElement('tr');
            // Construir la lista de productos
            const productos = pedido.items.map(
                item => `${item.menu_item_name} x${item.quantity}`
            ).join(', ');

            // Estado legible
            const estado = pedido.status === 'pending' ? 'Pendiente' : 'Atendido';

            tr.innerHTML = `
                <td>${pedido.id || idx + 1}</td>
                <td>${productos}</td>
                <td>$${pedido.total_price ? pedido.total_price.toFixed(2) : '0.00'}</td>
                <td data-estado="${estado}">${estado}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        mensaje.textContent = 'Error al cargar tus pedidos.';
    }

    // Verificar si el usuario es staff y mostrar/ocultar el enlace
    const consultaTodosLink = document.getElementById('consultatodoslink');
    if (token && consultaTodosLink) {
        try {
            // Pide el perfil del usuario autenticado
            const res = await fetch('https://final-backend2-20lz.onrender.com/app1/profile/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                // Si el usuario NO es staff, oculta el enlace
                if (user.is_staff === false) {
                    consultaTodosLink.style.display = 'none';
                } else {
                    consultaTodosLink.style.display = 'inline-block';
                }
            } else {
                consultaTodosLink.style.display = 'none';
            }
        } catch (err) {
            consultaTodosLink.style.display = 'none';
        }
    }
});

