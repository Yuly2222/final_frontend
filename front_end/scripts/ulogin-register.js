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

    // Validación simple para login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        const msg = document.getElementById('login-message');
        if (user === "" || pass === "") {
            msg.textContent = "Por favor, completa todos los campos.";
        } else {
            msg.textContent = "Inicio de sesión simulado (agrega backend).";
        }
    });

    // Registro: POST al backend
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('register-username').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const pass1 = document.getElementById('register-password').value;
        const pass2 = document.getElementById('register-password2').value;
        const msg = document.getElementById('register-message');

        if (user === "" || email === "" || pass1 === "" || pass2 === "") {
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
            address: "Sin dirección",
            contact: email,
            buyer_score: "0"
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
                msg.style.color = "green";
                msg.textContent = "¡Registro exitoso!";
                registerForm.reset();
            } else {
                msg.textContent = "Error en el registro. Intenta de nuevo.";
            }
        })
        .catch(() => {
            msg.textContent = "No se pudo conectar al servidor.";
        });
    });
});