/* lims-core.js - V8.0 Final Stable */

const KEYS = { SESSION: 'xelle_sess_v8', FORMATS: 'xelle_fmts_v8' };

// BASE DE DATOS DE FORMATOS COMPLETA
const SEED_FORMATS = [
    // Banco
    { id: 16, code: 'FO-LC-16', title: 'Bitácora de Limpieza', area: 'banco', file: 'FO-LC-16.html' },
    { id: 17, code: 'FO-LC-17', title: 'Recepción de Muestras', area: 'banco', file: 'FO-LC-17.html' },
    { id: 18, code: 'FO-LC-18', title: 'Evaluación Macroscópica', area: 'banco', file: 'FO-LC-18.html' },
    { id: 19, code: 'FO-LC-19', title: 'Liberación de Lote', area: 'banco', file: 'FO-LC-19.html' },
    { id: 20, code: 'FO-LC-20', title: 'Procesamiento de Tejido', area: 'banco', file: 'FO-LC-20.html' },
    { id: 21, code: 'FO-LC-21', title: 'Bitácora de Cultivo', area: 'banco', file: 'FO-LC-21.html' },
    { id: 22, code: 'FO-LC-22', title: 'Criopreservación', area: 'banco', file: 'FO-LC-22.html' },
    { id: 23, code: 'FO-LC-23', title: 'Control de Inventario', area: 'banco', file: 'FO-LC-23.html' },
    { id: 24, code: 'FO-LC-24', title: 'Etiquetado Final', area: 'banco', file: 'FO-LC-24.html' },
    // Calidad
    { id: 40, code: 'FO-LC-40', title: 'Preparación de Medios', area: 'calidad', file: 'FO-LC-40.html' },
    { id: 41, code: 'FO-LC-41', title: 'Control Microbiológico', area: 'calidad', file: 'FO-LC-41.html' },
    { id: 42, code: 'FO-LC-42', title: 'Monitoreo Ambiental', area: 'calidad', file: 'FO-LC-42.html' },
    { id: 43, code: 'FO-LC-43', title: 'Control de Partículas', area: 'calidad', file: 'FO-LC-43.html' },
    { id: 44, code: 'FO-LC-44', title: 'Certificado de Análisis', area: 'calidad', file: 'FO-LC-44.html' },
    { id: 45, code: 'FO-LC-45', title: 'Liberación de Producto', area: 'calidad', file: 'FO-LC-45.html' }
];

const Core = {
    init: function() {
        if (!localStorage.getItem(KEYS.FORMATS)) {
            localStorage.setItem(KEYS.FORMATS, JSON.stringify(SEED_FORMATS));
        }
    },
    Auth: {
        login: function(u, p) {
            if (!window.AppConfig) return { success: false, msg: 'Error Config' };
            const users = window.AppConfig.users;
            const found = users.find(x => x.user.toLowerCase() === u.toLowerCase() && x.pass === p);
            if (found) {
                if (!found.active) return { success: false, msg: 'Inactivo' };
                const s = { id: found.id, name: found.name, role: found.role.toLowerCase(), login: Date.now() };
                localStorage.setItem(KEYS.SESSION, JSON.stringify(s));
                return { success: true };
            }
            return { success: false, msg: 'Credenciales Incorrectas' };
        },
        logout: function() { localStorage.removeItem(KEYS.SESSION); window.location.href = 'index.html'; },
        getSession: function() { return JSON.parse(localStorage.getItem(KEYS.SESSION)); }
    },
    Data: {
        getModules: () => window.AppConfig ? window.AppConfig.modules.sort((a,b)=>a.order-b.order) : [],
        getFormats: () => JSON.parse(localStorage.getItem(KEYS.FORMATS) || '[]'),
        setFormats: (d) => localStorage.setItem(KEYS.FORMATS, JSON.stringify(d)),
        getUsers: () => window.AppConfig ? window.AppConfig.users : []
    }
};

Core.init();
window.Core = Core;

// --- DASHBOARD ---
if (typeof $ !== 'undefined' && $('#workspace').length > 0) {
    $(document).ready(function() {
        const s = Core.Auth.getSession();
        if (!s) { window.location.href = 'index.html'; return; }
        $('#u-name').text(s.name);
        $('#u-role').text(s.role.toUpperCase());
        setTimeout(() => { renderSidebar(); loadView('home'); }, 50);
    });
}

window.loadView = function(viewId) {
    $('.menu-item').removeClass('active');
    $(`#menu-${viewId}`).addClass('active');
    if(viewId === 'home') $('#menu-home').addClass('active');
    const ws = $('#workspace');
    ws.hide();
    if(viewId === 'home') renderHome(ws);
    else if(viewId === 'admin') renderAdmin(ws);
    else if(viewId === 'banco' || viewId === 'calidad') renderFormatsGrid(ws, viewId);
    else renderGeneric(ws, viewId);
    ws.fadeIn(200);
};

