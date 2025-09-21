const BASE_URL = 'http://127.0.0.1:5000/';

// = FUNCIONES GENERALES =
function visualizarTipoUsuario(data) {
    let tabla = "";

    data.tipo_usuario.forEach(item => {
        tabla += `
            <tr data-id="${item.id_tipo_usuario}">
                <td>${item.id_tipo_usuario}</td>
                <td>${item.descripcion}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_tipo_usuario.html?id=${item.id_tipo_usuario}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarTipoUsuario(${item.id_tipo_usuario})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-tipo-usuario').innerHTML = tabla;
}

function consultarTipoUsuario(){
    fetch(`${BASE_URL}/tipo_usuario`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarTipoUsuario(data))
    .catch(error => console.error('Error:', error));
}

function eliminarTipoUsuario(id){
    fetch(`${BASE_URL}/eliminar_tipo_usuario/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoUsuario(); // Recargar la tabla
    })
    .catch(error => console.error('Error:', error));
}

function registrarTipoUsuario(descripcion) {
    fetch(`${BASE_URL}/registro_tipo_usuario`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descripcion: descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoUsuario(); // Recargar la tabla
    })
    .catch(error => console.error('Error:', error));
}

// ========== TIPO DOCUMENTO ==========

function visualizarTipoDocumento(data) {
    let tabla = "";

    data.tipo_documento.forEach(item => {
        tabla += `
            <tr data-id="${item.id_tipo_documento}">
                <td>${item.id_tipo_documento}</td>
                <td>${item.nombre}</td>
                <td>${item.abreviatura}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_tipo_documento.html?id=${item.id_tipo_documento}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarTipoDocumento(${item.id_tipo_documento})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-tipo-documento').innerHTML = tabla;
}

function consultarTipoDocumento(){
    fetch(`${BASE_URL}/tipo_documento`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarTipoDocumento(data))
    .catch(error => console.error('Error:', error));
}

function eliminarTipoDocumento(id){
    fetch(`${BASE_URL}/eliminar_tipo_documento/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoDocumento();
    })
    .catch(error => console.error('Error:', error));
}

function registrarTipoDocumento(nombre, abreviatura) {
    fetch(`${BASE_URL}/registro_tipo_documento`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre, abreviatura: abreviatura })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoDocumento();
    })
    .catch(error => console.error('Error:', error));
}

// ========== TIPO GASTO ==========

function visualizarTipoGasto(data) {
    let tabla = "";

    data.tipo_gasto.forEach(item => {
        tabla += `
            <tr data-id="${item.id_tipo_gasto}">
                <td>${item.id_tipo_gasto}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_tipo_gasto.html?id=${item.id_tipo_gasto}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarTipoGasto(${item.id_tipo_gasto})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-tipo-gasto').innerHTML = tabla;
}

function consultarTipoGasto(){
    fetch(`${BASE_URL}/tipo_gasto`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarTipoGasto(data))
    .catch(error => console.error('Error:', error));
}

function eliminarTipoGasto(id){
    fetch(`${BASE_URL}/eliminar_tipo_gasto/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoGasto();
    })
    .catch(error => console.error('Error:', error));
}

function registrarTipoGasto(nombre, descripcion) {
    fetch(`${BASE_URL}/registro_tipo_gasto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre, descripcion: descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoGasto();
    })
    .catch(error => console.error('Error:', error));
}

// ========== ESTADO ==========

function visualizarEstado(data) {
    let tabla = "";

    data.estado.forEach(item => {
        tabla += `
            <tr data-id="${item.id_estado}">
                <td>${item.id_estado}</td>
                <td>${item.nombre}</td>
                <td>${item.descripcion}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_estado.html?id=${item.id_estado}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V极h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarEstado(${item.id_estado})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4极4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2极8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-estado').innerHTML = tabla;
}

function consultarEstado(){
    fetch(`${BASE_URL}/estado`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarEstado(data))
    .catch(error => console.error('Error:', error));
}

function eliminarEstado(id){
    fetch(`${BASE_URL}/eliminar_estado/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarEstado();
    })
    .catch(error => console.error('Error:', error));
}

function registrarEstado(nombre, descripcion) {
    fetch(`${BASE_URL}/registro_estado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre: nombre, descripcion: descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarEstado();
    })
    .catch(error => console.error('Error:', error));
}

