const API_URL = 'http://localhost:8080/api';

// Configuración inicial
document.addEventListener('DOMContentLoaded', () => {
    initDate(); // Corrige la fecha inicial
    
    // Escuchar cambios en fecha y responsable
    document.getElementById('current-date').addEventListener('change', updateDateDisplay);
    document.getElementById('responsible').addEventListener('input', syncResponsible);
    
    // Iniciar tablas
    addRecipientRow();
    addHarvestRow();
    
    // Cargar lista de frascos activos desde BD
    loadActiveRecipients();
});

// --- MANEJO DE FECHAS (FIX) ---
function initDate() {
    // Usamos la fecha local del navegador, formateada YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    const dateStr = `${yyyy}-${mm}-${dd}`;
    document.getElementById('current-date').value = dateStr;
    updateDateDisplay();
}

function updateDateDisplay() {
    const rawDate = document.getElementById('current-date').value;
    if (!rawDate) return;
    
    // Truco para evitar problemas de zona horaria: crear fecha a mediodía o dividir string
    const parts = rawDate.split('-'); 
    // parts[0] = año, parts[1] = mes, parts[2] = dia
    // Mes en JS es 0-11, por eso restamos 1
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]); 
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const textDate = dateObj.toLocaleDateString('es-ES', options);
    
    document.getElementById('day-date-display').textContent = 
        textDate.charAt(0).toUpperCase() + textDate.slice(1);
        
    // Actualizar también las fechas FI de las filas nuevas
    document.querySelectorAll('.recipient-fi').forEach(input => {
        if(input.value === '') input.value = rawDate;
    });
}

function syncResponsible() {
    const mainName = document.getElementById('responsible').value;
    document.querySelectorAll('.recipient-resp').forEach(input => {
        // Solo llenar si está vacío para permitir excepciones
        if(input.value.trim() === '') input.value = mainName;
    });
}

// --- TABLA RECIPIENTES ---
function addRecipientRow() {
    const tbody = document.querySelector('#daily-recipients tbody');
    const row = tbody.insertRow();
    
    const line = document.getElementById('cell-line').value || 'TPL32';
    const dateVal = document.getElementById('current-date').value;
    const count = tbody.rows.length; 
    const resp = document.getElementById('responsible').value;

    row.innerHTML = `
        <td><input type="text" class="recipient-line" value="${line}" onchange="updateCodes()"></td>
        <td><input type="date" class="recipient-fi" value="${dateVal}" onchange="updateCodes()"></td>
        <td><input type="number" class="recipient-num" value="${count}" onchange="updateCodes()" style="width:50px"></td>
        <td class="code-preview" style="font-weight:bold; color:#555; font-size:10px;">Generando...</td>
        <td><input type="number" class="recipient-pass" value="0" style="width:50px"></td>
        <td>
            <select class="recipient-type">
                <option>Flask 75 cm²</option><option>Flask 175 cm²</option>
                <option>Hyper Flask</option><option>Cell Stack</option>
            </select>
        </td>
        <td>
            <select class="recipient-status">
                <option value="activo">Activo</option>
                <option value="contaminado">Contaminado</option>
            </select>
        </td>
        <td><input type="text" class="recipient-obs"></td>
        <td><input type="text" class="recipient-resp" value="${resp}"></td>
        <td class="no-print"><button class="btn btn-danger" onclick="this.closest('tr').remove(); updateCounts()">X</button></td>
    `;
    updateCodes();
    updateCounts();
}

function updateCodes() {
    document.querySelectorAll('#daily-recipients tbody tr').forEach(row => {
        const line = row.querySelector('.recipient-line').value;
        const fi = row.querySelector('.recipient-fi').value;
        const num = row.querySelector('.recipient-num').value;
        
        if (fi) {
            const parts = fi.split('-');
            const dateObj = new Date(parts[0], parts[1]-1, parts[2]);
            const monthNames = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
            const day = String(dateObj.getDate()).padStart(2,'0');
            const mon = monthNames[dateObj.getMonth()];
            
            row.querySelector('.code-preview').textContent = `${line} ${day}${mon} #${num}`;
        }
    });
}

// --- TABLA COSECHAS ---
async function loadActiveRecipients() {
    try {
        const res = await fetch(`${API_URL}/recipientes/activos`);
        if(res.ok) {
            const data = await res.json();
            window.activeRecipients = data; // Guardar en memoria
            renderHarvestOptions();
        }
    } catch(e) { console.error("Sin conexión a backend"); }
}

