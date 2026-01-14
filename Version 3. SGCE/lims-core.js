/* FILENAME: lims-core.js 
   DESCRIPCIÓN: Lógica del Dashboard, Navegación y Administración.
   VERSIÓN: 3.2 (Gestión de Usuarios Mejorada)
*/

// --- 1. VALIDACIÓN DE SESIÓN ---
const SESSION_KEY = 'xelle_session_active_v2';
const USER_DB_KEY = 'xelle_db_users_v2';

const sessionRaw = localStorage.getItem(SESSION_KEY);

if (!sessionRaw) {
    console.warn("Acceso denegado. Redirigiendo...");
    window.location.href = 'index.html';
    throw new Error("Stop");
}

const Session = JSON.parse(sessionRaw);
const currentUserRole = Session.role;
const currentUserName = Session.name;

// --- 2. BASE DE DATOS DE FORMATOS ---
let formatsDB = [
    { code: 'FO-LC-17', title: 'Recepción de Muestras', area: 'banco', file: 'FO-LC-17.html' },
    { code: 'FO-LC-18', title: 'Evaluación Macroscópica', area: 'banco', file: 'FO-LC-18.html' },
    { code: 'FO-LC-19', title: 'Liberación de Calidad MP', area: 'banco', file: 'FO-LC-19.html' },
    { code: 'FO-LC-20', title: 'Procesamiento de Tejido', area: 'banco', file: 'FO-LC-20.html' },
    { code: 'FO-LC-21', title: 'Bitácora de Cultivo', area: 'banco', file: 'FO-LC-21.html' },
    { code: 'FO-LC-22', title: 'Criopreservación', area: 'banco', file: 'FO-LC-22.html' },
    { code: 'FO-LC-23', title: 'Movimientos de Banco', area: 'banco', file: 'FO-LC-23.html' },
    { code: 'FO-LC-24', title: 'Dosificación Diaria', area: 'banco', file: 'FO-LC-24.html' },
    
    { code: 'FO-LC-40', title: 'Prep. Medios de Cultivo', area: 'calidad', file: 'FO-LC-40.html' },
    { code: 'FO-LC-41', title: 'Control Microbiológico', area: 'calidad', file: 'FO-LC-41.html' },
    { code: 'FO-LC-42', title: 'Liofilización de Placenta', area: 'calidad', file: 'FO-LC-42.html' },
    { code: 'FO-LC-43', title: 'Liofilización MC', area: 'calidad', file: 'FO-LC-43.html' },
    { code: 'FO-LC-44', title: 'Liberación Micro Flasks', area: 'calidad', file: 'FO-LC-44.html' },
    { code: 'FO-LC-45', title: 'Embalaje y Envíos', area: 'calidad', file: 'FO-LC-45.html' }
];

const customFormats = JSON.parse(localStorage.getItem('xelle_custom_formats') || '[]');
formatsDB = formatsDB.concat(customFormats);

// Estado global para edición
let editingUserIndex = null; 

// --- 3. INICIALIZACIÓN ---
$(document).ready(function() {
    $('#user-display').text(currentUserName);
    $('#role-badge').text(currentUserRole.toUpperCase());
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#date-display').text(new Date().toLocaleDateString('es-ES', options));

    if (currentUserRole === 'admin') {
        $('#menu-admin, #menu-banco, #menu-calidad').show();
    } else if (currentUserRole === 'banco') {
        $('#menu-admin, #menu-calidad').hide();
    } else if (currentUserRole === 'calidad') {
        $('#menu-admin, #menu-banco').hide();
    }

    loadView('home');
});

// --- 4. NAVEGACIÓN ---
window.loadView = function(viewName) {
    if (viewName === 'admin' && currentUserRole !== 'admin') return alert("Acceso Denegado");
    
    $('.menu-item').removeClass('active');
    if(viewName === 'home') $('.menu-item:eq(0)').addClass('active');
    else if(viewName === 'banco') $('#menu-banco').addClass('active');
    else if(viewName === 'calidad') $('#menu-calidad').addClass('active');
    else if(viewName === 'admin') $('#menu-admin').addClass('active');

    const workspace = $('#workspace');
    workspace.fadeOut(150, function() {
        workspace.empty();
        editingUserIndex = null; // Resetear edición al cambiar de vista
        
        switch(viewName) {
            case 'home': renderHome(workspace); break;
            case 'banco': renderGrid(workspace, 'banco'); break;
            case 'calidad': renderGrid(workspace, 'calidad'); break;
            case 'admin': renderAdminPanel(workspace); break;
        }
        workspace.fadeIn(150);
    });
};

// --- 5. VISTAS ---

function renderHome(container) {
    const html = `
        <div class="grid-container">
            <div class="doc-card" style="border-top-color: var(--accent); grid-column: 1/-1;">
                <h3><i class="fas fa-user-circle"></i> Hola, ${currentUserName}</h3>
                <p>Bienvenido al Sistema de Gestión Modular Xelle-LIMS.</p>
            </div>
        </div>
        <h4 class="section-title" style="margin-top:30px;">📂 Historial Reciente (Local)</h4>
        <div id="history-list"></div>
    `;
    container.html(html);
    renderHistory($('#history-list'));
}

