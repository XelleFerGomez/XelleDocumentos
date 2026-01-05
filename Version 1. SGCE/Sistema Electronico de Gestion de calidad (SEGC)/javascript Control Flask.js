// Datos iniciales
const recipientTypes = [
    "Flask 75 cm²",
    "Flask 175 cm²", 
    "Flask 225 cm²",
    "Hyper Flask",
    "Cell Stack",
    "Bioreactor"
];

const productTypes = [
    "Stem Xelle",
    "Hybrid Xelle",
    "X-Breath Nebulizer",
    "X-Exosomes",
    "X-Exosomes HA",
    "X-Implant",
    "X-Wound Care",
    "REGENE"
];

const destinationTypes = [
    "Dosificación",
    "Refrigeración (Banco celular producción BCP)",
    "Criopreservación banco celular de trabajo (BCT)",
    "Criopreservación Banco Celular Maestro (BCM)",
    "Desecho RPBI"
];

// Almacenamiento de datos
let weeklyHistory = [];
let monthlyHistory = [];
let annualHistory = [];
let allRecipients = {};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', function() {
    setupWeekDates();
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    days.forEach(day => {
        addRecipientRow(day);
        addHarvestRow(day);
        addDoseRow(day);
    });
    
    loadSavedData();
    updateWeekSummary();
});

// Configurar fechas de la semana
function setupWeekDates() {
    const weekStartInput = document.getElementById('week-start');
    const today = new Date();
    
    if (!weekStartInput.value) {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        
        weekStartInput.valueAsDate = startOfWeek;
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        document.getElementById('week-end').valueAsDate = endOfWeek;
    }
    
    updateDayDates();
}

// Actualizar fechas de cada día
function updateDayDates() {
    const weekStart = new Date(document.getElementById('week-start').value);
    if (!weekStart) return;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    days.forEach((day, index) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(weekStart.getDate() + index);
        
        const dateElement = document.getElementById(`${day}-date`);
        if (dateElement) {
            dateElement.textContent = formatDate(dayDate);
        }
    });
}

