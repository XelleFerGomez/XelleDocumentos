/* lims-core.js - V11.1 FINAL MERGE */

const KEYS = {
    SESSION: 'xelle_v11_session',
    USERS: 'xelle_v11_users',
    MODULES: 'xelle_v11_modules',
    FORMATS: 'xelle_v11_formats',
    ATTEMPTS: 'xelle_v11_attempts'
};

const Core = {
    init: function() {
        console.log("Core V11.1 Inicializando...");
        if(!localStorage.getItem(KEYS.USERS) && window.SeedData) Core.Data.set(KEYS.USERS, window.SeedData.users);
        if(!localStorage.getItem(KEYS.MODULES) && window.SeedData) Core.Data.set(KEYS.MODULES, window.SeedData.modules);
        if(!localStorage.getItem(KEYS.FORMATS) && window.SeedData) Core.Data.set(KEYS.FORMATS, window.SeedData.formats);
    },

    Auth: {
        login: function(u, p) {
            let attempts = parseInt(localStorage.getItem(KEYS.ATTEMPTS) || '0');
            if(attempts >= 3) return { success: false, status: 'blocked', msg: 'Cuenta bloqueada. Contacte Administración.' };

            const users = Core.Data.get(KEYS.USERS);
            const user = users.find(x => x.user.toLowerCase() === u.toLowerCase());

            if(!user) {
                localStorage.setItem(KEYS.ATTEMPTS, attempts + 1);
                return { success: false, status: 'error', msg: 'Usuario inexistente.' };
            }
            if(user.pass !== p) {
                localStorage.setItem(KEYS.ATTEMPTS, attempts + 1);
                return { success: false, status: 'error', msg: 'Contraseña incorrecta.' };
            }
            if(!user.active) return { success: false, status: 'error', msg: 'Usuario inactivo.' };

            // ÉXITO
            localStorage.setItem(KEYS.ATTEMPTS, '0');
            const s = { id: user.id, name: user.name, role: user.role, modules: user.modules||[], login: Date.now() };
            Core.Data.set(KEYS.SESSION, s);
            return { success: true };
        },
        logout: function() { localStorage.removeItem(KEYS.SESSION); window.location.href = 'index.html'; },
        getSession: function() { return JSON.parse(localStorage.getItem(KEYS.SESSION)); }
    },

    Data: {
        get: (k) => JSON.parse(localStorage.getItem(k)||'[]'),
        set: (k,v) => localStorage.setItem(k, JSON.stringify(v))
    }
};

Core.init();
window.Core = Core;

// --- GESTOR DE VISTAS (LA CONEXIÓN QUE FALTABA) ---
if(typeof $ !== 'undefined' && $('#workspace').length > 0) {
    $(document).ready(function() {
        const s = Core.Auth.getSession();
        if(!s) { window.location.href = 'index.html'; return; }
        
        $('#u-name').text(s.name);
        $('#u-role').text(s.role.toUpperCase());
        
        // Renderizar Sidebar y Logo
        if(window.SeedData && window.SeedData.LOGO_SVG) $('#sidebar-logo-place').html(window.SeedData.LOGO_SVG);
        renderSidebar();
        
        // Cargar vista inicial
        loadView('home');
    });
}

// Router Principal (VINCULA EL CLICK CON LA ACCIÓN)
window.loadView = function(id) {
    $('.menu-item').removeClass('active'); 
    $(`#menu-${id}`).addClass('active');
    if(id==='home') $('#menu-home').addClass('active');
    
    const ws = $('#workspace'); 
    ws.hide();
    
    if(id==='home') renderHome(ws);
    else if(id==='admin') renderAdmin(ws);
    else if(['banco','calidad','almacen','sgc','comercial'].includes(id)) renderFormatsGrid(ws, id);
    else renderGeneric(ws, id);
    
    ws.fadeIn(200);
};

// --- RENDERIZADORES ---

