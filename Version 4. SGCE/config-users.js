/* config-users.js - BASE DE DATOS INICIAL */

// DEFINICIÓN DE USUARIOS OFICIALES (SEMILLA)
window.SeedUsers = [
    // SUPERUSUARIOS (ADMIN)
    { 
        id: 1, 
        user: 'Xelle_Fer', 
        pass: 'Lufe3120', 
        name: 'Fernando (Dev)', 
        role: 'admin', 
        active: true 
    },
    { 
        id: 2, 
        user: 'Xelle_Admin', 
        pass: 'Xelle', 
        name: 'Administrador General', 
        role: 'admin', 
        active: true 
    },
    // USUARIOS DE MÓDULOS
    { 
        id: 3, 
        user: 'Xelle_Lab', 
        pass: 'Xelle_Calidad', 
        name: 'Laboratorio de Calidad', 
        role: 'calidad', 
        active: true 
    },
    { 
        id: 4, 
        user: 'Xelle_Banco', 
        pass: 'Xelle_Cultivo', 
        name: 'Banco de Células', 
        role: 'banco', 
        active: true 
    },
    { 
        id: 5, 
        user: 'Xelle_Cultivo', 
        pass: 'Xelle_Cultivo', 
        name: 'Fanny (Banco)', 
        role: 'banco', 
        active: true 
    }
];

/* NÚCLEO DEL SISTEMA (LIMS CORE AUTH) */
const Core = {
    KEYS: {
        USERS: 'xelle_db_users_v2', // Cambié la clave para forzar limpieza de errores viejos
        SESSION: 'xelle_session_active_v2'
    },

    init: function() {
        // Asegurar que los usuarios existan al cargar
        this.ensureUsers();
    },

    ensureUsers: function() {
        let currentUsers = this.getUsers();
        
        // Si no hay usuarios o falta Xelle_Fer, reinicializar con la semilla
        const superUser = window.SeedUsers[0]; // Xelle_Fer
        const hasSuper = currentUsers.find(u => u.user === superUser.user);

        if (currentUsers.length === 0 || !hasSuper) {
            console.log("Restaurando base de usuarios...");
            this.saveUsers(window.SeedUsers);
        }
    },

    getUsers: function() {
        return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]');
    },

    saveUsers: function(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    // --- AUTENTICACIÓN ---
    Auth: {
        login: function(username, password) {
            const users = Core.getUsers();
            
            // Búsqueda insensible a mayúsculas para el USUARIO
            const found = users.find(u => 
                u.user.toLowerCase() === username.toLowerCase() && 
                u.pass === password // La contraseña SÍ debe ser exacta
            );

            if (found) {
                if (!found.active) return { success: false, msg: "Usuario desactivado." };
                
                const session = {
                    id: found.id,
                    name: found.name,
                    role: found.role,
                    user: found.user,
                    loginTime: new Date().getTime()
                };
                
                // Usamos localStorage para la sesión (más estable que sessionStorage)
                localStorage.setItem(Core.KEYS.SESSION, JSON.stringify(session));
                return { success: true };
            }
            return { success: false, msg: "Credenciales incorrectas" };
        },

        logout: function() {
            localStorage.removeItem(Core.KEYS.SESSION);
            window.location.href = 'index.html';
        },

        getSession: function() {
            return JSON.parse(localStorage.getItem(Core.KEYS.SESSION) || 'null');
        }
    }
};

// Inicializar base de datos
Core.init();
window.Core = Core;