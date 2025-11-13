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
                <td>${i.responsable}</td>
                <td>
                <button type="button" onclick="eliminar_movimiento_producto(${i.codigo})">Eliminar</button>
                </td>
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
        llamar_tipo_donacion()
        llamar_organizacion()
        llamar_bodega()
        llamar_producto()

    }catch(error){
        console.error(error)
    }
}

// ==========================================================================
// ================= POST, MOVIMIENTO DE PRODUCTO   =========================
// ==========================================================================

async function agregar_movimiento() {
    try {
        const  id_producto = document.getElementById("id_producto").value;
        const  tipoMovimiento = document.getElementById("tipoMovimiento").value;
        const  cantidad = document.getElementById("Cantidad").value;
        const  fechaMovimiento = document.getElementById("fechaMovimiento").value;
        const  observacion = document.getElementById("observacion").value;
        const  tipo_donacion = document.getElementById("tipo_donacion").value;
        const  organizacion = document.getElementById("organizacion").value;
        const  bodega = document.getElementById("bodega").value;
        const  responsable = document.getElementById("responsable").value;
        const nuevo_movimiento = {
            id_producto,
            tipoMovimiento,
            cantidad,
            fechaMovimiento,
            observacion,
            tipo_donacion,
            organizacion,
            bodega,
            responsable
        }

    const promesa = await fetch(`${URL_BASE}/registro_movimiento`, {
        method: 'POST',
        body : JSON.stringify(nuevo_movimiento),
        headers: {
            "Content-type" : "application/json"
        }
    })
    const response = await promesa.json()
    console.log(response)
        document.getElementById("unidad_de_medida").value = "";
        unidad_de_medida()
    } catch (error) {
        console.error(error)
    }
}
// ==========================================================================
// ===============  DELETE, MOVIMIENTO DE PRODUCTO   ========================
// ==========================================================================

async function eliminar_movimiento_producto(codigo) {
    try {
        const promesa = await fetch(`${URL_BASE}/eliminar_movimiento_producto/${codigo}`, {method: 'DELETE',});
        const response = await promesa.json()
        console.log("Movimiento de producto eliminado:", response)

        movimiento_producto();
        return response

    } catch (error) {
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
        try {
            const promesa = await fetch(`${URL_BASE}/unidad_de_medida`, { method: 'GET' });
            const response = await promesa.json();
            console.log(response)
            mostrar_uni_medida(response)
        } catch (error) {
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
        window.listaUnidades = response.unidad_de_medida;


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
                <td>${i.categoria}</td>
                <td>${i.subcategoria}</td>
                <td>${i.descripcion}</td>
                <td>${i.stock_minimo}</td>
                <td>${i.unidad_de_medida}</td>
                <td>${i.estado}</td>
                <td>
                    <button type="button" onclick="eliminar_producto(${i.id_producto})">Eliminar</button>
                    <button type="button" onclick="abrirModalEditar(${i.id_producto})">Actualizar</button>
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
            llamar_unidad_medida()

        }catch (error) {
            console.error(error)
        }
    }

// ==========================================================================
// ====================  POST, PRODUCTO  ====================================
// ==========================================================================
async function agregar_producto(event) {
  event.preventDefault();

  try {
    const categoria_producto = document.getElementById("categoria").value;
    const subcategoria_producto = document.getElementById("subcategoria").value;
    const nombre_producto = document.getElementById("nombre").value;
    const stock_minimo_producto = document.getElementById("stock_minimo").value;
    const unidad_de_medida_producto = document.getElementById("unidad_medida").value;
    const descripcionInput = document.getElementById("descripcion");
    const descripcion_producto = descripcionInput ? descripcionInput.value : "";

    // Validaciones simples antes de enviar
    if (!categoria_producto || !subcategoria_producto || !nombre_producto || !unidad_de_medida_producto) {
      return Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos obligatorios.",
        confirmButtonColor: "#198754"
      });
    }

    const nuevo_producto = {
      categoria_producto,
      subcategoria_producto,
      nombre: nombre_producto,
      stock_minimo: stock_minimo_producto,
      unidad_de_medida: unidad_de_medida_producto,
      descripcion: descripcion_producto
    };

    const promesa = await fetch(`${URL_BASE}/registro_producto`, {
      method: "POST",
      body: JSON.stringify(nuevo_producto),
      headers: { "Content-Type": "application/json" }
    });

    const response = await promesa.json();
    console.log(response);

    if (promesa.ok) {
      // Notificación de éxito
      await Swal.fire({
        icon: "success",
        title: "Producto registrado",
        text: response.mensaje || "El producto fue agregado correctamente.",
        showConfirmButton: false,
        timer: 1500
      });

      // Limpiar el formulario
      document.getElementById("formProducto").reset();

      // Actualizar la tabla
      producto();

    } else {
      // Error desde el backend
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: response.mensaje || "No se pudo registrar el producto.",
        confirmButtonColor: "#d33"
      });
    }

  } catch (error) {
    console.error("Error al registrar producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error inesperado",
      text: "Ocurrió un problema al registrar el producto.",
      confirmButtonColor: "#d33"
    });
  }
}

