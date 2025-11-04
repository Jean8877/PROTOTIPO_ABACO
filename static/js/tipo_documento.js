'use strict';

const STORAGE_KEY = 'paramsBancoAlimentos_v1';
const initialStructure = { document: [], gender: [], status: [] };
let systemParams = {};

// -------------------- LocalStorage --------------------
function saveParams() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(systemParams));
}

function loadParams() {
    const raw = localStorage.getItem(STORAGE_KEY);
    systemParams = raw ? JSON.parse(raw) : initialStructure;
}

// -------------------- Notificación --------------------
function showNotification(msg, type = 'success') {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.className = `notification ${type} show`;
    setTimeout(() => { n.className = `notification ${type}`; }, 2500);
}

// -------------------- Renderizado --------------------
const paramsContainer = document.getElementById('paramsContainer');

function clearParamsGrid() { paramsContainer.innerHTML = ''; }

function createParamCard(type, param) {
    const card = document.createElement('article');
    card.className = 'param-card';
    card.dataset.type = type;
    card.dataset.code = param.code;
    card.innerHTML = `
        <div class="param-header">
          <span class="param-code">${param.code}</span>
          <span class="param-status ${param.status === 'active' ? 'status-active' : 'status-inactive'}">
            ${param.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <h3 class="param-name">${param.name}</h3>
        <div class="param-desc">${param.description || ''}</div>
        <div class="param-actions">
          <button class="action-btn edit-btn" data-action="edit"><i class="fas fa-edit"></i> Editar</button>
          <button class="action-btn toggle-btn" data-action="toggle">${param.status === 'active'
                    ? '<i class="fas fa-ban"></i> Desactivar' : '<i class="fas fa-check"></i> Activar'}</button>
          <button class="action-btn delete-btn" data-action="delete"><i class="fas fa-trash"></i> Eliminar</button>
        </div>`;
    return card;
}

function renderParams(filterType = 'all', searchTerm = '') {
    clearParamsGrid();
    const term = searchTerm.toLowerCase();
    Object.keys(systemParams).forEach(type => {
        systemParams[type].forEach(param => {
            if (filterType !== 'all' && filterType !== type) return;
            if (term && !param.name.toLowerCase().includes(term) && !param.code.toLowerCase().includes(term)) return;
            const card = createParamCard(type, param);
            paramsContainer.appendChild(card);
        });
    });
}

// -------------------- Filtro activo --------------------
function getActiveFilter() {
    const activeBtn = document.querySelector('.param-type-btn.active');
    return activeBtn ? activeBtn.dataset.type : 'all';
}

// -------------------- Backend: Tipo Documento --------------------
async function cargarTiposDocumento() {
    try {
        const response = await fetch('/api/tipo_documento/');
        const tipos = await response.json();
        systemParams['document'] = tipos.map(t => ({
            id: t.id,
            name: t.tipo,
            code: t.numero,
            description: '',
            status: 'active'
        }));
    } catch (err) {
        console.error('Error cargando tipos de documento:', err);
    }
}

async function guardarTipoDocumento(nombre, numero) {
    try {
        const response = await fetch('/api/tipo_documento/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: nombre, numero: numero })
        });
        const data = await response.json();
        if (response.ok) {
            showNotification('Tipo de documento guardado correctamente');
            await cargarTiposDocumento();
            renderParams('document');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (err) {
        showNotification('Error al guardar el tipo de documento', 'error');
        console.error(err);
    }
}

async function editarTipoDocumento(id, nombre, numero) {
    try {
        const response = await fetch(`/api/tipo_documento/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tipo: nombre, numero: numero })
        });
        const data = await response.json();
        if (response.ok) {
            showNotification('Tipo de documento actualizado correctamente');
            await cargarTiposDocumento();
            renderParams('document');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (err) {
        showNotification('Error al actualizar el tipo de documento', 'error');
        console.error(err);
    }
}

async function eliminarTipoDocumento(id) {
    try {
        const response = await fetch(`/api/tipo_documento/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (response.ok) {
            showNotification('Tipo de documento eliminado correctamente');
            await cargarTiposDocumento();
            renderParams('document');
        } else {
            showNotification(data.error, 'error');
        }
    } catch (err) {
        showNotification('Error al eliminar el tipo de documento', 'error');
        console.error(err);
    }
}

// -------------------- Formulario --------------------
document.getElementById('parameterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tipo = document.getElementById('paramType').value;
    const nombre = document.getElementById('name').value;
    const descripcion = document.getElementById('description').value;
    const editId = document.getElementById('editOldCode').value;

    if (tipo === 'document') {
        if (editId) {
            await editarTipoDocumento(editId, nombre, descripcion);
            document.getElementById('editOldCode').value = '';
        } else {
            await guardarTipoDocumento(nombre, descripcion);
        }
        document.getElementById('modal').classList.remove('show');
    } else {
        const code = Date.now();
        systemParams[tipo].push({ name: nombre, code: code, description: descripcion, status: 'active' });
        saveParams();
        renderParams(tipo);
        document.getElementById('modal').classList.remove('show');
        showNotification('Parámetro guardado correctamente');
    }
});

// -------------------- Acciones en la grilla --------------------
paramsContainer.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const card = btn.closest('.param-card');
    const type = card.dataset.type;
    const code = card.dataset.code;

    if (btn.dataset.action === 'edit') {
        const param = systemParams[type].find(p => p.code == code);
        document.getElementById('paramType').value = type;
        document.getElementById('name').value = param.name;
        document.getElementById('description').value = param.description || '';
        if (type === 'document') document.getElementById('editOldCode').value = param.id;
        document.getElementById('modal').classList.add('show');
    }

    if (btn.dataset.action === 'toggle') {
        const param = systemParams[type].find(p => p.code == code);
        param.status = param.status === 'active' ? 'inactive' : 'active';
        if (type !== 'document') saveParams();
        renderParams(getActiveFilter());
    }

    if (btn.dataset.action === 'delete') {
        if (type === 'document') {
            const param = systemParams[type].find(p => p.code == code);
            if (confirm('¿Seguro que deseas eliminar este tipo de documento?')) {
                await eliminarTipoDocumento(param.id);
            }
        } else {
            systemParams[type] = systemParams[type].filter(p => p.code != code);
            saveParams();
            renderParams(type);
        }
    }
});

// -------------------- Inicialización --------------------
document.addEventListener('DOMContentLoaded', async () => {
    loadParams();
    await cargarTiposDocumento();
    renderParams();

    document.getElementById('openAdd').addEventListener('click', () => {
        document.getElementById('modal').classList.add('show');
    });
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('modal').classList.remove('show');
    });
    document.getElementById('searchInput').addEventListener('input', (e) => {
        renderParams(getActiveFilter(), e.target.value);
    });
    document.querySelectorAll('.param-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.param-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderParams(btn.dataset.type, document.getElementById('searchInput').value);
        });
    });
});
// archivo: tipo_documento.js