// frontend/js/core/auth.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar si estamos en el Login para limpiar sesión
    if (window.location.pathname.includes('login.html')) {
        localStorage.removeItem('lims_user_session');
    }

    // 2. Referencias al DOM
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('loginError');

    // 3. Manejador del Evento Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            if (!usernameInput || !passwordInput) {
                showError('Por favor complete todos los campos');
                return;
            }

            attemptLogin(usernameInput, passwordInput);
        });
    }

    // 4. Lógica de Validación
    function attemptLogin(username, password) {
        // Busca en la configuración global cargada
        const usersDB = window.SeedData ? window.SeedData.users : [];
        
        // Simulación de consulta (esto luego será una petición al Backend Spring Boot)
        const userFound = usersDB.find(u => u.username === username && u.password === password);

        if (userFound) {
            const sessionData = {
                id: userFound.id,
                name: userFound.fullName,
                role: userFound.role,
                module: userFound.moduleAccess,
                timestamp: new Date().getTime()
            };

            localStorage.setItem('lims_user_session', JSON.stringify(sessionData));
            
            // Redirección al Dashboard
            window.location.href = 'index.html';
        } else {
            showError();
        }
    }

    // 5. Mostrar Error Visual
    function showError() {
        if(errorAlert) {
            errorAlert.classList.remove('hidden');
            setTimeout(() => {
                errorAlert.classList.add('hidden');
            }, 3000);
        } else {
            alert("Credenciales incorrectas");
        }
    }
});