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

});