function renderHome(c) {
    const s = Core.Auth.getSession();
    let h = `<div style="text-align:center;margin-bottom:40px;"><h2 style="color:var(--c-navy);">Bienvenido, ${s.name}</h2></div><div class="menu-grid">`;
    const mods = Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order);
    
    mods.forEach(m => {
        // Verificar permisos
        const hasAccess = s.role === 'admin' || (s.modules && (s.modules.includes(m.id) || s.modules.includes('all'))) || s.role === m.id;
        
        if(hasAccess && m.visible) {
            h += `<div class="menu-card ${m.colorClass}" onclick="loadView('${m.id}')">
                <div class="svg-icon">${m.svg}</div>
                <span class="label">${m.label}</span>
            </div>`;
        }
    });
    c.html(h+'</div>');
}

function renderSidebar() {
    const s = Core.Auth.getSession();
    const div = $('#dynamic-menu'); div.empty();
    const mods = Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order);
    
    mods.forEach(m => {
        const hasAccess = s.role === 'admin' || (s.modules && (s.modules.includes(m.id) || s.modules.includes('all'))) || s.role === m.id;
        if(hasAccess && m.visible && m.id!=='home') {
            div.append(`<div class="menu-item" onclick="loadView('${m.id}')" id="menu-${m.id}"><i class="fas fa-circle" style="font-size:6px;"></i> ${m.label}</div>`);
        }
    });
}

function renderFormatsGrid(c, area) {
    // Aquí filtramos los formatos por área (banco, calidad, etc.)
    const fmts = Core.Data.get(KEYS.FORMATS).filter(f => f.area === area); // Quitamos orden por ID para respetar orden del admin
    
    const colorMap = {'banco':'var(--c-teal)', 'calidad':'var(--c-navy)', 'almacen':'var(--c-sky)', 'sgc':'var(--c-warning)', 'comercial':'var(--c-danger)'};
    const color = colorMap[area] || 'var(--c-dark)';
    
    let h = `<h3 style="border-bottom:3px solid ${color};padding-bottom:10px;color:var(--c-navy);">${area.toUpperCase()}</h3>
             <div class="formats-grid">`;
    
    if(fmts.length===0) h+='<p>No hay formatos disponibles en este módulo.</p>';
    
    fmts.forEach(f => {
        h += `<div class="format-card" onclick="window.open('${f.file}')" style="border-left-color:${color};">
            <span class="fmt-code">${f.code}</span>
            <div class="fmt-title">${f.title}</div>
            <a href="#" class="fmt-link" style="color:${color}">ABRIR DOCUMENTO</a>
        </div>`;
    });
    c.html(h+'</div>');
}

