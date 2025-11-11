// gastos.js

const formGasto = document.getElementById("formGasto");
const tablaGastos = document.querySelector("#tablaGastos tbody");

const formActualizarGasto = document.getElementById("formActualizarGasto");
const modalActualizarGasto = new bootstrap.Modal(document.getElementById("modalActualizarGasto"));

let tiposGasto = [];

// ==============================
// CARGAR DATOS AL INICIAR
// ==============================
document.addEventListener("DOMContentLoaded", () => {
    cargarTiposGasto();
    listarGastos();
});

// ==============================
// CARGAR TIPOS DE GASTO
// ==============================
// Llenar selects con tipos de gasto
async function cargarTiposGasto() {
    try {
        const res = await fetch("/api/tipos_gasto");
        const tipos = await res.json();

        const selectNuevo = document.getElementById("id_tipo_gasto");
        const selectModal = document.getElementById("id_tipo_gasto_modal");

        // Limpiar selects
        selectNuevo.innerHTML = '<option value="">Seleccione tipo de gasto</option>';
        selectModal.innerHTML = '<option value="">Seleccione tipo de gasto</option>';

        tipos.forEach(t => {
            const option1 = document.createElement("option");
            option1.value = t.id_tipo_gasto;
            option1.textContent = t.nombre;
            selectNuevo.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = t.id_tipo_gasto;
            option2.textContent = t.nombre;
            selectModal.appendChild(option2);
        });

    } catch (error) {
        console.error("Error cargando tipos de gasto:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarTiposGasto();
});

// ==============================
// LISTAR GASTOS
// ==============================
async function listarGastos() {
    try {
        const res = await fetch("/api/gastos");
        const gastos = await res.json();

        tablaGastos.innerHTML = "";

        gastos.forEach(g => {
            tablaGastos.innerHTML += `
                <tr>
                    <td>${g.id_gasto}</td>
                    <td>${g.tipo_nombre || ""}</td>
                    <td>${g.descripcion}</td>
                    <td>${g.monto}</td>
                    <td>${g.fecha}</td>
                    <td>
                        <button class="btn btn-sm btn-success me-2" onclick="abrirModalActualizarGasto(${g.id_gasto})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarGasto(${g.id_gasto})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error listando gastos:", error);
    }
}

// ==============================
// CREAR GASTO
// ==============================
formGasto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        id_tipo_gasto: document.getElementById("id_tipo_gasto").value,
        descripcion: document.getElementById("descripcion").value.trim(),
        monto: document.getElementById("monto").value,
        fecha: document.getElementById("fecha").value
    };

    try {
        const res = await fetch("/api/gastos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            return swal("Error", result.message || "No se pudo registrar el gasto", "error");
        }

        swal("Gasto registrado", "", "success");
        formGasto.reset();
        listarGastos();

    } catch (error) {
        console.error("Error creando gasto:", error);
        swal("Error", "Error creando gasto", "error");
    }
});

// ==============================
// ABRIR MODAL ACTUALIZAR
// ==============================
async function abrirModalActualizarGasto(id_gasto) {
    try {
        const res = await fetch(`/api/gastos/${id_gasto}`);
        const gasto = await res.json();

        if (!res.ok) {
            return swal("Error", gasto.message || "No se encontró el gasto", "error");
        }

        document.getElementById("id_gasto_modal").value = gasto.id_gasto;
        document.getElementById("id_tipo_gasto_modal").value = gasto.id_tipo_gasto;
        document.getElementById("descripcion_modal").value = gasto.descripcion;
        document.getElementById("monto_modal").value = gasto.monto;
        document.getElementById("fecha_modal").value = gasto.fecha;

        modalActualizarGasto.show();

    } catch (error) {
        console.error("Error abriendo modal:", error);
    }
}

// ==============================
// ACTUALIZAR GASTO
// ==============================
formActualizarGasto.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id_gasto = document.getElementById("id_gasto_modal").value;
    const data = {
        id_tipo_gasto: document.getElementById("id_tipo_gasto_modal").value,
        descripcion: document.getElementById("descripcion_modal").value.trim(),
        monto: document.getElementById("monto_modal").value,
        fecha: document.getElementById("fecha_modal").value
    };

    try {
        const res = await fetch(`/api/gastos/${id_gasto}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (!res.ok) {
            return swal("Error", result.message || "No se pudo actualizar el gasto", "error");
        }

        swal("Actualizado correctamente", "", "success");
        modalActualizarGasto.hide();
        listarGastos();

    } catch (error) {
        console.error("Error actualizando gasto:", error);
        swal("Error", "Error actualizando gasto", "error");
    }
});

// ==============================
// ELIMINAR GASTO
// ==============================
async function eliminarGasto(id_gasto) {
    const confirmacion = await swal({
        title: "¿Eliminar?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        buttons: ["Cancelar", "Eliminar"],
        dangerMode: true
    });

    if (!confirmacion) return;

    try {
        const res = await fetch(`/api/gastos/${id_gasto}`, { method: "DELETE" });
        const result = await res.json();

        if (!res.ok) {
            return swal("Error", result.message || "No se pudo eliminar el gasto", "error");
        }

        swal("Eliminado", "", "success");
        listarGastos();

    } catch (error) {
        console.error("Error eliminando gasto:", error);
        swal("Error", "Error eliminando gasto", "error");
    }
}