// Formatear fecha
function formatDate(date) {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Generar código de recipiente
function generateRecipientCode(line, fi, number) {
    const fiFormatted = formatDateForCode(fi);
    return `${line} ${fiFormatted} # ${number}`;
}

// Formatear fecha para código
function formatDateForCode(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
}

// Agregar fila a recipientes
function addRecipientRow(day) {
    const table = document.getElementById(`${day}-recipients`).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    const dayDate = document.getElementById(`${day}-date`).textContent;
    const cellLine = document.getElementById('cell-line').value || 'TPL27';
    const recipientCount = document.querySelectorAll(`#${day}-recipients tbody tr`).length + 1;
    
    newRow.innerHTML = `
        <td><input type="text" class="recipient-line" value="${cellLine}" onchange="updateRecipientCode(this)"></td>
        <td><input type="date" class="recipient-fi" value="${getDateForInput(dayDate)}" onchange="updateRecipientCode(this)"></td>
        <td><input type="number" class="recipient-number" value="${recipientCount}" onchange="updateRecipientCode(this)"></td>
        <td><div class="code-preview">${generateRecipientCode(cellLine, getDateForInput(dayDate), recipientCount)}</div></td>
        <td>
            <select class="recipient-type">
                <option value="">Seleccionar</option>
                ${recipientTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
        </td>
        <td>
            <select class="recipient-status">
                <option value="activo">Activo</option>
                <option value="contaminado">Contaminado</option>
                <option value="cosechado">Cosechado</option>
                <option value="desechado">Desechado</option>
            </select>
        </td>
        <td><input type="text" class="recipient-notes" placeholder="Observaciones"></td>
        <td class="no-print"><button class="btn btn-danger" onclick="confirmDeleteRow(this)">Eliminar</button></td>
    `;
    
    updateRecipientsTotal(day);
    updateRecipientOptions(day);
}

// Actualizar código de recipiente
function updateRecipientCode(input) {
    const row = input.closest('tr');
    const line = row.querySelector('.recipient-line').value;
    const fi = row.querySelector('.recipient-fi').value;
    const number = row.querySelector('.recipient-number').value;
    
    const codePreview = row.querySelector('.code-preview');
    codePreview.textContent = generateRecipientCode(line, fi, number);
    
    // Actualizar opciones en cosecha
    const day = row.closest('.day-section').id.split('-')[0];
    updateRecipientOptions(day);
}

// Agregar fila a control de cultivos
function addHarvestRow(day) {
    const table = document.getElementById(`${day}-harvest`).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>
            <select class="harvest-recipient" onchange="updateHarvestRecipientType(this, '${day}')">
                <option value="">Seleccionar</option>
            </select>
        </td>
        <td><input type="text" class="harvest-recipient-type" placeholder="Tipo de recipiente" readonly></td>
        <td><input type="text" class="harvest-cells" placeholder="Ej: 1.5x10^6" onchange="updateHarvestTotal('${day}')"></td>
        <td><input type="text" class="harvest-viability" placeholder="Ej: 95%" onchange="updateHarvestTotal('${day}')"></td>
        <td>
            <select class="harvest-destination" onchange="updateInventory('${day}')">
                <option value="">Seleccionar</option>
                ${destinationTypes.map(type => `<option value="${type}">${type}</option>`).join('')}
            </select>
        </td>
        <td><input type="text" class="harvest-notes" placeholder="Observaciones"></td>
        <td class="no-print"><button class="btn btn-danger" onclick="confirmDeleteRow(this)">Eliminar</button></td>
    `;
    
    updateRecipientOptions(day);
    updateHarvestTotal(day);
}

// Actualizar tipo de recipiente en control de cultivos
function updateHarvestRecipientType(select, day) {
    const row = select.closest('tr');
    const recipientTypeInput = row.querySelector('.harvest-recipient-type');
    const selectedCode = select.value;
    
    // Buscar en la tabla de recipientes del mismo día
    const recipientsTable = document.getElementById(`${day}-recipients`);
    const recipientRows = recipientsTable.querySelectorAll('tbody tr');
    
    let foundType = '';
    recipientRows.forEach(recipientRow => {
        const codePreview = recipientRow.querySelector('.code-preview');
        if (codePreview && codePreview.textContent === selectedCode) {
            const typeSelect = recipientRow.querySelector('.recipient-type');
            foundType = typeSelect ? typeSelect.value : '';
        }
    });
    
    recipientTypeInput.value = foundType;
}

// Agregar fila a dosis
function addDoseRow(day) {
    const table = document.getElementById(`${day}-doses`).getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    
    newRow.innerHTML = `
        <td>
            <input type="text" class="dose-product" placeholder="Nombre del producto">
        </td>
        <td><input type="text" class="dose-presentation" placeholder="Ej: 10M"></td>
        <td><input type="number" class="dose-quantity" placeholder="Cantidad"></td>
        <td><input type="text" class="dose-lot" placeholder="Lote"></td>
        <td><input type="text" class="dose-cells" placeholder="Células utilizadas" onchange="updateDosesTotal('${day}')"></td>
        <td class="no-print"><button class="btn btn-danger" onclick="confirmDeleteRow(this)">Eliminar</button></td>
    `;
    
    updateDosesTotal(day);
}

// Obtener fecha en formato YYYY-MM-DD para input date
function getDateForInput(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
}

// Funciones auxiliares
function confirmDeleteRow(button) {
    if (confirm('¿Está seguro de que desea eliminar esta fila?')) {
        deleteRow(button);
    }
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const table = row.parentNode.parentNode;
    const day = table.id.split('-')[0];
    
    // Si estamos eliminando un recipiente, eliminar también de las cosechas
    if (table.id.includes('recipients')) {
        const codePreview = row.querySelector('.code-preview');
        if (codePreview) {
            const code = codePreview.textContent;
            
            // Eliminar de la tabla de cosecha del mismo día
            const harvestTable = document.getElementById(`${day}-harvest`).getElementsByTagName('tbody')[0];
            const harvestRows = harvestTable.querySelectorAll('tr');
            harvestRows.forEach(harvestRow => {
                const harvestSelect = harvestRow.querySelector('.harvest-recipient');
                if (harvestSelect && harvestSelect.value === code) {
                    harvestRow.remove();
                }
            });
        }
    }
    
    row.remove();
    
    // Actualizar totales según la tabla
    if (table.id.includes('recipients')) {
        updateRecipientsTotal(day);
        updateRecipientOptions(day);
    } else if (table.id.includes('harvest')) {
        updateHarvestTotal(day);
    } else if (table.id.includes('doses')) {
        updateDosesTotal(day);
    }
}

function updateRecipientOptions(day) {
    const recipientSelects = document.querySelectorAll(`#${day}-harvest .harvest-recipient`);
    const codePreviews = document.querySelectorAll(`#${day}-recipients .code-preview`);
    const recipientCodes = Array.from(codePreviews)
        .map(preview => preview.textContent)
        .filter(value => value.trim() !== '');
    
    recipientSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Seleccionar</option>';
        
        recipientCodes.forEach(code => {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = code;
            select.appendChild(option);
        });
        
        // Restaurar valor anterior si existe
        if (recipientCodes.includes(currentValue)) {
            select.value = currentValue;
        }
    });
}

