//mira este codigo lo unico que toca hacerle es, que convierte ese array, a un objeto pero no meuvas mas nada, porque ahora si me esta mostrandos los demas producto que ya tenia guardado, solo que undifined
// ==============================
// CONFIGURACIÓN INICIAL
// ==============================
let productos = [];
let categorias = [];
let subcategorias = [];
let unidades = [];
let editandoProducto = null;

const formProducto = document.getElementById('formProducto');
const tablaProductos = document.getElementById('tablaProductos').querySelector('tbody');

const API_PRODUCTOS = '/api/productos';
const API_CATEGORIAS = '/api/categorias';
const API_SUBCATEGORIAS = '/api/subcategorias';
const API_UNIDADES = '/api/unidades';

// ==============================
// FUNCIÓN DE SIMILITUD
// ==============================
function es_similar(a, b) {
    // Comparación simple case-insensitive
    return a.toLowerCase() === b.toLowerCase() ||
        a.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(a.toLowerCase());
}

// ==============================
// CARGAR CATEGORÍAS Y SUBCATEGORÍAS
// ==============================
async function cargarCategoriasYSubcategorias() {
    try {
        const resCat = await fetch(API_CATEGORIAS);
        categorias = await resCat.json();

        const selectCrear = document.getElementById('categoriaSelect');
        const selectModalCat = document.getElementById('categoriaProductoModal');

        selectCrear.innerHTML = '<option value="">Selecciona una categoría</option>';
        selectModalCat.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach(cat => {
            selectCrear.innerHTML += `<option value="${cat[0]}">${cat[1]}</option>`;
            selectModalCat.innerHTML += `<option value="${cat[0]}">${cat[1]}</option>`;
        });

        // Evento formulario crear producto
        selectCrear.addEventListener('change', async () => {
            const id_categoria = selectCrear.value;
            const selectSub = document.getElementById('subcategoriaSelect');
            selectSub.innerHTML = '';

            if (!id_categoria) {
                selectSub.innerHTML = '<option value="">Selecciona una categoría primero</option>';
                selectSub.disabled = true;
                return;
            }

            const resSub = await fetch(API_SUBCATEGORIAS);
            const todasSub = await resSub.json();
            const subRelacionadas = todasSub.filter(sub => sub[3].toString() === id_categoria.toString());

            if (subRelacionadas.length > 0) {
                subRelacionadas.forEach(sub => {
                    selectSub.innerHTML += `<option value="${sub[0]}">${sub[1]}</option>`;
                });
                selectSub.disabled = false;
            } else {
                selectSub.innerHTML = '<option value="">No hay subcategorías</option>';
                selectSub.disabled = true;
            }
        });

        // Evento modal editar producto
        selectModalCat.addEventListener('change', async () => {
            const id_categoria = selectModalCat.value;
            const selectSubModal = document.getElementById('subcategoriaProductoModal');
            selectSubModal.innerHTML = '';

            if (!id_categoria) {
                selectSubModal.innerHTML = '<option value="">Selecciona una categoría primero</option>';
                selectSubModal.disabled = true;
                return;
            }

            const resSub = await fetch(API_SUBCATEGORIAS);
            const todasSub = await resSub.json();
            const subRelacionadas = todasSub.filter(sub => sub[3].toString() === id_categoria.toString());

            if (subRelacionadas.length > 0) {
                subRelacionadas.forEach(sub => {
                    selectSubModal.innerHTML += `<option value="${sub[0]}">${sub[1]}</option>`;
                });
                selectSubModal.disabled = false;
            } else {
                selectSubModal.innerHTML = '<option value="">No hay subcategorías</option>';
                selectSubModal.disabled = true;
            }
        });

    } catch (error) {
        console.error('Error cargando categorías y subcategorías:', error);
        swal("Error", "No se pudieron cargar las categorías y subcategorías", "error");
    }
}


// ==============================
// CARGAR UNIDADES DE MEDIDA
// ==============================
async function cargarUnidades() {
    try {
        const response = await fetch('/api/unidades');
        if (!response.ok) throw new Error("Error al obtener unidades");

        unidades = await response.json();

        // Select de crear producto
        const selectUnidad = document.getElementById('selectUnidad');
        selectUnidad.innerHTML = `<option value="">Seleccione unidad</option>`;
        unidades.forEach(unidad => {
            selectUnidad.innerHTML += `<option value="${unidad[0]}">${unidad[1]}</option>`;
        });

        // Select del modal
        const selectUnidadModal = document.getElementById('selectUnidadModal');
        selectUnidadModal.innerHTML = `<option value="">Seleccione unidad</option>`;
        unidades.forEach(unidad => {
            selectUnidadModal.innerHTML += `<option value="${unidad[0]}">${unidad[1]}</option>`;
        });

        console.log("Unidades cargadas correctamente");
    } catch (error) {
        console.error("Error cargarUnidades:", error);
    }
}

