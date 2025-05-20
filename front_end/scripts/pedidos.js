window.addEventListener('DOMContentLoaded', async () => {
    const mensaje = document.getElementById('mensaje-pedidos');
    const tbody = document.querySelector('#tabla-pedidos tbody');

    // Mostrar usuario logueado en el nav
    async function fetchUserProfile() {
        const token = localStorage.getItem('token');
        const userDisplay = document.getElementById('user-display');
        const logoutBtn = document.getElementById('logout-btn');
        const loginBtn = document.querySelector('.login-btn');
        if (!token) {
            userDisplay.textContent = '';
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'inline-block';
            return;
        }
        try {
            const res = await fetch('https://final-backend2-20lz.onrender.com/app1/ordenes/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                // Solo aquí borra el token
                localStorage.removeItem('token');
                throw new Error('Sesión expirada');
            }
            if (!res.ok) throw new Error('Error al obtener perfil');
            const data = await res.json();
            userDisplay.innerHTML = `<span class="user-welcome">Bienvenido, ${data.user.name}</span>`;
            logoutBtn.style.display = 'inline-block';
            loginBtn.style.display = 'none';
        } catch (err) {
            userDisplay.textContent = '';
            logoutBtn.style.display = 'none';
            loginBtn.style.display = 'inline-block';
        }
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'parcial.html';
        });
    }

    await fetchUserProfile();

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

