// frontend/modules/celulas/celulas.js

/**
 * Módulo: Banco de Células (Cryo-Storage)
 * Funcionalidad: Gestión de líneas celulares, criopreservación y ubicación en tanques de N2.
 */

window.app = window.app || {};

window.app['banco-celulas'] = {

    state: {
        activeTab: 'inventario', // inventario | tanques
        cells: [
            { id: 'CB-HEK-001', line: 'HEK293T', passage: 'P12', date: '2023-11-15', location: 'T01-C04-B01', viability: '98%', status: 'Almacenado' },
            { id: 'CB-CHO-045', line: 'CHO-K1', passage: 'P08', date: '2024-01-10', location: 'T01-C02-A05', viability: '95%', status: 'Cuarentena' },
            { id: 'CB-MSC-102', line: 'MSC-Human', passage: 'P04', date: '2024-01-20', location: 'T02-C01-D02', viability: '92%', status: 'Almacenado' },
            { id: 'CB-HELA-09', line: 'HeLa', passage: 'P25', date: '2023-09-05', location: 'T01-C05-E09', viability: '96%', status: 'Almacenado' }
        ],
        tanks: [
            { id: 'T01', name: 'Dewar Alpha', type: 'Liquid N2', capacity: 500, used: 342, temp: '-196°C' },
            { id: 'T02', name: 'Dewar Beta', type: 'Vapor N2', capacity: 500, used: 120, temp: '-150°C' }
        ]
    },

    init: function() {
        console.log('Inicializando Banco de Células...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Banco de Células</h2>
                        <p class="text-slate-500 text-sm mt-1">Gestión de criopreservación y líneas celulares</p>
                    </div>
                    <div class="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button onclick="window.app['banco-celulas'].switchTab('inventario')" id="tab-cel-inventario" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Inventario Vial</button>
                        <button onclick="window.app['banco-celulas'].switchTab('tanques')" id="tab-cel-tanques" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Tanques N2</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-xelle-navy p-4 rounded-xl text-white shadow-lg flex items-center justify-between relative overflow-hidden">
                         <div class="absolute -right-4 -top-4 text-white/10"><span class="material-symbols-outlined text-9xl">ac_unit</span></div>
                         <div class="relative z-10">
                            <p class="text-xs font-bold uppercase text-white/60">Temp. Promedio</p>
                            <p class="text-2xl font-black">-196°C</p>
                         </div>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p class="text-xs text-slate-500 font-bold uppercase">Total Viales</p>
                        <p class="text-2xl font-black text-xelle-navy">462</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
                        <p class="text-xs text-slate-500 font-bold uppercase">Líneas Activas</p>
                        <p class="text-2xl font-black text-primary">14</p>
                    </div>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center border-l-4 border-orange-400">
                        <p class="text-xs text-slate-500 font-bold uppercase">Cuarentena</p>
                        <p class="text-2xl font-black text-xelle-navy">5</p>
                    </div>
                </div>

                <div id="celulas-content" class="min-h-[400px]"></div>
            </div>
        `;

        this.switchTab(this.state.activeTab);
    },

    switchTab: function(tabName) {
        this.state.activeTab = tabName;
        
        // Reset estilos tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50');
        document.getElementById(`tab-cel-${tabName}`).className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold bg-xelle-navy text-white shadow-md';

        const content = document.getElementById('celulas-content');
        if (tabName === 'inventario') this.renderInventory(content);
        if (tabName === 'tanques') this.renderTanks(content);
    },

    // VISTA 1: TABLA DE VIALES
    renderInventory: function(container) {
        const cells = this.state.cells;
        
        let html = `
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
                    <div class="flex items-center gap-2 w-full sm:w-auto">
                        <span class="material-symbols-outlined text-slate-400">search</span>
                        <input type="text" placeholder="Buscar vial, línea o pasaje..." class="bg-transparent outline-none text-sm font-bold text-xelle-navy placeholder:font-normal w-full">
                    </div>
                    <button class="bg-xelle-navy hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-xelle-navy/20">
                        <span class="material-symbols-outlined text-[18px]">snowflake</span> Criopreservar
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="text-slate-500 border-b border-slate-200">
                                <th class="px-6 py-4 text-[11px] font-black uppercase">ID Vial</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase">Línea Celular</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase">Pasaje</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase">Ubicación</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-center">Viabilidad</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-center">Estado</th>
                                <th class="px-6 py-4 text-[11px] font-black uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
        `;

        cells.forEach(c => {
            let statusBadge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Almacenado</span>`;
            if(c.status === 'Cuarentena') statusBadge = `<span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-100 text-orange-700 flex items-center gap-1 justify-center"><span class="material-symbols-outlined text-[10px]">science</span>Cuarentena</span>`;

            html += `
                <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="px-6 py-4 font-mono text-xs font-bold text-xelle-navy">${c.id}</td>
                    <td class="px-6 py-4 font-bold text-sm text-slate-700">${c.line}</td>
                    <td class="px-6 py-4 text-xs font-bold text-slate-500 bg-slate-100 px-2 rounded w-fit">${c.passage}</td>
                    <td class="px-6 py-4 text-xs font-mono text-primary">${c.location}</td>
                    <td class="px-6 py-4 text-center text-xs font-bold">${c.viability}</td>
                    <td class="px-6 py-4 text-center">${statusBadge}</td>
                    <td class="px-6 py-4 text-right">
                        <button class="p-2 text-slate-400 hover:text-xelle-navy transition-colors" title="Descongelar"><span class="material-symbols-outlined">waves</span></button>
                        <button class="p-2 text-slate-400 hover:text-primary transition-colors" title="Historial"><span class="material-symbols-outlined">history</span></button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        container.innerHTML = html;
    },

    // VISTA 2: VISUALIZACIÓN DE TANQUES
    renderTanks: function(container) {
        const tanks = this.state.tanks;
        
        let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">`;
        
        tanks.forEach(t => {
            const percent = Math.round((t.used / t.capacity) * 100);
            let barColor = 'bg-primary';
            if(percent > 90) barColor = 'bg-red-500';

            html += `
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border-4 border-blue-100">
                                <span class="material-symbols-outlined">kitchen</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-xelle-navy text-lg">${t.name}</h3>
                                <p class="text-xs text-slate-500 font-bold">${t.id} • ${t.type}</p>
                            </div>
                        </div>
                        <span class="font-mono text-2xl font-black text-xelle-sky">${t.temp}</span>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex justify-between text-xs font-bold text-slate-500">
                            <span>Ocupación</span>
                            <span>${t.used} / ${t.capacity} (${percent}%)</span>
                        </div>
                        <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div class="${barColor} h-full rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-slate-100 flex gap-3">
                        <button class="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                            Ver Mapa
                        </button>
                        <button class="flex-1 py-2 text-xs font-bold text-white bg-xelle-navy hover:bg-blue-900 rounded-lg transition-colors shadow-md">
                            Registrar Ingreso
                        </button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    }
};