// ========== GASTO ==========

function visualizarGasto(data) {
    let tabla = "";

    data.gasto.forEach(item => {
        tabla += `
            <tr data-id="${item.id_gasto}">
                <td>${item.id_gasto}</td>
                <td>${item.fecha}</td>
                <td>${item.monto}</td>
                <td>${item.descripcion}</td>
                <td>${item.tipo_gasto}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_gasto.html?id=${item.id_gasto}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16极3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarGasto(${item.id_gasto})">
                        <svg xmlns="http://www.w3.org/极000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-gasto').innerHTML = tabla;
}

function consultarGasto(){
    fetch(`${BASE_URL}/gasto`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarGasto(data))
    .catch(error => console.error('极ror:', error));
}

function eliminarGasto(id){
    fetch(`${BASE_URL}/eliminar_gasto/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarGasto();
    })
    .catch(error => console.error('Error:', error));
}

function registrarGasto(fecha, monto, descripcion, tipo_gasto) {
    fetch(`${BASE_URL}/registro_gasto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fecha: fecha, monto: monto, descripcion: descripcion, tipo_gasto: tipo_gasto })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarGasto();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarGasto(id, fecha, monto, descripcion, tipo_gasto) {
    fetch(`${BASE_URL}/actualizar_gasto/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fecha: fecha, monto: monto, descripcion: descripcion, tipo_gasto: tipo_gasto })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarGasto();
    })
    .catch(error => console.error('Error:', error));
}

// ========== USUARIO ==========

function visualizarUsuario(data) {
    let tabla = "";

    data.usuario.forEach(item => {
        tabla += `
            <tr data-id="${item.id_usuario}">
                <td>${item.id_usuario}</td>
                <td>${item.nombre_completo}</td>
                <td>${item.numero_documento}</td>
                <td>${item.gmail}</td>
                <td>${item.tipo_usuario}</td>
                <td>${item.tipo_documento}</td>
                <td>${item.estado}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_usuario.html?id=${item.id_usuario}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3极3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 极 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarUsuario(${item.id_usuario})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13极10zM9 17h2V8H9zm4 0h2V8h-2zM极 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-usuario').innerHTML = tabla;
}

function consultarUsuario(){
    fetch(`${BASE_URL}/usuarios`)
    .then(response => {
        if (!极esponse.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarUsuario(data))
    .catch(error => console.error('Error:', error));
}

function eliminarUsuario(id){
    fetch(`${BASE_URL}/eliminar_usuarios/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarUsuario();
    })
    .catch(error => console.error('Error:', error));
}

function registrarUsuario(nombre_completo, numero_documento, gmail, contrasena, tipo_usuario, tipo_documento, estado) {
    fetch(`${BASE_URL}/registro_usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre_completo: nombre_completo, 
            numero_documento: numero_documento, 
            gmail: gmail, 
            contrasena: contrasena, 
            tipo_usuario: tipo_usuario, 
            tipo_documento: tipo_documento, 
            estado: estado 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarUsuario();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarUsuario(id, nombre_completo, numero_documento, gmail, contrasena, tipo_usuario, tipo_documento, estado) {
    fetch(`${BASE_URL}/actualizar_usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre_completo: nombre_completo, 
            numero_documento: numero_documento, 
            gmail: gmail, 
            contrasena: contrasena, 
            tipo_usuario: tipo_usuario, 
            tipo_documento: tipo_documento, 
            estado: estado 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarUsuario();
    })
    .catch(error => console.error('Error:', error));
}

// ========== TIPO DONANTE ==========

