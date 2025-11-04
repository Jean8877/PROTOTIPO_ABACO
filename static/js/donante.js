// =============================
// CONFIGURACIÓN BASE
// =============================
const API_DONANTES = 'http://localhost:5000/api/donantes';
const API_TIPOS = 'http://localhost:5000/api/tipo_donante';

const formDonante = document.getElementById('formDonante');
const tablaDonantes = document.getElementById('tablaDonantes').querySelector('tbody');
const selectTipoDonante = document.getElementById('tipoDonante');
let editandoId = null;

// =============================
// CARGAR TIPOS DE DONANTE
// =============================
async function cargarTiposDonante() {
    try {
        const res = await fetch(API_TIPOS); // ✅ Aquí usamos la constante correcta
        const tipos = await res.json();

        selectTipoDonante.innerHTML = '<option value="">Seleccione un tipo...</option>';
        tipos.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo;
            option.textContent = tipo.nombre;
            selectTipoDonante.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar tipos de donante:', error);
    }
}

// =============================
// CARGAR LISTA DE DONANTES
// =============================
async function cargarDonantes() {
    try {
        const res = await fetch(`${API_DONANTES}/`);
        const donantes = await res.json();

        tablaDonantes.innerHTML = '';
        donantes.forEach(d => {
            const row = document.createElement('tr');
            row.innerHTML = `
    <td>${d.id_donante}</td>
    <td>${d.nombre}</td>
    <td>${d.tipo_documento || 'Sin tipo'}</td>
    <td>---</td>
    <td>${d.tipo_nombre || 'Sin tipo'}</td>
    <td>${d.telefono}</td>
    <td>${d.correo}</td>
    <td>${d.direccion}</td>
    <td>
        <button class="btn btn-sm btn-primary me-2" onclick="editarDonante(${d.id_donante})">
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
        console.error('Error al cargar donantes:', error);
    }
}

// =============================
// REGISTRAR O ACTUALIZAR DONANTE
// =============================
formDonante.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById('nombreDonante').value.trim(),
        tipo_id: document.getElementById('tipoDonante').value, // 👈 este nombre es clave
        correo: document.getElementById('correo').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        direccion: document.getElementById('direccion').value.trim()
    };

    try {
        const url = editandoId ? `${API_DONANTES}/${editandoId}` : `${API_DONANTES}/`;
        const method = editandoId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

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
            const err = await res.json();
            Swal.fire('Error', err.message || 'No se pudo guardar el donante', 'error');
        }
    } catch (error) {
        console.error('Error al guardar donante:', error);
    }
});


// =============================
// EDITAR DONANTE
// =============================
async function editarDonante(id) {
    try {
        const res = await fetch(`${API_DONANTES}/${id}`);
        const d = await res.json();

        document.getElementById('nombreDonante').value = d.nombre;
        document.getElementById('tipoDocumento').value = d.tipo_documento;
        document.getElementById('numeroDocumento').value = d.numero_documento;
        document.getElementById('tipoDonante').value = d.tipo_donante;
        document.getElementById('telefono').value = d.telefono;
        document.getElementById('correo').value = d.correo;
        document.getElementById('direccion').value = d.direccion;

        editandoId = id;
    } catch (error) {
        console.error('Error al editar donante:', error);
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
                    Swal.fire('Error', 'No se pudo eliminar el donante.', 'error');
                }
            } catch (error) {
                console.error('Error al eliminar donante:', error);
            }
        }
    });
}

// =============================
// INICIO AUTOMÁTICO
// =============================
document.addEventListener('DOMContentLoaded', async () => {
    await cargarTiposDonante();
    await cargarDonantes();
});
