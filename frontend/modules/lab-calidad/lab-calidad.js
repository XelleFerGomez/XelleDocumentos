// frontend/modules/lab-calidad/lab-calidad.js

/**
 * Módulo: Laboratorio de Control de Calidad
 * Funcionalidad: Gestión de muestras, ingreso de resultados y validación.
 */

window.app = window.app || {};

// Nota: Usamos corchetes porque el nombre del módulo tiene un guion
window.app['lab-calidad'] = {

    state: {
        activeTab: 'muestras', // muestras | resultados | historial
        samples: [
            { id: 'M-2024-001', product: 'Paracetamol 500mg', batch: 'B23001', test: 'Valoración', status: 'Pendiente', priority: 'Alta' },
            { id: 'M-2024-002', product: 'Ibuprofeno Susp.', batch: 'B23005', test: 'pH y Viscosidad', status: 'En Proceso', priority: 'Normal' },
            { id: 'M-2024-003', product: 'Agua Purificada', batch: 'W-2401', test: 'Microbiología', status: 'Validado', priority: 'Alta' }
        ]
    },

    init: function() {
        console.log('Inicializando Lab. Calidad...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Control de Calidad</h2>
                        <p class="text-slate-500 text-sm mt-1">Gestión analítica y liberación de lotes</p>
                    </div>
                    <div class="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button onclick="window.app['lab-calidad'].switchTab('muestras')" id="tab-lab-muestras" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Recepción</button>
                        <button onclick="window.app['lab-calidad'].switchTab('resultados')" id="tab-lab-resultados" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Resultados</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div><p class="text-xs text-slate-500 font-bold uppercase">Pendientes</p><p class="text-2xl font-black text-xelle-navy">12</p></div>
                        <div class="p-2 bg-orange-50 text-orange-500 rounded-lg"><span class="material-symbols-outlined">pending_actions</span></div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div><p class="text-xs text-slate-500 font-bold uppercase">En Análisis</p><p class="text-2xl font-black text-xelle-navy">5</p></div>
                        <div class="p-2 bg-blue-50 text-blue-500 rounded-lg"><span class="material-symbols-outlined">science</span></div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div><p class="text-xs text-slate-500 font-bold uppercase">Para Firmar</p><p class="text-2xl font-black text-xelle-navy">3</p></div>
                        <div class="p-2 bg-primary/10 text-primary rounded-lg"><span class="material-symbols-outlined">fact_check</span></div>
                    </div>
                </div>

                <div id="lab-content" class="min-h-[400px]"></div>
            </div>
        `;

        this.switchTab(this.state.activeTab);
    },

    switchTab: function(tabName) {
        this.state.activeTab = tabName;
        
        // Reset estilos tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50');
        document.getElementById(`tab-lab-${tabName}`).className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold bg-xelle-navy text-white shadow-md';

        const content = document.getElementById('lab-content');
        if (tabName === 'muestras') this.renderSamplesList(content);
        if (tabName === 'resultados') this.renderResultsView(content);
    },

    renderSamplesList: function(container) {
        const samples = this.state.samples;
        
        let html = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                <div class="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <h3 class="font-bold text-xelle-navy">Muestras Activas</h3>
                    <button class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                        <span class="material-symbols-outlined text-[18px]">add_vial</span> Registrar Muestra
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="text-slate-500 border-b border-slate-200">
                                <th class="px-6 py-4 text-[11px] font-black uppercase">ID Muestra</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase">Producto / Lote</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase">Análisis</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-center">Prioridad</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-center">Estado</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
        `;

        samples.forEach(s => {
            let statusColor = 'bg-slate-100 text-slate-600';
            if(s.status === 'En Proceso') statusColor = 'bg-blue-100 text-blue-700';
            if(s.status === 'Validado') statusColor = 'bg-emerald-100 text-emerald-700';

            let priorityIcon = s.priority === 'Alta' 
                ? `<span class="text-red-500 flex items-center justify-center gap-1 font-bold text-xs"><span class="material-symbols-outlined text-[16px]">priority_high</span>Alta</span>` 
                : `<span class="text-slate-400 flex items-center justify-center gap-1 font-bold text-xs">Normal</span>`;

            html += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-mono text-xs font-bold text-xelle-navy">${s.id}</td>
                    <td class="px-6 py-4">
                        <div class="flex flex-col">
                            <span class="font-bold text-sm text-slate-700">${s.product}</span>
                            <span class="text-xs text-slate-500">Lote: ${s.batch}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-600">${s.test}</td>
                    <td class="px-6 py-4 text-center">${priorityIcon}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${statusColor}">${s.status}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <button class="p-2 text-slate-400 hover:text-xelle-navy transition-colors" title="Imprimir Etiqueta"><span class="material-symbols-outlined">qr_code_2</span></button>
                        <button class="p-2 text-slate-400 hover:text-primary transition-colors" title="Ver Detalles"><span class="material-symbols-outlined">visibility</span></button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        container.innerHTML = html;
    },

    renderResultsView: function(container) {
        // Vista simplificada para ingreso de resultados
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-fade-in">
                <div class="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-3xl text-slate-400">biotech</span>
                </div>
                <h3 class="text-lg font-bold text-xelle-navy">Módulo de Resultados</h3>
                <p class="text-slate-500 text-sm mt-2 max-w-md mx-auto">Seleccione una muestra "En Proceso" para capturar datos crudos, cálculos y adjuntar cromatogramas.</p>
                <button onclick="window.app['lab-calidad'].switchTab('muestras')" class="mt-6 text-primary font-bold hover:underline">Volver a lista de muestras</button>
            </div>
        `;
    }
};