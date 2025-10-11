const URL_BASE = "http://127.0.0.1:5000";


// ==== movimiento de producto ==== \\
function mostrar_movimiento(movimientos){
    let info = "";
    movimientos.movimiento_producto.forEach(i => {
        info += `
            <tr>
                <td>${i.id}</td>
                <td>${i.id_producto}</td>
                <td>${i.movimiento}</td>
                <td>${i.cantidad}</td>
                <td>${i.fecha}</td>
                <td>${i.observacion}</td>
                <td>${i.tipo_donacion}</td>
                <td>${i.organizacion}</td>
            </tr>
        `;
    });
    document.getElementById("tbodyMovimientos").innerHTML = info;
}

async function movimiento_producto() {
    try{
        const promesa = await fetch(`${URL_BASE}/movimiento_producto`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_movimiento(response)
    }catch(error){
        console.error(error)
    }
}
// ==== Agregar movimiento de producto ==== \\

// producto

function mostrar_producto(producto) {
    let info = "";
    producto.producto.forEach(i => {
        info +=`
        <tr>
                <td>${i.id_producto}</td>
                <td>${i.nombre}</td>
                <td>${i.descripcion}</td>
                <td>${i.cantidad}</td>
                <td>${i.codigo_barras}</td>
                <td>${i.stock}</td>
                <td>${i.stock_maximo}</td>
                <td>${i.stock_minimo}</td>
                <td>${i.categoria_producto}</td>
                <td>${i.subcategoria_producto}</td>
                <td>${i.estado}</td>
                <td>${i.unidad_de_medida}</td>
                </tr>
                `;
            });
        document.getElementById("tbodyproducto").innerHTML = info;
    }
    
    async function producto() {
        try{
            const promesa = await fetch(`${URL_BASE}/producto`, {method: 'GET'});
            const response = await promesa.json();
            console.log(response)
            mostrar_producto(response)
        }catch (error) {
            console.error(error)
        }
    }
    
    // categoria producto
    
    function mostrar_categoria(categoria) {
        let info = "";
        categoria.categoria_producto.forEach(i => {
            info +=`
            <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            </tr>
            `;
        });
        document.getElementById("tbodycategoria_producto").innerHTML = info;
    }
    
    async function categoria_producto() {        
        try{
            const promesa = await fetch(`${URL_BASE}/categoria_producto`, {method: 'GET'});
            const response = await promesa.json();
            console.log(response)
            mostrar_categoria(response)
        }catch(error){
            console.error(error)
        }
    }

    // agregar categoria \\

async function agregar_categoria() {
    try {
        const nombre_categoria = document.getElementById("nombreCategoria").value;

        const categoria = {
      "descripcion": nombre_categoria
    }

    const promesa = await fetch(`${URL_BASE}/registro_categoria_producto`, {
        method: 'POST',
        body : JSON.stringify(categoria),
        headers: {
            "Content-type" : "application/json"
        }
    })

    const response = await promesa.json()
    console.log(response)

    } catch (error) {
        console.error(error)
    }
}


// subcategoria 


function mostrar_subcategoria(subcategoria) {
    let info ="";
    subcategoria.subcategoria_producto.forEach(i => {
        info +=`
        <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td>${i.categoria_producto}</td>
        </tr>
        `;
    });
    document.getElementById("tbodysubcategoria_producto").innerHTML = info;
}

async function subcategoria_producto() {
    try{
        const promesa = await fetch(`${URL_BASE}/subcategoria_producto`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_subcategoria(response)
    }catch(error){
        console.error(error)
    }
}


//       ===============bodega===================     \\


function mostrarbodega(bodega){
    let info ="";
    bodega.bodega.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_bodega}</td>
            <td>${i.nombre_bodega}</td>
            <td>${i.ubicacion}</td>
            <td>${i.capacidad}</td>
            <td>${i.estado}</td>
            </tr>
        `;
    });
    document.getElementById("tbodybodega").innerHTML = info;
}

async function bodega() {
    try{
        const promesa = await fetch(`${URL_BASE}/bodega`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrarbodega(response)
    }catch(error){
        console.error(error)
    }
}

//    ==================  tipo_donante  ======================     \\

function mostrartipo_donante(tipo_donante) {
    let info ="";
    tipo_donante.tipo_donante.forEach(i => {
        info +=`
        <tr>
            <td>${i.ID}</td>
            <td>${i.descripcion}</td>
            <td > <button type="button">Eliminar</button> </td>
        </tr>
        `;
    });
    document.getElementById("tbodytipo_donante").innerHTML = info;
}

async function tipo_donante() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_donante`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrartipo_donante(response)
    }catch(error){
        console.error(error)
    }
}

//     ================   donante   =====================       \\