function renderHistory(container) {
    let history = [];
    // Buscar archivos guardados en el navegador
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('xelle_doc-')) {
            history.push({ id: key.replace('xelle_', ''), title: 'Archivo Guardado' });
        }
    }
    
    if (history.length === 0) {
        container.html('<p style="color:#999; font-style:italic;">No hay registros recientes.</p>');
        return;
    }

    let html = '<div class="grid-container">';
    history.slice(0, 6).forEach(h => {
        html += `
            <div class="doc-card" onclick="window.open('${h.id.replace('doc-','').toUpperCase()}.html', '_blank')">
                <span class="code">GUARDADO</span>
                <h3>${h.id.replace('doc-','').toUpperCase()}</h3>
                <p>Clic para abrir</p>
            </div>`;
    });
    html += '</div>';
    container.html(html);
}

function renderGrid(container, area) {
    const items = formatsDB.filter(item => item.area === area);
    const title = area === 'banco' ? 'Banco de Células' : 'Laboratorio de Calidad';
    
    let html = `<h3 style="margin-bottom:20px; color:var(--primary);">${title}</h3><div class="grid-container">`;
    
    if (items.length === 0) return container.html('<p>No hay formatos.</p>');

    items.forEach(item => {
        const border = area === 'banco' ? 'area-banco' : 'area-calidad';
        const icon = area === 'banco' ? 'fa-dna' : 'fa-vial';
        html += `
            <div class="doc-card ${border}" onclick="window.open('${item.file}', '_blank')">
                <span class="code">${item.code}</span>
                <h3><i class="fas ${icon}"></i> ${item.title}</h3>
                <p>Abrir Formato</p>
            </div>`;
    });
    html += '</div>';
    container.html(html);
}

// --- PANEL DE ADMINISTRACIÓN MEJORADO ---
function renderAdminPanel(container) {
    const users = JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');
    
    let rows = '';
    users.forEach((u, index) => {
        const isProtected = u.user === 'Xelle_Fer';
        // Estilo visual para inactivos
        const rowStyle = u.active ? '' : 'background-color: #f2f2f2; color: #999;';
        const statusBadge = u.active 
            ? '<span style="color:green; font-weight:bold; font-size:10px;">ACTIVO</span>' 
            : '<span style="color:red; font-weight:bold; font-size:10px;">INACTIVO</span>';

        rows += `
            <tr style="${rowStyle}">
                <td style="padding:8px; border-bottom:1px solid #eee;"><strong>${u.user}</strong></td>
                <td style="padding:8px; border-bottom:1px solid #eee;">${u.name}</td>
                <td style="padding:8px; border-bottom:1px solid #eee;">${u.role}</td>
                <td style="padding:8px; border-bottom:1px solid #eee;">${statusBadge}</td>
                <td style="padding:8px; border-bottom:1px solid #eee; text-align:center;">
                    ${isProtected ? '<i class="fas fa-lock" style="color:#ccc;"></i>' : `
                        <button class="btn-icon btn-edit" onclick="startEditUser(${index})" title="Editar / Inactivar">
                            <i class="fas fa-pencil-alt"></i>
                        </button>
                        <button class="btn-icon btn-delete" onclick="deleteUser(${index})" title="Eliminar Definitivamente">
                            <i class="fas fa-times"></i>
                        </button>
                    `}
                </td>
            </tr>`;
    });

    const html = `
        <h3 style="color:var(--primary); border-bottom:2px solid var(--accent); padding-bottom:10px;">
            <i class="fas fa-cogs"></i> Panel de Administración
        </h3>

        <div style="display:flex; gap:20px; flex-wrap:wrap; margin-top:20px;">
            
            <div class="doc-card" style="flex:2; min-width:350px; cursor:default; border-top-color:var(--primary);">
                <h4>👥 Usuarios del Sistema</h4>
                <div style="max-height:200px; overflow-y:auto; margin-bottom:15px;">
                    <table style="width:100%; font-size:13px; border-collapse:collapse;">
                        <thead style="background:#f4f4f4;">
                            <tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th style="text-align:center;">Acciones</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>

                <hr style="margin:10px 0; border:0; border-top:1px solid #eee;">
                
                <h5 id="form-title" style="color:var(--accent);">➕ Agregar Nuevo Usuario</h5>
                <form onsubmit="event.preventDefault(); window.saveUser();" style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <input id="u_user" class="login-input" placeholder="Usuario (Login)" required>
                    <input id="u_pass" class="login-input" placeholder="Contraseña" required>
                    <input id="u_name" class="login-input" placeholder="Nombre Completo" required style="grid-column:1/-1;">
                    
                    <select id="u_role" class="login-input">
                        <option value="banco">Rol: Banco</option>
                        <option value="calidad">Rol: Calidad</option>
                        <option value="admin">Rol: Admin</option>
                    </select>
                    
                    <select id="u_status" class="login-input">
                        <option value="true">Estado: ACTIVO</option>
                        <option value="false">Estado: INACTIVO</option>
                    </select>

                    <div style="grid-column:1/-1; display:flex; gap:10px;">
                        <button type="submit" id="btn-save-user" class="btn-login" style="background:#27ae60; flex:1;">Guardar Usuario</button>
                        <button type="button" id="btn-cancel-edit" onclick="cancelEdit()" class="btn-login" style="background:#95a5a6; display:none; width:100px;">Cancelar</button>
                    </div>
                </form>
            </div>

            <div class="doc-card" style="flex:1; min-width:300px; cursor:default; border-top-color:#e67e22;">
                <h4>📄 Integrar Formato HTML</h4>
                <p style="font-size:11px; color:#666; line-height:1.4;">
                    <strong>¿Para qué sirve?</strong><br>
                    Si subes manualmente un archivo nuevo (ej: <code>FO-LC-99.html</code>) a la carpeta del sistema, 
                    úsalo aquí para que aparezca en los menús sin reprogramar.
                </p>
                <form onsubmit="event.preventDefault(); window.integrateFormat();" style="margin-top:10px;">
                    <input id="fmt_code" class="login-input" placeholder="Código (FO-LC-XX)" required style="margin-bottom:5px;">
                    <input id="fmt_title" class="login-input" placeholder="Título del Formato" required style="margin-bottom:5px;">
                    <input id="fmt_file" class="login-input" placeholder="Nombre archivo (.html)" required style="margin-bottom:5px;">
                    <select id="fmt_area" class="login-input" style="margin-bottom:10px;">
                        <option value="banco">Banco de Células</option>
                        <option value="calidad">Lab. de Calidad</option>
                    </select>
                    <button type="submit" class="btn-login" style="background:#e67e22;">Registrar</button>
                </form>
            </div>
        </div>
    `;
    container.html(html);
}

