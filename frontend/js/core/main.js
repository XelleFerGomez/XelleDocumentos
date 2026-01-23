// frontend/js/core/main.js

// 1. Verificar Sesión al inicio
(function checkAuth() {
    const session = localStorage.getItem('lims_user_session');
    if (!session) {
        window.location.href = 'login.html';
    } else {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        // 24 horas de expiración
        if (now - sessionData.timestamp > (24 * 60 * 60 * 1000)) {
            logout();
        }
    }
})();

// Variables globales de la APP
window.app = window.app || {};
window.app.state = {
    currentModule: null,
    loadedScripts: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
});

function loadUserInfo() {
    const session = JSON.parse(localStorage.getItem('lims_user_session'));
    if (session) {
        document.getElementById('userNameDisplay').textContent = session.name;
        document.getElementById('userRoleDisplay').textContent = session.role.toUpperCase().replace('_', ' ');
    }
}

window.logout = function() {
    localStorage.removeItem('lims_user_session');
    window.location.href = 'login.html';
};

// --- NAVEGACIÓN Y CARGA DE MÓDULOS ---

/**
 * Navega a un módulo específico.
 * 1. Oculta el dashboard.
 * 2. Muestra el contenedor de módulos.
 * 3. Carga el script del módulo si no existe.
 * 4. Inicializa el módulo.
 */
window.app.navigateTo = function(moduleName) {
    console.log(`Navegando a: ${moduleName}`);
    
    // UI: Cambiar vistas
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-module').classList.remove('hidden');
    
    // UI: Actualizar Breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    const title = document.getElementById('currentModuleTitle');
    breadcrumb.classList.remove('hidden');
    title.textContent = formatModuleName(moduleName);

    // LÓGICA: Cargar script dinámicamente
    if (!window.app.state.loadedScripts.includes(moduleName)) {
        loadModuleScript(moduleName);
    } else {
        // Si ya está cargado, reinicializarlo
        if (window.app[moduleName] && typeof window.app[moduleName].init === 'function') {
            window.app[moduleName].init();
        }
    }
};

/**
 * Regresa al Dashboard principal
 */
window.app.goHome = function() {
    document.getElementById('view-module').classList.add('hidden');
    document.getElementById('view-module').innerHTML = ''; // Limpiar vista anterior
    document.getElementById('view-dashboard').classList.remove('hidden');
    document.getElementById('breadcrumb').classList.add('hidden');
    window.app.state.currentModule = null;
};

// Helper interno para cargar scripts JS bajo demanda
function loadModuleScript(moduleName) {
    const script = document.createElement('script');
    script.src = `modules/${moduleName}/${moduleName}.js`;
    script.onload = () => {
        console.log(`Script ${moduleName} cargado.`);
        window.app.state.loadedScripts.push(moduleName);
        // Intentar inicializar si el script define el objeto global
        if (window.app[moduleName] && typeof window.app[moduleName].init === 'function') {
            window.app[moduleName].init();
        }
    };
    script.onerror = () => {
        alert(`No se encontró el módulo: ${moduleName}`);
        window.app.goHome();
    };
    document.body.appendChild(script);
}

function formatModuleName(name) {
    const names = {
        'comercial': 'Comercial / Ventas',
        'lab-calidad': 'Control de Calidad',
        'almacen': 'Almacén e Inventario',
        'admin': 'Administración',
        'documentacion': 'Biblioteca SGC',
        'banco-celulas': 'Banco de Células'
    };
    return names[name] || name;
}