// ==========================================================================
// ======================== ACTUALIZAR, PRODUCTO  ===========================
// ==========================================================================

async function cargarCategoriasEditar(categoriaActual = "") {
  try {
    const response = await fetch(`${URL_BASE}/categoria_producto`);
    const data = await response.json();

    const categorias = data.categoria_producto;
    const select = document.getElementById("categoria_editar");
    select.innerHTML = '<option value="">Seleccione una categoría</option>';

    categorias.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.codigo;
      option.textContent = c.descripcion;

      // 🔹 Si esta categoría es la actual, la marcamos como seleccionada
      if (c.descripcion === categoriaActual || c.codigo === categoriaActual) {
        option.selected = true;
      }

      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

// ==========================================================================
// ================ CARGAR LA OPCION DE LA SUBCATEGORIA   ===================
// ==========================================================================
async function cargarSubcategoriasEditar() {
  try {
    const response = await fetch(`${URL_BASE}/subcategoria_producto`);
    const data = await response.json();

    const subcategorias = data.subcategoria_producto;
    const select = document.getElementById("subcategoria_editar");
    select.innerHTML = '<option value="">Seleccione una subcategoría</option>';

    subcategorias.forEach((s) => {
      const option = document.createElement("option");
      option.value = s.codigo; // usa "codigo"
      option.textContent = s.descripcion; // usa "descripcion"
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar subcategorías:", error);
  }
}

// ==========================================================================
// ==================  GUARDAR CAMBIOS PRODUCTO =============================
// ==========================================================================
async function guardar_cambios() {
  const id = document.getElementById("id_editar").value;

  if (!id) {
    alert("Error: no se encontró el ID del producto a editar.");
    return;
  }

  // Obtener valores
  const categoria = document.getElementById("categoria_editar").value;
  const subcategoria = document.getElementById("subcategoria_editar").value;
  const nombre = document.getElementById("nombre_editar").value.trim();
  const stock_minimo = document.getElementById("stock_minimo_editar").value;
  const unidad_de_medida = document.getElementById(
    "unidad_medida_editar"
  ).value;
  const descripcion = document
    .getElementById("descripcion_editar")
    .value.trim();
  const estado = document.getElementById("estado_editar").value;

  // Validar unidad de medida
  if (!unidad_de_medida) {
    alert("Por favor, seleccione una unidad de medida antes de guardar.");
    return;
  }

  const producto_actualizado = {
    categoria_producto: parseInt(categoria) || null,
    subcategoria_producto: parseInt(subcategoria) || null,
    nombre,
    stock_minimo: parseInt(stock_minimo) || 0,
    unidad_de_medida: parseInt(unidad_de_medida),
    descripcion,
    estado: parseInt(estado) || null,
  };

  try {
    const response = await fetch(`${URL_BASE}/actualizar_producto/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(producto_actualizado),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensaje || "Error en la actualización");
    }

    Swal.fire({
      icon: "success",
      title: "Producto actualizado correctamente",
      showConfirmButton: false,
      timer: 2000,
      background: "#fefefe",
      color: "#333",
      iconColor: "#28a745",
    });


    // Cerrar el modal correctamente
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalEditarProducto")
    );
    if (modal) modal.hide();

    // Refrescar la tabla si existe la función producto()
    if (typeof producto === "function") {
      producto();
    }
  } catch (error) {
    console.error("Error al guardar cambios:", error);
    alert(
      "❌ No se pudo actualizar el producto. Revisa la consola para más detalles."
    );
  }
}

// ==========================================================================
// =======================   ABRIR MODAL EDITAR PRODUCTO   ===========================
// ==========================================================================
async function abrirModalEditar(codigo) {
  try {
    await cargarCategoriasEditar();
    await cargarSubcategoriasEditar();
    await cargarUnidadesEditar();
    

    const response = await fetch(`${URL_BASE}/producto/${codigo}`);
    const data = await response.json();

    if (!response.ok || !data.producto) {
      alert("Error al cargar el producto.");
      return;
    }

    const producto = data.producto;

    document.getElementById("id_editar").value = producto.id_producto;
    document.getElementById("categoria_editar").value =
      producto.categoria_producto;
    document.getElementById("subcategoria_editar").value =
      producto.subcategoria_producto;
    document.getElementById("nombre_editar").value = producto.nombre;
    document.getElementById("descripcion_editar").value = producto.descripcion;
    document.getElementById("stock_minimo_editar").value = producto.stock_minimo;
    document.getElementById("unidad_medida_editar").value = producto.unidad_de_medida || "";

        await llamar_estado(producto.estado);
    const modal = new bootstrap.Modal(
      document.getElementById("modalEditarProducto")
    );
    modal.show();
  } catch (error) {
    console.error("Error al abrir el modal de edición:", error);
    alert("No se pudo abrir el modal de edición.");
  }
}
// ==========================================================================
// ====================   CARGAR ESTADOS EDITAR   ===========================
// ==========================================================================
async function cargarEstadosEditar() {
  try {
    const response = await fetch(`${URL_BASE}/estado`);
    const data = await response.json();
    console.log("Estados recibidos:", data);

    const estados = data.estado;
    const select = document.getElementById("estado_editar");
    select.innerHTML = '<option value="">Seleccione un estado</option>';

    estados.forEach((e) => {
      const option = document.createElement("option");
      option.value = e.id_estado; // ← valor que se guarda
      option.textContent = e.nombre; // ← texto visible ("Activo" o "Inactivo")
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar estados:", error);
  }
}

// ==========================================================================
// ==================   CARGAR UNIDADES DE MEDIDA   ========================
// ==========================================================================
async function cargarUnidadesEditar() {
  try {
    const response = await fetch(`${URL_BASE}/unidad_de_medida`);
    const data = await response.json();

    const select = document.getElementById("unidad_medida_editar");
    select.innerHTML = '<option value="">Seleccione una unidad</option>';

    data.unidad_de_medida.forEach((u) => {
      const option = document.createElement("option");
      option.value = u.codigo; // código numérico
      option.textContent = u.nombre; // nombre visible
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar unidades de medida:", error);
  }
}


// ==========================================================================
// ======================== DELETE,  PRODUCTO  ==============================
// ==========================================================================
async function eliminar_producto(codigo) {
  try {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacion.isConfirmed) return;

    const respuesta = await fetch(`${URL_BASE}/eliminar_producto/${codigo}`, {
      method: "DELETE",
    });

    const data = await respuesta.json();
    console.log("Producto eliminado:", data);

    // Verifica el código HTTP para decidir el tipo de mensaje
    if (respuesta.ok) {
      await Swal.fire({
        icon: "success",
        title: "Eliminado",
        text: data.mensaje || "El producto fue eliminado correctamente.",
        timer: 1500,
        showConfirmButton: false,
      });
      producto();
    } else {
      await Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: data.mensaje || "El producto está asociado a otras tablas.",
      });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Ocurrió un problema al eliminar el producto.", 
    });
  }
}

// ==========================================================================
// =================== GET, CATEGORIA PORDUCTO ==============================
// ==========================================================================
    
    function mostrar_categoria(categoria) {
        let info = "";
        categoria.categoria_producto.forEach(i => {
            info += `
            <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td>
                <button type="button" onclick="eliminar_categoria(${i.codigo})">Eliminar</button>
                <button type="button" onclick="editar_categoria(${i.codigo})">Actualizar</button>
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
// ================= ACTIUALIZAR CATEGORIA PRODUCTO =========================
// ==========================================================================

async function actualizar_categoria(codigo) {
  try {
    const descripcion = document.getElementById("categoria_editar").value;

    const categoria = {
      descripcion: descripcion,
    };

    const promesa = await fetch(`${URL_BASE}/categoria_producto/${codigo}`, {
      method: "PUT",
      body: JSON.stringify(categoria),
      headers: {
        "Content-type": "application/json",
      },
    });

    const response = await promesa.json();
    console.log(response);
    if (response.Mensaje == "Categoría Actualizada") {
      Swal.fire({
        title: "Mensaje",
        text: `${response.Mensaje}`,
        icon: "success",
      });
    }

    return response;
  } catch (error) {
    console.error(error);
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
// =======================   ABRIR MODAL EDITAR CATEGORIA  ==================
// ==========================================================================
async function editar_categoria(codigo) {
  try {
    // Cargar datos de la categoría por ID
    const response = await fetch(`${URL_BASE}/categoria_producto/${codigo}`);
    const data = await response.json();

    if (!response.ok || !data.categoria_producto || data.categoria_producto.length === 0) {
      alert("Error: no se encontró la categoría.");
      return;
    }

    const categoria_producto = data.categoria_producto[0]; // ✅ corregido

    // Asignar valores en el modal
    document.getElementById("id_editar_categoria").value = categoria_producto.id_categoria_producto;
    document.getElementById("categoria_editar").value = categoria_producto.descripcion;

    // Abrir el modal
    const modal = new bootstrap.Modal(document.getElementById("editar_categoria"));
    modal.show();

  } catch (error) {
    console.error("Error al abrir el modal de edición:", error);
    alert("No se pudo abrir el modal de edición.");
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
// =========== LLAMAR CATEGORÍA Y SUBCATEGORÍA (DEPENDIENTE) ===============
// ==========================================================================

// Cargar categorías en el select principal
async function llamar_categoria() {
    try {
        const promesa = await fetch(`${URL_BASE}/categoria_producto`, { method: 'GET' });
        const response = await promesa.json();

        const selectCategoria = document.getElementById("categoria");
        selectCategoria.innerHTML = "<option value=''>Seleccione una categoría</option>";

        window.listaCategorias = response.categoria_producto || [];

        window.listaCategorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.codigo;
            option.textContent = categoria.descripcion;
            selectCategoria.appendChild(option);
        });

        selectCategoria.addEventListener("change", async function () {
            const categoriaSeleccionada = this.value;
            if (categoriaSeleccionada) {
                await llamar_subcategoria_por_categoria(categoriaSeleccionada);
            } else {
                limpiar_subcategorias();
            }
        });

    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

function limpiar_subcategorias() {
    const selectSub = document.getElementById("subcategoria");
    selectSub.innerHTML = "<option value=''>Seleccione una subcategoría</option>";
}

async function llamar_subcategoria_por_categoria(categoria_id) {
    try {
        const promesa = await fetch(`${URL_BASE}/subcategoria/${categoria_id}`, { method: 'GET' });
        const response = await promesa.json();

        const selectSub = document.getElementById("subcategoria");
        selectSub.innerHTML = "<option value=''>Seleccione una subcategoría</option>";

        // Verificar estructura del JSON
        const subcategorias = response.subcategoria_producto || response;

        // Guardar globalmente para el modal de visualización
        window.listaSubcategorias = subcategorias;

        // Llenar select con las subcategorías
        subcategorias.forEach(sub => {
            const option = document.createElement("option");
            option.value = sub.codigo;
            option.textContent = sub.descripcion;
            selectSub.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar subcategorías:", error);
    }
}

// ==========================================================================
// ======================== GUARDAR CAMBIOS CATEGORIA ===================
// ==========================================================================
async function guardar_cambios_categoria() {
  const codigo = document.getElementById("id_editar_categoria").value;
  const categoria = document.getElementById("categoria_editar").value;

  console.log("ID:", codigo);
  console.log("Categoría:", categoria);


  const response = await fetch(`${URL_BASE}/categoria_producto/${codigo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categoria_producto: categoria }),
  });

  const data = await response.json();
  console.log("Respuesta:", data);

  if (response.ok) {
    alert("Categoría actualizada correctamente.");
    // Aquí podrías cerrar el modal o refrescar la tabla
  } else {
    alert("Error al actualizar la categoría.");
  }
}

// ==========================================================================
// ============== CARGAR TODAS LAS SUBCATEGORÍAS (para el modal) ============
// ==========================================================================
async function llamar_todas_subcategorias() {
  try {
    const promesa = await fetch(`${URL_BASE}/subcategoria_producto`, { method: 'GET' });
    const response = await promesa.json();
    window.listaSubcategorias = response.subcategoria_producto || [];
  } catch (error) {
    console.error("Error al cargar todas las subcategorías:", error);
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

    // =======================================================================
    // ====================== LLAMAR ESTADO =================================
    // =======================================================================

async function llamar_estado(estadoSeleccionado = null) {
  try {
    const promesa = await fetch(`${URL_BASE}/estado`, { method: "GET" });
    const response = await promesa.json();
    window.listaEstados = response.estado; // Guardamos para uso futuro

    const selectIds = ["estado", "estado_editar"]; // llenamos ambos si existen
    selectIds.forEach((id) => {
      const select = document.getElementById(id);
      if (select) {
        // Crear opción inicial deshabilitada
        select.innerHTML = `
          <option value="" disabled ${!estadoSeleccionado ? "selected" : ""}>
            Seleccione un estado
          </option>
        `;

        // Agregar las opciones de estados
        response.estado.forEach((estado) => {
          const option = document.createElement("option");
          option.value = estado.id_estado;
          option.text = estado.nombre;
          if (estadoSeleccionado && estado.id_estado === estadoSeleccionado) {
            option.selected = true;
          }
          select.appendChild(option);
        });
      }
    });
  } catch (error) {
    console.error("Error al cargar el estado", error);
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
            <td>
            <button type="button" onclick="eliminar_tipo_donante(${i.ID})">Eliminar</button>
            </td>
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
// ====================== GET, TIPO DOCUMENTO ================================
// ==========================================================================

function mostrartipo_documento(tipo_documento) {
    let info ="";
    tipo_documento.tipo_documento.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_documento}</td>
            <td>${i.descripcion}</td>
            <td>${i.abreviatura}</td>
            <td>
            <button type="button" onclick="eliminar_tipo_documento(${i.id_tipo_documento})">Eliminar</button>
            </td>
        </tr>

        `;
    });
    document.getElementById("tbodytipo_documento").innerHTML = info;
}

async function tipo_documento() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_documento`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_tipo_documento(response)
    }catch(error){
        console.error(error)
    }
}
// =======================================================================
// ===================== LLAMAR TIPO_DOCUMENTO ===========================
// =======================================================================
async function llamar_tipo_documento() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_documento`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("tipo_documento");
        select.innerHTML = "";
        response.tipo_documento.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.id_tipo_documento;
            option.text = `${tipo.id_tipo_documento} - ${tipo.descripcion}`;
            option.text = `${tipo.abreviatura} - ${tipo.descripcion}`;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de documento", error)
    }
}

// =======================================================================
// ===================== LLAMAR TIPO_DONANTE =============================
// =======================================================================
async function llamar_tipo_donante() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_donante`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("tipo_donante");
        select.innerHTML = "";
        response.tipo_donante.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.ID;
            option.text = tipo.descripcion;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de donante", error)
    }
}

// ==========================================================================
// ====================== POST, TIPO DONANTE =================================
// ==========================================================================

async function agregar_tipo_donante() {
    try {
        const descripcion = document.getElementById("descripcion").value;

        const nuevo_tipo_donante = {
            "descripcion": descripcion
        };

        const promesa = await fetch(`${URL_BASE}/registro_tipo_donante`, {
            method: 'POST',
            body: JSON.stringify(nuevo_tipo_donante),
            headers: {
                "Content-type": "application/json"
            },
        })
        const response = await promesa.json();
        console.log(response);
        document.getElementById("descripcion").value = "";
        tipo_donante();
    } catch (error) {
        
    }
}

// ==========================================================================
// ====================== DELETE, TIPO DONANTE =================================
// ==========================================================================

async function eliminar_tipo_donante(codigo) {
    try {
        fetch(`${URL_BASE}/eliminar_tipo_donante/${codigo}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log("tipo de donante eliminado:", data);
            tipo_donante();
            return data;
        });
    } catch (error) {
        console.error(error);
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
            <td>
            <button type="button" onclick="eliminar_donante(${i.id_donante})">Eliminar</button>
            </td>
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
        llamar_estado()
        llamar_tipo_donante()
        llamar_tipo_documento()
    }catch(error){
        console.error(error)
    }
}
// ==========================================================================
// ======================== POST, DONANTE ====================================
// ==========================================================================

async function agregar_donante() {
    try {
        const nombre = document.getElementById("nombre").value;
        const tipo_documento = document.getElementById("tipo_documento").value;
        const numero_documento = document.getElementById("numero_documento").value;
        const telefono = document.getElementById("telefono").value;
        const correo = document.getElementById("correo").value;
        const direccion = document.getElementById("direccion").value;
        const estado = document.getElementById("estado").value;
        const tipo_donante = document.getElementById("tipo_donante").value;

        const nuevo_donante = {
            "nombre": nombre,
            "tipo_documento": tipo_documento,
            "numero_documento": numero_documento,
            "telefono": telefono,
            "correo": correo,
            "direccion": direccion,
            "estado": estado,
            "tipo_donante": tipo_donante
        }
        const promesa = await fetch(`${URL_BASE}/registro_donante`, {
            method: 'POST',
            body: JSON.stringify(nuevo_donante),
            headers: {
                "Content-type": "application/json"
            },
        })
        const response = await promesa.json()
        console.log(response)
        document.getElementById("nombre").value = "";
        document.getElementById("tipo_documento").value = "";
        document.getElementById("numero_documento").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("correo").value = "";
        document.getElementById("direccion").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("tipo_donante").value = "";

        donante();
    } catch (error) {
        console.error(error);
    }
}

// ==========================================================================
// ====================== DELETE,DONANTE ====================================
// ==========================================================================

async function eliminar_donante(codigo) {
    try {
        fetch(`${URL_BASE}/eliminar_donante/${codigo}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log("donante eliminado:", data);
            donante();
            return data;
        });
    } catch (error) {
        console.error(error);
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
            <td>${i.descripcion}</td>
            <td> <button onclick="editar_tipo_organizacion(${i.id_tipo_organizacion})">Editar</button> <button onclick="eliminar_tipo_organizacion(${i.id_tipo_organizacion})">Eliminar</button></td>
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
// =================== POST, TIPO ORGANIZACION  ==============================
// ==========================================================================

async function agregar_tipo_organizacion() {
    try {
        const nombre_tipo_organizacion = document.getElementById("nombre").value;
        const descripcion_tipo_organizacion = document.getElementById("descripcion").value;

        const nuevo_tipo_organizacion = {
        "nombre": nombre_tipo_organizacion,
        "descripcion": descripcion_tipo_organizacion
        };

        const promesa = await fetch(`${URL_BASE}/registro_tipo_organizacion`, {
        method: 'POST',
        body: JSON.stringify(nuevo_tipo_organizacion),
        headers: {
            "Content-type": "application/json"
        }
        });

        const response = await promesa.json();
        console.log(response);

        document.getElementById("nombre").value = "";
        document.getElementById("descripcion").value = "";
        tipo_organizacion();

    } catch (error) {
        console.error(error);
    }
    }

// ==========================================================================
// =================== DELETE, TIPO ORGANIZACION ============================
// ==========================================================================

async function eliminar_tipo_organizacion(codigo) {
    try {
        fetch(`${URL_BASE}/eliminar_tipo_organizacion/${codigo}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log("tipo de organizacion eliminado:", data);
            tipo_organizacion();
            return data;
        });
    } catch (error) {
        console.error(error);
    }
}
// =======================================================================
// ===================== LLAMAR TIPO_ORGANIZACION ========================
// =======================================================================
async function llamar_tipo_organizacion() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_organizacion`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("tipo_organizacion");
        select.innerHTML = "";
        response.tipo_organizacion.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.id_tipo_organizacion;
            option.text = `${tipo.id_tipo_organizacion} - ${tipo.nombre}`;

            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de organizacion", error)
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
            <td>
                <button onclick="eliminar_organizacion(${i.codigo})">Eliminar</button>
            </td>
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
        llamar_tipo_organizacion()
        llamar_tipo_entrega()
    }catch(error){
        console.error(error)
    }
}

// ==========================================================================
// ====================   POST, AGREGAR ORGANIZACION   ====================
// ==========================================================================
async function agregar_organizacion() {
    try {
        const descripcion = document.getElementById("descripcion").value;
        const nombre = document.getElementById("nombre").value;
        const responsable = document.getElementById("responsable").value;
        const telefono = document.getElementById("telefono").value;
        const direccion = document.getElementById("direccion").value;
        const tipo_entrega = document.getElementById("tipo_entrega").value;
        const tipo_organizacion = document.getElementById("tipo_organizacion").value;

        const nueva_organizacion = {
            "descripcion": descripcion,
            "nombre": nombre,
            "responsable": responsable,
            "telefono": telefono,
            "direccion": direccion,
            "tipo_entrega": tipo_entrega,
            "tipo_organizacion": tipo_organizacion
        }

        const promesa = await fetch(`${URL_BASE}/registro_organizacion`, {
            method: 'POST',
            body : JSON.stringify(nueva_organizacion),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await promesa.json()
        console.log(response)
        document.getElementById("descripcion").value = "";
        document.getElementById("nombre").value = "";
        document.getElementById("responsable").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("direccion").value = "";
        document.getElementById("tipo_entrega").value = "";
        document.getElementById("tipo_organizacion").value = "";
        
        organizacion();
        

    } catch (error) {
        console.error(error);
    }
}
// ==========================================================================
// =================== DELETE, ORGANIZACION ============================
// ==========================================================================

async function eliminar_organizacion(codigo) {
    try {
        fetch(`${URL_BASE}/eliminar_organizacion/${codigo}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log("organizacion eliminada:", data);
            organizacion();
            return data;
        });
    } catch (error) {
        console.error(error);
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
// ===================  GET, TIPO_ENTREGA  =================================
// ==========================================================================
function mostrar_tipo_entrega(tipo_entrega) {
    let info ="";
    tipo_entrega.tipo_entrega.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_entrega}</td>
            <td>${i.nombre}</td>
            <td>${i.descripcion}</td>
            
            
        </tr>
        `;
    });
    document.getElementById("tbodytipo_entrega").innerHTML = info;
}
async function obtener_tipo_entrega() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_entrega`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_tipo_entrega(response)
    }catch(error){
        console.error(error)
    }
}
// ==========================================================================
// ====================== LLAMAR TIPO_ENTREGA ==============================
// ==========================================================================
async function llamar_tipo_entrega() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_entrega`, {method: 'GET'});
        const response = await promesa.json();
        const select = document.getElementById("tipo_entrega");
        select.innerHTML = "";
        response.tipo_entrega.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.id_tipo_entrega;
            option.dataset.descripcion = tipo.descripcion;
            option.text = `${tipo.nombre}`;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de entrega", error)
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
// ======================   GET, TIPO_DOCUMENTO   ===========================
// ==========================================================================
function mostrartipo_documento(tipo_documento) {
    let info ="";
    tipo_documento.tipo_documento.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_documento}</td>
            <td>${i.nombre}</td>
        </tr>
        `;
    });
    document.getElementById("tbodytipo_documento").innerHTML = info;
}
async function tipo_documento() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_documento`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrartipo_documento(response)
    }catch(error){
        console.error(error)
    }
}
// =======================================================================
// ====================== LLAMAR TIPO_DOCUMENTO ==========================
// =======================================================================
async function llamar_tipo_documento() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_documento`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("tipo_documento");
        select.innerHTML = "";
        response.tipo_documento.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.id_tipo_documento;
            option.text = `${tipo.nombre}`;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de documento", error)
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
            <td><button class="btn btn-danger" onclick="eliminar_usuario(${i.id_usuario})">Eliminar</button></td>
        </tr>
        `
    });
    document.getElementById("tbodyusuario").innerHTML = info;
}
async function usuario() {
    try{
        const promesa = await fetch(`${URL_BASE}/usuarios`, {method : 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_usuario(response)
        llamar_estado()
        llamar_tipo_documento()
        llamar_tipo_usuario()


    }catch(error){
        console.error(error)
    }
}
// ==========================================================================
// ====================   POST, AGREGAR USUARIO   ===========================
// ==========================================================================
async function agregar_usuario() {
    try {
        const nombre_completo = document.getElementById("nombre_completo").value;
        const tipo_documento = document.getElementById("tipo_documento").value;
        const numero_documento = document.getElementById("numero_documento").value;
        const correo = document.getElementById("correo").value;
        const contrasena = document.getElementById("contrasena").value;
        const tipo_usuario = document.getElementById("tipo_usuario").value;
        const estado = document.getElementById("estado").value;

        const nuevo_usuario = {
            "nombre_completo": nombre_completo,
            "tipo_documento": tipo_documento,
            "numero_documento": numero_documento,
            "correo": correo,
            "contrasena": contrasena,
            "tipo_usuario": tipo_usuario,
            "estado": estado
        }

        const promesa = await fetch(`${URL_BASE}/registro_usuarios`, {
            method: 'POST',
            body : JSON.stringify(nuevo_usuario),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const response = await promesa.json()
        console.log(response)
        document.getElementById("nombre_completo").value = "";
        document.getElementById("tipo_documento").value = "";
        document.getElementById("numero_documento").value = "";
        document.getElementById("correo").value = "";
        document.getElementById("contrasena").value = "";
        document.getElementById("tipo_usuario").value = "";
        document.getElementById("estado").value = "";
        usuario();

    } catch (error) {
        console.error(error);
    }
}
// ==========================================================================
// ====================== DELETE, USUARIO ==================================
// ==========================================================================
async function eliminar_usuario(codigo) {
    try {
        fetch(`${URL_BASE}/eliminar_usuarios/${codigo}`, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            console.log("usuario eliminado:", data);
            usuario();
            return data;
        });
    } catch (error) {
        console.error(error);
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
// =================== MOSTRAR CONTRASEÑA ===================================
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("contrasena");
    const toggle = document.getElementById("togglePassword");
    const icon = document.getElementById("iconoOjo");

    if (input && toggle && icon) {
        toggle.addEventListener("click", () => {
            const mostrar = input.type === "password";
            input.type = mostrar ? "text" : "password";
            icon.classList.toggle("bi-eye");
            icon.classList.toggle("bi-eye-slash");
        });
    }
});
// ==========================================================================
// =================== GET, TIPO_USUARIO ===================================
// ==========================================================================
function mostrar_tipo_usuario(tipo_usuario) {
    let info ="";
    tipo_usuario.forEach(i => {
        info +=`
        <tr>
            <td>${i.id_tipo_usuario}</td>
            <td>${i.descripcion}</td>
        </tr>
        `;
    });
    document.getElementById("tbodytipo_usuario").innerHTML = info;
}
async function tipo_usuario() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_usuario`, {method : 'GET'});
        const response = await promesa.json();
        mostrar_tipo_usuario(response);
    }catch(error){
        console.error(error);
    }
}
// =======================================================================
// ====================== LLAMAR TIPO USUARIO ============================
// =======================================================================
async function llamar_tipo_usuario() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_usuario`, {method: 'GET'});
        const response = await promesa.json()

        const select = document.getElementById("tipo_usuario");
        select.innerHTML = "";
        response.tipo_usuario.forEach(tipo =>  {
            const option = document.createElement("option")
            option.value = tipo.id_tipo_usuario;
            option.text = `${tipo.descripcion}`;
            select.appendChild(option)
        })
    } catch (error) {
        console.error("Error al cargar el tipo de usuario", error)
    }
}
// ==========================================================================
// ===================  GET, TIPO_DONACION  =================================
// ==========================================================================
function mostrar_tipo_donacion(tipo_donacion) {
    let info ="";
    tipo_donacion.tipo_donacion.forEach(i => {
        info +=`
        <tr>
            <td>${i.codigo}</td>
            <td>${i.descripcion}</td>
            <td></td>
            
        </tr>
        `;
    });
    document.getElementById("tbodytipo_entrega").innerHTML = info;
}
async function obtener_tipo_entrega() {
    try{
        const promesa = await fetch(`${URL_BASE}/tipo_entrega`, {method: 'GET'});
        const response = await promesa.json();
        console.log(response)
        mostrar_tipo_entrega(response)
    }catch(error){
        console.error(error)
    }
}
// ==========================================================================
// ===================== LLAMAR TIPO_DONACION  ===========================
// ==========================================================================
async function llamar_tipo_donacion() {
    try {
        const promesa = await fetch(`${URL_BASE}/tipo_donacion`, { method: 'GET' });
        const response = await promesa.json();


        const select = document.getElementById("tipo_donacion");
        select.innerHTML = "<option value=''>Seleccione un tipo de donación</option>";

        response.tipo_donacion.forEach(tipo => {
            const option = document.createElement("option");
            option.value = tipo.codigo;
            option.text = `${tipo.descripcion}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar tipos de donación:", error);
    }
}
// ==========================================================================
// ===================== LLAMAR ORGANIZACION  ===========================
// ==========================================================================
async function llamar_organizacion() {
    try {
        const promesa = await fetch(`${URL_BASE}/organizacion`, { method: 'GET' });
        const response = await promesa.json();


        const select = document.getElementById("organizacion");
        select.innerHTML = "<option value=''>Seleccione una organización</option>";

        response.organizacion.forEach(tipo => {
            const option = document.createElement("option");
            option.value = tipo.codigo;
            option.text = `${tipo.nombre}`;

            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar organizaciones:", error);
    }
}

// ==========================================================================
// ========================= LLAMAR BODEGA  =================================
// ==========================================================================
async function llamar_bodega() {
    try {
        const promesa = await fetch(`${URL_BASE}/bodega`, { method: 'GET' });
        const response = await promesa.json();

        const select = document.getElementById("bodega");
        select.innerHTML = "<option value=''>Seleccione una bodega</option>";
        response.bodega.forEach(tipo => {
            const option = document.createElement("option");
            option.value = tipo.id_bodega;
            option.text = `${tipo.nombre_bodega}`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las bodegas:", error);
    }
}

// ============================================================
// ========== GET, DONACIÓN DE PRODUCTOS ===========
// ============================================================

function mostrar_donacion(donacion) {
    let info = "";
    donacion.forEach((i) => {
    info += `
        <tr>
            <td>${i.id}</td>
            <td>${i.id_donacion}</td>
            <td>${i.id_producto}</td>
            <td>${i.donante}</td>
            <td>${i.fecha}</td>
            <td>${i.observaciones}</td>
            <td>${i.usuario}</td>
            <td>${i.tipo_donacion}</td>
            <td>
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminar_donacion(${i.id_donacion})"> <i class="bi bi-trash-fill"></i> Eliminar </button>
            </td>
        </tr>
        `;
    });
    document.getElementById("tbodydonacion").innerHTML = info;
}

async function donacion() {
    try {
        const promesa = await fetch(`${URL_BASE}/detalle_donacion_producto`, {
          method: "GET",
        });
        const response = await promesa.json();
        console.log(response);
        mostrar_donacion(response);
    } catch (error) {
        console.error("Error al obtener donaciones:", error);
    }
}
