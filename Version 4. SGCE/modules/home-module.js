/* modules/home-module.js */
const HomeModule = {
    init: function() {
        const session = window.Core.Auth.getSession();
        const role = session.role;
        const user = session.name;

        // HTML Base del Menú Principal
        const html = `
            <div class="welcome-text">
                Bienvenido, <strong>${user}</strong>
            </div>

            <div class="menu-grid" id="card-container">
                </div>

            <div class="dashboard-summary">
                <div class="summary-item">
                    <div class="summary-val" id="stat-files">0</div>
                    <div class="summary-lbl">Archivos Hoy</div>
                </div>
                <div class="summary-item">
                    <div class="summary-val" id="stat-alerts">0</div>
                    <div class="summary-lbl">Alertas Activas</div>
                </div>
                <div class="summary-item">
                    <div class="summary-val">En Línea</div>
                    <div class="summary-lbl">Estado Sistema</div>
                </div>
                ${role === 'admin' ? `
                <div class="summary-item">
                    <div class="summary-val" style="color:red; cursor:pointer;" onclick="alert('Ver Logs del sistema')">LOGS</div>
                    <div class="summary-lbl">Admin Only</div>
                </div>` : ''}
            </div>

            <div style="text-align:center; margin-top:40px;">
                 <button class="btn-back" style="border-color:#e74c3c; color:#e74c3c" onclick="window.Core.Auth.logout()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                 </button>
            </div>
        `;

        document.getElementById('workspace').innerHTML = html;
        this.renderCards(role);
    },

    renderCards: function(role) {
        const container = document.getElementById('card-container');
        
        // Definición de Módulos (Configuración)
        const modules = [
            { id: 'banco', label: 'Banco de Células', icon: 'fa-flask', class: 'mc-blue', roles: ['admin', 'banco'] },
            { id: 'calidad', label: 'Lab. Calidad', icon: 'fa-microscope', class: 'mc-purple', roles: ['admin', 'calidad'] },
            { id: 'almacen', label: 'Almacén', icon: 'fa-box-open', class: 'mc-green', roles: ['admin', 'almacen', 'banco', 'calidad'] },
            { id: 'sgc', label: 'Biblioteca SGC', icon: 'fa-book', class: 'mc-orange', roles: ['admin', 'calidad', 'sgc', 'banco'] },
            { id: 'comercial', label: 'Comercial', icon: 'fa-chart-line', class: 'mc-red', roles: ['admin', 'comercial'] },
            { id: 'admin', label: 'Gestión Usuarios', icon: 'fa-users-cog', class: 'mc-dark', roles: ['admin'] }
        ];

        modules.forEach(mod => {
            if (mod.roles.includes(role) || role === 'admin') {
                const card = document.createElement('div');
                card.className = `menu-card ${mod.class}`;
                card.onclick = () => window.Dashboard.loadModule(mod.id); // Navegación SPA
                card.innerHTML = `
                    <span class="icon"><i class="fas ${mod.icon}"></i></span>
                    <span class="label">${mod.label}</span>
                `;
                container.appendChild(card);
            }
        });
    }
};
window.HomeModule = HomeModule;