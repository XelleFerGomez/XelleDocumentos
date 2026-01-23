/* config-users.js - V11.1 MASTER DATA */

// 1. ICONOS SVG (Sistema Visual Incrustado)
const ICONS = {
    LOGO: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#F4F8F6" stroke="#2FA583" stroke-width="3"/><path d="M30 30 Q 50 50 70 30" stroke="#1E3A5F" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M30 70 Q 50 50 70 70" stroke="#1E3A5F" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="30" cy="30" r="6" fill="#2FA583"/><circle cx="70" cy="70" r="6" fill="#64C4ED"/><circle cx="70" cy="30" r="6" fill="#1E3A5F"/><circle cx="30" cy="70" r="6" fill="#2FA583"/></svg>`,
    BANCO: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v12a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><path d="M6 3h12"/><path d="M10 13h4"/></svg>`,
    CALIDAD: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 21h20"/><path d="M7 21V10l-4-5h12l-4 5v11"/><circle cx="12" cy="7" r="4"/></svg>`,
    ALMACEN: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    SGC: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
    ADMIN: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
    COMERCIAL: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`
};

// 2. DATOS SEMILLA (Se cargan si se borra el historial)
window.SeedData = {
    users: [
        { id: 1, user: 'Xelle_Fer', pass: 'Lufe3120', name: 'Fernando (Dev)', role: 'admin', active: true, modules: ['all'] },
        { id: 2, user: 'Xelle_Admin', pass: 'Xelle', name: 'Administrador Gral', role: 'admin', active: true, modules: ['all'] },
        { id: 3, user: 'Xelle_Lab', pass: 'Xelle_Calidad', name: 'Laboratorio Calidad', role: 'calidad', active: true, modules: ['calidad', 'almacen'] },
        { id: 4, user: 'Xelle_Banco', pass: 'Xelle_Cultivo', name: 'Banco de Células', role: 'banco', active: true, modules: ['banco', 'almacen'] },
        { id: 5, user: 'Xelle_Cultivo', pass: 'Xelle_Cultivo', name: 'Fanny (Banco)', role: 'banco', active: true, modules: ['banco'] }
    ],
    modules: [
        { id: 'banco', label: 'Banco de Células', svg: ICONS.BANCO, colorClass: 'mc-teal', visible: true, order: 1 },
        { id: 'calidad', label: 'Lab. Calidad', svg: ICONS.CALIDAD, colorClass: 'mc-navy', visible: true, order: 2 },
        { id: 'almacen', label: 'Almacén', svg: ICONS.ALMACEN, colorClass: 'mc-sky', visible: true, order: 3 },
        { id: 'sgc', label: 'Biblioteca SGC', svg: ICONS.SGC, colorClass: 'mc-orange', visible: true, order: 4 },
        { id: 'comercial', label: 'Comercial', svg: ICONS.COMERCIAL, colorClass: 'mc-red', visible: true, order: 5 },
        { id: 'admin', label: 'Administración', svg: ICONS.ADMIN, colorClass: 'mc-dark', visible: true, order: 99 }
    ],
    formats: [
        // BANCO
        { id: 16, code: 'FO-LC-16', title: 'Bitácora de Limpieza', area: 'banco', file: 'FO-LC-16.html' },
        { id: 17, code: 'FO-LC-17', title: 'Recepción de Muestras', area: 'banco', file: 'FO-LC-17.html' },
        { id: 18, code: 'FO-LC-18', title: 'Evaluación Macroscópica', area: 'banco', file: 'FO-LC-18.html' },
        { id: 19, code: 'FO-LC-19', title: 'Liberación de Lote', area: 'banco', file: 'FO-LC-19.html' },
        { id: 20, code: 'FO-LC-20', title: 'Procesamiento de Tejido', area: 'banco', file: 'FO-LC-20.html' },
        { id: 21, code: 'FO-LC-21', title: 'Bitácora de Cultivo', area: 'banco', file: 'FO-LC-21.html' },
        { id: 22, code: 'FO-LC-22', title: 'Criopreservación', area: 'banco', file: 'FO-LC-22.html' },
        { id: 23, code: 'FO-LC-23', title: 'Control de Inventario', area: 'banco', file: 'FO-LC-23.html' },
        { id: 24, code: 'FO-LC-24', title: 'Etiquetado Final', area: 'banco', file: 'FO-LC-24.html' },
        // CALIDAD
        { id: 40, code: 'FO-LC-40', title: 'Preparación de Medios', area: 'calidad', file: 'FO-LC-40.html' },
        { id: 41, code: 'FO-LC-41', title: 'Control Microbiológico', area: 'calidad', file: 'FO-LC-41.html' },
        { id: 42, code: 'FO-LC-42', title: 'Monitoreo Ambiental', area: 'calidad', file: 'FO-LC-42.html' },
        { id: 43, code: 'FO-LC-43', title: 'Control de Partículas', area: 'calidad', file: 'FO-LC-43.html' },
        { id: 44, code: 'FO-LC-44', title: 'Certificado de Análisis', area: 'calidad', file: 'FO-LC-44.html' },
        { id: 45, code: 'FO-LC-45', title: 'Liberación de Producto', area: 'calidad', file: 'FO-LC-45.html' }
    ],
    LOGO_SVG: ICONS.LOGO
};