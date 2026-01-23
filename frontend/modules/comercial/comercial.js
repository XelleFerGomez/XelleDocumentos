// frontend/modules/comercial/comercial.js

/**
 * Módulo Comercial V5
 * Maneja Cotizaciones y Clientes con Ventanas Modales (Sin alertas nativas).
 */

window.app = window.app || {};

window.app.comercial = {
    
    // Estado local simulando Base de Datos
    state: {
        activeTab: 'cotizaciones',
        quotations: [
            { id: 'COT-2025-001', client: 'Farmacéutica A', date: '2025-01-10', total: 1500.00, status: 'Aprobada' },
            { id: 'COT-2025-002', client: 'Hospital General', date: '2025-01-15', total: 850.50, status: 'Pendiente' },
            { id: 'COT-2025-003', client: 'Centro de Investigación X', date: '2025-01-18', total: 3200.00, status: 'Borrador' }
        ],
        clients: [
            { id: 1, name: 'Farmacéutica A', contact: 'Juan Perez', email: 'juan@pharma.com' },
            { id: 2, name: 'Hospital General', contact: 'Dra. Lopez', email: 'compras@hospital.com' },
            { id: 3, name: 'Centro de Investigación X', contact: 'Dr. Strange', email: 'lab@x.com' }
        ]
    },

    // 1. INICIALIZACIÓN
    init: function() {
        console.log('Inicializando Módulo Comercial...');
        const container = document.getElementById('view-module');
        
        // Estructura Base
        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div>
                        <h1 class="text-2xl font-bold text-xelle-navy">Gestión Comercial</h1>
                        <p class="text-slate-500 text-sm">Administración de clientes y propuestas económicas</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="window.app.comercial.openNewQuotationModal()" class="flex items-center gap-2 bg-primary hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                            <span>Nueva Cotización</span>
                        </button>
                    </div>
                </div>

                <div class="flex gap-6 border-b border-slate-200 px-2">
                    <button onclick="window.app.comercial.switchTab('cotizaciones')" id="tab-cotizaciones" class="pb-3 px-2 text-primary border-b-2 border-primary font-bold text-sm transition-all">
                        Cotizaciones
                    </button>
                    <button onclick="window.app.comercial.switchTab('clientes')" id="tab-clientes" class="pb-3 px-2 text-slate-500 font-medium text-sm hover:text-xelle-navy transition-all">
                        Base de Clientes
                    </button>
                </div>

                <div id="comercial-content" class="bg-white rounded-xl shadow-sm border border-slate-100 min-h-[400px] p-4">
                    </div>
            </div>
            
            <div id="modal-container" class="relative z-[60]"></div>
        `;

        this.renderQuotations();
    },

    // 2. CAMBIO DE PESTAÑAS
    switchTab: function(tabName) {
        this.state.activeTab = tabName;
        
        // Actualizar UI de Tabs
        const tabs = ['cotizaciones', 'clientes'];
        tabs.forEach(t => {
            const el = document.getElementById(`tab-${t}`);
            if (t === tabName) {
                el.className = "pb-3 px-2 text-primary border-b-2 border-primary font-bold text-sm transition-all";
            } else {
                el.className = "pb-3 px-2 text-slate-500 font-medium text-sm hover:text-xelle-navy transition-all";
            }
        });

        if (tabName === 'cotizaciones') this.renderQuotations();
        if (tabName === 'clientes') this.renderClients();
    },

    // 3. RENDERIZADO: COTIZACIONES
    renderQuotations: function() {
        const content = document.getElementById('comercial-content');
        const list = this.state.quotations;

        // Ordenar por ID descendente (más nuevas primero)
        list.sort((a, b) => b.id.localeCompare(a.id));

        if (list.length === 0) {
            content.innerHTML = `<div class="p-8 text-center text-slate-400">No hay cotizaciones registradas.</div>`;
            return;
        }

        let html = `
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th class="p-4">Folio</th>
                            <th class="p-4">Cliente</th>
                            <th class="p-4">Fecha</th>
                            <th class="p-4">Total</th>
                            <th class="p-4">Estatus</th>
                            <th class="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-slate-700 divide-y divide-slate-50">
        `;

        list.forEach(item => {
            let statusClass = "bg-slate-100 text-slate-600";
            if(item.status === 'Aprobada') statusClass = "bg-green-100 text-green-700";
            if(item.status === 'Pendiente') statusClass = "bg-yellow-100 text-yellow-700";
            if(item.status === 'Rechazada') statusClass = "bg-red-100 text-red-700";

            html += `
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="p-4 font-bold text-xelle-navy">${item.id}</td>
                    <td class="p-4">${item.client}</td>
                    <td class="p-4 text-slate-500">${item.date}</td>
                    <td class="p-4 font-mono font-medium">$${parseFloat(item.total).toFixed(2)}</td>
                    <td class="p-4"><span class="px-2 py-1 rounded-full text-xs font-bold ${statusClass}">${item.status}</span></td>
                    <td class="p-4 text-right">
                        <button class="text-slate-400 hover:text-primary p-1 transition-colors" title="Ver PDF">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        content.innerHTML = html;
    },

    // 4. RENDERIZADO: CLIENTES
    renderClients: function() {
        const content = document.getElementById('comercial-content');
        const list = this.state.clients;

        let html = `
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th class="p-4">Empresa / Cliente</th>
                            <th class="p-4">Contacto</th>
                            <th class="p-4">Email</th>
                            <th class="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm text-slate-700 divide-y divide-slate-50">
        `;

        list.forEach(item => {
            html += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-bold text-xelle-navy">${item.name}</td>
                    <td class="p-4">${item.contact}</td>
                    <td class="p-4 text-blue-600 hover:underline cursor-pointer">${item.email}</td>
                    <td class="p-4 text-right">
                        <button class="text-slate-400 hover:text-primary p-1">
                            <span class="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        content.innerHTML = html;
    },

    // 5. MODAL: NUEVA COTIZACIÓN
    openNewQuotationModal: function() {
        const modalContainer = document.getElementById('modal-container');
        
        // Generar opciones de clientes para el select
        const clientOptions = this.state.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');

        // HTML del Modal
        const modalHTML = `
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onclick="window.app.comercial.closeModal()"></div>
            
            <div class="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all scale-100 pointer-events-auto flex flex-col max-h-[90vh]">
                    
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                        <h3 class="text-xl font-bold text-xelle-navy">Nueva Cotización</h3>
                        <button onclick="window.app.comercial.closeModal()" class="text-slate-400 hover:text-red-500 transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div class="p-6 overflow-y-auto">
                        <form id="newQuoteForm" class="flex flex-col gap-4">
                            
                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Cliente</label>
                                <select id="inputClient" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required>
                                    <option value="">Seleccione un cliente...</option>
                                    ${clientOptions}
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Emisión</label>
                                <input type="date" id="inputDate" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" required value="${new Date().toISOString().split('T')[0]}">
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Monto Total Estimado ($)</label>
                                <input type="number" id="inputTotal" step="0.01" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="0.00" required>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Notas / Observaciones</label>
                                <textarea id="inputNotes" rows="3" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="Detalles adicionales..."></textarea>
                            </div>

                        </form>
                    </div>

                    <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                        <button onclick="window.app.comercial.closeModal()" class="px-5 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onclick="window.app.comercial.saveQuotation()" class="px-5 py-2.5 bg-primary hover:bg-emerald-600 text-white font-bold text-sm rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-95">
                            Guardar Cotización
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modalContainer.innerHTML = modalHTML;
    },

    // 6. CERRAR MODAL
    closeModal: function() {
        document.getElementById('modal-container').innerHTML = '';
    },

    // 7. GUARDAR DATOS (Acción del Formulario)
    saveQuotation: function() {
        const client = document.getElementById('inputClient').value;
        const date = document.getElementById('inputDate').value;
        const total = document.getElementById('inputTotal').value;

        // Validación simple
        if(!client || !date || !total) {
            alert("Por favor complete todos los campos obligatorios");
            return;
        }

        // Crear objeto (Simulación de Backend)
        const newId = `COT-2025-${(this.state.quotations.length + 1).toString().padStart(3, '0')}`;
        
        const newQuote = {
            id: newId,
            client: client,
            date: date,
            total: parseFloat(total),
            status: 'Borrador' // Default status
        };

        // Guardar en estado local
        this.state.quotations.push(newQuote);

        // Feedback visual y recarga
        this.closeModal();
        this.renderQuotations();
        
        // Notificación Toast (Podemos mejorar esto luego)
        console.log("Cotización guardada:", newQuote);
    }
};