function updateRecipientsTotal(day) {
    const recipientRows = document.querySelectorAll(`#${day}-recipients tbody tr`).length;
    document.getElementById(`${day}-recipients-total`).textContent = recipientRows;
    updateWeekSummary();
}

function updateHarvestTotal(day) {
    const harvestCells = document.querySelectorAll(`#${day}-harvest .harvest-cells`);
    let total = 0;
    
    harvestCells.forEach(input => {
        const value = input.value.trim();
        if (value) {
            const cellCount = parseCellInput(value);
            total += cellCount;
        }
    });
    
    document.getElementById(`${day}-harvest-total`).textContent = formatCellCount(total);
    updateInventory(day);
}

function updateDosesTotal(day) {
    const doseCells = document.querySelectorAll(`#${day}-doses .dose-cells`);
    let total = 0;
    
    doseCells.forEach(input => {
        const value = input.value.trim();
        if (value) {
            const cellCount = parseCellInput(value);
            total += cellCount;
        }
    });
    
    document.getElementById(`${day}-doses-total`).textContent = formatCellCount(total);
    updateInventory(day);
}

function parseCellInput(value) {
    // Convertir notación científica a número
    const match = value.match(/(\d+(?:\.\d+)?)\s*x\s*10\s*\^\s*(\d+)/i);
    if (match) {
        const base = parseFloat(match[1]);
        const exponent = parseInt(match[2]);
        return base * Math.pow(10, exponent);
    } else {
        // Intentar parsear como número normal
        const num = parseFloat(value.replace(/[^\d.]/g, ''));
        return isNaN(num) ? 0 : num;
    }
}

function updateInventory(day) {
    const harvestRows = document.querySelectorAll(`#${day}-harvest tbody tr`);
    let dosed = 0;
    let refrigeration = 0;
    let cryopreserved = 0;
    let discarded = 0;
    
    // Calcular células por destino desde la tabla de cosecha
    harvestRows.forEach(row => {
        const destination = row.querySelector('.harvest-destination').value;
        const cellsInput = row.querySelector('.harvest-cells').value;
        
        if (cellsInput) {
            const cellCount = parseCellInput(cellsInput);
            
            if (destination === 'Dosificación') {
                dosed += cellCount;
            } else if (destination === 'Refrigeración (Banco celular producción BCP)') {
                refrigeration += cellCount;
            } else if (destination.includes('Criopreservación')) {
                cryopreserved += cellCount;
            } else if (destination === 'Desecho RPBI') {
                discarded += cellCount;
            }
        }
    });
    
    // Sumar las células de dosis preparadas
    const dosesTotalText = document.getElementById(`${day}-doses-total`).textContent;
    if (dosesTotalText && dosesTotalText !== '0') {
        const dosesTotal = parseCellCount(dosesTotalText);
        dosed += dosesTotal;
    }
    
    // Actualizar valores en la tabla de inventario
    document.getElementById(`${day}-dosed`).textContent = formatCellCount(dosed);
    document.getElementById(`${day}-refrigeration`).textContent = formatCellCount(refrigeration);
    document.getElementById(`${day}-cryopreserved`).textContent = formatCellCount(cryopreserved);
    document.getElementById(`${day}-discarded`).textContent = formatCellCount(discarded);
    
    // Calcular total del día
    const totalDay = dosed + refrigeration + cryopreserved + discarded;
    document.getElementById(`${day}-total-day`).textContent = formatCellCount(totalDay);
    
    updateWeekSummary();
}

