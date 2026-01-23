// frontend/modules/admin/admin.js

/**
 * Módulo de Administración Ejecutiva (KPIs)
 * - Dashboard de alto nivel
 * - Estado del Sistema
 * - Auditoría Reciente
 */

window.app = window.app || {};

window.app.admin = {
    
    init: function() {
        console.log('Inicializando Dashboard Ejecutivo...');
        const container = document.getElementById('view-module');
        
        container.innerHTML = `
            <div class="flex flex-col gap-8 animate-fade-in pb-12">
                
                <div class="flex justify-between items-end">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Admin Dashboard</h2>
                        <p class="text-slate-500 text-sm mt-1">Visión general del rendimiento del laboratorio clínico</p>
                    </div>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
                            <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Operativo
                        </span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform bg-white border border-slate-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-primary/10 rounded-lg text-primary"><span class="material-symbols-outlined">vital_signs</span></div>
                            <span class="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+12.4%</span>
                        </div>
                        <p class="text-xelle-navy/60 text-xs font-bold uppercase tracking-wider">Muestras Totales</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">15,420</p>
                    </div>

                    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform bg-white border border-slate-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-xelle-sky/10 rounded-lg text-xelle-sky"><span class="material-symbols-outlined">verified</span></div>
                            <span class="text-[10px] font-bold text-xelle-sky bg-xelle-sky/10 px-2 py-1 rounded-full">Óptimo</span>
                        </div>
                        <p class="text-xelle-navy/60 text-xs font-bold uppercase tracking-wider">Tasa Validación</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">99.2%</p>
                    </div>

                    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform bg-white border-l-4 border-red-500">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-red-50 rounded-lg text-red-500"><span class="material-symbols-outlined">warning</span></div>
                            <span class="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">Urgente</span>
                        </div>
                        <p class="text-xelle-navy/60 text-xs font-bold uppercase tracking-wider">Alertas OOS</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">03</p>
                    </div>

                    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:-translate-y-1 transition-transform bg-white border border-slate-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="p-2 bg-xelle-navy/5 rounded-lg text-xelle-navy"><span class="material-symbols-outlined">router</span></div>
                            <span class="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Estable</span>
                        </div>
                        <p class="text-xelle-navy/60 text-xs font-bold uppercase tracking-wider">Uptime</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">99.9%</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="flex justify-between items-center mb-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-xelle-sky text-white flex items-center justify-center">
                                    <span class="material-symbols-outlined text-2xl">biotech</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-xelle-navy">Lab. Calidad</h3>
                                    <p class="text-xs text-slate-500">Estado de validación molecular</p>
                                </div>
                            </div>
                            <button onclick="window.app.navigateTo('lab-calidad')" class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50"><span class="material-symbols-outlined text-sm">arrow_forward</span></button>
                        </div>
                        <div class="space-y-3">
                            <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                                <span class="text-sm font-semibold text-slate-700 flex items-center gap-2"><span class="material-symbols-outlined text-orange-500 text-sm">pending</span> Pendientes</span>
                                <span class="font-black text-xelle-navy">42</span>
                            </div>
                            <div class="flex justify-between items-center p-3 bg-slate-50 rounded-lg border-l-4 border-primary">
                                <span class="text-sm font-semibold text-slate-700 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-sm">check_circle</span> Validados Hoy</span>
                                <span class="font-black text-xelle-navy">128</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="flex justify-between items-center mb-6">
                            <div class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-xelle-navy text-white flex items-center justify-center">
                                    <span class="material-symbols-outlined text-2xl">manage_accounts</span>
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-xelle-navy">Actividad de Usuarios</h3>
                                    <p class="text-xs text-slate-500">Control de Acceso y Auditoría</p>
                                </div>
                            </div>
                            <button onclick="window.app.navigateTo('configuracion')" class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50"><span class="material-symbols-outlined text-sm">settings</span></button>
                        </div>
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex -space-x-2">
                                <div class="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                                <div class="w-8 h-8 rounded-full bg-slate-400 border-2 border-white"></div>
                                <div class="w-8 h-8 rounded-full bg-slate-500 border-2 border-white"></div>
                                <div class="w-8 h-8 rounded-full bg-xelle-navy text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">+15</div>
                            </div>
                            <span class="text-xs font-bold text-primary">18 Online Ahora</span>
                        </div>
                        <button class="w-full py-2 bg-primary/10 text-primary font-bold rounded-lg text-sm hover:bg-primary/20 transition-colors">
                            Ver Logs de Auditoría
                        </button>
                    </div>

                </div>
            </div>
        `;
    }
};