
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

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
});

