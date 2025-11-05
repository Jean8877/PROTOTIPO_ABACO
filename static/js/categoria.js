// ==============================
// CONFIGURACIÓN INICIAL
// ==============================
let editandoCategoria = null;

const formCategoria = document.getElementById('formCategoria');
const tablaCategorias = document.getElementById('tablaCategorias').querySelector('tbody');
const API_CATEGORIAS = '/api/categorias';

// ==============================
// CARGAR TODAS LAS CATEGORÍAS
// ==============================
async function cargarCategorias() {
    try {
        const res = await fetch(API_CATEGORIAS);
        const categorias = await res.json();
        console.log(categorias);

        tablaCategorias.innerHTML = ''; // Limpiar tabla
        categorias.forEach(cat => {
            agregarFilaCategoria(cat);
        });
    } catch (error) {
        console.error('Error cargando categorías:', error);
        swal("Error", "No se pudieron cargar las categorías", "error");
    }
}

// ==============================
// AGREGAR FILA A LA TABLA
// ==============================
function agregarFilaCategoria(cat) {
    const row = document.createElement('tr');
    row.innerHTML = `
        
        <td class="col-id">${cat[0]}</td>
        <td class="col-nombre">${cat[1]}</td>
        <td class="col-descripcion">${cat[2] || ''}</td>
        <td>
            <button class="btn btn-sm btn-primary me-2" onclick="editarCategoria(this)">
                <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCategoria(this)">
                <i class="bi bi-trash-fill"></i>
            </button>
        </td>
    `;
    tablaCategorias.appendChild(row);
}

// ==============================
// CREAR NUEVA CATEGORÍA
// ==============================
formCategoria.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreCategoria').value.trim();
    const descripcion = document.getElementById('descripcionCategoria').value.trim();

    if (!nombre) {
        swal("Error", "El nombre es obligatorio", "error");
        return;
    }

    try {
        const res = await fetch(API_CATEGORIAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            agregarFilaCategoria(data.categoria);
            formCategoria.reset();
            swal("Éxito", "Categoría creada correctamente", "success");
        } else {
            swal("Error", data.message || "No se pudo crear la categoría", "error");
        }
    } catch (error) {
        console.error('Error creando categoría:', error);
        swal("Error", "No se pudo crear la categoría", "error");
    }
});

// ==============================
// ELIMINAR CATEGORÍA
// ==============================
async function eliminarCategoria(btn) {
    const row = btn.closest('tr');
    const id = row?.querySelector('.col-id')?.textContent;

    if (!id) {
        console.error("No se pudo obtener el ID de la categoría");
        return;
    }

    const confirm = await swal({
        title: "¿Está seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });

    if (!confirm) return;

    try {
        const res = await fetch(`${API_CATEGORIAS}/${id}`, { method: 'DELETE' });
        let data;
        try {
            data = await res.json();
        } catch (err) {
            data = { message: "Error en la respuesta del servidor" };
        }

        if (res.ok) {
            row.remove();
            swal("Eliminado", data.message || "Categoría eliminada", "success");
        } else {
            swal("Error", data.message || "No se pudo eliminar la categoría", "error");
        }
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        swal("Error", "No se pudo eliminar la categoría", "error");
    }
}


// ==============================
// EDITAR CATEGORÍA
// ==============================
function editarCategoria(btn) {
    const row = btn.closest('tr');
    const id = row.querySelector('.col-id').textContent;
    const nombre = row.querySelector('.col-nombre').textContent;
    const descripcion = row.querySelector('.col-descripcion').textContent;

    document.getElementById('idCategoriaModal').value = id;
    document.getElementById('nombreCategoriaModal').value = nombre;
    document.getElementById('descripcionCategoriaModal').value = descripcion;

    editandoCategoria = row;

    const modal = new bootstrap.Modal(document.getElementById('modalActualizarCategoria'));
    modal.show();
}

// ==============================
// ACTUALIZAR CATEGORÍA
// ==============================
document.getElementById('formActualizarCategoria').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('idCategoriaModal').value;
    const nombre = document.getElementById('nombreCategoriaModal').value.trim();
    const descripcion = document.getElementById('descripcionCategoriaModal').value.trim();

    if (!nombre) {
        swal("Error", "El nombre es obligatorio", "error");
        return;
    }

    try {
        const res = await fetch(`${API_CATEGORIAS}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, estado: 'Activo' })
        });

        const data = await res.json();

        if (res.ok && data.success) {
            editandoCategoria.querySelector('.col-nombre').textContent = data.categoria [1];
            editandoCategoria.querySelector('.col-descripcion').textContent = data.categoria [2] || '';

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalActualizarCategoria'));
            modal.hide();

            swal("Actualizado", "Categoría actualizada correctamente", "success");
            editandoCategoria = null;
        } else {
            swal("Error", data.message || "No se pudo actualizar la categoría", "error");
        }
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        swal("Error", "No se pudo actualizar la categoría", "error");
    }
});

// ==============================
// INICIALIZACIÓN
// ==============================
document.addEventListener('DOMContentLoaded', cargarCategorias);