function mostrar_donante(donante) {
    let info ="";
    donante.donante.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_donante}</td>
            <td>${i.nombre}</td>
            <td>${i.tipo_documento}</td>
            <td>${i.numero_documento}</td>
            <td>${i.telefono}</td>
            <td>${i.correo}</td>
            <td>${i.direccion}</td>
            <td>${i.estado}</td>
            <td>${i.tipo_donante}</td>
            </tr>
        `
    });
    document.getElementById("tbodydonante").innerHTML = info;
}
async function donante() {
    try{
        const promesa = await fetch(`${URL_BASE}/donante`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_donante(response)
    }catch(error){
        console.error(error)
    }
}



//     ================    tipo_gasto   ==================   \\


function mostrartipo_gasto(tipo_gasto) {
    let info ="";
    tipo_gasto.tipo_gasto.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_gasto}</td>
            <td>${i.nombre}</td>
            <td>${i.descripcion}</td>
            
        </tr>
        `;
    });
    document.getElementById("tbodytipo_gasto").innerHTML = info;
}

async function tipo_gasto() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_gasto`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrartipo_gasto(response)
    }catch(error){
        console.error(error)
    }
}


//     ================   gasto   ==================   \\


function mostrargasto(gasto) {
    let info ="";
    gasto.gasto.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_gasto}</td>
            <td>${i.fecha}</td>
            <td>${i.monto}</td>
            <td>${i.descripcion}</td>
            <td>${i.tipo_gasto}</td>
            <td>${i.usuario}</td>
            
        </tr>
        `;
    });
    document.getElementById("tbodygasto").innerHTML = info;
}

async function gasto() {
    try{
        const promesa = await fetch(`${URL_BASE}/gasto`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrargasto(response)
    }catch(error){
        console.error(error)
    }
}

//     ================   tipo_organizacion   ==================   \\


function mostrartipo_organizacion(tipo_organizacion) {
    let info ="";
    tipo_organizacion.tipo_organizacion.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_organizacion}</td>
            <td>${i.nombre}</td>
            
            
        </tr>
        `;
    });
    document.getElementById("tbodytipo_organizacion").innerHTML = info;
}

async function tipo_organizacion() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_organizacion`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrartipo_organizacion(response)
    }catch(error){
        console.error(error)
    }
}
//     ================  organizacion   ==================   \\


function mostrarorganizacion(organizacion) {
    let info ="";
    organizacion.organizacion.forEach(i => {
        info +=`
        <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td>${i.nombre}</td>
            <td>${i.responsable}</td>
            <td>${i.telefono}</td>
            <td>${i.direccion}</td>
            <td>${i.tipo_entrega}</td>
            <td>${i.tipo_organizacion}</td>
            
            
        </tr>
        `;
    });
    document.getElementById("tbodyorganizacion").innerHTML = info;
}

async function organizacion() {
    try{
        const promesa = await fetch(`${URL_BASE}/organizacion`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrarorganizacion(response)
    }catch(error){
        console.error(error)
    }
}

//     ================  acta_vencimiento   ==================   \\


function mostraracta_vencimiento(acta_vencimiento) {
    let info ="";
    acta_vencimiento.acta_vencimiento.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_acta}</td>
            <td>${i.fecha}</td>
            <td>${i.descripcion}</td>
            
            
        </tr>
        `;
    });
    document.getElementById("tbodyacta_vencimiento").innerHTML = info;
}

async function acta_vencimiento() {
    try{
        const promesa = await fetch(`${URL_BASE}/acta_vencimiento`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostraracta_vencimiento(response)
    }catch(error){
        console.error(error)
    }
}

//   ================  certificado_donante   ==================   \\


function mostrarcertificado_donante(certificado_donante) {
    let info ="";
    certificado_donante.certificado_donante.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_certificado}</td>
            <td>${i.fecha}</td>
            <td>${i.valor_donado}</td>
            <td>${i.firma_representante}</td>
            <td>${i.id_donante}</td>
            <td>${i.tipo_certificado}</td>
            <td>${i.id_donacion}</td>
            <td>${i.id_donacion_monetaria}</td>
        </tr>
        `;
    });
    document.getElementById("tbodycertificado_donante").innerHTML = info;
}