function visualizarTipoDonante(data) {
    let tabla = "";

    data.tipo_donante.forEach(item => {
        tabla += `
            <tr data-id="${item.ID}">
                <td>${item.ID}</td>
                <td>${item.descripcion}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_tipo_donante.html?id=${item.ID}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 极 2 2h14a2 2 0 0 0 2-2极-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarTipoDonante(${item.ID})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24"极 height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-tipo-donante').innerHTML = tabla;
}

function consultarTipoDonante(){
    fetch(`${BASE_URL}/tipo_donante`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarTipoDonante(data))
    .catch(error => console.error('Error:', error));
}

function eliminarTipoDonante(id){
    fetch(`${BASE_URL}/eliminar_tipo_donante/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultar极ipoDonante();
    })
    .catch(error => console.error('Error:', error));
}

function registrarTipoDonante(descripcion) {
    fetch(`${BASE_URL}/registro_tipo_donante`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descripcion: descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoDonante();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarTipoDonante(id, descripcion) {
    fetch(`${BASE_URL}/actualizar_tipo_donante/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descripcion: descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarTipoDonante();
    })
    .catch(error => console.error('Error:', error));
}

// ========== DONANTE ==========

function visualizarDonante(data) {
    let tabla = "";

    data.donante.forEach(item => {
        tabla += `
            <tr data-id="${item.id_donante}">
                <td>${item.id_donante}</td>
                <td>${item.nombre}</td>
                <td>${item.telefono}</td>
                <td>${item.gmail}</td>
                <td>${item.direccion}</td>
                <td>${item.estado}</td>
                <td>${item.tipo_documento}</td>
                <td>${item.tipo_donante}</td>
                <td>
                    <button type='button' class='btn btn-info'
                        onclick="location.href='editar_donante.html?id=${item.id_donante}'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"/><path fill="currentColor" d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5极-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2极14a2 2 0 0 0 2-2v-8.668l-2 2z"/></svg>
                    </button>
                </td>
                <td>
                    <button type='button' class='btn btn-warning'
                        onclick="eliminarDonante(${item.id_donante})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                    </button>
                </td>
            </tr>`;
    });
    
    document.getElementById('tabla-donante').innerHTML = tabla;
}

function consultarDonante(){
    fetch(`${BASE_URL}/donante`)
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => visualizarDonante(data))
    .catch(error => console.error('Error:', error));
}

function eliminarDonante(id){
    fetch(`${BASE_URL}/eliminar_donante/${id}`, { 
        method: 'DELETE' 
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarDonante();
    })
    .catch(error => console.error('Error:', error));
}

function registrarDonante(nombre, telefono, gmail, direccion, estado, tipo_documento, tipo_donante) {
    fetch(`${BASE_URL}/registro_donante`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre: nombre, 
            telefono: telefono, 
            gmail: gmail, 
            direccion: direccion, 
            estado: estado, 
            tipo_documento: tipo_documento, 
            tipo_donante: tipo_donante 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarDonante();
    })
    .catch(error => console.error('Error:', error));
}

function actualizarDonante(id, nombre, telefono, gmail, direccion, estado, tipo_documento, tipo_donante) {
    fetch(`${BASE_URL}/actualizar_donante/${id}`, {
        method: 'PUT',
        headers: {
极          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            nombre: nombre, 
            telefono: telefono, 
            gmail: gmail, 
            direccion: direccion, 
            estado: estado, 
            tipo_documento: tipo_documento, 
            tipo_donante: tipo_donante 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        consultarDonante();
    })
    .catch(error => console.error('Error:', error));
}

                // ========== METODO AGREGAR  ==========


//=====DONANTE ======

function agregarDonante(nombre, numero_documento, telefono, gmail, direccion, tipo_documento, tipo_donante, estado = 1) {
    fetch('http://127.0.0.1:5000/donantes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            numero_documento: numero_documento,
            telefono: telefono,
            gmail: gmail,
            direccion: direccion,
            tipo_documento: tipo_documento,
            tipo_donante: tipo_donante,
            estado: estado
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Donante agregado correctamente');
            // Si quieres actualizar la tabla, llama aquí a consultarDonante()
        } else {
            alert('Error al agregar donante: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

// Conecta el formulario con la función agregarDonante
document.getElementById('formDonante').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreDonante').value.trim();
    const tipo_documento = document.getElementById('tipoDocumento').value;
    const numero_documento = document.getElementById('numeroDocumento').value.trim();
    const tipo_donante = document.getElementById('tipoDonante').value;
    const telefono = document.getElementById('telefono').value.trim();
    const gmail = document.getElementById('correo').value.trim();
    const direccion = document.getElementById('direccion').value.trim();

    agregarDonante(nombre, numero_documento, telefono, gmail, direccion, tipo_documento, tipo_donante);
    this.reset();
});

//=====ACTA VENCIMIENTO ======

function agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador) {
    fetch('http://127.0.0.1:5000/actas_vencimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha: fecha,
            hora: hora,
            datos_producto: datos_producto,
            observaciones: observaciones,
            acciones_tomadas: acciones_tomadas,
            firma_conformidad: firma_conformidad,
            firma_coordinador: firma_coordinador
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Acta de vencimiento agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarActas()
        } else {
            alert('Error al agregar acta: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}
document.getElementById('formActa').addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const datos_producto = document.getElementById('datosProducto').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    const acciones_tomadas = document.getElementById('accionesTomadas').value.trim();
    const firma_conformidad = document.getElementById('firmaConformidad').value.trim();
    const firma_coordinador = document.getElementById('firmaCoordinador').value.trim();

    agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador);
    this.reset();
});

//===== CREAR ORGANIZACION ======

function agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador) {
    fetch('http://127.0.0.1:5000/actas_vencimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha: fecha,
            hora: hora,
            datos_producto: datos_producto,
            observaciones: observaciones,
            acciones_tomadas: acciones_tomadas,
            firma_conformidad: firma_conformidad,
            firma_coordinador: firma_coordinador
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Acta de vencimiento agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarActas()
        } else {
            alert('Error al agregar acta: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}
document.getElementById('formActa').addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const datos_producto = document.getElementById('datosProducto').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    const acciones_tomadas = document.getElementById('accionesTomadas').value.trim();
    const firma_conformidad = document.getElementById('firmaConformidad').value.trim();
    const firma_coordinador = document.getElementById('firmaCoordinador').value.trim();

    agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador);
    this.reset();
});

//===== FUNDACIONES ====

function agregarFundacion(id_parroquia, nombre, encargado, telefono, descripcion) {
    fetch('http://127.0.0.1:5000/fundaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_parroquia: id_parroquia,
            nombre: nombre,
            encargado: encargado,
            telefono: telefono,
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Fundación agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarFundaciones()
        } else {
            alert('Error al agregar fundación: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formFundacion').addEventListener('submit', function(e) {
    e.preventDefault();

    const id_parroquia = document.getElementById('idParroquia').value.trim();
    const nombre = document.getElementById('nombreFundacion').value.trim();
    const encargado = document.getElementById('nombreEncargado').value.trim();
    const telefono = document.getElementById('telefonoEncargado').value.trim();
    const descripcion = document.getElementById('descripcionFundacion').value.trim();

    agregarFundacion(id_parroquia, nombre, encargado, telefono, descripcion);
    this.reset();
});

//==== TIPO DE DONANTE ====

function agregarTipoDonante(descripcion) {
    fetch('http://127.0.0.1:5000/tipo-donante', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tipo de donante agregado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarTipoDonante()
        } else {
            alert('Error al agregar tipo de donante: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}
document.getElementById('formTipoDonante').addEventListener('submit', function(e) {
    e.preventDefault();

    const descripcion = document.getElementById('descripcionTipo').value.trim();

    if (!descripcion) {
        alert("Por favor completa la descripción");
        return;
    }

    agregarTipoDonante(descripcion);
    this.reset();
});

//==== TIPO DE GASTO ====

function agregarTipoGasto(nombre, descripcion) {
    fetch('http://127.0.0.1:5000/tipo-gasto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tipo de gasto agregado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarTipoGasto()
        } else {
            alert('Error al agregar tipo de gasto: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formGasto').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreGasto').value.trim();
    const descripcion = document.getElementById('descripcionGasto').value.trim();

    if (!nombre || !descripcion) {
        alert("Por favor completa todos los campos");
        return;
    }

    agregarTipoGasto(nombre, descripcion);
    this.reset();
});

// ==== DONACION PRODUCTO ===

function agregarDonacionProducto(producto, cantidad, fecha, donante, observaciones) {
    fetch('http://127.0.0.1:5000/donaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            producto: producto,
            cantidad: cantidad,
            fecha: fecha,
            donante: donante,
            observaciones: observaciones
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Donación registrada correctamente');
           
        } else {
            alert('Error al registrar donación: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formDonacionProducto').addEventListener('submit', function(e) {
    e.preventDefault();

    const producto = document.getElementById('productoDonado').value.trim();
    const cantidad = document.getElementById('cantidadDonada').value.trim();
    const fecha = document.getElementById('fechaDonacion').value;
    const donante = document.getElementById('donante').value.trim();
    const observaciones = document.getElementById('observacionesDonacion').value.trim();

    agregarDonacionProducto(producto, cantidad, fecha, donante, observaciones);
    this.reset();
});

//===== SUB CATEGORIA =====

function agregarSubcategoria(descripcion, categoria_producto) {
    fetch('http://127.0.0.1:5000/subcategorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            descripcion: descripcion,
            categoria_producto: categoria_producto
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Subcategoría agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarSubcategorias()
        } else {
            alert('Error al agregar subcategoría: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formSubcategoria').addEventListener('submit', function(e) {
    e.preventDefault();

    const categoria_producto = document.getElementById('categoriaSelect').value;
    const descripcion = document.getElementById('nombreSubcategoria').value.trim();

    if (!categoria_producto || !descripcion) {
        alert("Por favor completa todos los campos");
        return;
    }

    agregarSubcategoria(descripcion, categoria_producto);
    this.reset();
});

//==== CATEGORiA ======

function agregarCategoria(descripcion) {
    fetch('http://127.0.0.1:5000/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Categoría agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarCategorias()
        } else {
            alert('Error al agregar categoría: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formCategoria').addEventListener('submit', function(e) {
    e.preventDefault();

    // Solo enviamos la descripción porque es lo que espera el backend
    const descripcion = document.getElementById('descripcionCategoria').value.trim();

    if (!descripcion) {
        alert("Por favor completa la descripción");
        return;
    }

    agregarCategoria(descripcion);
    this.reset();
});

//==== PRODUCTO =====

function agregarProducto(nombre, descripcion, cantidad, precio, categoria_producto, subcategoria_producto, peso_unitario, fecha_vencimiento) {
    fetch('http://127.0.0.1:5000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            cantidad: cantidad,
            precio: precio,
            categoria_producto: categoria_producto,
            subcategoria_producto: subcategoria_producto,
            peso_unitario: peso_unitario,
            fecha_vencimiento: fecha_vencimiento
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto agregado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarProductos()
        } else {
            alert('Error al agregar producto: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formProducto').addEventListener('submit', function(e) {
    e.preventDefault();

    const categoria_producto = document.getElementById('categoriaSelect').value;
    const subcategoria_producto = document.getElementById('subcategoriaSelect').value;
    // Si tienes un select de producto, úsalo, si no, puedes pedir el nombre por input
    const nombre = document.getElementById('productoSelect').value || "Producto sin nombre";
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const cantidad = parseInt(document.getElementById('cantidadProducto').value);
    const peso_unitario = document.getElementById('pesoUnitario').value.trim();
    const fecha_vencimiento = document.getElementById('fechaVencimiento').value;
    const descripcion = document.getElementById('descripcionProducto').value.trim();

    if (!categoria_producto || !subcategoria_producto || !nombre || isNaN(precio) || isNaN(cantidad) || !peso_unitario || !fecha_vencimiento) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    agregarProducto(nombre, descripcion, cantidad, precio, categoria_producto, subcategoria_producto, peso_unitario, fecha_vencimiento);
    this.reset();
    document.getElementById('subcategoriaSelect').disabled = true;
});

//===== MOVIMIENTO DE INVENTARIO ========

function agregarMovimientoInventario(producto, cantidad, tipo_movimiento, fecha, bodega, responsable) {
    fetch('http://127.0.0.1:5000/movimientos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            producto: producto,
            cantidad: cantidad,
            tipo_movimiento: tipo_movimiento,
            fecha: fecha,
            bodega: bodega,
            responsable: responsable
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Movimiento registrado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarMovimientos()
        } else {
            alert('Error al registrar movimiento: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formMovimiento').addEventListener('submit', function(e) {
    e.preventDefault();

    const producto = document.getElementById('producto').value.trim();
    const cantidad = Number(document.getElementById('cantidad').value);
    const tipo_movimiento = document.getElementById('tipoMovimiento').value;
    const fecha = document.getElementById('fechaMovimiento').value;
    const bodega = document.getElementById('bodega').value;
    const responsable = document.getElementById('responsable').value.trim();

    if (!producto || cantidad <= 0 || !tipo_movimiento || !fecha || !bodega || !responsable) {
        alert('Por favor completa todos los campos correctamente.');
        return;
    }

    agregarMovimientoInventario(producto, cantidad, tipo_movimiento, fecha, bodega, responsable);
    this.reset();
    document.getElementById('fechaMovimiento').valueAsDate = new Date();
});


//==== DONACION MONETARIA =====

function agregarDonacionMonetaria(donante, id_transaccion, banco, moneda, monto, medio_pago, fecha) {
    fetch('http://127.0.0.1:5000/donaciones_monetarias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            donante: donante,
            id_transaccion: id_transaccion,
            banco: banco,
            moneda: moneda,
            monto: monto,
            medio_pago: medio_pago,
            fecha: fecha
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Donación monetaria registrada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarDonacionesMonetarias()
        } else {
            alert('Error al registrar donación: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formDonacionMonetaria').addEventListener('submit', function(e) {
    e.preventDefault();

    const donante = document.getElementById('donante').value.trim();
    const id_transaccion = document.getElementById('idTransaccion').value.trim();
    const banco = document.getElementById('banco').value.trim();
    const moneda = document.getElementById('moneda').value;
    const monto = parseFloat(document.getElementById('monto').value);
    const medio_pago = document.getElementById('medioPago').value;
    const fecha = document.getElementById('fechaDonacion').value;

    if (!donante || !id_transaccion || !banco || !moneda || isNaN(monto) || monto <= 0 || !medio_pago || !fecha) {
        alert('Por favor completa todos los campos correctamente.');
        return;
    }

    agregarDonacionMonetaria(donante, id_transaccion, banco, moneda, monto, medio_pago, fecha);
    this.reset();
    document.getElementById('fechaDonacion').valueAsDate = new Date();
});

//=== TIPO DE DONANTE =====

function agregarTipoDonante(descripcion) {
    fetch('http://127.0.0.1:5000/tipo-donante', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            descripcion: descripcion
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Tipo de donante agregado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarTipoDonante()
        } else {
            alert('Error al agregar tipo de donante: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formTipoDonante').addEventListener('submit', function(e) {
    e.preventDefault();

    const descripcion = document.getElementById('descripcionTipo').value.trim();

    if (!descripcion) {
        alert("Por favor completa la descripción");
        return;
    }

    agregarTipoDonante(descripcion);
    this.reset();
});

//======= GESTION PARROQUIA =======//  // ==== NO BACKEND ====/

function agregarParroquia(nombre, tipo_organizacion, nombre_padre, tipo_documento, numero_documento, telefono, direccion, correo, departamento, municipio) {
    fetch('http://127.0.0.1:5000/parroquias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre: nombre,
            tipo_organizacion: tipo_organizacion,
            nombre_padre: nombre_padre,
            tipo_documento: tipo_documento,
            numero_documento: numero_documento,
            telefono: telefono,
            direccion: direccion,
            correo: correo,
            departamento: departamento,
            municipio: municipio
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Parroquia agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarParroquias()
        } else {
            alert('Error al agregar parroquia: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formParroquia').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreParroquia').value.trim();
    const tipo_organizacion = document.getElementById('tipo_organizacion').value;
    const nombre_padre = document.getElementById('nombrePadre').value.trim();
    const tipo_documento = document.getElementById('tipoDocumento').value;
    const numero_documento = document.getElementById('numeroDocumento').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const departamento = document.getElementById('departamentos').options[document.getElementById('departamentos').selectedIndex].text;
    const municipio = document.getElementById('municipios').options[document.getElementById('municipios').selectedIndex].text;

    agregarParroquia(nombre, tipo_organizacion, nombre_padre, tipo_documento, numero_documento, telefono, direccion, correo, departamento, municipio);
    this.reset();
});

//======   MOVIMIENTO DE INVENTARIO  ======//

function agregarMovimientoInventario(producto, cantidad, tipo_movimiento, fecha, bodega, responsable) {
    fetch('http://127.0.0.1:5000/movimientos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            producto: producto,
            cantidad: cantidad,
            tipo_movimiento: tipo_movimiento,
            fecha: fecha,
            bodega: bodega,
            responsable: responsable
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Movimiento registrado correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarMovimientos()
        } else {
            alert('Error al registrar movimiento: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formMovimiento').addEventListener('submit', function(e) {
    e.preventDefault();

    const producto = document.getElementById('producto').value.trim();
    const cantidad = Number(document.getElementById('cantidad').value);
    const tipo_movimiento = document.getElementById('tipoMovimiento').value;
    const fecha = document.getElementById('fechaMovimiento').value;
    const bodega = document.getElementById('bodega').value;
    const responsable = document.getElementById('responsable').value.trim();

    if (!producto || cantidad <= 0 || !tipo_movimiento || !fecha || !bodega || !responsable) {
        alert('Por favor completa todos los campos correctamente.');
        return;
    }

    agregarMovimientoInventario(producto, cantidad, tipo_movimiento, fecha, bodega, responsable);
    this.reset();
    document.getElementById('fechaMovimiento').valueAsDate = new Date();
});


//======= REGISTRAR USUARIO   ======//

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const error = document.getElementById('errorAlert');
    const success = document.getElementById('successAlert');

    if (password !== confirmPassword) {
        error.textContent = "⚠ Las contraseñas no coinciden.";
        error.classList.remove('d-none');
        return;
    }

    // Aquí puedes agregar más validaciones si lo deseas

    fetch('http://127.0.0.1:5000/registro_usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre_completo: username,
            gmail: email,
            contrasena: password,
            tipo_usuario: 1,         // Puedes cambiar el valor según tu lógica
            tipo_documento: 1,       // Puedes cambiar el valor según tu lógica
            numero_documento: "N/A", // O pedirlo en el formulario
            estado: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje && data.mensaje.toLowerCase().includes('exitoso')) {
            error.classList.add('d-none');
            success.classList.remove('d-none');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } else {
            error.textContent = data.mensaje || "Error al registrar usuario.";
            error.classList.remove('d-none');
        }
    })
    .catch(() => {
        error.textContent = "Error de red o de servidor.";
        error.classList.remove('d-none');
    });
});



////================= ACTA DE VENCIMIENTO ================//

function agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador) {
    fetch('http://127.0.0.1:5000/actas_vencimiento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fecha: fecha,
            hora: hora,
            datos_producto: datos_producto,
            observaciones: observaciones,
            acciones_tomadas: acciones_tomadas,
            firma_conformidad: firma_conformidad,
            firma_coordinador: firma_coordinador
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Acta de vencimiento agregada correctamente');
            // Aquí puedes recargar la tabla si tienes una función consultarActas()
        } else {
            alert('Error al agregar acta: ' + (data.message || data.error));
        }
    })
    .catch(error => {
        alert('Error de red: ' + error);
    });
}

document.getElementById('formActa').addEventListener('submit', function(e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const datos_producto = document.getElementById('datosProducto').value.trim();
    const observaciones = document.getElementById('observaciones').value.trim();
    const acciones_tomadas = document.getElementById('accionesTomadas').value.trim();
    const firma_conformidad = document.getElementById('firmaConformidad').value.trim();
    const firma_coordinador = document.getElementById('firmaCoordinador').value.trim();

    agregarActaVencimiento(fecha, hora, datos_producto, observaciones, acciones_tomadas, firma_conformidad, firma_coordinador);
    this.reset();
});

//===========  =============//


