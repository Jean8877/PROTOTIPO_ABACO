// =============================
// CONFIGURACIÓN BASE
// =============================
const API_DONANTES = 'http://localhost:5000/api/donantes';

const formDonante = document.getElementById('formDonante');
const tablaDonantes = document.getElementById('tablaDonantes').querySelector('tbody');
const selectTipoDonante = document.getElementById('tipoDonante');
const selectTipoDocumento = document.getElementById('tipoDocumento');
let editandoId = null;

// =============================
// CARGAR TIPOS DE DONANTE
// =============================
async function cargarTiposDonante() {
    try {
        const res = await fetch(`${API_DONANTES}/tipos`);
        if (!res.ok) throw new Error('No se pudo obtener los tipos de donante');
        const tipos = await res.json();

        selectTipoDonante.innerHTML = '<option value="">Seleccione un tipo...</option>';
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo;
            option.textContent = tipo.nombre;
            selectTipoDonante.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los tipos de donante', 'error');
    }
}

// =============================
// CARGAR TIPOS DE DOCUMENTO
// =============================
async function cargarTiposDocumento() {
    try {
        const res = await fetch(`${API_DONANTES}/tipos_documento`);
        if (!res.ok) throw new Error('No se pudo obtener los tipos de documento');
        const tipos = await res.json();

        selectTipoDocumento.innerHTML = '<option value="">Seleccione un tipo de documento...</option>';
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo_doc;
            option.textContent = tipo.nombre;
            selectTipoDocumento.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los tipos de documento', 'error');
    }
}