// --- ADMINISTRACIÓN TOTAL (CRUD) ---
function renderAdmin(c) {
    const s = Core.Auth.getSession();
    if(s.role !== 'admin') { c.html('<p>Acceso Denegado. Se requieren permisos de Administrador.</p>'); return; }

    const h = `
    <div class="admin-tabs">
        <button class="tab-btn active" onclick="setTab('users')">Usuarios</button>
        <button class="tab-btn" onclick="setTab('formats')">Formatos</button>
        <button class="tab-btn" onclick="setTab('modules')">Módulos</button>
    </div>
    
    <div id="tab-users" class="tab-content">
        <div style="text-align:right;margin-bottom:15px;"><button class="btn-primary" onclick="Admin.openUserModal()" style="width:auto;padding:8px 15px;">+ Nuevo Usuario</button></div>
        <div id="admin-users-list"></div>
    </div>

    <div id="tab-formats" class="tab-content" style="display:none;">
        <div style="background:#fff;padding:15px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <h4>Gestor de Formatos</h4>
            <div style="display:flex;gap:10px;">
                <input id="nf-code" class="form-input" placeholder="Cód" style="width:80px;margin:0;">
                <input id="nf-title" class="form-input" placeholder="Título" style="flex:1;margin:0;">
                <select id="nf-area" class="form-input" style="width:120px;margin:0;"><option value="banco">Banco</option><option value="calidad">Calidad</option><option value="almacen">Almacén</option></select>
                <input id="nf-file" class="form-input" placeholder="file.html" style="flex:1;margin:0;">
                <button onclick="Admin.addFmt()" class="btn-primary" style="width:auto;">+</button>
            </div>
        </div>
        <div id="admin-fmt-list"></div>
    </div>

    <div id="tab-modules" class="tab-content" style="display:none;"><div id="admin-mods-list"></div></div>

    <div id="user-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header"><h3 class="modal-title">Usuario</h3><button class="close-modal" onclick="Admin.closeUserModal()">&times;</button></div>
            <input type="hidden" id="mu-id">
            <input id="mu-user" class="form-input" placeholder="Usuario Login">
            <input id="mu-name" class="form-input" placeholder="Nombre Completo">
            <input id="mu-pass" class="form-input" placeholder="Contraseña">
            <select id="mu-role" class="form-input"><option value="banco">Banco</option><option value="calidad">Calidad</option><option value="admin">Admin</option></select>
            <div style="font-size:12px;font-weight:bold;margin-bottom:5px;">Accesos:</div>
            <div id="mu-modules-check" class="modules-check-grid"></div>
            <div style="margin-top:20px;text-align:right;"><button class="btn-primary" onclick="Admin.saveUser()">Guardar</button></div>
        </div>
    </div>`;
    
    c.html(h);
    Admin.renderUsers(); Admin.renderMods(); Admin.renderFmts();
}

window.setTab = (t) => { $('.tab-content').hide(); $(`#tab-${t}`).fadeIn(); $('.tab-btn').removeClass('active'); $(event.target).addClass('active'); }

