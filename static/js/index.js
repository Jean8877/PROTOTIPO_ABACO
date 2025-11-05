// ============================
// LOGIN
// ============================
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido ' + username,
        text: 'Inicio de sesión exitoso',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '/pagina_principal';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: data.message || 'Correo o contraseña incorrectos'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.'
    });
  }
});

// ============================
// CONTROL AUTOMÁTICO DE SESIÓN
// ============================

// Duración igual a Flask → 5 minutos
const DURACION_SESION = 5 * 60 * 1000; // 5 minutos
const AVISO_EXPIRACION = 4 * 60 * 1000; // Aviso al minuto 4

let temporizadorAviso;
let temporizadorCierre;

// 🕒 Iniciar control de sesión
function iniciarControlSesion() {
  limpiarTemporizadores();

  // Mostrar advertencia antes de expirar
  temporizadorAviso = setTimeout(() => {
    Swal.fire({
      title: "Sesión a punto de expirar",
      text: "Tu sesión se cerrará automáticamente en 1 minuto si no realizas ninguna acción.",
      icon: "warning",
      timer: 4000,
      showConfirmButton: false
    });
  }, AVISO_EXPIRACION);

  // Cerrar sesión automáticamente
  temporizadorCierre = setTimeout(() => {
    cerrarSesionAutomatica();
  }, DURACION_SESION);
}

// 🔄 Limpiar temporizadores (para reiniciar)
function limpiarTemporizadores() {
  clearTimeout(temporizadorAviso);
  clearTimeout(temporizadorCierre);
}

// 🚪 Cerrar sesión y redirigir al index
function cerrarSesionAutomatica() {
  fetch('/logout')
    .then(() => {
      Swal.fire({
        title: "Sesión finalizada",
        text: "Tu sesión ha expirado por inactividad.",
        icon: "info",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '/';
      });
    })
    .catch(() => {
      window.location.href = '/';
    });
}

// 🎯 Detectar actividad del usuario
['mousemove', 'keydown', 'click'].forEach(evento => {
  document.addEventListener(evento, reiniciarSesion);
});

// 🔁 Reiniciar sesión si hay actividad
function reiniciarSesion() {
  limpiarTemporizadores();
  iniciarControlSesion();
}

// Iniciar control cuando cargue la página
window.onload = iniciarControlSesion;