function parseCellCount(formattedCount) {
    if (!formattedCount || formattedCount === '0') return 0;
    
    const match = formattedCount.match(/(\d+(?:\.\d+)?)([KMB]?)/);
    if (match) {
        const base = parseFloat(match[1]);
        const suffix = match[2];
        
        switch(suffix) {
            case 'K': return base * 1e3;
            case 'M': return base * 1e6;
            case 'B': return base * 1e9;
            default: return base;
        }
    }
    
    return parseFloat(formattedCount.replace(/[^\d.]/g, '')) || 0;
}

function formatCellCount(count) {
    if (count === 0) return '0';
    if (count < 1000) return count.toString();
    
    const exponents = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' }
    ];
    
    for (const exp of exponents) {
        if (count >= exp.value) {
            return (count / exp.value).toFixed(2) + exp.suffix;
        }
    }
    
    return count.toString();
}

function updateWeekSummary() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let weekRecipients = 0;
    let weekHarvest = 0;
    let weekDosed = 0;
    let weekRefrigeration = 0;
    let weekCryopreserved = 0;
    let weekDiscarded = 0;
    let weekTotal = 0;
    
    days.forEach(day => {
        // Recipientes activos
        const recipients = parseInt(document.getElementById(`${day}-recipients-total`).textContent) || 0;
        document.getElementById(`week-${day}-recipients`).textContent = recipients;
        weekRecipients += recipients;
        
        // Células cosechadas
        const harvest = parseCellCount(document.getElementById(`${day}-harvest-total`).textContent);
        document.getElementById(`week-${day}-harvest`).textContent = formatCellCount(harvest);
        weekHarvest += harvest;
        
        // Células dosificadas
        const dosed = parseCellCount(document.getElementById(`${day}-dosed`).textContent);
        document.getElementById(`week-${day}-dosed`).textContent = formatCellCount(dosed);
        weekDosed += dosed;
        
        // Células refrigeradas
        const refrigeration = parseCellCount(document.getElementById(`${day}-refrigeration`).textContent);
        document.getElementById(`week-${day}-refrigeration`).textContent = formatCellCount(refrigeration);
        weekRefrigeration += refrigeration;
        
        // Células criopreservadas
        const cryopreserved = parseCellCount(document.getElementById(`${day}-cryopreserved`).textContent);
        document.getElementById(`week-${day}-cryopreserved`).textContent = formatCellCount(cryopreserved);
        weekCryopreserved += cryopreserved;
        
        // Células desechadas
        const discarded = parseCellCount(document.getElementById(`${day}-discarded`).textContent);
        document.getElementById(`week-${day}-discarded`).textContent = formatCellCount(discarded);
        weekDiscarded += discarded;
        
        // Total del día
        const dayTotal = parseCellCount(document.getElementById(`${day}-total-day`).textContent);
        document.getElementById(`week-${day}-total`).textContent = formatCellCount(dayTotal);
        weekTotal += dayTotal;
    });
    
    // Actualizar totales semanales
    document.getElementById('week-total-recipients').textContent = weekRecipients;
    document.getElementById('week-total-harvest').textContent = formatCellCount(weekHarvest);
    document.getElementById('week-total-dosed').textContent = formatCellCount(weekDosed);
    document.getElementById('week-total-refrigeration').textContent = formatCellCount(weekRefrigeration);
    document.getElementById('week-total-cryopreserved').textContent = formatCellCount(weekCryopreserved);
    document.getElementById('week-total-discarded').textContent = formatCellCount(weekDiscarded);
    document.getElementById('week-total-general').textContent = formatCellCount(weekTotal);
}

