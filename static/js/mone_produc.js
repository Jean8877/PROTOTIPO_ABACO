
            // Toggle de formularios
            const btnProducto = document.getElementById('btnProducto');
            const btnMonetaria = document.getElementById('btnMonetaria');
            const formProducto = document.getElementById('formProducto');
            const formMonetaria = document.getElementById('formMonetaria');

            btnProducto.addEventListener('click', () => {
                btnProducto.classList.add('btn-success', 'active');
                btnProducto.classList.remove('btn-outline-success');
                btnMonetaria.classList.remove('btn-success', 'active');
                btnMonetaria.classList.add('btn-outline-success');
                formProducto.classList.remove('d-none');
                formMonetaria.classList.add('d-none');
            });

            btnMonetaria.addEventListener('click', () => {
                btnMonetaria.classList.add('btn-success', 'active');
                btnMonetaria.classList.remove('btn-outline-success');
                btnProducto.classList.remove('btn-success', 'active');
                btnProducto.classList.add('btn-outline-success');
                formMonetaria.classList.remove('d-none');
                formProducto.classList.add('d-none');
            });

            formProducto.addEventListener('submit', function (e) {
                e.preventDefault();
                //validacion
                const nombre = document.getElementById('nombre').value.trim();
                if (!nombre) {
                    swal("Error", "Por favor, completa todos los campos.", "error");
                    return;
                }
                //guardar producto
                //swal("Éxito", "Producto guardado correctamente.", "success");
                swal({
                    title: "Éxito",
                    text: "Producto guardado correctamente.",
                    icon: "success",
                    buttons: ["OK", "Ver Donación"], // Botón izquierdo = false, derecho = true
                }).then((verDonacion) => {
                    if (verDonacion) {
                        // Si el usuario hace clic en "Ver Donación"
                        swal({
                            title: "Redirigiendo a lista de Donaciones...",
                            icon: "info",
                            buttons: false,
                            timer: 2000, // 2 segundos
                        });

                        // Redirige después de 2 segundos
                        setTimeout(() => {
                            window.location.href = "lista_donaciones.html";
                        }, 2000);
                    }
                });


                formProducto.reset();
            });
            formMonetaria.addEventListener('submit', function (e) {
                e.preventDefault();

                const monto = document.getElementById('monto').value.trim();
                const metodo = document.getElementById('metodoPago').value;

                if (!monto || monto <= 0 || !metodo) {
                    swal("Error", "Por favor ingresa un monto válido y selecciona un método de pago.", "error");
                    return;
                }

                swal("Éxito", "Donación monetaria guardada correctamente.", "success");
                formMonetaria.reset();
            });




document.addEventListener("DOMContentLoaded", function() {
    const fechaIngreso = document.getElementById("ingreso");
    const fechaIngresoMonetaria = document.getElementById("ingresoMonetaria"); 
    const fechaVencimiento = document.getElementById("vencimiento");

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split("T")[0];

    // 🔹 Fecha de ingreso: máximo hoy (no puede ser futura)
    if (fechaIngreso) {
        fechaIngreso.setAttribute("max", hoy);
    }

    // 🔹 Monetaria: tampoco se puede registrar con fecha futura
    if (fechaIngresoMonetaria) {
        fechaIngresoMonetaria.setAttribute("max", hoy);
    }

    // 🔹 Fecha de vencimiento: mínimo hoy (no puede ser pasada)
    if (fechaVencimiento) {
        fechaVencimiento.setAttribute("min", hoy);
    }
});
        