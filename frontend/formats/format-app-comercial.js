/**
 * FORMAT-APP-COMERCIAL.JS
 * Módulo exclusivo para Ventas y Operaciones Comerciales.
 * Independiente del sistema de Laboratorio (FO-LC).
 */

const AppCom = {
    config: {
        // Base de datos de productos comerciales
        DB_PRODUCTS: {
            "Stem Xelle": { lotPre: "XCM", pres: ["10 M", "25 M", "50 M", "100 M"] },
            "Hybrid Xelle": { lotPre: "XHY", pres: ["10M + 1B", "25M + 2B", "50M + 5B", "60M + 6B", "100M + 10B"] },
            "Stem Ortho": { lotPre: "XOR", pres: ["10 M", "25 M", "50 M", "100 M"] },
            "Hybrid Ortho": { lotPre: "XHO", pres: ["10M + 1B", "25M + 2B", "50M + 5B", "60M + 6B", "100M + 10B"] },
            "X-Exosomes": { lotPre: "EXO", pres: ["3B", "9B", "15B", "30B", "75B", "90B"] }
        }
    },

    init: function() {
        const docId = document.body.id;
        console.log("Iniciando App Comercial para:", docId);
        
        this.Universal.setupDateInputs();
        this.Universal.setupBarcodes();
        this.Universal.loadData(docId);
        this.Universal.setupPrintHandler();

        // Inicialización específica del formato
        if (docId === 'doc-fo-op-15') {
            this.FO_OP_15.init();
        }
    },

    Universal: {
        setupDateInputs: function() {
            document.querySelectorAll('input[type="date"]').forEach(input => {
                if (!input.value && !input.classList.contains('no-auto-date')) input.valueAsDate = new Date();
            });
        },
        setupBarcodes: function() {
            const process = (input) => {
                const prefix = input.dataset.prefix || '';
                const val = input.value;
                if (val && window.JsBarcode) {
                    try {
                        JsBarcode(`#${input.dataset.target}`, prefix + val, { format: "CODE128", height: 30, displayValue: true, fontSize: 10, margin: 0 });
                    } catch(e) {}
                }
            };
            document.querySelectorAll('.generate-barcode').forEach(i => {
                i.addEventListener('input', (e) => process(e.target));
                if(i.value) process(i);
            });
        },
        setupPrintHandler: function() {
            window.addEventListener('beforeprint', () => {
                document.querySelectorAll('select').forEach(sel => {
                    let span = sel.nextElementSibling;
                    if(!span || !span.classList.contains('print-only-value')) {
                        span = document.createElement('span');
                        span.className = 'print-only-value';
                        sel.parentNode.insertBefore(span, sel.nextSibling);
                    }
                    span.textContent = sel.options[sel.selectedIndex]?.text || '';
                });
            });
        },
        autoResize: function(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        },
        saveData: function() {
            const docId = document.body.id;
            const data = {};
            document.querySelectorAll('input, select, textarea').forEach(el => {
                if ((el.id || el.name) && el.type !== 'submit' && !el.closest('tr')) { 
                    if (el.type === 'checkbox') data[el.id || el.name] = el.checked;
                    else if (el.type === 'radio') { if(el.checked) data[el.name] = el.value; }
                    else data[el.id || el.name] = el.value;
                }
            });
            // Guardar datos custom
            if (docId === 'doc-fo-op-15') {
                Object.assign(data, AppCom.FO_OP_15.getCustomData());
            }
            localStorage.setItem(`xelle_comercial_${docId}`, JSON.stringify(data));
            Swal.fire({ icon: 'success', title: 'Guardado', timer: 1000, showConfirmButton: false });
        },
        loadData: function(docId) {
            const saved = localStorage.getItem(`xelle_comercial_${docId}`);
            if (!saved) return;
            const data = JSON.parse(saved);
            for (const [key, value] of Object.entries(data)) {
                let el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
                if (el && !el.closest('tr')) {
                    if (el.type === 'checkbox') el.checked = value;
                    else if (el.type === 'radio') {
                        const r = document.querySelector(`input[name="${key}"][value="${value}"]`);
                        if(r) r.checked = true;
                    } else el.value = value;
                    el.dispatchEvent(new Event('input')); 
                    el.dispatchEvent(new Event('change')); 
                }
            }
            if (docId === 'doc-fo-op-15') AppCom.FO_OP_15.loadCustomData(data);
        },
        clearForm: function() {
            Swal.fire({
                title: '¿Limpiar todo?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem(`xelle_comercial_${document.body.id}`);
                    location.reload();
                }
            });
        },
        printForm: function() { window.print(); }
    },

    // --- MÓDULO OP-15: REGISTRO DE PEDIDOS ---
    FO_OP_15: {
        init: function() {
            if(document.querySelector('#tbl-pedidos tbody').children.length === 0) {
                this.addPedidoRow();
            }
        },
        addPedidoRow: function() {
            const tbody = document.querySelector('#tbl-pedidos tbody');
            const row = document.createElement('tr');
            const prods = Object.keys(AppCom.config.DB_PRODUCTS).map(p => `<option value="${p}">${p}</option>`).join('');
            
            row.innerHTML = `
                <td><input type="number" class="cedit" style="text-align:center;"></td>
                <td><select class="cedit prod-select" onchange="AppCom.FO_OP_15.onProd(this)"><option value="">Seleccionar...</option>${prods}</select></td>
                <td><select class="cedit pres-select"><option>-</option></select></td>
                <td><input class="cedit"></td>
                <td><input type="date" class="cedit"></td>
                <td class="no-print"><button class="btn btn-danger btn-mini" onclick="this.closest('tr').remove()">x</button></td>
            `;
            tbody.appendChild(row);
        },
        onProd: function(select) {
            const row = select.closest('tr');
            const val = select.value;
            const presSelect = row.querySelector('.pres-select');
            presSelect.innerHTML = '<option>-</option>';
            
            if(val && AppCom.config.DB_PRODUCTS[val]) {
                AppCom.config.DB_PRODUCTS[val].pres.forEach(p => {
                    presSelect.add(new Option(p, p));
                });
            }
        },
        getCustomData: function() {
            const rows = [];
            document.querySelectorAll('#tbl-pedidos tbody tr').forEach(r => {
                const inputs = r.querySelectorAll('input, select');
                rows.push({
                    cant: inputs[0].value,
                    prod: inputs[1].value,
                    pres: inputs[2].value,
                    lote: inputs[3].value,
                    cad: inputs[4].value
                });
            });
            return { t_pedidos: rows };
        },
        loadCustomData: function(data) {
            if(data.t_pedidos) {
                const tbody = document.querySelector('#tbl-pedidos tbody');
                tbody.innerHTML = '';
                data.t_pedidos.forEach(item => {
                    this.addPedidoRow();
                    const r = tbody.lastElementChild;
                    const inputs = r.querySelectorAll('input, select');
                    inputs[0].value = item.cant;
                    inputs[1].value = item.prod;
                    this.onProd(inputs[1]); 
                    inputs[2].value = item.pres;
                    inputs[3].value = item.lote;
                    inputs[4].value = item.cad;
                });
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', ()=>AppCom.init());

// Funciones globales para botones HTML
window.saveForm = () => AppCom.Universal.saveData(); 
window.printForm = () => AppCom.Universal.printForm(); 
window.clearForm = () => AppCom.Universal.clearForm(); 
window.addPedidoRow = () => AppCom.FO_OP_15.addPedidoRow();