// Funciones de guardado
function saveDay(day) {
    try {
        const dayData = {
            date: document.getElementById(`${day}-date`).textContent,
            recipients: getTableData(`${day}-recipients`),
            harvest: getTableData(`${day}-harvest`),
            doses: getTableData(`${day}-doses`),
            inventory: {
                dosed: document.getElementById(`${day}-dosed`).textContent,
                refrigeration: document.getElementById(`${day}-refrigeration`).textContent,
                cryopreserved: document.getElementById(`${day}-cryopreserved`).textContent,
                discarded: document.getElementById(`${day}-discarded`).textContent,
                total: document.getElementById(`${day}-total-day`).textContent
            },
            notes: getInventoryNotes(day)
        };
        
        localStorage.setItem(`cosecha-${day}`, JSON.stringify(dayData));
        alert(`Datos del ${day} guardados correctamente.`);
    } catch (error) {
        alert(`Error al guardar ${day}: ${error.message}`);
    }
}

function saveWeek() {
    try {
        const weekData = {
            startDate: document.getElementById('week-start').value,
            endDate: document.getElementById('week-end').value,
            responsible: document.getElementById('responsible').value,
            cellLine: document.getElementById('cell-line').value,
            days: {}
        };
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        days.forEach(day => {
            weekData.days[day] = JSON.parse(localStorage.getItem(`cosecha-${day}`) || '{}');
        });
        
        // Agregar a historial
        weeklyHistory.push(weekData);
        localStorage.setItem('cosecha-historial-semanal', JSON.stringify(weeklyHistory));
        
        localStorage.setItem('cosecha-semana', JSON.stringify(weekData));
        alert('Datos de la semana guardados correctamente.');
    } catch (error) {
        alert(`Error al guardar semana: ${error.message}`);
    }
}

function saveAllData() {
    try {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        days.forEach(day => {
            saveDay(day);
        });
        saveWeek();
        alert('Todos los datos guardados correctamente.');
    } catch (error) {
        alert(`Error al guardar todos los datos: ${error.message}`);
    }
}

function getInventoryNotes(day) {
    const notes = {};
    const noteInputs = document.querySelectorAll(`.inventory-notes[data-day="${day}"]`);
    
    noteInputs.forEach(input => {
        notes[input.dataset.type] = input.value;
    });
    
    return notes;
}