function renderHarvestOptions() {
    const selects = document.querySelectorAll('.harvest-origin');
    selects.forEach(sel => {
        const current = sel.value;
        sel.innerHTML = '<option value="">Seleccionar...</option>';
        if(window.activeRecipients) {
            window.activeRecipients.forEach(r => {
                // Usar el código completo generado por la BD o armarlo
                const label = r.codigoCompleto || `${r.linea} #${r.numero} (${r.fechaFi})`;
                const opt = document.createElement('option');
                opt.value = r.id;
                opt.textContent = label;
                sel.appendChild(opt);
            });
        }
        sel.value = current;
    });
}

function addHarvestRow() {
    const tbody = document.querySelector('#daily-harvest tbody');
    const row = tbody.insertRow();
    row.innerHTML = `
        <td><select class="harvest-origin"></select></td>
        <td><input type="number" class="harvest-cells" placeholder="Total" onchange="calcHarvest()"></td>
        <td><input type="number" class="harvest-viab" value="95" style="width:50px"></td>
        <td>
            <select class="harvest-dest" onchange="calcHarvest()">
                <option>Dosificación</option>
                <option>Refrigeración</option>
                <option>Criopreservación</option>
                <option>Desecho</option>
            </select>
        </td>
        <td>
            <select class="harvest-status-change">
                <option value="cosechado">Marcar Cosechado</option>
                <option value="activo">Mantener Activo</option>
            </select>
        </td>
        <td><input type="text" class="harvest-notes"></td>
        <td class="no-print"><button class="btn btn-danger" onclick="this.closest('tr').remove(); calcHarvest()">X</button></td>
    `;
    renderHarvestOptions();
}

function calcHarvest() {
    let totals = { dosed:0, refrig:0, cryo:0, trash:0, sum:0 };
    
    document.querySelectorAll('#daily-harvest tbody tr').forEach(row => {
        const cells = parseFloat(row.querySelector('.harvest-cells').value) || 0;
        const dest = row.querySelector('.harvest-dest').value;
        
        totals.sum += cells;
        if(dest.includes('Dosifi')) totals.dosed += cells;
        if(dest.includes('Refrig')) totals.refrig += cells;
        if(dest.includes('Crio')) totals.cryo += cells;
        if(dest.includes('Desech')) totals.trash += cells;
    });

    document.getElementById('harvest-total').textContent = formatNum(totals.sum);
    document.getElementById('total-dosed').textContent = formatNum(totals.dosed);
    document.getElementById('total-refrig').textContent = formatNum(totals.refrig);
    document.getElementById('total-cryo').textContent = formatNum(totals.cryo);
    document.getElementById('total-trash').textContent = formatNum(totals.trash);
    document.getElementById('total-day').textContent = formatNum(totals.sum);
}

// --- UTILIDADES ---
function updateCounts() {
    document.getElementById('recipients-count').textContent = document.querySelector('#daily-recipients tbody').rows.length;
}

function formatNum(n) {
    if(n >= 1e6) return (n/1e6).toFixed(2) + ' M';
    return n.toLocaleString();
}

// --- GUARDAR EN BD ---
async function saveDay() {
    const mainResp = document.getElementById('responsible').value;
    if(!mainResp) return alert("Falta Responsable");

    // 1. Guardar Nuevos
    const newRecipients = document.querySelectorAll('#daily-recipients tbody tr');
    for(let r of newRecipients) {
        const payload = {
            linea: r.querySelector('.recipient-line').value,
            fechaFi: r.querySelector('.recipient-fi').value,
            numero: r.querySelector('.recipient-num').value,
            pasaje: r.querySelector('.recipient-pass').value,
            tipo: r.querySelector('.recipient-type').value,
            estado: r.querySelector('.recipient-status').value,
            observaciones: r.querySelector('.recipient-obs').value,
            responsableCreacion: r.querySelector('.recipient-resp').value
        };
        
        try {
            const res = await fetch(`${API_URL}/recipientes`, {
                method:'POST', 
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify(payload)
            });
            if(res.status === 400) alert(`Duplicado ignorado: ${payload.linea} #${payload.numero}`);
        } catch(e) { console.error(e); }
    }

    // 2. Guardar Cosechas
    const harvests = document.querySelectorAll('#daily-harvest tbody tr');
    for(let h of harvests) {
        const originId = h.querySelector('.harvest-origin').value;
        if(!originId) continue;

        const payload = {
            recipienteId: originId,
            celulas: h.querySelector('.harvest-cells').value,
            viabilidad: h.querySelector('.harvest-viab').value,
            destino: h.querySelector('.harvest-dest').value,
            nuevoEstadoRecipiente: h.querySelector('.harvest-status-change').value,
            observaciones: h.querySelector('.harvest-notes').value,
            responsable: mainResp
        };

        await fetch(`${API_URL}/movimientos`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
    }

    alert("Datos Guardados Exitosamente");
    location.reload();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Reporte Diario Xelle", 10, 10);
    // (Implementación básica para que el botón funcione, expandir si se requiere formato complejo)
    doc.save("Reporte.pdf");
}