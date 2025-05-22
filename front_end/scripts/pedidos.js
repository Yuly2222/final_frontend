window.addEventListener('DOMContentLoaded', async () => {
    const mensaje = document.getElementById('mensaje-pedidos');
    const tbody = document.querySelector('#tabla-pedidos tbody');
    const token = localStorage.getItem('token');
    if (!token) {
        mensaje.textContent = 'Debes iniciar sesión para ver tus pedidos.';
        return;
    }

    // 1) Obtengo perfil para saber si es staff
    let isStaff = false;
    try {
        const perfilRes = await fetch('https://final-backend2-20lz.onrender.com/app1/profile/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        if (perfilRes.ok) {
            const perfil = await perfilRes.json();
            isStaff = perfil.is_staff === true;
        }
    } catch (e) {}

    // 2) Cargo lista de usuarios para mapear nombres
    let usuarios = [];
    try {
        const uRes = await fetch('https://final-backend2-20lz.onrender.com/app1/usuarios/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        if (uRes.ok) usuarios = await uRes.json();
    } catch (e) {}

    // 3) Traigo todas las órdenes
    let pedidos = [];
    try {
        const res = await fetch('https://final-backend2-20lz.onrender.com/app1/ordenes/', {
            headers: { 'Authorization': `Token ${token}` }
        });
        if (!res.ok) throw new Error();
        pedidos = await res.json();
    } catch (err) {
        mensaje.textContent = 'Error al cargar tus pedidos.';
        return;
    }

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
        mensaje.textContent = 'No tienes pedidos registrados.';
        return;
    }

    mensaje.textContent = '';
    tbody.innerHTML = '';

    // 4) Construyo filas
    pedidos.forEach(pedido => {
        const tr = document.createElement('tr');

        // ID
        const tdId = document.createElement('td');
        tdId.textContent = pedido.id;

        // Cliente
        const user = usuarios.find(u => u.id === pedido.user);
        const tdCliente = document.createElement('td');
        tdCliente.textContent = user
            ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username
            : '—';

        // Productos
        const tdProductos = document.createElement('td');
        tdProductos.textContent = pedido.items
            .map(item => `${item.menu_item_name} x${item.quantity}`)
            .join(', ');

        // Total
        const tdTotal = document.createElement('td');
        tdTotal.textContent = `$${(pedido.total_price || 0).toFixed(2)}`;

        // Estado
        const tdEstado = document.createElement('td');
        const estadoTexto = pedido.status === 'pending' ? 'Pendiente' : 'Atendido';
        tdEstado.textContent = estadoTexto;
        tdEstado.dataset.estado = estadoTexto;
        tdEstado.style.color = pedido.status === 'pending' ? 'orange' : 'green';
        tdEstado.style.fontWeight = 'bold';

        tr.append(tdId, tdCliente, tdProductos, tdTotal, tdEstado);

        // Acción (solo staff y si está pendiente)
        if (isStaff) {
            const tdAccion = document.createElement('td');
            if (pedido.status === 'pending') {
                const btn = document.createElement('button');
                btn.textContent = 'Marcar como enviado';
                btn.classList.add('deliver-btn');
                btn.dataset.id = pedido.id;
                tdAccion.appendChild(btn);
            }
            tr.appendChild(tdAccion);
        }

        tbody.appendChild(tr);
    });

    // 5) Handler para marcar como delivered
    if (isStaff) {
        tbody.querySelectorAll('.deliver-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const orderId = btn.dataset.id;
                btn.disabled = true;
                try {
                    const putRes = await fetch(
                        `https://final-backend2-20lz.onrender.com/app1/ordenes/${orderId}/`,
                        {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Token ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status: 'delivered' })
                        }
                    );
                    if (!putRes.ok) throw new Error();
                    // Actualizo UI
                    const row = btn.closest('tr');
                    const estadoCell = row.querySelector('td[data-estado]');
                    estadoCell.textContent = 'Atendido';
                    estadoCell.dataset.estado = 'Atendido';
                    estadoCell.style.color = 'green';
                    btn.remove();
                } catch {
                    btn.disabled = false;
                    alert('No se pudo actualizar el estado.');
                }
            });
        });
    }
});