const Admin = {
    // USUARIOS
    renderUsers: () => {
        let h = '<table class="std-table"><thead><tr><th>User</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead><tbody>';
        Core.Data.get(KEYS.USERS).forEach((u,i) => {
            h += `<tr><td>${u.user}</td><td>${u.name}</td><td>${u.role}</td>
            <td><button class="action-btn" onclick="Admin.openUserModal(${u.id})">✏️</button><button class="action-btn" onclick="Admin.delUser(${i})" style="color:red;">🗑️</button></td></tr>`;
        }); $('#admin-users-list').html(h+'</tbody></table>');
    },
    openUserModal: (id = null) => {
        $('#mu-id').val(id||''); $('#mu-user').val(''); $('#mu-name').val(''); $('#mu-pass').val('');
        const mods = Core.Data.get(KEYS.MODULES);
        let checks = `<label class="check-item"><input type="checkbox" value="all" id="chk-all"> TODO</label>`;
        mods.forEach(m => checks += `<label class="check-item"><input type="checkbox" value="${m.id}" class="mod-chk"> ${m.label}</label>`);
        $('#mu-modules-check').html(checks);
        if(id) {
            const u = Core.Data.get(KEYS.USERS).find(x => x.id == id);
            if(u) { $('#mu-user').val(u.user); $('#mu-name').val(u.name); $('#mu-pass').val(u.pass); $('#mu-role').val(u.role); }
        }
        $('#user-modal').css('display','flex');
    },
    saveUser: () => {
        const id=$('#mu-id').val(), u=$('#mu-user').val(), n=$('#mu-name').val(), p=$('#mu-pass').val(), r=$('#mu-role').val();
        let ms=[]; if($('#chk-all').is(':checked')) ms.push('all'); else $('.mod-chk:checked').each(function(){ms.push($(this).val())});
        if(!u) return;
        let db=Core.Data.get(KEYS.USERS);
        if(id) { const idx=db.findIndex(x=>x.id==id); if(idx!==-1) db[idx]={...db[idx],user:u,name:n,pass:p,role:r,modules:ms}; }
        else { db.push({id:Date.now(),user:u,name:n,pass:p,role:r,active:true,modules:ms}); }
        Core.Data.set(KEYS.USERS,db); Admin.closeUserModal(); Admin.renderUsers();
    },
    closeUserModal: () => $('#user-modal').hide(),
    delUser: (i) => { if(confirm('¿Borrar?')){ let db=Core.Data.get(KEYS.USERS); db.splice(i,1); Core.Data.set(KEYS.USERS,db); Admin.renderUsers(); } },

    // FORMATOS
    renderFmts: () => {
        let h='<table class="std-table"><thead><tr><th>Orden</th><th>Cód</th><th>Título</th><th>Área</th><th>Acción</th></tr></thead><tbody>';
        Core.Data.get(KEYS.FORMATS).forEach((f,i)=> {
            h += `<tr><td>
                <button onclick="Admin.moveFmt(${i},-1)" class="action-btn">⬆</button>
                <button onclick="Admin.moveFmt(${i},1)" class="action-btn">⬇</button>
            </td><td>${f.code}</td><td>${f.title}</td><td>${f.area}</td>
            <td><button onclick="Admin.editFmt(${i})" class="action-btn">✏️</button><button onclick="Admin.delFmt(${i})" class="action-btn" style="color:red;">🗑️</button></td></tr>`;
        }); $('#admin-fmt-list').html(h+'</tbody></table>');
    },
    moveFmt: (i,d) => { let db=Core.Data.get(KEYS.FORMATS); if(d===-1&&i>0){[db[i],db[i-1]]=[db[i-1],db[i]]} if(d===1&&i<db.length-1){[db[i],db[i+1]]=[db[i+1],db[i]]} Core.Data.set(KEYS.FORMATS,db); Admin.renderFmts(); },
    editFmt: (i) => { let db=Core.Data.get(KEYS.FORMATS), t=prompt("Título:",db[i].title); if(t){db[i].title=t;Core.Data.set(KEYS.FORMATS,db);Admin.renderFmts();} },
    addFmt: () => { const c=$('#nf-code').val(), t=$('#nf-title').val(), a=$('#nf-area').val(), f=$('#nf-file').val(); if(c){ let db=Core.Data.get(KEYS.FORMATS); db.push({id:Date.now(),code:c,title:t,area:a,file:f}); Core.Data.set(KEYS.FORMATS,db); Admin.renderFmts(); } },
    delFmt: (i) => { if(confirm('¿Borrar?')){ let db=Core.Data.get(KEYS.FORMATS); db.splice(i,1); Core.Data.set(KEYS.FORMATS,db); Admin.renderFmts(); } },

    // MODULOS
    renderMods: () => { let h=''; Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order).forEach((m,i)=>{ h+=`<div style="background:white;padding:10px;margin-bottom:5px;border:1px solid #eee;display:flex;justify-content:space-between;"><div><strong>${m.label}</strong></div><div><button onclick="Admin.moveMod(${i},-1)" class="action-btn">⬆</button><button onclick="Admin.moveMod(${i},1)" class="action-btn">⬇</button><button onclick="Admin.toggleMod(${i})" class="action-btn">${m.visible?'👁️':'🚫'}</button></div></div>`}); $('#admin-mods-list').html(h); },
    moveMod: (i,d) => { let db=Core.Data.get(KEYS.MODULES); if(d===-1&&i>0){[db[i],db[i-1]]=[db[i-1],db[i]]} if(d===1&&i<db.length-1){[db[i],db[i+1]]=[db[i+1],db[i]]} db.forEach((m,x)=>m.order=x); Core.Data.set(KEYS.MODULES,db); Admin.renderMods(); renderSidebar(); },
    toggleMod: (i) => { let db=Core.Data.get(KEYS.MODULES); db[i].visible=!db[i].visible; Core.Data.set(KEYS.MODULES,db); Admin.renderMods(); renderSidebar(); }
};

function renderGeneric(c,id){ c.html(`<div style="padding:50px;text-align:center;color:#ccc;"><h3>${id.toUpperCase()}</h3><p>Módulo en construcción...</p></div>`); }