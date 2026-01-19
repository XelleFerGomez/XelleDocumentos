/* config-users.js - V7.3 (Iconos y Logos Definitivos) */

// DEFINICIÓN DE ICONOS SVG (Vectoriales, no requieren imágenes externas)
const ICONS = {
    // LOGO XELLE: Hélice de ADN estilizada con los colores corporativos
    LOGO: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.2)"/>
                </filter>
            </defs>
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#27ae60" stroke-width="2" filter="url(#shadow)"/>
            <path d="M30 30 Q 50 50 70 30" stroke="#2c3e50" stroke-width="6" fill="none" stroke-linecap="round"/>
            <path d="M30 70 Q 50 50 70 70" stroke="#2c3e50" stroke-width="6" fill="none" stroke-linecap="round"/>
            <circle cx="30" cy="30" r="7" fill="#27ae60"/>
            <circle cx="70" cy="70" r="7" fill="#3498db"/>
            <circle cx="70" cy="30" r="7" fill="#9b59b6"/>
            <circle cx="30" cy="70" r="7" fill="#e74c3c"/>
           </svg>`,

    // Iconos de Módulos
    BANCO: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><path d="M6 3h12"/><path d="M10 13h4"/></svg>`,
    CALIDAD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21h20"/><path d="M7 21V10l-4-5h12l-4 5v11"/><circle cx="12" cy="7" r="4"/></svg>`,
    ALMACEN: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    SGC: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    ADMIN: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    COMERCIAL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`
};

window.AppConfig = {
    // 1. USUARIOS
    users: [
        { id: 1, user: "Xelle_Admin", pass: "Xelle", role: "admin", name: "Administrador General", active: true },
        { id: 2, user: "Banco", pass: "1234", role: "banco", name: "Responsable Banco", active: true },
        { id: 3, user: "Calidad", pass: "1234", role: "calidad", name: "Responsable Calidad", active: true },
        { id: 4, user: "Almacen", pass: "1234", role: "almacen", name: "Encargado Almacén", active: true },
        { id: 5, user: "SGC", pass: "1234", role: "sgc", name: "Control Documental", active: true },
        { id: 6, user: "Comercial", pass: "1234", role: "comercial", name: "Gerente Comercial", active: true }
    ],

    // 2. MÓDULOS
    modules: [
        { id: 'banco', label: 'Banco de Células', svg: ICONS.BANCO, colorClass: 'mc-blue', roles: ['admin', 'banco'], visible: true, order: 1 },
        { id: 'calidad', label: 'Lab. Calidad', svg: ICONS.CALIDAD, colorClass: 'mc-purple', roles: ['admin', 'calidad'], visible: true, order: 2 },
        { id: 'almacen', label: 'Almacén', svg: ICONS.ALMACEN, colorClass: 'mc-green', roles: ['admin', 'almacen', 'banco', 'calidad'], visible: true, order: 3 },
        { id: 'sgc', label: 'Biblioteca SGC', svg: ICONS.SGC, colorClass: 'mc-orange', roles: ['admin', 'calidad', 'sgc', 'banco'], visible: true, order: 4 },
        { id: 'comercial', label: 'Comercial', svg: ICONS.COMERCIAL, colorClass: 'mc-red', roles: ['admin', 'comercial'], visible: true, order: 5 },
        { id: 'admin', label: 'Administración', svg: ICONS.ADMIN, colorClass: 'mc-dark', roles: ['admin'], visible: true, order: 99 }
    ],

    // LOGO GLOBAL EXPORTADO
    LOGO_SVG: ICONS.LOGO
};