// ==============================
// CARGAR PRODUCTOS
// ==============================
async function cargarProductos() {
    try {
        const res = await fetch(API_PRODUCTOS);
        const data = await res.json();

        console.log('Respuesta cruda del backend:', data);
        console.log("👉 DATA RAW PRODUCTOS:", data);
        data.forEach((p, i) => console.log(`Fila ${i}:`, p));
        // Si data es [ [4, 'pera', 100, ...] ], hacemos:

        // Si quieres que cada producto sea un objeto con propiedades más claras:
        productos = data.map(p => {
    return {
        id_producto: p[0],
        nombre: p[1],
        stock_minimo: p[2],
        id_unidad: p[3], // ✅ esto es clave
        descripcion: p[4],
        id_categoria: p[5],
        id_subcategoria: p[6],
        categoria: p[7],
        subcategoria: p[8],
        unidad_medida: (unidades.find(u => u[0] == p[3])?.[1]) || "" // ✅ aquí obtenemos el nombre real
    };
});
        console.log('Productos procesados:', productos);

        const tabla = document.querySelector("#tablaProductos tbody");
        tabla.innerHTML = '';
        productos.forEach(prod => {
            const fila = `
                <tr>
                    <td>${prod.id_producto}</td>
                    <td>${prod.nombre}</td>
                    <td>${prod.stock_minimo}</td>
                    <td>${prod.unidad_medida}</td>
                    <td>${prod.descripcion}</td>
                    <td>
                        <button class="btn btn-sm btn-success me-2" onclick="abrirModalEditarProducto(${prod.id_producto})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${prod.id_producto})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
            tabla.insertAdjacentHTML("beforeend", fila);
        });

    } catch (error) {
        console.error('Error cargando productos:', error);
        swal("Error", "No se pudieron cargar los productos", "error");
    }
}


// ==============================
// BUSCADOR DE PRODUCTOS
// ==============================
const buscadorProductos = document.getElementById('buscadorProductos');
buscadorProductos.addEventListener('input', () => {
    const texto = buscadorProductos.value.toLowerCase();

    Array.from(tablaProductos.rows).forEach(row => {
        const nombre = row.querySelector('.col-nombre').textContent.toLowerCase();
        const descripcion = row.querySelector('.col-descripcion').textContent.toLowerCase();
        row.style.display = (nombre.includes(texto) || descripcion.includes(texto)) ? '' : 'none';
    });
});

// ==============================
// AGREGAR FILA DE PRODUCTO A LA TABLA
// ==============================
function agregarFilaProducto(prod) {
    const row = document.createElement('tr');
    row.dataset.id = prod.id_producto;
    //row.dataset.id = prod[0]; 
    row.innerHTML = `
        <td class="col-id">${prod[0]}</td>
        <td class="col-nombre">${prod[1]}</td>
        <td class="col-stock">${prod[2]}</td>
        <td class="col-unidad">${prod[3]}</td>
        <td class="col-descripcion">${prod[4]}</td>
        <td>
            <button class="btn btn-sm btn-success me-2" onclick="abrirModalEditarProducto(${prod[0]})">
                <i class="bi bi-pencil-fill"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${prod[0]})">
                <i class="bi bi-trash-fill"></i>
            </button>
        </td>
    `;
    tablaProductos.appendChild(row);
}

// ==============================
// CREAR PRODUCTO
// ==============================
formProducto.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('productoSelect').value.trim();
    const id_categoria = document.getElementById('categoriaSelect').value;
    const id_subcategoria = document.getElementById('subcategoriaSelect').value;
    const stock_minimo = document.getElementById('cantidadProducto').value;
    const id_unidad = document.querySelector('#formProducto select:nth-of-type(2)').value;
    const descripcion = document.getElementById('descripcionProducto').value.trim();

    if (!nombre || !id_categoria || !id_subcategoria || !stock_minimo || !id_unidad) {
        swal("Error", "Todos los campos son obligatorios", "error");
        return;
    }

    if (productos.some(p => es_similar(p.nombre, nombre))) {
        swal("Error", "Ya existe un producto con nombre similar", "error");
        return;
    }

    try {
        const res = await fetch(API_PRODUCTOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, id_categoria, id_subcategoria, stock_minimo, id_unidad, descripcion })
        });
        const data = await res.json();

        if (res.ok && data.success) {
            productos.push(data.producto);
            agregarFilaProducto(data.producto);
            formProducto.reset();
            swal("Éxito", "Producto creado correctamente", "success");
        } else {
            swal("Error", data.message || "No se pudo crear el producto", "error");
        }
    } catch (error) {
        console.error('Error creando producto:', error);
        swal("Error", "No se pudo crear el producto", "error");
    }
});

// ==============================
// ABRIR MODAL EDITAR PRODUCTO
// ==============================
async function abrirModalEditarProducto(id) {
    try {
        //const prod = productos.find(p => p.id_producto == id);
        const producto = productos.find(p => p.id_producto === id);

        if (!producto) {
            console.error("Producto no encontrado:", id);
            swal("Error", "No se pudo cargar el producto", "error");

            return;
        }

        document.getElementById('idProductoModal').value = producto.id_producto;
        document.getElementById('nombreProductoModal').value = producto.nombre;
        document.getElementById('nombreStockModal').value = producto.stock_minimo;
        document.getElementById('descripcionProductoModal').value = producto.descripcion;
        document.getElementById('categoriaProductoModal').value = producto.id_categoria;
        document.getElementById('selectUnidadModal').value = producto.id_unidad;


        const event = new Event('change');
        document.getElementById('categoriaProductoModal').dispatchEvent(event);

        setTimeout(() => {
            document.getElementById('subcategoriaProductoModal').value = producto.id_subcategoria;
        }, 100);

        editandoProducto = Array.from(tablaProductos.rows).find(
            row => row.children[0].textContent == id
        );

        await cargarUnidades(); // Asegura que las unidades estén cargadas
        document.getElementById('selectUnidadModal').value = producto.id_unidad;

        const modal = new bootstrap.Modal(document.getElementById('modalActualizarProducto'));
        modal.show();

    } catch (error) {
        console.error('Error cargando producto:', error);
        swal("Error", "No se pudo cargar el producto", "error");
    }
}

// ==============================
// ACTUALIZAR PRODUCTO
// ==============================
document.getElementById('formActualizarProducto').addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('idProductoModal').value;
    const nombre = document.getElementById('nombreProductoModal').value.trim();
    const id_categoria = document.getElementById('categoriaProductoModal').value;
    const id_subcategoria = document.getElementById('subcategoriaProductoModal').value;
    const stock_minimo = document.getElementById('nombreStockModal').value;
    const descripcion = document.getElementById('descripcionProductoModal').value.trim();
    const id_unidad = document.querySelector('#formActualizarProducto select').value;

    if (!nombre || !id_categoria || !id_subcategoria || !stock_minimo || !id_unidad) {
        swal("Error", "Todos los campos son obligatorios", "error");
        return;
    }

    if (productos.some(p => p.id_producto != id && es_similar(p.nombre, nombre))) {
        swal("Error", "Ya existe un producto con nombre similar", "error");
        return;
    }

    try {
        const res = await fetch(`${API_PRODUCTOS}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, id_categoria, id_subcategoria, stock_minimo, id_unidad, descripcion })
        });
        const data = await res.json();
        console.log("🔎 RESPUESTA BACKEND PUT:", data);
