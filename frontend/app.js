const URL_BASE = "http://127.0.0.1:5000";


// ==========================================================================
// ================= GET, MOVIMIENTO DE PRODUCTO   =========================
// ==========================================================================

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
// ==========================================================================
// ===================  GET, PRODUCTO   ==============================
// ==========================================================================

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
    
// ==========================================================================
// =================== GET, CATEGORIA PORDUCTO ==============================
// ==========================================================================
    
    function mostrar_categoria(categoria) {
        let info = "";
        categoria.categoria_producto.forEach(i => {
            info +=`
            <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td>
                <button type="button" onclick="eliminar_categoria(${i.codigo})">Eliminar</button>
                <button type="button" onclick="mostrar_categoria(${i.codigo})">Editar</button>
            </td>
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
// ==========================================================================
// =================== POST, CATEGORIA PRODUCTO==============================
// ==========================================================================

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
        document.getElementById("nombreCategoria").value = "";
    categoria_producto();
    } catch (error) {
        console.error(error)
    }
}

// ==========================================================================
// =================== DELETE, CATEGORIA PRODUCTO==============================
// ==========================================================================

async function eliminar_categoria(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_categoria_producto/${codigo}`, {method: 'DELETE',});
        const response = await promesa.json()
        console.log("Categoría eliminada:", response)

        categoria_producto();
        return response

    } catch (error) {
        console.error(error)
    }
}

// ==========================================================================
// ================= GET, SUBCATEGORIA PRODUCTO ============================
// ==========================================================================

function mostrar_subcategoria(subcategoria) {
    let info ="";
    subcategoria.subcategoria_producto.forEach(i => {
        info +=`
        <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td>${i.categoria_producto}</td>
            <td>
            <button type="button" onclick="eliminar_subcategoria_producto(${i.codigo})">Eliminar</button>
            </td>
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
        console.error("Error al obtener subcategorías:", error)
    }
}

// ==========================================================================
// =================== POST, SUBCATEGORIA PRODUCTO==============================
// ==========================================================================

async function agregar_subcategoria() {
    try {
        const nombre_subcategoria = document.getElementById("nombreSubcategoria").value;
    
        const subcategoria = {
    "descripcion": nombre_subcategoria,
    "categoria_producto": document.getElementById("categoria").value
    }

    const promesa = await fetch(`${URL_BASE}/registro_subcategoria_producto`, {
        method: 'POST',
        body : JSON.stringify(subcategoria),
        headers: {
            "Content-type" : "application/json"
        }
    })
    const response = await promesa.json()
    subcategoria_producto();
        document.getElementById("nombreSubcategoria").value = "";
    console.log(response)
    
    } catch (error) {
        console.error(error)
    }
}

// ==========================================================================
// =================== LLAMAR CATEGORIA A SUBCATEGORIA =========================
// ==========================================================================
async function llamar_categoria() {
    try{
        const promesa = await fetch(`${URL_BASE}/categoria_producto`, {method: 'GET'});
        const response = await promesa.json();

        const select = document.getElementById("categoria");
        select.innerHTML = "";

        response.categoria_producto.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.codigo;
            option.text = categoria.descripcion;
            select.appendChild(option);
        });
    }catch(error){
        console.error("Error al cargar categorías:", error)
    }   
}

// ==========================================================================
// =================== DELETE, SUBCATEGORIA PRODUCTO ========================
// ==========================================================================

async function eliminar_subcategoria_producto(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_subcategoria_producto/${codigo}`, {method: 'DELETE',});
        const response = await promesa.json();
        console.log("Subcategoría eliminada:", response)
        
        subcategoria_producto();
        return response;
    } catch (error) {
        console.error("Error al eliminar subcategoría:", error);
    }
}

// ==========================================================================
// ======================== GET, BODEGA   ===================================
// ==========================================================================

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


// ==========================================================================
// ====================== GET, TIPO DONANTE =================================
// ==========================================================================

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



// ==========================================================================
// ======================== GET, DONANTE ====================================
// ==========================================================================

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

// ==========================================================================
// ====================  GET, TIPO GASTO  ===================================
// ==========================================================================

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



// ==========================================================================
// =========================  GET, GASTOS   =================================
// ==========================================================================

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


// ==========================================================================
// ================  CONSULTA GASTO INDIVIDUAL    ===========================
// ==========================================================================

async function gasto_id(id) {
    try {
        const promesa = await fetch(`${URL_BASE}/gasto/${id}`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)

        document.getElementById()
    
    } catch (error) {
        console.error((error))
    }
}

// ==========================================================================
// ===================  GET, TIPO ORGANIZACION   ===========================
// ==========================================================================



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


// ==========================================================================
// ===================  GET, ORGANIZACION  =================================
// ==========================================================================

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

// ==========================================================================
// ===================  GET, ACTA VENCIMIENTO  ==============================
// ==========================================================================

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

// ==========================================================================
// =================  GET, CERTIFICADO DONANTE ==============================
// ==========================================================================


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


// ==========================================================================
// ======================   GET, USUARIO   =================================
// ==========================================================================


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



// ==========================================================================
// ====================    GET, DONACION       ==============================
// ==========================================================================
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


// ==========================================================================
// =================== GET, DONACION MONETARIA ==============================
// ==========================================================================
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


// ==========================================================================
// =================== GET, FECHA VENCIMIENTO ==============================
// ==========================================================================

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

// ==========================================================================
// ===============  GET, DETALLE DONACION PRODUCTO  =========================
// ==========================================================================

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