// --- FUNCIONES DE ACCIÓN ---

window.startEditUser = function(index) {
    const users = JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');
    const user = users[index];
    
    editingUserIndex = index; // Marcar índice en edición
    
    // Llenar formulario
    $('#u_user').val(user.user);
    $('#u_pass').val(user.pass);
    $('#u_name').val(user.name);
    $('#u_role').val(user.role);
    $('#u_status').val(user.active ? "true" : "false");
    
    // Cambiar UI a modo edición
    $('#form-title').text("✏️ Editando: " + user.user).css('color', '#e67e22');
    $('#btn-save-user').text("Actualizar Datos").css('background', '#e67e22');
    $('#btn-cancel-edit').show();
    $('#u_user').focus();
};

window.cancelEdit = function() {
    editingUserIndex = null;
    $('#u_user').val('');
    $('#u_pass').val('');
    $('#u_name').val('');
    
    $('#form-title').text("➕ Agregar Nuevo Usuario").css('color', 'var(--accent)');
    $('#btn-save-user').text("Guardar Usuario").css('background', '#27ae60');
    $('#btn-cancel-edit').hide();
};

window.saveUser = function() {
    const user = $('#u_user').val().trim();
    const pass = $('#u_pass').val().trim();
    const name = $('#u_name').val().trim();
    const role = $('#u_role').val();
    const active = $('#u_status').val() === "true";

    if(!user || !pass || !name) return alert("Todos los campos son obligatorios");

    let users = JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');

    if (editingUserIndex !== null) {
        // ACTUALIZAR EXISTENTE
        // Si cambió el nombre de usuario, verificar que no choque con otro
        if (users[editingUserIndex].user !== user && users.find(u => u.user === user)) {
            return alert("Ese nombre de usuario ya está ocupado.");
        }
        users[editingUserIndex] = { ...users[editingUserIndex], user, pass, name, role, active };
        alert("Usuario actualizado correctamente.");
    } else {
        // CREAR NUEVO
        if (users.find(u => u.user === user)) return alert("El usuario ya existe.");
        users.push({ id: Date.now(), user, pass, name, role, active });
        alert("Usuario creado.");
    }

    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
    window.loadView('admin'); // Recargar tabla
};

window.deleteUser = function(index) {
    let users = JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');
    if (users[index].user === 'Xelle_Fer') return alert("No se puede eliminar al Superusuario.");
    
    if(confirm("¿Eliminar definitivamente a " + users[index].user + "?\nEsta acción no se puede deshacer.")) {
        users.splice(index, 1);
        localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
        window.loadView('admin');
    }
};

window.integrateFormat = function() {
    const newFmt = {
        code: $('#fmt_code').val(),
        title: $('#fmt_title').val(),
        file: $('#fmt_file').val(),
        area: $('#fmt_area').val()
    };
    const current = JSON.parse(localStorage.getItem('xelle_custom_formats') || '[]');
    current.push(newFmt);
    localStorage.setItem('xelle_custom_formats', JSON.stringify(current));
    alert("Formato registrado.");
    location.reload();
};

window.openFormat = (file) => window.open(file, '_blank');
window.logout = () => { localStorage.removeItem(SESSION_KEY); window.location.href = 'index.html'; };   