async function certificado_donante() {
    try{
        const promesa = await fetch(`${URL_BASE}/certificado_donante`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrarcertificado_donante(response)
    }catch(error){
        console.error(error)
    }
}

//    ========= USUARIO =========   \\


function mostrar_usuario(usuario) {
    let info="";
    usuario.usuario.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_usuario}</td>
            <td>${i.nombre_completo}</td>
            <td>${i.numero_documento}</td>
            <td>${i.correo}</td>
            <td>${i.contrasena}</td>
            <td>${i.tipo_usuario}</td>
            <td>${i.tipo_documento}</td>
            <td>${i.estado}</td>
        </tr>
        `
    });
    document.getElementById("tbodyusuario").innerHTML = info;
}
async function usuario() {
    try{
        const promesa = await fetch(`${URL_BASE}/usuario`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_usuario(response)
    }catch(error){
        console.error(error)
    }
}


// donacion \\
function mostrar_donacion(donacion) {
    let info="";
    donacion.donacion.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_donacion}</td>
            <td>${i.donante}</td>
            <td>${i.fecha}</td>
            <td>${i.observaciones}</td>
            <td>${i.usuario}</td>
            <td>${i.tipo_donacion}</td>
        </tr>
        `
    });
    document.getElementById("tbodydonacion").innerHTML = info;
}
async function donacion() {
    try{
        const promesa = await fetch(`${URL_BASE}/donacion`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_donacion(response)
    }catch(error){
        console.error(error)
    }
}


// donacion_monetaria \\
function mostrar_donacion_monetaria(monetaria) {
    let info="";
    monetaria.donacion_monetaria.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_donacion_monetaria}</td>
            <td>${i.donante}</td>
            <td>${i.monto}</td>
            <td>${i.fecha}</td>
            <td>${i.banco}</td>
            <td>${i.numero_transferencia}</td>
            <td>${i.usuario}</td>
            <td>${i.tipo_donacion}</td>
        </tr>
        `
    });
    document.getElementById("tbodydonacion_monetaria").innerHTML = info;
}
async function donacion_monetaria() {
    try{
        const promesa = await fetch(`${URL_BASE}/donacion_monetaria`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_donacion_monetaria(response)
    }catch(error){
        console.error(error)
    }
}

//     ================  fecha_vencimiento   ==================   \\


function mostrar_vencimiento(vencimiento) {
    let info ="";
    vencimiento.fecha_vencimiento.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_vencimiento}</td>
            <td>${i.id_producto}</td>
            <td>${i.id_donacion}</td>
            <td>${i.fecha}</td>
            <td>${i.cantidad}</td>
            <td>${i.id_acta}</td>
        </tr>
        `;
    });
    document.getElementById("tbodyfecha_vencimiento").innerHTML = info;
}

async function fecha_vencimiento() {
    try{
        const promesa = await fetch(`${URL_BASE}/fecha_vencimiento`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_vencimiento(response)
    }catch(error){
        console.error(error)
    }
}
//     ================  detalle_donacion_producto   ==================   \\


function mostrar_detalle_donacion_producto(detalle_donacion_producto) {
    let info ="";
    detalle_donacion_producto.detalle_donacion_producto.forEach(i => {
        info +=`
        <tr>
            <td>${i.ID}</td>
            <td>${i.id_producto}</td>
            <td>${i.id_donacion}</td>
            <td>${i.cantidad}</td>
        </tr>
        `;
    });
    document.getElementById("tbodydetalle_donacion_producto").innerHTML = info;
}

async function detalle_donacion_producto() {
    try{
        const promesa = await fetch(`${URL_BASE}/detalle_donacion_producto`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_detalle_donacion_producto(response)
    }catch(error){
        console.error(error)
    }
}




//===================================================//
         //========== agregar ==========//
//===================================================//






//==================   Tipo Donante    =====================//

function agregar_tipo_donante() {
   
    const nom = document.getElementById("nombreTipo").value;
    const des = document.getElementById("descripcionTipo").value;

    const data = {
        nombre: nom,
        descripcion: des
    };

    fetch(`${URL_BASE}/registro_tipo_donante`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(response => {
        if (!response.mensaje === "Error") {
            swal ("Mensaje","Error en el registro", "error");
        } else {
            consulta_general();
            swal ("Mensaje","Registro exitoso", "success");
        }
    })
    .catch(error => console.error('Error:', error));
}
  

//==========  ELIMINAR TIPO DONANTE   ============//








//=================== Donante =========================//

function agregar_donante() {
    const nom = document.getElementById("nombreDonante").value;
    const tip_doc = document.getElementById("tipoDocumento").value;
    const num_doc = document.getElementById("numeroDocumento").value;
    const tel = document.getElementById("telefonoDonante").value;
    const cor = document.getElementById("correoDonante").value;
    const dir = document.getElementById("direccionDonante").value;
    const est = document.getElementById("estadoDonante").value;
    const tip_don = document.getElementById("tipoDonante").value;
}
    const data = {
        nombre: nom,
        tipo_documento: tip_doc,
        numero_documento: num_doc,
        telefono: tel,
        correo: cor,
        direccion: dir,
        estado: est,
        tipo_donante: tip_don
    }
    fetch(`${URL_BASE}/registro_donante`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(response => {
        if (!response.mensaje === "Error") {
            swal ("Mensaje","Error en el registro", "error");
        } else {
            consulta_general();
            swal ("Mensaje","Registro exitoso", "success");
        }
    })
    .catch(error => console.error('Error:', error));    

//===============  ELIMINAR DONANTE  ======================//

function eliminar_donante(id_donante) {
    fetch(`${BASE_URL}/eliminar/${id_donante}`, { method: 'DELETE'}) // Solucitud DELETE
        .then(response => {
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return response.json();
    })
    .then(res => {
        actualizar_lista_donantes(); // Función para actualizar la lista de donantes en la interfaz
        swal("mensaje", `registro ${res.mensaje} exitosamente`, "success");
    })
    .catch(error => console.error('Error:', error));

function actualizar_lista_donantes(id_donante) {
    const row = document.querySelector(`tr[data-id='${id_donante}']`);
    if (row) row.remove();        
}







//========  VISUALIZAR DONANTE ========//

