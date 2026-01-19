/* lims-core.js - V10.1 Full Functionality */

const KEYS = {
    SESSION: 'xelle_v10_session',
    USERS: 'xelle_v10_users',
    MODULES: 'xelle_v10_modules',
    FORMATS: 'xelle_v10_formats',
    ATTEMPTS: 'xelle_v10_attempts'
};

const Core = {
    init: function() {
        // Cargar Semillas si LS está vacío
        if (!localStorage.getItem(KEYS.USERS) && window.SeedData) {
            Core.Data.set(KEYS.USERS, window.SeedData.users);
        }
        if (!localStorage.getItem(KEYS.MODULES) && window.SeedData) {
            Core.Data.set(KEYS.MODULES, window.SeedData.modules);
        }
        if (!localStorage.getItem(KEYS.FORMATS) && window.SeedData) {
            Core.Data.set(KEYS.FORMATS, window.SeedData.formats);
        }
    },

    Auth: {
        login: function(u, p) {
            let attempts = parseInt(localStorage.getItem(KEYS.ATTEMPTS) || '0');
            if (attempts >= 3) return { success: false, msg: 'Bloqueado. Contacte Admin.' };

            const users = Core.Data.get(KEYS.USERS);
            const user = users.find(x => x.user.toLowerCase() === u.toLowerCase());

            if (!user) {
                localStorage.setItem(KEYS.ATTEMPTS, attempts + 1);
                return { success: false, msg: 'Usuario no encontrado.' };
            }
            if (user.pass !== p) {
                localStorage.setItem(KEYS.ATTEMPTS, attempts + 1);
                return { success: false, msg: 'Contraseña incorrecta.' };
            }
            if (!user.active) return { success: false, msg: 'Usuario inactivo.' };

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

// --- UI LOGIC ---
if (typeof $ !== 'undefined' && $('#workspace').length > 0) {
    $(document).ready(function() {
        const s = Core.Auth.getSession();
        if (!s) { window.location.href = 'index.html'; return; }
        $('#u-name').text(s.name);
        $('#u-role').text(s.role.toUpperCase());
        renderSidebar(); loadView('home');
    });
}

window.loadView = function(id) {
    $('.menu-item').removeClass('active'); $(`#menu-${id}`).addClass('active');
    if(id==='home') $('#menu-home').addClass('active');
    const ws = $('#workspace'); ws.hide();
    
    if(id==='home') renderHome(ws);
    else if(id==='admin') renderAdmin(ws);
    else if(['banco','calidad','almacen','sgc'].includes(id)) renderFormatsGrid(ws, id);
    else renderGeneric(ws, id);
    ws.fadeIn(200);
}

function renderHome(c) {
    const s = Core.Auth.getSession();
    let h = `<div style="text-align:center;margin-bottom:30px;"><h2 style="color:var(--c-navy);">Bienvenido, ${s.name}</h2></div><div class="menu-grid">`;
    const mods = Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order);
    mods.forEach(m => {
        if((m.roles.includes(s.role) || s.role==='admin') && m.visible) {
            h += `<div class="menu-card ${m.colorClass}" onclick="loadView('${m.id}')"><div style="width:60px;margin-bottom:15px;color:var(--c-navy);">${m.svg}</div><span class="label">${m.label}</span></div>`;
        }
    });
    c.html(h+'</div>');
}

function renderSidebar() {
    const s = Core.Auth.getSession();
    const div = $('#dynamic-menu'); div.empty();
    Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order).forEach(m => {
        if((m.roles.includes(s.role) || s.role==='admin') && m.visible && m.id!=='home') {
            div.append(`<div class="menu-item" onclick="loadView('${m.id}')" id="menu-${m.id}"><i class="fas fa-circle" style="font-size:6px;"></i> ${m.label}</div>`);
        }
    });
}

function renderFormatsGrid(c, area) {
    // NOTA: Ya no ordenamos por ID, sino por el orden del array para respetar los cambios del Admin
    const fmts = Core.Data.get(KEYS.FORMATS).filter(f => f.area === area);
    const color = area==='banco'?'var(--c-teal)':(area==='calidad'?'var(--c-navy)':'var(--c-sky)');
    let h = `<h3 style="border-bottom:3px solid ${color};padding-bottom:10px;color:var(--c-navy);">${area.toUpperCase()}</h3><div class="formats-grid">`;
    if(fmts.length===0) h+='<p>No hay formatos.</p>';
    fmts.forEach(f => {
        h += `<div class="format-card" onclick="window.open('${f.file}')" style="border-left-color:${color};"><span class="fmt-code">${f.code}</span><div class="fmt-title">${f.title}</div><a href="#" class="fmt-link" style="color:${color}">ABRIR</a></div>`;
    });
    c.html(h+'</div>');
}

// --- ADMIN TOTAL ---
function renderAdmin(c) {
    const s = Core.Auth.getSession();
    if(s.role !== 'admin') { c.html('<p>Acceso Denegado</p>'); return; }

    const h = `
    <div class="admin-tabs"><button class="tab-btn active" onclick="setTab('modulos')">Módulos</button><button class="tab-btn" onclick="setTab('formatos')">Formatos</button><button class="tab-btn" onclick="setTab('usuarios')">Usuarios</button></div>
    
    <div id="tab-modulos" class="tab-content"><div id="admin-mods-list"></div></div>

    <div id="tab-formatos" class="tab-content" style="display:none;">
        <div style="background:#fff;padding:15px;margin-bottom:20px;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            <h4>Agregar Formato</h4>
            <div style="display:flex;gap:10px;">
                <input id="nf-code" class="form-input" placeholder="Cód" style="width:80px;">
                <input id="nf-title" class="form-input" placeholder="Título" style="flex:1;">
                <select id="nf-area" class="form-input"><option value="banco">Banco</option><option value="calidad">Calidad</option><option value="almacen">Almacén</option></select>
                <input id="nf-file" class="form-input" placeholder="file.html">
                <button onclick="Admin.addFmt()" class="btn-primary" style="width:auto;">+</button>
            </div>
        </div>
        <div id="admin-fmt-list"></div>
    </div>

    <div id="tab-usuarios" class="tab-content" style="display:none;">
        <div style="margin-bottom:10px;text-align:right;"><button class="btn-primary" onclick="Admin.addUser()" style="width:auto;">+ Nuevo Usuario</button></div>
        <div id="admin-users-list"></div>
    </div>`;
    
    c.html(h);
    Admin.renderMods(); Admin.renderFmts(); Admin.renderUsers();
}

window.setTab = (t) => { $('.tab-content').hide(); $(`#tab-${t}`).fadeIn(); $('.tab-btn').removeClass('active'); $(event.target).addClass('active'); };

const Admin = {
    // --- FORMATOS (EDITAR Y MOVER) ---
    renderFmts: () => {
        let h='<table class="std-table"><thead><tr><th>Orden</th><th>Cód</th><th>Título</th><th>Área</th><th>Acciones</th></tr></thead><tbody>';
        Core.Data.get(KEYS.FORMATS).forEach((f,i)=> {
            h += `<tr>
                <td>
                    <button onclick="Admin.moveFmt(${i},-1)" class="action-btn">⬆</button>
                    <button onclick="Admin.moveFmt(${i},1)" class="action-btn">⬇</button>
                </td>
                <td>${f.code}</td><td>${f.title}</td><td>${f.area}</td>
                <td>
                    <button onclick="Admin.editFmt(${i})" class="action-btn">✏️</button>
                    <button onclick="Admin.delFmt(${i})" class="action-btn" style="color:red;">🗑️</button>
                </td>
            </tr>`;
        });
        $('#admin-fmt-list').html(h+'</tbody></table>');
    },
    moveFmt: (i, dir) => {
        let db = Core.Data.get(KEYS.FORMATS);
        if(dir===-1 && i>0) { [db[i], db[i-1]] = [db[i-1], db[i]]; }
        if(dir===1 && i<db.length-1) { [db[i], db[i+1]] = [db[i+1], db[i]]; }
        Core.Data.set(KEYS.FORMATS, db); Admin.renderFmts();
    },
    editFmt: (i) => {
        let db = Core.Data.get(KEYS.FORMATS);
        let title = prompt("Editar Título:", db[i].title);
        let code = prompt("Editar Código:", db[i].code);
        if(title && code) { db[i].title = title; db[i].code = code; Core.Data.set(KEYS.FORMATS, db); Admin.renderFmts(); }
    },
    addFmt: () => {
        const c=$('#nf-code').val(), t=$('#nf-title').val(), a=$('#nf-area').val(), f=$('#nf-file').val();
        if(c&&t&&f){ let db=Core.Data.get(KEYS.FORMATS); db.push({id:Date.now(),code:c,title:t,area:a,file:f}); Core.Data.set(KEYS.FORMATS,db); Admin.renderFmts(); }
    },
    delFmt: (i) => { if(confirm('¿Borrar?')){ let db=Core.Data.get(KEYS.FORMATS); db.splice(i,1); Core.Data.set(KEYS.FORMATS,db); Admin.renderFmts(); } },

    // --- MÓDULOS ---
    renderMods: () => {
        let h=''; Core.Data.get(KEYS.MODULES).sort((a,b)=>a.order-b.order).forEach((m,i)=>{
            h+=`<div style="background:white;padding:10px;margin-bottom:5px;border:1px solid #eee;display:flex;justify-content:space-between;align-items:center;">
                <div><strong style="color:var(--c-teal)">${m.label}</strong></div>
                <div>
                    <button onclick="Admin.moveMod(${i},-1)" class="action-btn">⬆</button>
                    <button onclick="Admin.moveMod(${i},1)" class="action-btn">⬇</button>
                    <button onclick="Admin.toggleMod(${i})" class="action-btn">${m.visible?'👁️':'🚫'}</button>
                    <button onclick="Admin.editMod(${i})" class="action-btn">✏️</button>
                </div></div>`;
        }); $('#admin-mods-list').html(h);
    },
    moveMod: (i,d) => { let db=Core.Data.get(KEYS.MODULES); if(d===-1&&i>0){[db[i],db[i-1]]=[db[i-1],db[i]]} if(d===1&&i<db.length-1){[db[i],db[i+1]]=[db[i+1],db[i]]} db.forEach((m,x)=>m.order=x); Core.Data.set(KEYS.MODULES,db); Admin.renderMods(); renderSidebar(); },
    toggleMod: (i) => { let db=Core.Data.get(KEYS.MODULES); db[i].visible=!db[i].visible; Core.Data.set(KEYS.MODULES,db); Admin.renderMods(); renderSidebar(); },
    editMod: (i) => { let db=Core.Data.get(KEYS.MODULES), n=prompt("Título:",db[i].label); if(n){db[i].label=n; Core.Data.set(KEYS.MODULES,db); Admin.renderMods(); renderSidebar();} },

    // --- USUARIOS ---
    renderUsers: () => {
        let h='<table class="std-table"><thead><tr><th>User</th><th>Nombre</th><th>Rol</th><th>Acción</th></tr></thead><tbody>';
        Core.Data.get(KEYS.USERS).forEach((u,i)=>{
            h+=`<tr><td>${u.user}</td><td>${u.name}</td><td>${u.role}</td><td><button onclick="Admin.toggleUser(${i})" class="action-btn">${u.active?'✅':'🚫'}</button><button onclick="Admin.delUser(${i})" class="action-btn" style="color:red;">🗑️</button></td></tr>`;
        }); $('#admin-users-list').html(h+'</tbody></table>');
    },
    addUser: () => {
        const u=prompt("Usuario:"), p=prompt("Pass:"), n=prompt("Nombre:"), r=prompt("Rol (admin/banco):");
        if(u&&p&&n&&r){ let db=Core.Data.get(KEYS.USERS); db.push({id:Date.now(),user:u,pass:p,name:n,role:r,active:true,modules:[r]}); Core.Data.set(KEYS.USERS,db); Admin.renderUsers(); }
    },
    toggleUser: (i) => { let db=Core.Data.get(KEYS.USERS); db[i].active=!db[i].active; Core.Data.set(KEYS.USERS,db); Admin.renderUsers(); },
    delUser: (i) => { if(confirm('¿Borrar?')){ let db=Core.Data.get(KEYS.USERS); db.splice(i,1); Core.Data.set(KEYS.USERS,db); Admin.renderUsers(); } }
};

function renderGeneric(c,id){ c.html(`<div style="padding:50px;text-align:center;color:#ccc;"><h3>${id.toUpperCase()}</h3><p>En construcción</p></div>`); }