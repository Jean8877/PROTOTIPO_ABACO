const URL_BASE = "http://127.0.0.1:5000";


// ==========================================================================
// =================== LOGIN USUARIO ========================================
// ==========================================================================
const formLogin = document.getElementById("loginForm");

if (formLogin) { // solo si existe en el HTML
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault(); // evita recargar la página

        const correo = document.getElementById("username").value;
        const contrasena = document.getElementById("password").value;

        try {
            const response = await fetch(`${URL_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo: correo,
                    contrasena: contrasena,
                }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (response.ok) {
                // ✅ Login correcto → mostrar modal moderno
                const modal = new bootstrap.Modal(document.getElementById("loginSuccessModal"));
                document.getElementById("loginSuccessMessage").textContent = `Bienvenido, ${data.usuario.nombre_completo}`;
                modal.show();

                // guardar token en localStorage si existe
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                // 🔁 Redirigir automáticamente al menú central después de 2 segundos
                setTimeout(() => {
                    window.location.href = "menu_central.html"; // cambia la ruta si tu archivo se llama distinto
                }, 2000);

            } else {
                // ❌ Error de login → mostrar modal de error
                const modal = new bootstrap.Modal(document.getElementById("loginErrorModal"));
                document.getElementById("loginErrorMessage").textContent = data.mensaje || "Error al iniciar sesión";
                modal.show();
            }

        } catch (error) {
            console.error("Error en login:", error);
            const modal = new bootstrap.Modal(document.getElementById("loginErrorModal"));
            document.getElementById("loginErrorMessage").textContent = "Error de conexión con el servidor.";
            modal.show();
        }
    });
}

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
// =================== GET, UNIDAD DE MEDIDA  ===============================
// ==========================================================================
    
    function mostrar_uni_medida(medida) {
        let info = "";
        medida.unidad_de_medida.forEach(i => {
            info +=`
            <tr>
            <td>${i.codigo}</td>
            <td>${i.nombre}</td>
            <td>
                <button type="button" onclick="eliminar_unidad_de_medida(${i.codigo})">Eliminar</button>
            </td>
            </tr>
            `;
        });
        document.getElementById("tbodyunidad_de_medida").innerHTML = info;
    }
    
    async function unidad_de_medida() {        
        try{
            const promesa = await fetch(`${URL_BASE}/unidad_de_medida`, {method: 'GET'});
            const response = await promesa.json();
            console.log(response)
            mostrar_uni_medida  (response)
        }catch(error){
            console.error(error)
        }
    }
// ==========================================================================
// =================== POST, UNIDAD DE MEDIDA  ==============================
// ==========================================================================

async function agregar_unidad_de_medida() {
    try {
        const nombre_unidad_de_medida = document.getElementById("unidad_de_medida").value;
        const nueva_unidad = {
    "nombre": nombre_unidad_de_medida
    }

    const promesa = await fetch(`${URL_BASE}/registro_unidad_de_medida`, {
        method: 'POST',
        body : JSON.stringify(nueva_unidad),
        headers: {
            "Content-type" : "application/json"
        }
    })
    const response = await promesa.json()
    console.log(response)
        document.getElementById("unidad_de_medida").value = "";
        unidad_de_medida();
    } catch (error) {
        console.error(error)
    }
}

// ==========================================================================
// ===================== LLAMAR UNIDAD DE MEDIDA  ===========================
// ==========================================================================
async function llamar_unidad_medida() {
    try {
        const promesa = await fetch(`${URL_BASE}/unidad_de_medida`, { method: 'GET' });
        const response = await promesa.json();


        const select = document.getElementById("unidad_medida");
        select.innerHTML = "<option value=''>Seleccione una unidad de medida</option>";

        response.unidad_de_medida.forEach(unidad => {
            const option = document.createElement("option");
            option.value = unidad.codigo;
            option.text = unidad.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

// ==========================================================================
// =================== DELETE, UNIDAD DE MEDIDA  ============================
// ==========================================================================

async function eliminar_unidad_de_medida(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_unidad_de_medida/${codigo}`, {method: 'DELETE',});
        const response = await promesa.json()
        console.log("unidad de medida eliminada:", response)

        unidad_de_medida();
        return response

    } catch (error) {
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
                <td>
                    <button type="button" onclick="eliminar_producto(${i.id_producto})">Eliminar</button> 
                </td>
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
            llamar_categoria()
            llamar_estado()
            llamar_subcategoria()
            llamar_unidad_medida()

        }catch (error) {
            console.error(error)
        }
    }


