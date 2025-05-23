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

    // 4) Construyo filas con columnas fijas
    pedidos.forEach(pedido => {
        const tr = document.createElement('tr');

        // N° Pedido
        const tdId = document.createElement('td');
        tdId.textContent = pedido.id;

        // Cliente
        const user = usuarios.find(u => u.id === pedido.user_id);
        const tdCliente = document.createElement('td');
        tdCliente.textContent = user ? user.name : '—';

        // Productos
        const tdProductos = document.createElement('td');
        tdProductos.textContent = Array.isArray(pedido.items) && pedido.items.length > 0
            ? pedido.items.map(item => `${item.menu_item_name} x${item.quantity}`).join(', ')
            : '—';

        // Precio
        const tdTotal = document.createElement('td');
        tdTotal.textContent = `$${(pedido.total_price || 0).toFixed(2)}`;

        // Estado (con botón si es staff y pendiente)
        const tdEstado = document.createElement('td');
        tdEstado.dataset.estado = pedido.status;
        const status = (pedido.status || '').toLowerCase().trim();

        if (status === 'delivered') {
            tdEstado.textContent = 'Atendido';
            tdEstado.style.color = 'green';
            tdEstado.style.fontWeight = 'bold';
        } else {
            const btn = document.createElement('button');
            btn.textContent = 'Marcar como enviado';
            btn.classList.add('deliver-btn');
            btn.dataset.id = pedido.id;
            btn.style.background = 'orange';
            btn.style.color = 'black';
            btn.style.fontWeight = 'bold';
            btn.style.border = '2px solid red';
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                try {
                    const putRes = await fetch(
                        `https://final-backend2-20lz.onrender.com/app1/ordenes/${pedido.id}/`,
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
                    tdEstado.textContent = 'Atendido';
                    tdEstado.style.color = 'green';
                    tdEstado.style.fontWeight = 'bold';
                } catch {
                    btn.disabled = false;
                    alert('No se pudo actualizar el estado.');
                }
            });
            tdEstado.appendChild(btn);
        }

        tr.append(tdId, tdCliente, tdProductos, tdTotal, tdEstado);
        tbody.appendChild(tr);
    });
});
