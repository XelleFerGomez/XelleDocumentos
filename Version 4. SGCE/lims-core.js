/* lims-core.js - V4.2 Core & Router */

const Core = {
    KEYS: { SESSION: 'xelle_session_v4', USERS: 'xelle_users_db' },

    init: function() {
        if(!localStorage.getItem(this.KEYS.USERS) && window.SeedUsers) {
            this.saveUsers(window.SeedUsers);
        }
    },
    
    getUsers: function() { return JSON.parse(localStorage.getItem(this.KEYS.USERS) || '[]'); },
    saveUsers: function(users) { localStorage.setItem(this.KEYS.USERS, JSON.stringify(users)); },

    Auth: {
        login: function(user, pass) {
            const u = Core.getUsers().find(x => x.user.toLowerCase() === user.toLowerCase() && x.pass === pass);
            if(u) {
                if(!u.active) return {success:false, msg:'Usuario inactivo'};
                const session = { id:u.id, name:u.name, role:u.role, user:u.user, login:Date.now() };
                localStorage.setItem(Core.KEYS.SESSION, JSON.stringify(session));
                return {success:true};
            }
            return {success:false, msg:'Credenciales incorrectas'};
        },
        logout: function() {
            localStorage.removeItem(Core.KEYS.SESSION);
            window.location.href = 'index.html';
        },
        getSession: function() {
            const s = localStorage.getItem(Core.KEYS.SESSION);
            return s ? JSON.parse(s) : null;
        },
        check: function() {
            if(!this.getSession()) window.location.href = 'index.html';
        }
    }
};

const Dashboard = {
    init: function() {
        Core.Auth.check();
        const session = Core.Auth.getSession();
        
        // Render Header Info
        document.getElementById('u-name-display').innerText = session.name;
        document.getElementById('u-role-display').innerText = session.role;

        // Cargar Menu Principal
        if(window.HomeModule) window.HomeModule.init();
    },

    loadModule: function(moduleId) {
        const ws = document.getElementById('workspace');
        
        // Router Básico
        switch(moduleId) {
            case 'home':
                window.HomeModule.init();
                break;
            case 'admin':
                if(window.AdminModule) window.AdminModule.init();
                break;
            case 'banco':
                // Aquí en el FUTURO cargaremos el historial específico de banco
                ws.innerHTML = this.getModulePlaceholder('Banco de Células', 'FO-LC-17, FO-LC-20...', 'blue');
                break;
            case 'calidad':
                ws.innerHTML = this.getModulePlaceholder('Lab. Calidad', 'Microbiología, Paneles...', 'purple');
                break;
            case 'almacen':
                ws.innerHTML = this.getModulePlaceholder('Almacén', 'Inventario, Kárdex...', 'green');
                break;
            case 'sgc':
                ws.innerHTML = this.getModulePlaceholder('Biblioteca SGC', 'Manuales y Procedimientos', 'orange');
                break;
            default:
                alert("Módulo en construcción");
        }
    },

    getModulePlaceholder: function(title, desc, color) {
        // Esto es temporal hasta que hagamos cada módulo en el paso siguiente
        return `
            <button class="btn-back" onclick="Dashboard.loadModule('home')">
                <i class="fas fa-arrow-left"></i> Volver al Menú
            </button>
            <h2 style="color:var(--color-${color}); border-bottom:2px solid var(--color-${color}); padding-bottom:10px;">
                ${title}
            </h2>
            <p><strong>Módulo Activo.</strong> Aquí se cargarán los registros históricos de: ${desc}</p>
            <div style="background:white; padding:20px; border-radius:10px; border:1px dashed #ccc; text-align:center; color:#999;">
                [Tabla de Historial ${title} se implementará en la siguiente fase]
            </div>
        `;
    }
};

window.Core = Core;
window.Dashboard = Dashboard;
Core.init();