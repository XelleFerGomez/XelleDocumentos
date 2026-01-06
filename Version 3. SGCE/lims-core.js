/* lims-core.js */

// Recuperamos la sesión (si vienes del login)
const userRole = sessionStorage.getItem('lims_user_role');
const userName = sessionStorage.getItem('lims_user_name');

// PROTECCIÓN: Si no hay rol, volver al login
if (!userRole) {
    // Descomenta la siguiente linea en producción:
    window.location.href = 'index.html';
    // Para pruebas si abres directo el archivo, puedes usar un fallback:
    // alert("Redirigiendo a Login (Modo prueba: no se redirige si comentas la linea arriba)");
}

// 1. BASE DE DATOS INICIAL
let db = [
    { code: 'FO-LC-17', title: 'Recepción de Muestras', area: 'banco', file: 'FO-LC-17.html' },
    { code: 'FO-LC-18', title: 'Evaluación Macroscópica', area: 'banco', file: 'FO-LC-18.html' },
    { code: 'FO-LC-19', title: 'Liberación de Calidad MP', area: 'banco', file: 'FO-LC-19.html' },
    { code: 'FO-LC-20', title: 'Procesamiento de Tejido', area: 'banco', file: 'FO-LC-20.html' },
    { code: 'FO-LC-21', title: 'Bitácora de Cultivo', area: 'banco', file: 'FO-LC-21.html' },
    { code: 'FO-LC-22', title: 'Criopreservación', area: 'banco', file: 'FO-LC-22.html' },
    { code: 'FO-LC-23', title: 'Movimientos de Banco', area: 'banco', file: 'FO-LC-23.html' },
    // FO-LC-39 ELIMINADO por solicitud
    
    { code: 'FO-LC-40', title: 'Prep. Medios de Cultivo', area: 'calidad', file: 'FO-LC-40.html' },
    { code: 'FO-LC-41', title: 'Control Microbiológico', area: 'calidad', file: 'FO-LC-41.html' },
    { code: 'FO-LC-42', title: 'Liofilización de Placenta', area: 'calidad', file: 'FO-LC-42.html' },
    { code: 'FO-LC-43', title: 'Liofilización MC', area: 'calidad', file: 'FO-LC-43.html' },
    { code: 'FO-LC-44', title: 'Liberación Micro Flasks', area: 'calidad', file: 'FO-LC-44.html' },
    { code: 'FO-LC-45', title: 'Embalaje y Envíos', area: 'calidad', file: 'FO-LC-45.html' }
];

// 2. CARGAR FORMATOS PERSONALIZADOS (Agregados por Admin)
const customFormats = JSON.parse(localStorage.getItem('xelle_custom_formats') || '[]');
db = db.concat(customFormats);

$(document).ready(function() {
    $('#user-display').text(userName || "Invitado");
    $('#role-badge').text((userRole || "NONE").toUpperCase());
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    $('#date-display').text(new Date().toLocaleDateString('es-ES', options));

    // Mostrar menú de Admin solo si es Admin
    if (userRole === 'admin') {
        $('#menu-admin').show();
    }

    // Filtrar menús según rol
    if (userRole === 'banco') $('#menu-calidad').hide();
    if (userRole === 'calidad') $('#menu-banco').hide();

    // Cargar vista inicial
    loadView('home');
});

function loadView(viewName) {
    // Seguridad básica de navegación
    if (viewName !== 'home' && viewName !== 'admin' && userRole !== 'admin') {
        if (viewName === 'banco' && userRole === 'calidad') return alert("Acceso Denegado");
        if (viewName === 'calidad' && userRole === 'banco') return alert("Acceso Denegado");
    }

    $('.menu-item').removeClass('active');
    
    if(viewName === 'home') $('.menu-item:eq(0)').addClass('active');
    else if(viewName === 'banco') $('#menu-banco').addClass('active');
    else if(viewName === 'calidad') $('#menu-calidad').addClass('active');
    else if(viewName === 'admin') $('#menu-admin').addClass('active');

    const workspace = $('#workspace');
    workspace.fadeOut(150, function() {
        workspace.empty();
        
        if (viewName === 'home') {
            $('#page-title').text('Resumen General');
            renderHome(workspace);
        } else if (viewName === 'banco') {
            $('#page-title').text('Banco de Células');
            renderGrid(workspace, 'banco');
        } else if (viewName === 'calidad') {
            $('#page-title').text('Laboratorio de Calidad');
            renderGrid(workspace, 'calidad');
        } else if (viewName === 'admin') {
            $('#page-title').text('Administración del Sistema');
            renderAdminPanel(workspace);
        }
        workspace.fadeIn(150);
    });
}

// --- RENDERIZADORES ---