function loadSavedData() {
    try {
        const weekData = JSON.parse(localStorage.getItem('cosecha-semana') || '{}');
        const weeklyHistoryData = localStorage.getItem('cosecha-historial-semanal');
        
        if (weeklyHistoryData) {
            weeklyHistory = JSON.parse(weeklyHistoryData);
        }
        
        if (weekData.startDate) {
            document.getElementById('week-start').value = weekData.startDate;
            document.getElementById('week-end').value = weekData.endDate;
            document.getElementById('responsible').value = weekData.responsible || '';
            document.getElementById('cell-line').value = weekData.cellLine || '';
            
            updateDayDates();
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function getTableData(tableId) {
    const table = document.getElementById(tableId);
    const headers = Array.from(table.querySelectorAll('thead th'))
        .map(th => th.textContent.trim())
        .filter(header => header !== 'Acciones');
    const rows = table.querySelectorAll('tbody tr');
    const data = [];
    
    rows.forEach(row => {
        const rowData = {};
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, index) => {
            if (index < headers.length) {
                const input = cell.querySelector('input, select');
                // Para celdas con code-preview, usar el texto del preview
                const codePreview = cell.querySelector('.code-preview');
                if (codePreview) {
                    rowData[headers[index]] = codePreview.textContent.trim();
                } else {
                    rowData[headers[index]] = input ? input.value : cell.textContent.trim();
                }
            }
        });
        
        data.push(rowData);
    });
    
    return data;
}

// Funciones de impresión
function printDay(day) {
    const allDays = document.querySelectorAll('.day-section');
    allDays.forEach(daySection => {
        daySection.classList.add('hidden');
    });
    
    document.getElementById(`${day}-section`).classList.remove('hidden');
    
    window.print();
    
    setTimeout(() => {
        allDays.forEach(daySection => {
            daySection.classList.remove('hidden');
        });
    }, 500);
}

function printWeek() {
    const allDays = document.querySelectorAll('.day-section');
    allDays.forEach(daySection => {
        daySection.classList.add('hidden');
    });
    
    document.querySelector('.week-summary').classList.remove('hidden');
    
    window.print();
    
    setTimeout(() => {
        allDays.forEach(daySection => {
            daySection.classList.remove('hidden');
        });
    }, 500);
}

function printAll() {
    window.print();
}

function clearAllData() {
    if (confirm('¿Está seguro de que desea limpiar todos los datos del formato?')) {
        localStorage.removeItem('cosecha-semana');
        
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        days.forEach(day => {
            localStorage.removeItem(`cosecha-${day}`);
            
            const tables = [
                `${day}-recipients`,
                `${day}-harvest`,
                `${day}-doses`
            ];
            
            tables.forEach(tableId => {
                const table = document.getElementById(tableId);
                const tbody = table.getElementsByTagName('tbody')[0];
                tbody.innerHTML = '';
            });
            
            addRecipientRow(day);
            addHarvestRow(day);
            addDoseRow(day);
            
            document.getElementById(`${day}-dosed`).textContent = '0';
            document.getElementById(`${day}-refrigeration`).textContent = '0';
            document.getElementById(`${day}-cryopreserved`).textContent = '0';
            document.getElementById(`${day}-discarded`).textContent = '0';
            document.getElementById(`${day}-total-day`).textContent = '0';
            
            const noteInputs = document.querySelectorAll(`.inventory-notes[data-day="${day}"]`);
            noteInputs.forEach(input => {
                input.value = '';
            });
        });
        
        document.getElementById('responsible').value = '';
        document.getElementById('cell-line').value = '';
        
        updateWeekSummary();
        
        alert('Formato limpiado correctamente.');
    }
}

// Funciones de reportes PDF
function generateWeeklyReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const weekStart = document.getElementById('week-start').value;
    const weekEnd = document.getElementById('week-end').value;
    const responsible = document.getElementById('responsible').value;
    const cellLine = document.getElementById('cell-line').value;
    
    // Título
    doc.setFontSize(16);
    doc.text('REPORTE SEMANAL - COSECHA Y DOSIFICACIÓN', 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Período: ${weekStart} a ${weekEnd}`, 105, 22, { align: 'center' });
    doc.text(`Responsable: ${responsible} | Línea Celular: ${cellLine}`, 105, 27, { align: 'center' });
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 105, 32, { align: 'center' });
    
    // Resumen ejecutivo
    doc.setFontSize(12);
    doc.text('RESUMEN EJECUTIVO', 14, 45);
    doc.setFontSize(10);
    
    const summaryData = [
        ['Total de Recipientes', document.getElementById('week-total-recipients').textContent],
        ['Células Cosechadas', document.getElementById('week-total-harvest').textContent],
        ['Células Dosificadas', document.getElementById('week-total-dosed').textContent],
        ['Células Refrigeradas', document.getElementById('week-total-refrigeration').textContent],
        ['Células Criopreservadas', document.getElementById('week-total-cryopreserved').textContent],
        ['Células Desechadas', document.getElementById('week-total-discarded').textContent],
        ['TOTAL GENERAL', document.getElementById('week-total-general').textContent]
    ];
    
    doc.autoTable({
        startY: 50,
        head: [['Concepto', 'Cantidad']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Tabla detallada por día
    doc.addPage();
    doc.setFontSize(12);
    doc.text('DETALLE POR DÍA', 14, 15);
    
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayData = [];
    
    days.forEach((dayName, index) => {
        const day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][index];
        dayData.push([
            dayName,
            document.getElementById(`week-${day}-recipients`).textContent,
            document.getElementById(`week-${day}-harvest`).textContent,
            document.getElementById(`week-${day}-dosed`).textContent,
            document.getElementById(`week-${day}-refrigeration`).textContent,
            document.getElementById(`week-${day}-cryopreserved`).textContent,
            document.getElementById(`week-${day}-discarded`).textContent
        ]);
    });
    
    doc.autoTable({
        startY: 20,
        head: [['Día', 'Recipientes', 'Cosechadas', 'Dosificadas', 'Refrigeradas', 'Criopreservadas', 'Desechadas']],
        body: dayData,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Detalle de recipientes
    doc.addPage();
    doc.setFontSize(12);
    doc.text('DETALLE DE RECIPIENTES', 14, 15);
    
    const allRecipientsData = [];
    const dayNames = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado'
    };
    
    Object.keys(dayNames).forEach(day => {
        const recipients = getTableData(`${day}-recipients`);
        recipients.forEach(recipient => {
            allRecipientsData.push([
                dayNames[day],
                recipient.Código || '',
                recipient.Tipo || '',
                recipient.Estado || '',
                recipient.Observaciones || ''
            ]);
        });
    });
    
    if (allRecipientsData.length > 0) {
        doc.autoTable({
            startY: 20,
            head: [['Día', 'Código', 'Tipo', 'Estado', 'Observaciones']],
            body: allRecipientsData,
            theme: 'grid',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [41, 128, 185] }
        });
    } else {
        doc.text('No hay recipientes registrados', 14, 25);
    }
    
    // Guardar PDF
    doc.save(`Reporte_Semanal_${weekStart}_a_${weekEnd}.pdf`);
}

function generateDailyReport(day = null) {
    if (!day) {
        // Si no se especifica día, usar el primero disponible
        day = 'monday';
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const dayName = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado'
    }[day];
    
    const date = document.getElementById(`${day}-date`).textContent;
    const responsible = document.getElementById('responsible').value;
    const cellLine = document.getElementById('cell-line').value;
    
    // Título
    doc.setFontSize(16);
    doc.text(`REPORTE DIARIO - ${dayName.toUpperCase()}`, 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, 105, 22, { align: 'center' });
    doc.text(`Responsable: ${responsible} | Línea Celular: ${cellLine}`, 105, 27, { align: 'center' });
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 105, 32, { align: 'center' });
    
    // Resumen del día
    doc.setFontSize(12);
    doc.text('RESUMEN DEL DÍA', 14, 45);
    doc.setFontSize(10);
    
    const summaryData = [
        ['Recipientes Activos', document.getElementById(`${day}-recipients-total`).textContent],
        ['Células Cosechadas', document.getElementById(`${day}-harvest-total`).textContent],
        ['Células Dosificadas', document.getElementById(`${day}-dosed`).textContent],
        ['Células Refrigeradas', document.getElementById(`${day}-refrigeration`).textContent],
        ['Células Criopreservadas', document.getElementById(`${day}-cryopreserved`).textContent],
        ['Células Desechadas', document.getElementById(`${day}-discarded`).textContent],
        ['TOTAL DEL DÍA', document.getElementById(`${day}-total-day`).textContent]
    ];
    
    doc.autoTable({
        startY: 50,
        head: [['Concepto', 'Cantidad']],
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Detalle de recipientes
    doc.addPage();
    doc.setFontSize(12);
    doc.text('RECIPIENTES EN CULTIVO', 14, 15);
    
    const recipients = getTableData(`${day}-recipients`);
    if (recipients.length > 0) {
        const recipientData = recipients.map(recipient => [
            recipient.Código || '',
            recipient.Tipo || '',
            recipient.Estado || '',
            recipient.Observaciones || ''
        ]);
        
        doc.autoTable({
            startY: 20,
            head: [['Código', 'Tipo', 'Estado', 'Observaciones']],
            body: recipientData,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        });
    } else {
        doc.text('No hay recipientes registrados', 14, 20);
    }
    
    // Detalle de cosecha
    doc.addPage();
    doc.setFontSize(12);
    doc.text('CONTROL DE CULTIVOS', 14, 15);
    
    const harvest = getTableData(`${day}-harvest`);
    if (harvest.length > 0) {
        const harvestData = harvest.map(item => [
            item['Código'] || '',
            item['Recipiente'] || '',
            item['Células Obtenidas'] || '',
            item['Viabilidad (%)'] || '',
            item['Destino'] || '',
            item['Observaciones'] || ''
        ]);
        
        doc.autoTable({
            startY: 20,
            head: [['Código', 'Recipiente', 'Células', 'Viabilidad', 'Destino', 'Observaciones']],
            body: harvestData,
            theme: 'grid',
            styles: { fontSize: 7 },
            headStyles: { fillColor: [41, 128, 185] }
        });
    } else {
        doc.text('No hay controles de cultivo registrados', 14, 20);
    }
    
    // Guardar PDF
    doc.save(`Reporte_${dayName}_${date.replace(/\//g, '-')}.pdf`);
}