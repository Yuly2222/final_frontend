// Cambia entre las pestañas de login y registro
document.addEventListener('DOMContentLoaded', function() {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Mostrar formulario de login al hacer clic en la pestaña "Iniciar Sesión"
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    });

    // Mostrar formulario de registro al hacer clic en la pestaña "Registrarse"
    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    });

    // Registro: POST al backend
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('register-username').value.trim();
        const address = document.getElementById('register-address') 
            ? document.getElementById('register-address').value.trim() 
            : "Sin dirección";
        const contact = document.getElementById('register-email').value.trim();
        const pass1 = document.getElementById('register-password').value;
        const pass2 = document.getElementById('register-password2').value;
        const msg = document.getElementById('register-message');

        if (user === "" || contact === "" || pass1 === "" || pass2 === "") {
            msg.textContent = "Por favor, completa todos los campos.";
            return;
        }
        if (pass1 !== pass2) {
            msg.textContent = "Las contraseñas no coinciden.";
            return;
        }

        // Construir el objeto para el backend
        const data = {
            name: user,
            address: address,
            contact: contact,
            buyer_score: "0.00",
            password: pass1,
            is_staff: false
        };

        fetch('https://final-backend2-20lz.onrender.com/app1/usuarios/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                // Registro exitoso, ahora hacer login automático
                fetch('https://final-backend2-20lz.onrender.com/app1/login/', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({name: user, password: pass1})
                })
                .then(res => {
                    if (!res.ok) throw new Error('Error al iniciar sesión automáticamente');
                    return res.json();
                })
                .then(data => {
                    localStorage.setItem('token', data.token);
                    msg.style.color = "green";
                    msg.textContent = "¡Registro y login exitosos!";
                    registerForm.reset();
                    window.location.href = 'parcial.html';
                })
                .catch(() => {
                    msg.style.color = "red";
                    msg.textContent = "Registro exitoso, pero error al iniciar sesión.";
                });
            } else {
                msg.textContent = "Error en el registro. Intenta de nuevo.";
            }
        })
        .catch(() => {
            msg.textContent = "No se pudo conectar al servidor.";
        });
    });
});

// Login: POST al backend
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;
    loginMessage.textContent = '';

    fetch('https://final-backend2-20lz.onrender.com/app1/login/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: user, password: pass})
    })
    .then(res => {
        if (!res.ok) throw new Error('Credenciales inválidas');
        return res.json();
    })
    .then(data => {
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Login exitoso!';
        window.location.href = 'parcial.html';
    })
    .catch(err => {
        loginMessage.style.color = 'red';
        loginMessage.textContent = err.message || 'Error en login';
    });
});