const unidad = unidades.find(u => u[0] == data.producto.id_unidad)?.[1] || "Sin unidad";

        if (res.ok ) {
            editandoProducto.querySelector('.col-nombre').textContent = data.producto.nombre;
            editandoProducto.querySelector('.col-stock').textContent = data.producto.stock_minimo;
            editandoProducto.querySelector('.col-unidad').textContent = unidad;
            editandoProducto.querySelector('.col-descripcion').textContent = data.producto.descripcion;

            const index = productos.findIndex(p => p.id_producto == id);
            productos[index] = { ...data.producto, unidad_medida: unidad };

            swal("Éxito", "Producto actualizado correctamente", "success");
            cargarProductos();
        } else {
            swal("Error", data.message || "No se pudo actualizar el producto", "error");
        }
    } catch (error) {
        console.error('Error actualizando producto:', error);
        swal("Error", "No se pudo actualizar el producto", "error");
    }
});

// ==============================
// ELIMINAR PRODUCTO
// ==============================
async function eliminarProducto(id) {
    const confirmar = await swal({
        title: "¿Estás seguro?",
        text: "Una vez eliminado, no podrás recuperarlo",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    });

    if (!confirmar) return;

    try {
        const res = await fetch(`${API_PRODUCTOS}/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (res.ok && data.success) {
            const fila = document.querySelector(`tr[data-id="${id}"]`);
            if (fila) fila.remove();
            //fila.remove();
            //document.querySelector(`tr[data-id="${id}"]`).remove();

            productos = productos.filter(p => p.id_producto != id);

            swal("Éxito", "Producto eliminado correctamente", "success");
            cargarProductos();
        } else {
            swal("Error", data.message || "No se pudo eliminar el producto", "error");
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        swal("Error", "No se pudo eliminar el producto", "error");
    }
}

// ==============================
// INICIALIZACIÓN
// ==============================
document.addEventListener('DOMContentLoaded', () => {
    cargarCategoriasYSubcategorias();
    cargarUnidades();   // 👈 SE ESPERA
    cargarProductos();  // 👈 AHORA SÍ UNIDADES ESTÁ LISTO
});