// ==========================================================================
// ====================  POST, PRODUCTO   ====================================
// ==========================================================================
async function agregar_producto() {
    try{
        const nombre_producto = document.getElementById("producto").value;
        const descripcion_producto = document.getElementById("descripcion").value;
        const cantidad_producto = parseInt(document.getElementById("cantidad").value);
        const codi_barra_producto = document.getElementById("codigo_barras").value;

        const stock_maxi_producto = document.getElementById("stock_maximo").value;
        const stock_minim_producto = document.getElementById("stock_minimo").value;
        const categoria_producto = document.getElementById("categoria").value;
        const subcategoria_producto = document.getElementById("subcategoria").value;
        const estado = document.getElementById("estado").value;
        const unidad_de_medida_producto = document.getElementById("unidad_medida").value;

        const nuevo_producto = {
            "nombre": nombre_producto,
            "descripcion": descripcion_producto,
            "cantidad": cantidad_producto,
            "codigo_barras": codi_barra_producto,
            "stock": cantidad_producto,
            "stock_minimo": stock_minim_producto,
            "stock_maximo": stock_maxi_producto,
            "categoria_producto": categoria_producto,
            "subcategoria_producto": subcategoria_producto,
            "estado": estado,
            "unidad_de_medida": unidad_de_medida_producto
        }

        const promesa = await fetch(`${URL_BASE}/registro_producto`, {
            method: 'POST',
            body : JSON.stringify(nuevo_producto),
            headers: {
                "Content-Type" : "application/json"
            }
        })

        const response = await promesa.json()
        console.log(response)
        
        document.getElementById("producto").value = "";
        document.getElementById("descripcion").value = "";
        document.getElementById("cantidad").value = "";
        document.getElementById("codigo_barras").value = "";
        document.getElementById("stock_maximo").value = "";
        document.getElementById("stock_minimo").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("subcategoria").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("unidad_medida").value = "";

        producto();
    } catch (error) {
        console.error(error)
    }
}
// ==========================================================================
// ======================== DELETE,  PRODUCTO  ==============================
// ==========================================================================

async function eliminar_producto(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_producto/${codigo}`, {method: 'DELETE',});
        const response = await promesa.json()
        console.log("Producto eliminada:", response)

        producto();
        return response

    } catch (error) {
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
                <button type="button" onclick="mostrar_categoria(${i.codigo})">Actualizar</button>
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
// =================== DELETE, CATEGORIA PRODUCTO============================
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
        llamar_categoria()
    }catch(error){
        console.error("Error al obtener subcategorías:", error)
    }
}

// ==========================================================================
// =================== POST, SUBCATEGORIA PRODUCTO===========================
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
    try {
        const promesa = await fetch(`${URL_BASE}/categoria_producto`, { method: 'GET' });
        const response = await promesa.json();

        const select = document.getElementById("categoria");
        select.innerHTML = "<option value=''>Seleccione una categoría</option>";

        response.categoria_producto.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.codigo;
            option.text = categoria.descripcion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

// ==========================================================================
// =================== LLAMAR CATEGORIA A PRODUCTO =========================
// ==========================================================================
async function llamar_subcategoria() {
    try {
        const promesa = await fetch(`${URL_BASE}/subcategoria_producto`, { method: 'GET' });
        const response = await promesa.json();

 const select = document.getElementById("subcategoria");
        select.innerHTML = "<option value=''>Seleccione una subcategoría</option>";

        response.subcategoria_producto.forEach(sub => {
            const option = document.createElement("option");
            option.value = sub.codigo;       // el ID de la subcategoría
            option.text = sub.descripcion;   // el nombre que se muestra
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar subcategorías:", error);
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
            <td>
                <button type="button" onclick="eliminar_bodega(${i.id_bodega})">Eliminar</button>
            </td>
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
        llamar_estado();
    }catch(error){
        console.error(error)
    }
}

// ==========================================================================
// ====================== POST, AGREGAR BODEGA =================================
// ==========================================================================

async function agregar_bodega() {
    try {
        const nombre_bodega = document.getElementById("bodega").value;
        const direccion_bodega = document.getElementById("direccion").value;
        const capacidad_bodega = document.getElementById("capacidad").value;
        const estado_bodega = document.getElementById("estado").value;

        const nueva_bodega = {
            "capacidad": capacidad_bodega,
            "estado": estado_bodega,
            "nombre_bodega": nombre_bodega,
            "ubicacion": direccion_bodega
        }

        const promesa = await fetch(`${URL_BASE}/registro_bodega`, {
            method: 'POST',
            body : JSON.stringify(nueva_bodega),
            headers: {
                "Content-type" : "application/json"
            }
        })
        
        const response = await promesa.json()
        console.log(response)

        document.getElementById("bodega").value = "";
        document.getElementById("direccion").value = "";
        document.getElementById("capacidad").value = "";
        document.getElementById("estado").value = "";

        bodega();
    } catch (error) {
        console.error(error)
    }
}


// =======================================================================
// ====================== LLAMAR ESTADO =================================
// =======================================================================
async function llamar_estado() {
    try {
        const promesa = await fetch(`${URL_BASE}/estado`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("estado");
        select.innerHTML = "";
        response.estado.forEach(estado =>  {
            const option = document.createElement("option")
            option.value = estado.id_estado;
    option.text = `${estado.nombre} - ${estado.descripcion}`;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar es estado", error)
    }
}
// ==========================================================================
// ====================== DELETE, BODEGA  =================================
// ==========================================================================
async function eliminar_bodega(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_bodega/${codigo}`, {method: 'DELETE',});
    const response = await promesa.json()
    console.log("Bodega eliminada", response)
    bodega();
    return response;
    } catch ( error) {
        console.error("Error al eliminar bodega:", error);
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