function renderHome(container) {
    let msg = `Bienvenido al Sistema de Gestión Modular XelleLims V1.`;
    
    let html = `
        <div class="grid-container">
            <div class="doc-card" style="border-top-color: var(--accent); grid-column: 1/-1;">
                <h3><i class="fas fa-user-shield"></i> Hola, ${userName || 'Usuario'}</h3>
                <p>${msg}</p>
            </div>
        </div>
        
        <h4 class="section-title" style="margin-top:30px;">📂 Historial de Trabajo Reciente (Local)</h4>
        <div id="history-list"></div>
    `;
    
    container.html(html);
    renderHistory($('#history-list'));
}

function renderHistory(container) {
    const history = JSON.parse(localStorage.getItem('xelle_history_log') || '[]');
    
    if (history.length === 0) {
        container.html('<p style="color:#888; font-style:italic;">No hay registros guardados recientemente en este equipo.</p>');
        return;
    }

    let listHtml = '<div class="grid-container">';
    history.slice(0, 6).forEach(h => { // Mostrar solo los ultimos 6
        const dateObj = new Date(h.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
        
        listHtml += `
            <div class="doc-card" style="border-top-color: #95a5a6;" onclick="openDocById('${h.docId}')">
                <span class="code">GUARDADO</span>
                <h3>${h.docId}</h3>
                <p><strong>${h.title}</strong></p>
                <p style="font-size:12px; margin-top:5px; color:#555;">📅 ${dateStr}<br>👤 ${h.user}</p>
            </div>
        `;
    });
    listHtml += '</div>';
    container.html(listHtml);
}

function renderGrid(container, area) {
    const items = db.filter(item => item.area === area);
    if (items.length === 0) {
        container.html('<p>No hay formatos disponibles en esta sección.</p>');
        return;
    }
    
    let html = '<div class="grid-container">';
    items.forEach(item => {
        const border = area === 'banco' ? 'area-banco' : 'area-calidad';
        const icon = area === 'banco' ? 'fa-dna' : 'fa-vial';
        html += `
            <div class="doc-card ${border}" onclick="openFormat('${item.file}')">
                <span class="code">${item.code}</span>
                <h3><i class="fas ${icon}"></i> ${item.title}</h3>
                <p>Abrir formato original</p>
            </div>`;
    });
    html += '</div>';
    container.html(html);
}

// --- PANEL DE ADMINISTRADOR (AGREGAR FORMATOS) ---
function renderAdminPanel(container) {
    const html = `
        <div class="doc-card" style="max-width: 600px; margin: 0 auto; cursor: default;">
            <h3>➕ Integrar Nuevo Formato</h3>
            <p>Registre un nuevo archivo HTML que haya subido a la carpeta del sistema.</p>
            <hr style="margin: 15px 0; border:0; border-top:1px solid #eee;">
            
            <form id="addFormatForm" onsubmit="event.preventDefault(); saveNewFormat();">
                <label style="display:block; margin-top:10px;">Código (Ej: FO-LC-99):</label>
                <input type="text" id="newCode" class="login-input" required>
                
                <label style="display:block; margin-top:10px;">Título del Formato:</label>
                <input type="text" id="newTitle" class="login-input" required>
                
                <label style="display:block; margin-top:10px;">Nombre del Archivo (Ej: nuevo.html):</label>
                <input type="text" id="newFile" class="login-input" required>
                
                <label style="display:block; margin-top:10px;">Área:</label>
                <select id="newArea" class="login-input" style="height:45px;">
                    <option value="banco">Banco de Células</option>
                    <option value="calidad">Lab. de Calidad</option>
                </select>
                
                <button type="submit" class="btn-login" style="margin-top:20px; background:#2c3e50;">GUARDAR INTEGRACIÓN</button>
            </form>
        </div>
        
        <div style="text-align:center; margin-top:20px;">
            <button onclick="clearCustomFormats()" style="background:red; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer;">Borrar Integraciones Personalizadas</button>
        </div>
    `;
    container.html(html);
}

function saveNewFormat() {
    const code = $('#newCode').val();
    const title = $('#newTitle').val();
    const file = $('#newFile').val();
    const area = $('#newArea').val();
    
    if(!code || !title || !file) return alert("Complete todos los campos");

    const newEntry = { code, title, area, file };
    
    // Guardar en LocalStorage
    const current = JSON.parse(localStorage.getItem('xelle_custom_formats') || '[]');
    current.push(newEntry);
    localStorage.setItem('xelle_custom_formats', JSON.stringify(current));
    
    alert("Formato integrado con éxito. Se actualizará al recargar.");
    location.reload();
}

function clearCustomFormats() {
    if(confirm("¿Eliminar todos los formatos agregados manualmente?")) {
        localStorage.removeItem('xelle_custom_formats');
        location.reload();
    }
}

// --- FUNCIONES GLOBALES ---
function openFormat(file) { window.open(file, '_blank'); }

function openDocById(docId) {
    const item = db.find(d => d.code === docId);
    if(item) {
        window.open(item.file, '_blank');
    } else {
        alert("No se encuentra el archivo asociado al historial: " + docId + ". Puede haber sido renombrado.");
    }
}

function logout() { sessionStorage.clear(); window.location.href = 'index.html'; }