// =============================
// CARGAR LISTA DE DONANTES
// =============================
async function cargarDonantes() {
    try {
        const res = await fetch(`${API_DONANTES}/`);
        if (!res.ok) throw new Error('No se pudieron cargar los donantes');

        const donantes = await res.json();
        tablaDonantes.innerHTML = '';

        donantes.forEach(d => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${d.id_donante}</td>
                <td>${d.nombre || ''}</td>
                <td>${d.tipo_documento || 'Sin tipo'}</td>
                <td>${d.numero_documento || ''}</td>
                <td>${d.tipo_nombre || 'Sin tipo'}</td>
                <td>${d.telefono || ''}</td>
                <td>${d.correo || ''}</td>
                <td>${d.direccion || ''}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-2" onclick="abrirModalEditarDonante(${d.id_donante})">
                        <i class="bi bi-pencil-fill"></i>
                    </button>

                    <button class="btn btn-sm btn-danger" onclick="eliminarDonante(${d.id_donante})">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            `;
            tablaDonantes.appendChild(row);
        });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudieron cargar los donantes', 'error');
    }
}

// =============================
// REGISTRAR O ACTUALIZAR DONANTE
// =============================
formDonante.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreDonante').value.trim();
    const tipo_id = selectTipoDonante.value;
    const tipo_doc_id = selectTipoDocumento.value;
    const numero_documento = document.getElementById('numeroDocumento').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    if (!nombre || !tipo_id) {
        return Swal.fire('Error', 'Por favor complete los campos obligatorios', 'warning');
    }

    const data = { nombre, tipo_id, tipo_doc_id, numero_documento, correo, telefono, direccion };

    try {
        const url = editandoId ? `${API_DONANTES}/${editandoId}` : `${API_DONANTES}/`;
        const method = editandoId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            Swal.fire({
                icon: 'success',
                title: editandoId ? 'Donante actualizado' : 'Donante registrado',
                timer: 1500,
                showConfirmButton: false
            });
            formDonante.reset();
            editandoId = null;
            await cargarDonantes();
        } else {
            Swal.fire('Error', result.message || 'No se pudo guardar el donante', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo guardar el donante', 'error');
    }
});

// =============================
// EDITAR DONANTE
// =============================
async function editarDonante(id) {
    try {
        const res = await fetch(`${API_DONANTES}/${id}`);
        if (!res.ok) throw new Error('No se pudo obtener el donante');

        const d = await res.json();

        document.getElementById('nombreDonante').value = d.nombre || '';
        selectTipoDocumento.value = d.tipo_doc_id || '';
        document.getElementById('numeroDocumento').value = d.numero_documento || '';
        selectTipoDonante.value = d.tipo_id || '';
        document.getElementById('telefono').value = d.telefono || '';
        document.getElementById('correo').value = d.correo || '';
        document.getElementById('direccion').value = d.direccion || '';

        editandoId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el donante para editar', 'error');
    }
}

// =============================
// ELIMINAR DONANTE
// =============================
async function eliminarDonante(id) {
    Swal.fire({
        title: '¿Eliminar donante?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_DONANTES}/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire('Eliminado', 'El donante ha sido eliminado.', 'success');
                    await cargarDonantes();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el donante', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo eliminar el donante', 'error');
            }
        }
    });
}


// Abrir modal y llenar campos
async function abrirModalEditarDonante(id) {
    try {
        const res = await fetch(`${API_DONANTES}/${id}`);
        const d = await res.json();

        document.getElementById('editandoIdModal').value = d.id_donante;
        document.getElementById('nombreDonanteModal').value = d.nombre || '';
        document.getElementById('numeroDocumentoModal').value = d.numero_documento || '';
        document.getElementById('telefonoModal').value = d.telefono || '';
        document.getElementById('correoModal').value = d.correo || '';
        document.getElementById('direccionModal').value = d.direccion || '';

        // Cargar tipos de documento
        const tiposDocRes = await fetch(`${API_DONANTES}/tipos_documento`);
        const tiposDocumento = await tiposDocRes.json();
        const tipoDocumentoModal = document.getElementById('tipoDocumentoModal');
        tipoDocumentoModal.innerHTML = '<option value="">Seleccione un tipo de documento...</option>';
        tiposDocumento.forEach(td => {
            const option = document.createElement('option');
            option.value = td.id_tipo_doc;
            option.textContent = td.nombre;
            tipoDocumentoModal.appendChild(option);
        });
        tipoDocumentoModal.value = d.tipo_doc_id || '';

        // Cargar tipos de donante
        const tiposRes = await fetch(`${API_DONANTES}/tipos`);
        const tipos = await tiposRes.json();
        const tipoDonanteModal = document.getElementById('tipoDonanteModal');
        tipoDonanteModal.innerHTML = '<option value="">Seleccione un tipo de donante...</option>';
        tipos.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id_tipo;
            option.textContent = t.nombre;
            tipoDonanteModal.appendChild(option);
        });
        tipoDonanteModal.value = d.tipo_id || '';

        const modal = new bootstrap.Modal(document.getElementById('modalActualizarDonante'));
        modal.show();
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo cargar el donante', 'error');
    }
}

// Enviar actualización desde modal
document.getElementById('formActualizarDonante').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editandoIdModal').value;
    const data = {
        nombre: document.getElementById('nombreDonanteModal').value.trim(),
        tipo_doc_id: document.getElementById('tipoDocumentoModal').value,
        numero_documento: document.getElementById('numeroDocumentoModal').value.trim(),
        tipo_id: document.getElementById('tipoDonanteModal').value,
        telefono: document.getElementById('telefonoModal').value.trim(),
        correo: document.getElementById('correoModal').value.trim(),
        direccion: document.getElementById('direccionModal').value.trim()
    };

    try {
        const res = await fetch(`${API_DONANTES}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Donante actualizado', timer: 1500, showConfirmButton: false });
            bootstrap.Modal.getInstance(document.getElementById('modalActualizarDonante')).hide();
            await cargarDonantes();
        } else {
            Swal.fire('Error', result.message || 'No se pudo actualizar', 'error');
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo actualizar el donante', 'error');
    }
});

// =============================
// INICIO AUTOMÁTICO
// =============================
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTiposDonante();
    await cargarTiposDocumento();
    await cargarDonantes();
});
