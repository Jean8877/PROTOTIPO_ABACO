// ================================
// CONFIGURACIÓN
// ================================
const tablaUnidades = document.querySelector("#tablaUnidades tbody");
const API_UNIDADES = "/api/unidades/";

// ================================
// FUNCIONES
// ================================

// Cargar todas las unidades
async function cargarUnidades() {
    try {
        const res = await fetch(API_UNIDADES);
        const data = await res.json();

        tablaUnidades.innerHTML = "";

        data.forEach(u => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${u[0]}</td>             <!-- id_unidad -->
                <td>${u[1]}</td>             <!-- nombre -->
                <td>${u[2]}</td>             <!-- abreviatura -->
                <td>${u[3]}</td>             <!-- factor_kg -->
                <td>${u[4]}</td>             <!-- estado -->
                <td>
                    ${u[4] === "Activo" 
                      ? `<button class="btn btn-sm btn-warning" onclick="confirmarDesactivar(${u[0]})">Desactivar</button>` 
                      : `<button class="btn btn-sm btn-success" onclick="confirmarActivar(${u[0]})">Activar</button>`}
                </td>
            `;
            tablaUnidades.appendChild(fila);
        });

    } catch (error) {
        console.error("Error al cargar unidades:", error);
        swal("Error", "No se pudieron cargar las unidades", "error");
    }
}

// ================================
// CONFIRMACIONES CON SWAL
// ================================
function confirmarDesactivar(id) {
    swal({
        title: "¿Estás seguro?",
        text: "La unidad se desactivará",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDeactivate) => {
        if (willDeactivate) {
            desactivarUnidad(id);
        }
    });
}

function confirmarActivar(id) {
    swal({
        title: "¿Estás seguro?",
        text: "La unidad se activará",
        icon: "info",
        buttons: true,
    }).then((willActivate) => {
        if (willActivate) {
            activarUnidad(id);
        }
    });
}

// ================================
// ACCIONES
// ================================
async function desactivarUnidad(id) {
    try {
        const res = await fetch(`${API_UNIDADES}desactivar/${id}`, { method: "PUT" });
        const data = await res.json();
        if (data.success) {
            swal("¡Éxito!", data.message, "success");
            cargarUnidades();
        } else {
            swal("Error", data.message, "error");
        }
    } catch (error) {
        console.error("Error al desactivar:", error);
        swal("Error", "No se pudo desactivar la unidad", "error");
    }
}

async function activarUnidad(id) {
    try {
        const res = await fetch(`${API_UNIDADES}activar/${id}`, { method: "PUT" });
        const data = await res.json();
        if (data.success) {
            swal("¡Éxito!", data.message, "success");
            cargarUnidades();
        } else {
            swal("Error", data.message, "error");
        }
    } catch (error) {
        console.error("Error al activar:", error);
        swal("Error", "No se pudo activar la unidad", "error");
    }
}

// ================================
// EJECUTAR AL INICIO
// ================================
document.addEventListener("DOMContentLoaded", () => {
    cargarUnidades();
});
