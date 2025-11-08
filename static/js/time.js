const TIEMPO_INACTIVIDAD = 5 * 60 * 1000; // 1 minuto
const TIEMPO_RESPUESTA = 4 * 60 * 1000;   // 1 segundo para responder el modal

let temporizadorInactividad;
let temporizadorRespuesta;

mostrarModalInactividad;

// Función que muestra el modal de aviso
function mostrarModalInactividad() {
  Swal.fire({
    title: "¿Sigues ahí?",
    text: "Tu sesión se cerrará automáticamente si no respondes en 30 segundos.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, sigo activo",
    cancelButtonText: "No, cerrar sesión",
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: TIEMPO_RESPUESTA,
    timerProgressBar: true
  }).then((result) => {
    if (result.isConfirmed) {
      reiniciarTemporizador(); // Usuario activo
    } else {
      cerrarSesion(); // Usuario no activo o no respondió
    }
  });

  // Si el usuario no responde en TIEMPO_RESPUESTA, cerrar sesión automáticamente
  temporizadorRespuesta = setTimeout(cerrarSesion, TIEMPO_RESPUESTA);
}

// Función que cierra sesión y redirige al login
function cerrarSesion() {
  clearTimeout(temporizadorInactividad);
  clearTimeout(temporizadorRespuesta);
  // Aquí puedes llamar a tu ruta logout de Flask si quieres limpiar sesión real
  fetch('/logout')
    .finally(() => {
      console.log('Sesión cerrada por inactividad.');
      window.location.href = '/index'; // Redirige al login
    });
}

// Reinicia el temporizador de inactividad
function reiniciarTemporizador() {
  clearTimeout(temporizadorInactividad);
  clearTimeout(temporizadorRespuesta);
  temporizadorInactividad = setTimeout(mostrarModalInactividad, TIEMPO_INACTIVIDAD);
}

// Detectar actividad del usuario
['mousemove', 'keydown', 'click'].forEach(evento => {
  document.addEventListener(evento, reiniciarTemporizador);
});

// Iniciar temporizador al cargar la página
window.onload = reiniciarTemporizador;

// 🔁 Reiniciar sesión si hay actividad
function reiniciarSesion() {
  limpiarTemporizadores();
  iniciarControlSesion();
}