// RENDERERS
function renderHome(c) {
    const s = Core.Auth.getSession();
    let html = `<div style="text-align:center; margin-bottom:40px;"><h2 style="color:var(--primary);">Bienvenido, ${s.name}</h2></div><div class="menu-grid">`;
    const mods = Core.Data.getModules();
    mods.forEach(m => {
        // Mostrar si rol coincide o es admin
        if((m.roles.includes(s.role) || s.role==='admin') && m.visible) {
            html += `<div class="menu-card ${m.colorClass}" onclick="loadView('${m.id}')">
                <div class="svg-icon">${m.svg}</div><span class="label">${m.label}</span></div>`;
        }
    });
    c.html(html + '</div>');
}

function renderSidebar() {
    const role = Core.Auth.getSession().role;
    const div = $('#dynamic-menu'); div.empty();
    Core.Data.getModules().forEach(m => {
        if((m.roles.includes(role) || role==='admin') && m.visible && m.id!=='home') {
            div.append(`<div class="menu-item" onclick="loadView('${m.id}')" id="menu-${m.id}"><i class="fas fa-circle" style="font-size:6px;"></i> ${m.label}</div>`);
        }
    });
}

function renderFormatsGrid(c, area) {
    const fmts = Core.Data.getFormats().filter(f => f.area === area).sort((a,b) => a.id - b.id);
    const color = area==='banco'?'var(--c-banco)':'var(--c-calidad)';
    let h = `<h3 style="border-bottom:3px solid ${color}; padding-bottom:10px;">${area.toUpperCase()}</h3><div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:20px; margin-top:20px;">`;
    if(fmts.length===0) h+='<p>No hay formatos.</p>';
    fmts.forEach(f => {
        h += `<div onclick="window.open('${f.file}')" style="background:white; padding:20px; border-radius:8px; border-left:5px solid ${color}; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <div style="font-weight:bold; color:#aaa; font-size:12px;">${f.code}</div>
            <div style="font-weight:600; color:#333; margin-top:5px;">${f.title}</div>
        </div>`;
    });
    c.html(h+'</div>');
}

function renderAdmin(c) {
    const role = Core.Auth.getSession().role;
    if(role !== 'admin') { c.html('<p>Acceso Denegado</p>'); return; }
    
    const h = `<div class="admin-tabs"><button class="tab-btn active" onclick="setTab('users')">Usuarios</button><button class="tab-btn" onclick="setTab('formats')">Gestor Formatos</button></div>
    <div id="tab-users" class="tab-content"><p style="background:#e3f2fd; padding:10px;">Gestión en <strong>config-users.js</strong></p><table class="std-table"><thead><tr><th>User</th><th>Nombre</th><th>Rol</th></tr></thead><tbody>${Core.Data.getUsers().map(u=>`<tr><td>${u.user}</td><td>${u.name}</td><td>${u.role}</td></tr>`).join('')}</tbody></table></div>
    <div id="tab-formats" class="tab-content" style="display:none;"><div style="background:#fff; padding:15px; margin-bottom:20px; display:flex; gap:10px; border-radius:8px;"><input id="nf-code" class="form-input" style="margin:0;" placeholder="Cód"><input id="nf-title" class="form-input" style="margin:0;" placeholder="Título"><select id="nf-area" class="form-input" style="margin:0;"><option value="banco">Banco</option><option value="calidad">Calidad</option></select><input id="nf-file" class="form-input" style="margin:0;" placeholder="File.html"><button onclick="AdminAction.add()" class="btn-primary" style="width:auto;">+</button></div><div id="fmt-list"></div></div>`;
    c.html(h); AdminAction.list();
}

window.setTab = function(t){ $('.tab-content').hide(); $(`#tab-${t}`).fadeIn(); $('.tab-btn').removeClass('active'); $(event.target).addClass('active'); }

const AdminAction = {
    list: () => {
        let h='<table class="std-table"><thead><tr><th>Cód</th><th>Título</th><th>Área</th><th>Archivo</th><th></th></tr></thead><tbody>';
        Core.Data.getFormats().forEach((f,i)=> h+=`<tr><td>${f.code}</td><td>${f.title}</td><td>${f.area}</td><td>${f.file}</td><td><button onclick="AdminAction.del(${i})" style="color:red;border:none;background:none;cursor:pointer;">X</button></td></tr>`);
        $('#fmt-list').html(h+'</tbody></table>');
    },
    add: () => { const c=$('#nf-code').val(), t=$('#nf-title').val(), a=$('#nf-area').val(), f=$('#nf-file').val(); if(c&&t&&f){ let db=Core.Data.getFormats(); db.push({id:Date.now(),code:c,title:t,area:a,file:f}); Core.Data.setFormats(db); AdminAction.list(); } },
    del: (i) => { if(confirm('¿Borrar?')){ let db=Core.Data.getFormats(); db.splice(i,1); Core.Data.setFormats(db); AdminAction.list(); } }
}

function renderGeneric(c,id){ c.html(`<div style="padding:50px; text-align:center;"><h3>${id.toUpperCase()}</h3><p>En construcción</p></div>`); }