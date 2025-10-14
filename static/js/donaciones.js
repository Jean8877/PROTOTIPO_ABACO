document.getElementById("formProducto").addEventListener("submit", function(e) {
    e.preventDefault();

    // Campos del formulario
    const id_donante = document.getElementById("buscarDonante").value || 1; // Temporal mientras haces buscador
    const fecha = document.getElementById("vencimiento").value;
    const usuario = 1; // Cambia cuando tengas login
    const observaciones = document.getElementById("descripcion").value;

    const productos = [{
        id_producto: 1, // Cambiar cuando hagas la búsqueda de productos
        cantidad: document.getElementById("cantidad").value
    }];

    // Enviar datos al backend
    fetch("http://127.0.0.1:5000/donacion/producto", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_donante,
            fecha,
            usuario,
            observaciones,
            productos
        })
    })
    .then(response => response.json())
    .then(data => {
        swal("Éxito!", "Donación registrada con ID: " + data.id_donacion, "success");
        document.getElementById("formProducto").reset();
    })
    .catch(error => {
        console.error("Error:", error);
        swal("Error", "No se pudo registrar la donación", "error");
    });
});
