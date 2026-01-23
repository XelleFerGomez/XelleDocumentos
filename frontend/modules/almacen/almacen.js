// frontend/modules/almacen/almacen.js

/**
 * Módulo: Almacén e Inventario (ERP Style)
 * Basado en: Productos CORRECTO (1).xlsx
 * Funcionalidad: Control de stocks, valoración, mínimos/máximos y categorización por Línea.
 */

window.app = window.app || {};

window.app.almacen = {

    state: {
        filterTerm: '',
        filterLine: 'TODOS',
        // Simulamos la carga de TU archivo CSV aquí
        inventory: [
            { code: 'MP-LAB-0001', name: 'Exosomas a granel 1L', type: 'PRODUCTO', unit: 'PZ', line: 'MPLAB', batchControl: 'S', cost: 1500.00, stock: 0, min: 5, max: 20, status: 'A' },
            { code: 'MP-LAB-0002', name: 'Grenetina 1 kg', type: 'PRODUCTO', unit: 'PZ', line: 'MPLAB', batchControl: 'N', cost: 250.50, stock: 12, min: 2, max: 15, status: 'A' },
            { code: 'MP-LAB-0003', name: 'Sodium Hyaluronate Injection Grade (HA)', type: 'PRODUCTO', unit: 'PZ', line: 'MPLAB', batchControl: 'S', cost: 3200.00, stock: 8, min: 3, max: 10, status: 'A' },
            { code: 'CE-EMP-0008', name: 'Sobre de burbuja isotermico 6 X 6 1/2', type: 'CONSUMIBLE', unit: 'PZ', line: 'CE', batchControl: 'N', cost: 15.00, stock: 500, min: 100, max: 1000, status: 'A' },
            { code: 'CE-EMP-0009', name: 'Hielera #4', type: 'CONSUMIBLE', unit: 'PZ', line: 'CE', batchControl: 'N', cost: 45.00, stock: 42, min: 20, max: 100, status: 'A' },
            { code: 'CE-EMP-0012', name: 'Gel refrigerante de 500g', type: 'CONSUMIBLE', unit: 'PZ', line: 'CE', batchControl: 'N', cost: 12.50, stock: 15, min: 50, max: 200, status: 'A' },
            { code: 'AF-MOB-001', name: 'Micropipeta 10-100uL', type: 'ACTIVO FIJO', unit: 'PZ', line: 'AF', batchControl: 'S', cost: 4500.00, stock: 5, min: 2, max: 5, status: 'A' }
        ]
    },

    // --- 1. INICIALIZACIÓN ---
    init: function() {
        console.log('Inicializando ERP Almacén...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Gestión de Inventarios</h2>
                        <p class="text-slate-500 text-sm mt-1">Control de existencias, costos y reabastecimiento (Base: Productos CORRECTO.xlsx)</p>
                    </div>
                    <div class="flex gap-2">
                         <button class="bg-white border border-slate-200 text-xelle-navy px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-50 flex items-center gap-2">
                            <span class="material-symbols-outlined text-[18px]">upload_file</span> Importar CSV
                        </button>
                        <button class="bg-xelle-navy hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-xelle-navy/20">
                            <span class="material-symbols-outlined">add_box</span> Entrada Mercancía
                        </button>
                    </div>
                </div>

                <div id="warehouse-kpis"></div>

                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    <div class="relative w-full md:w-96">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input type="text" placeholder="Buscar por Clave, Nombre o Tipo..." 
                            onkeyup="window.app.almacen.setFilter(this.value)"
                            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-xelle-navy text-sm font-semibold outline-none transition-all">
                    </div>

                    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span class="text-xs font-bold text-slate-400 uppercase">Línea:</span>
                        <button onclick="window.app.almacen.setLine('TODOS')" id="filter-line-TODOS" class="line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-xelle-navy text-white transition-all">TODOS</button>
                        <button onclick="window.app.almacen.setLine('MPLAB')" id="filter-line-MPLAB" class="line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">MPLAB</button>
                        <button onclick="window.app.almacen.setLine('CE')" id="filter-line-CE" class="line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">CE</button>
                        <button onclick="window.app.almacen.setLine('AF')" id="filter-line-AF" class="line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">ACTIVOS</button>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 text-slate-500 border-b border-slate-200">
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Clave Artículo</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Descripción / Tipo</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider">Línea</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-center">Stock Actual</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-center">Estado Stock</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-right">Costo Prom.</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-right">Total</th>
                                    <th class="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body" class="divide-y divide-slate-100">
                                </tbody>
                        </table>
                    </div>
                    <div class="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 px-6">
                        <span id="inventory-count">Cargando...</span>
                        <div class="flex gap-2">
                            <button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_left</span></button>
                            <button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_right</span></button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        this.renderKPIs();
        this.renderTable();
    },

    // --- 2. LÓGICA DE FILTRADO ---
    setFilter: function(val) {
        this.state.filterTerm = val.toLowerCase();
        this.renderTable();
    },

    setLine: function(line) {
        this.state.filterLine = line;
        
        // Actualizar UI botones
        document.querySelectorAll('.line-btn').forEach(btn => {
            btn.className = 'line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all';
        });
        document.getElementById(`filter-line-${line}`).className = 'line-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-xelle-navy text-white transition-all shadow-md';

        this.renderTable();
        this.renderKPIs(); // Recalcular KPIs según filtro
    },

    // --- 3. RENDERIZADO DE TABLA ---
    renderTable: function() {
        const tbody = document.getElementById('inventory-table-body');
        const countLabel = document.getElementById('inventory-count');
        
        // Filtrar datos
        const filtered = this.state.inventory.filter(item => {
            const matchesTerm = item.name.toLowerCase().includes(this.state.filterTerm) || 
                                item.code.toLowerCase().includes(this.state.filterTerm);
            const matchesLine = this.state.filterLine === 'TODOS' || item.line === this.state.filterLine;
            return matchesTerm && matchesLine;
        });

        countLabel.textContent = `Mostrando ${filtered.length} artículos`;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center py-10 text-slate-400">No se encontraron artículos con estos criterios.</td></tr>`;
            return;
        }

        let html = '';
        filtered.forEach(item => {
            const totalValue = item.stock * item.cost;
            
            // Lógica de Semáforo de Stock
            let stockStatus = '';
            let rowClass = 'hover:bg-slate-50';
            
            if (item.stock === 0) {
                stockStatus = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200"><span class="material-symbols-outlined text-[12px]">block</span>AGOTADO</span>`;
                rowClass = 'bg-slate-50/50 grayscale opacity-80 hover:opacity-100';
            } else if (item.stock <= item.min) {
                stockStatus = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-600 border border-red-100"><span class="material-symbols-outlined text-[12px]">warning</span>BAJO MÍNIMO</span>`;
                rowClass = 'bg-red-50/20 hover:bg-red-50/40';
            } else if (item.stock >= item.max) {
                stockStatus = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100"><span class="material-symbols-outlined text-[12px]">inventory</span>SOBRE STOCK</span>`;
            } else {
                stockStatus = `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><span class="material-symbols-outlined text-[12px]">check_circle</span>ÓPTIMO</span>`;
            }

            // Icono según tipo
            let typeIcon = 'package_2';
            if (item.type === 'CONSUMIBLE') typeIcon = 'box';
            if (item.type === 'ACTIVO FIJO') typeIcon = 'biotech';

            // Batch Control Icon
            const batchIcon = item.batchControl === 'S' 
                ? `<span class="text-primary" title="Control por Lote"><span class="material-symbols-outlined text-[14px]">qr_code_2</span></span>` 
                : `<span class="text-slate-300" title="Sin Lote"><span class="material-symbols-outlined text-[14px]">remove</span></span>`;

            html += `
                <tr class="${rowClass} transition-colors group border-b border-slate-50 last:border-0">
                    <td class="px-6 py-3 font-mono text-xs font-bold text-xelle-navy">${item.code}</td>
                    <td class="px-6 py-3">
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined text-slate-300 text-[18px] mt-0.5">${typeIcon}</span>
                            <div>
                                <span class="font-bold text-sm text-slate-700 block">${item.name}</span>
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">${item.type}</span>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-3">
                        <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">${item.line}</span>
                    </td>
                    <td class="px-6 py-3 text-center">
                        <div class="font-bold text-slate-800">${item.stock} <span class="text-[10px] text-slate-400">${item.unit}</span></div>
                    </td>
                    <td class="px-6 py-3 text-center">${stockStatus}</td>
                    <td class="px-6 py-3 text-right font-mono text-xs text-slate-600">$${item.cost.toFixed(2)}</td>
                    <td class="px-6 py-3 text-right font-mono text-xs font-bold text-xelle-navy">$${totalValue.toFixed(2)}</td>
                    <td class="px-6 py-3 text-center">
                        <div class="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors border border-transparent hover:border-slate-200 shadow-sm" title="Kardex / Movimientos">
                                <span class="material-symbols-outlined text-[18px]">history</span>
                            </button>
                            <button class="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-xelle-navy transition-colors border border-transparent hover:border-slate-200 shadow-sm" title="Ajuste Inventario">
                                <span class="material-symbols-outlined text-[18px]">edit_note</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    // --- 4. KPIs DINÁMICOS ---
    renderKPIs: function() {
        // Calcular basado en los datos actuales
        const items = this.state.inventory;
        const totalValue = items.reduce((acc, curr) => acc + (curr.stock * curr.cost), 0);
        const lowStockCount = items.filter(i => i.stock <= i.min).length;
        const totalItems = items.length;

        const container = document.getElementById('warehouse-kpis');
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass-panel p-5 rounded-2xl bg-white border border-slate-100 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Total Inventario</p>
                        <p class="text-2xl font-black text-xelle-navy mt-1">$${totalValue.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p>
                    </div>
                    <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                        <span class="material-symbols-outlined text-2xl">payments</span>
                    </div>
                </div>

                <div class="glass-panel p-5 rounded-2xl bg-white border border-slate-100 flex items-center justify-between ${lowStockCount > 0 ? 'border-b-4 border-b-red-400' : ''}">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertas de Stock</p>
                        <p class="text-2xl font-black ${lowStockCount > 0 ? 'text-red-500' : 'text-slate-700'} mt-1">${lowStockCount} Artículos</p>
                    </div>
                    <div class="p-3 ${lowStockCount > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'} rounded-xl">
                        <span class="material-symbols-outlined text-2xl">notification_important</span>
                    </div>
                </div>

                <div class="glass-panel p-5 rounded-2xl bg-white border border-slate-100 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Catálogo Activo</p>
                        <p class="text-2xl font-black text-xelle-navy mt-1">${totalItems} SKUs</p>
                    </div>
                    <div class="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <span class="material-symbols-outlined text-2xl">category</span>
                    </div>
                </div>
            </div>
        `;
    }
};