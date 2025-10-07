const URL_BASE = "http://127.0.0.1:5000";

// -----------------------------
// Helpers genéricos para Fetch
// -----------------------------
function authHeaders() {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

async function apiGet(path) {
    try {
        const res = await fetch(`${URL_BASE}${path}`, { method: "GET", headers: authHeaders() });
        return await res.json();
    } catch (err) {
    console.error("GET error", path, err);
    throw err;
}
}

async function apiPost(path, body) {
    try {
        const res = await fetch(`${URL_BASE}${path}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
    return await res.json();
    } catch (err) {
    console.error("POST error", path, err);
    throw err;
}
}

async function apiPut(path, body) {
    try {
    const res = await fetch(`${URL_BASE}${path}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
    });
    return await res.json();
} catch (err) {
    console.error("PUT error", path, err);
    throw err;
}
}

async function apiDelete(path) {
try {
    const res = await fetch(`${URL_BASE}${path}`, {
    method: "DELETE",
    headers: authHeaders(),
    });
    return await res.json();
} catch (err) {
    console.error("DELETE error", path, err);
    throw err;
}
}

// -----------------------------
// UI helpers
// -----------------------------
function showToast(message, isError = false) {
  // Simple fallback: console + alert. Replace by Bootstrap toast if you want.
console[isError ? "error" : "log"](message);
try {
    // if Bootstrap toast area exists you can implement better UI
    alert(message);
} catch (e) {}
}

// Utility: find item by id from a list response (when no single-GET endpoint exists)
function findInList(listKey, idKey, response, id) {
if (!response || !response[listKey]) return null;
return response[listKey].find((x) => String(x[idKey]) === String(id)) || null;
}

// -----------------------------
// --- UNIDAD DE MEDIDA -------
// -----------------------------
async function listarUnidadMedida() {
try {
    const data = await apiGet("/unidad_de_medida");
    // espera: response.unidad_de_medida array con {codigo, nombre, cantidad}
    let html = "";
    (data.unidad_de_medida || []).forEach((u) => {
    html += `
        <tr>
        <td>${u.codigo}</td>
        <td>${u.nombre}</td>
        <td>${u.cantidad ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarUnidad(${u.codigo})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarUnidad(${u.codigo})">Eliminar</button>
        </td>
        </tr>
    `;
    });
    const tbody = document.getElementById("tbodyunidad_de_medida");
    if (tbody) tbody.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarUnidadMedidaFromForm() {
  // espera inputs: id="unidad_nombre" id="unidad_cantidad"
try {
    const nombre = document.getElementById("unidad_nombre").value;
    const cantidad = parseInt(document.getElementById("unidad_cantidad").value || 0);
    if (!nombre) return showToast("Nombre es obligatorio", true);
    await apiPost("/registro_unidad_de_medida", { nombre, cantidad });
    showToast("Unidad de medida creada");
    document.getElementById("unidad_nombre").value = "";
    document.getElementById("unidad_cantidad").value = "";
    listarUnidadMedida();
    llamar_unidad_medida();
} catch (e) {
    showToast("Error agregando unidad", true);
}
}

async function eliminarUnidad(codigo) {
try {
    if (!confirm("¿Eliminar unidad de medida?")) return;
    await apiDelete(`/eliminar_unidad_de_medida/${codigo}`);
    showToast("Unidad eliminada");
    listarUnidadMedida();
    llamar_unidad_medida();
} catch (e) {
    showToast("Error eliminando unidad", true);
}
}

/* Editar unidad: abrimos modal o formulario y luego actualizamos */
async function abrirEditarUnidad(codigo) {
try {
    // no hay GET /unidad/:id, así que listamos y buscamos
    const resp = await apiGet("/unidad_de_medida");
    const u = findInList("unidad_de_medida", "codigo", resp, codigo);
    if (!u) return showToast("Unidad no encontrada", true);

    // Rellenar campos de edición (se asume inputs con estos ids)
    document.getElementById("edit_unidad_codigo").value = u.codigo;
    document.getElementById("edit_unidad_nombre").value = u.nombre;
    document.getElementById("edit_unidad_cantidad").value = u.cantidad ?? "";

    // abrir modal bootstrap si existe
    const modalEl = document.getElementById("modalEditarUnidad");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarUnidadFromForm() {
try {
    const codigo = document.getElementById("edit_unidad_codigo").value;
    const nombre = document.getElementById("edit_unidad_nombre").value;
    const cantidad = parseInt(document.getElementById("edit_unidad_cantidad").value || 0);
    if (!codigo) return showToast("Código falta", true);
    await apiPut(`/actualizar_unidad_de_medida/${codigo}`, { nombre, cantidad });
    showToast("Unidad actualizada");
    listarUnidadMedida();
    llamar_unidad_medida();
    const modalEl = document.getElementById("modalEditarUnidad");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando unidad", true);
}
}

// -----------------------------
// --- CATEGORIA PRODUCTO ------
// -----------------------------
async function listarCategoriaProducto() {
try {
    const resp = await apiGet("/categoria_producto");
    let html = "";
    (resp.categoria_producto || []).forEach((c) => {
    html += `
        <tr>
        <td>${c.codigo}</td>
        <td>${c.descripcion}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarCategoria(${c.codigo})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCategoria(${c.codigo})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodycategoria_producto");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarCategoriaFromForm() {
try {
    const nombre = document.getElementById("nombreCategoria").value;
    if (!nombre) return showToast("Nombre de categoría obligatorio", true);
    await apiPost("/registro_categoria_producto", { descripcion: nombre });
    showToast("Categoría creada");
    document.getElementById("nombreCategoria").value = "";
    listarCategoriaProducto();
    llamar_categoria(); // refrescar selects
} catch (e) {
    showToast("Error creando categoría", true);
}
}

async function eliminarCategoria(codigo) {
try {
    if (!confirm("¿Eliminar categoría?")) return;
    await apiDelete(`/eliminar_categoria_producto/${codigo}`);
    showToast("Categoría eliminada");
    listarCategoriaProducto();
    llamar_categoria();
} catch (e) {
    showToast("Error eliminando categoría", true);
}
}

async function abrirEditarCategoria(codigo) {
try {
    const resp = await apiGet("/categoria_producto");
    const item = findInList("categoria_producto", "codigo", resp, codigo);
    if (!item) return showToast("Categoría no encontrada", true);
    document.getElementById("edit_categoria_codigo").value = item.codigo;
    document.getElementById("edit_categoria_descripcion").value = item.descripcion;
    const modalEl = document.getElementById("modalEditarCategoria");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarCategoriaFromForm() {
try {
    const codigo = document.getElementById("edit_categoria_codigo").value;
    const descripcion = document.getElementById("edit_categoria_descripcion").value;
    if (!codigo) return showToast("Código faltante", true);
    await apiPut(`/actualizar_categoria_producto/${codigo}`, { descripcion });
    showToast("Categoría actualizada");
    listarCategoriaProducto();
    llamar_categoria();
    const modalEl = document.getElementById("modalEditarCategoria");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando categoría", true);
}
}

// -----------------------------
// --- SUBCATEGORIA PRODUCTO ---
// -----------------------------
async function listarSubcategoriaProducto() {
try {
    const resp = await apiGet("/subcategoria_producto");
    let html = "";
    (resp.subcategoria_producto || []).forEach((s) => {
    html += `
        <tr>
        <td>${s.codigo}</td>
        <td>${s.descripcion}</td>
        <td>${s.categoria_producto}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarSubcategoria(${s.codigo})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarSubcategoria(${s.codigo})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodysubcategoria_producto");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarSubcategoriaFromForm() {
try {
    const nombre = document.getElementById("nombreSubcategoria").value;
    const categoria = document.getElementById("categoria").value;
    if (!nombre || !categoria) return showToast("Nombre y categoría obligatorios", true);
    await apiPost("/registro_subcategoria_producto", { descripcion: nombre, categoria_producto: categoria });
    showToast("Subcategoría creada");
    document.getElementById("nombreSubcategoria").value = "";
    listarSubcategoriaProducto();
    llamar_subcategoria();
} catch (e) {
    showToast("Error creando subcategoría", true);
}
}

async function eliminarSubcategoria(codigo) {
try {
    if (!confirm("¿Eliminar subcategoría?")) return;
    await apiDelete(`/eliminar_subcategoria_producto/${codigo}`);
    showToast("Subcategoría eliminada");
    listarSubcategoriaProducto();
    llamar_subcategoria();
} catch (e) {
    showToast("Error eliminando subcategoría", true);
}
}

async function abrirEditarSubcategoria(codigo) {
try {
    const resp = await apiGet("/subcategoria_producto");
    const s = findInList("subcategoria_producto", "codigo", resp, codigo);
    if (!s) return showToast("Subcategoría no encontrada", true);
    document.getElementById("edit_subcategoria_codigo").value = s.codigo;
    document.getElementById("edit_subcategoria_descripcion").value = s.descripcion;
    document.getElementById("edit_subcategoria_categoria").value = s.categoria_producto;
    const modalEl = document.getElementById("modalEditarSubcategoria");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarSubcategoriaFromForm() {
try {
    const codigo = document.getElementById("edit_subcategoria_codigo").value;
    const descripcion = document.getElementById("edit_subcategoria_descripcion").value;
    const categoria_producto = document.getElementById("edit_subcategoria_categoria").value;
    if (!codigo) return showToast("Código faltante", true);
    await apiPut(`/actualizar_subcategoria_producto/${codigo}`, { descripcion, categoria_producto });
    showToast("Subcategoría actualizada");
    listarSubcategoriaProducto();
    llamar_subcategoria();
    const modalEl = document.getElementById("modalEditarSubcategoria");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando subcategoría", true);
}
}

// -----------------------------
// --- BODEGA ------------------
// -----------------------------
async function listarBodega() {
try {
    const resp = await apiGet("/bodega");
    let html = "";
    (resp.bodega || []).forEach((b) => {
    html += `
        <tr>
        <td>${b.id_bodega}</td>
        <td>${b.nombre_bodega}</td>
        <td>${b.ubicacion ?? ""}</td>
        <td>${b.capacidad ?? ""}</td>
        <td>${b.estado ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarBodega(${b.id_bodega})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarBodega(${b.id_bodega})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodybodega");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarBodegaFromForm() {
try {
    const nombre = document.getElementById("bodega").value;
    const ubicacion = document.getElementById("direccion").value;
    const capacidad = document.getElementById("capacidad").value;
    const estado = document.getElementById("estado").value;
    if (!nombre) return showToast("Nombre de bodega obligatorio", true);
    await apiPost("/registro_bodega", { nombre_bodega: nombre, capacidad, estado });
    showToast("Bodega creada");
    document.getElementById("bodega").value = "";
    document.getElementById("direccion").value = "";
    document.getElementById("capacidad").value = "";
    document.getElementById("estado").value = "";
    listarBodega();
} catch (e) {
    showToast("Error creando bodega", true);
}
}

async function eliminarBodega(codigo) {
try {
    if (!confirm("¿Eliminar bodega?")) return;
    await apiDelete(`/eliminar_bodega/${codigo}`);
    showToast("Bodega eliminada");
    listarBodega();
} catch (e) {
    showToast("Error eliminando bodega", true);
}
}

async function abrirEditarBodega(codigo) {
try {
    const resp = await apiGet("/bodega");
    const b = findInList("bodega", "id_bodega", resp, codigo);
    if (!b) return showToast("Bodega no encontrada", true);
    document.getElementById("edit_bodega_codigo").value = b.id_bodega;
    document.getElementById("edit_bodega_nombre").value = b.nombre_bodega;
    document.getElementById("edit_bodega_direccion").value = b.ubicacion || "";
    document.getElementById("edit_bodega_capacidad").value = b.capacidad || "";
    document.getElementById("edit_bodega_estado").value = b.estado || "";
    const modalEl = document.getElementById("modalEditarBodega");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarBodegaFromForm() {
try {
    const codigo = document.getElementById("edit_bodega_codigo").value;
    const nombre_bodega = document.getElementById("edit_bodega_nombre").value;
    const ubicacion = document.getElementById("edit_bodega_direccion").value;
    const capacidad = document.getElementById("edit_bodega_capacidad").value;
    const estado = document.getElementById("edit_bodega_estado").value;
    if (!codigo) return showToast("Código faltante", true);
    await apiPut(`/actualizar_bodega/${codigo}`, { nombre_bodega, capacidad, estado });
    showToast("Bodega actualizada");
    listarBodega();
    const modalEl = document.getElementById("modalEditarBodega");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando bodega", true);
}
}

// -----------------------------
// --- MOVIMIENTO PRODUCTO -----
// -----------------------------
async function listarMovimientoProducto() {
try {
    const resp = await apiGet("/movimiento_producto");
    let html = "";
    (resp.movimiento_producto || []).forEach((m) => {
        html += `
        <tr>
        <td>${m.id}</td>
        <td>${m.movimiento ?? ""}</td>
        <td>${m.cantidad ?? ""}</td>
        <td>${m.observacion ?? ""}</td>
        <td>${m.tipo_donacion ?? ""}</td>
        <td>${m.organizacion ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarMovimiento(${m.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarMovimiento(${m.id})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodyMovimientos");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarMovimientoFromForm() {
try {
    const movimiento = document.getElementById("movimiento_tipo").value;
    const cantidad = parseInt(document.getElementById("movimiento_cantidad").value || 0);
    const observacion = document.getElementById("movimiento_observacion").value;
    const tipo_donacion = document.getElementById("movimiento_tipo_donacion").value;
    const organizacion = document.getElementById("movimiento_organizacion").value;
    const tipo_organizacion = document.getElementById("movimiento_tipo_organizacion").value;
    const tipo_entrega = document.getElementById("movimiento_tipo_entrega").value;

    await apiPost("/registro_movimiento_producto", {
    movimiento, cantidad, observacion, tipo_donacion, organizacion, tipo_organizacion, tipo_entrega,
    });
    showToast("Movimiento registrado");
    listarMovimientoProducto();
} catch (e) {
    showToast("Error registrando movimiento", true);
}
}

async function eliminarMovimiento(codigo) {
try {
    if (!confirm("¿Eliminar movimiento?")) return;
    await apiDelete(`/eliminar_movimiento_producto/${codigo}`);
    showToast("Movimiento eliminado");
    listarMovimientoProducto();
} catch (e) {
    showToast("Error eliminando movimiento", true);
}
}

async function abrirEditarMovimiento(codigo) {
try {
    const resp = await apiGet("/movimiento_producto");
    const m = findInList("movimiento_producto", "id", resp, codigo);
    if (!m) return showToast("Movimiento no encontrado", true);
    document.getElementById("edit_movimiento_id").value = m.id;
    document.getElementById("edit_movimiento_tipo").value = m.movimiento || "";
    document.getElementById("edit_movimiento_cantidad").value = m.cantidad || "";
    document.getElementById("edit_movimiento_observacion").value = m.observacion || "";
    document.getElementById("edit_movimiento_tipo_donacion").value = m.tipo_donacion || "";
    document.getElementById("edit_movimiento_organizacion").value = m.organizacion || "";
    document.getElementById("edit_movimiento_tipo_organizacion").value = m.tipo_organizacion || "";
    document.getElementById("edit_movimiento_tipo_entrega").value = m.tipo_entrega || "";

    const modalEl = document.getElementById("modalEditarMovimiento");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarMovimientoFromForm() {
try {
    const id = document.getElementById("edit_movimiento_id").value;
    const movimiento = document.getElementById("edit_movimiento_tipo").value;
    const cantidad = parseInt(document.getElementById("edit_movimiento_cantidad").value || 0);
    const observacion = document.getElementById("edit_movimiento_observacion").value;
    const tipo_donacion = document.getElementById("edit_movimiento_tipo_donacion").value;
    const organizacion = document.getElementById("edit_movimiento_organizacion").value;
    const tipo_organizacion = document.getElementById("edit_movimiento_tipo_organizacion").value;
    const tipo_entrega = document.getElementById("edit_movimiento_tipo_entrega").value;
    if (!id) return showToast("ID faltante", true);
    await apiPut(`/actualizar_movimiento_producto/${id}`, { movimiento, cantidad, observacion, tipo_donacion, organizacion, tipo_organizacion, tipo_entrega });
    showToast("Movimiento actualizado");
    listarMovimientoProducto();
    const modalEl = document.getElementById("modalEditarMovimiento");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando movimiento", true);
}
}

// -----------------------------
// --- PRODUCTO ---------------
// -----------------------------
async function listarProducto() {
try {
    const resp = await apiGet("/producto");
    // OBS: en tu backend devolvías 'movimiento_producto' por error en la última parte; aquí asumimos
    // resp.producto (si tu backend responde distinto, ajústalo).
    const list = resp.producto || resp.movimiento_producto || [];
    let html = "";
    list.forEach((p) => {
    html += `
        <tr>
        <td>${p.id_producto}</td>
        <td>${p.nombre}</td>
        <td>${p.descripcion}</td>
        <td>${p.cantidad}</td>
        <td>${p.codigo_barras ?? ""}</td>
        <td>${p.stock ?? ""}</td>
        <td>${p.stock_maximo ?? ""}</td>
        <td>${p.stock_minimo ?? ""}</td>
        <td>${p.categoria_producto ?? ""}</td>
        <td>${p.subcategoria_producto ?? ""}</td>
        <td>${p.estado ?? ""}</td>
        <td>${p.unidad_de_medida ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarProducto(${p.id_producto})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id_producto})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodyproducto");
    if (el) el.innerHTML = html;

    // refrescar selects dependientes
    llamar_categoria();
    llamar_subcategoria();
    llamar_unidad_medida();
    llamar_estado();
} catch (e) {
    console.error(e);
}
}

async function agregarProductoFromForm() {
try {
    const nombre = document.getElementById("producto").value;
    const descripcion = document.getElementById("descripcion").value;
    const cantidad = parseInt(document.getElementById("cantidad").value || 0);
    const codigo_barras = document.getElementById("codigo_barras").value;
    const stock_maximo = document.getElementById("stock_maximo").value;
    const stock_minimo = document.getElementById("stock_minimo").value;
    const categoria_producto = document.getElementById("categoria").value;
    const subcategoria_producto = document.getElementById("subcategoria").value;
    const estado = document.getElementById("estado").value;
    const unidad_de_medida = document.getElementById("unidad_medida").value;

    if (!nombre) return showToast("Nombre producto obligatorio", true);
    await apiPost("/registro_producto", {
        nombre,
        descripcion,
        cantidad,
        codigo_barras,
        stock: cantidad,
        stock_maximo,
        stock_minimo,
        categoria_producto,
        subcategoria_producto,
        estado,
        unidad_de_medida
    });
    showToast("Producto creado");
    // limpiar (ajusta ids según tu HTML)
    ["producto","descripcion","cantidad","codigo_barras","stock_maximo","stock_minimo","categoria","subcategoria","estado","unidad_medida"].forEach(id => {
    const e = document.getElementById(id); if (e) e.value = "";
    });
    listarProducto();
} catch (e) {
    showToast("Error creando producto", true);
}
}

async function eliminarProducto(codigo) {
try {
    if (!confirm("¿Eliminar producto?")) return;
    await apiDelete(`/eliminar_producto/${codigo}`);
    showToast("Producto eliminado");
    listarProducto();
} catch (e) {
    showToast("Error eliminando producto", true);
}
}

async function abrirEditarProducto(codigo) {
try {
    const resp = await apiGet("/producto");
    const p = (resp.producto || resp.movimiento_producto || []).find(x => String(x.id_producto) === String(codigo));
    if (!p) return showToast("Producto no encontrado", true);
    // llenar form edición (ids asumidos)
    document.getElementById("edit_producto_id").value = p.id_producto;
    document.getElementById("edit_producto_nombre").value = p.nombre || "";
    document.getElementById("edit_producto_descripcion").value = p.descripcion || "";
    document.getElementById("edit_producto_cantidad").value = p.cantidad || "";
    document.getElementById("edit_producto_codigo_barras").value = p.codigo_barras || "";
    document.getElementById("edit_producto_stock_maximo").value = p.stock_maximo || "";
    document.getElementById("edit_producto_stock_minimo").value = p.stock_minimo || "";
    document.getElementById("edit_producto_categoria").value = p.categoria_producto || "";
    document.getElementById("edit_producto_subcategoria").value = p.subcategoria_producto || "";
    document.getElementById("edit_producto_estado").value = p.estado || "";
    document.getElementById("edit_producto_unidad_medida").value = p.unidad_de_medida || "";
    const modalEl = document.getElementById("modalEditarProducto");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarProductoFromForm() {
try {
    const id = document.getElementById("edit_producto_id").value;
    const nombre = document.getElementById("edit_producto_nombre").value;
    const descripcion = document.getElementById("edit_producto_descripcion").value;
    const cantidad = parseInt(document.getElementById("edit_producto_cantidad").value || 0);
    const codigo_barras = document.getElementById("edit_producto_codigo_barras").value;
    const stock = document.getElementById("edit_producto_stock").value || cantidad;
    const stock_maximo = document.getElementById("edit_producto_stock_maximo").value;
    const stock_minimo = document.getElementById("edit_producto_stock_minimo").value;
    const categoria_producto = document.getElementById("edit_producto_categoria").value;
    const subcategoria_producto = document.getElementById("edit_producto_subcategoria").value;
    const estado = document.getElementById("edit_producto_estado").value;
    const unidad_de_medida = document.getElementById("edit_producto_unidad_medida").value;
    if (!id) return showToast("ID faltante", true);
    await apiPut(`/actualizar_producto/${id}`, {
        nombre, descripcion, cantidad, codigo_barras, stock, stock_maximo, stock_minimo,
        categoria_producto, subcategoria_producto, estado, unidad_de_medida
    });
    showToast("Producto actualizado");
    listarProducto();
    const modalEl = document.getElementById("modalEditarProducto");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando producto", true);
}
}

// -----------------------------
// --- DONANTE ---------------
// -----------------------------
async function listarDonante() {
try {
    const resp = await apiGet("/donante");
    let html = "";
    (resp.donante || []).forEach((d) => {
        html += `
        <tr>
        <td>${d.id_donante}</td>
        <td>${d.nombre}</td>
        <td>${d.tipo_documento ?? ""}</td>
        <td>${d.numero_documento ?? ""}</td>
        <td>${d.telefono ?? ""}</td>
        <td>${d.correo ?? d.gmail ?? ""}</td>
        <td>${d.direccion ?? ""}</td>
        <td>${d.estado ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarDonante(${d.id_donante})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarDonante(${d.id_donante})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodydonante");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarDonanteFromForm() {
try {
    const nombre = document.getElementById("donante_nombre").value;
    const telefono = document.getElementById("donante_telefono").value;
    const gmail = document.getElementById("donante_gmail").value;
    const direccion = document.getElementById("donante_direccion").value;
    const estado = document.getElementById("donante_estado").value;
    const tipo_documento = document.getElementById("donante_tipo_documento").value;
    const tipo_donante = document.getElementById("donante_tipo_donante").value;
    if (!nombre) return showToast("Nombre donante obligatorio", true);
    await apiPost("/registro_donante", { nombre, telefono, gmail, direccion, estado, tipo_documento, tipo_donante });
    showToast("Donante creado");
    listarDonante();
} catch (e) {
    showToast("Error creando donante", true);
}
}

async function eliminarDonante(codigo) {
try {
    if (!confirm("¿Eliminar donante?")) return;
    await apiDelete(`/eliminar_donante/${codigo}`);
    showToast("Donante eliminado");
    listarDonante();
} catch (e) {
    showToast("Error eliminando donante", true);
}
}

async function abrirEditarDonante(codigo) {
try {
    const resp = await apiGet("/donante");
    const d = findInList("donante", "id_donante", resp, codigo);
    if (!d) return showToast("Donante no encontrado", true);
    document.getElementById("edit_donante_id").value = d.id_donante;
    document.getElementById("edit_donante_nombre").value = d.nombre || "";
    document.getElementById("edit_donante_telefono").value = d.telefono || "";
    document.getElementById("edit_donante_gmail").value = d.gmail || d.correo || "";
    document.getElementById("edit_donante_direccion").value = d.direccion || "";
    document.getElementById("edit_donante_estado").value = d.estado || "";
    document.getElementById("edit_donante_tipo_documento").value = d.tipo_documento || "";
    document.getElementById("edit_donante_tipo_donante").value = d.tipo_donante || "";
    const modalEl = document.getElementById("modalEditarDonante");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarDonanteFromForm() {
try {
    const codigo = document.getElementById("edit_donante_id").value;
    const nombre = document.getElementById("edit_donante_nombre").value;
    const telefono = document.getElementById("edit_donante_telefono").value;
    const gmail = document.getElementById("edit_donante_gmail").value;
    const direccion = document.getElementById("edit_donante_direccion").value;
    const estado = document.getElementById("edit_donante_estado").value;
    const tipo_documento = document.getElementById("edit_donante_tipo_documento").value;
    const tipo_donante = document.getElementById("edit_donante_tipo_donante").value;
    if (!codigo) return showToast("ID faltante", true);
    await apiPut(`/actualizar_donante/${codigo}`, { nombre, telefono, gmail, direccion, estado, tipo_documento, tipo_donante });
    showToast("Donante actualizado");
    listarDonante();
    const modalEl = document.getElementById("modalEditarDonante");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando donante", true);
}
}

// -----------------------------
// --- ORGANIZACION ----------
// -----------------------------
async function listarOrganizacion() {
try {
    const resp = await apiGet("/organizacion");
    let html = "";
    (resp.organizacion || []).forEach((o) => {
        html += `
        <tr>
        <td>${o.codigo}</td>
        <td>${o.descripcion}</td>
        <td>${o.nombre}</td>
        <td>${o.responsable}</td>
        <td>${o.telefono}</td>
        <td>${o.direccion}</td>
        <td>${o.tipo_entrega}</td>
        <td>${o.tipo_organizacion}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarOrganizacion(${o.codigo})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarOrganizacion(${o.codigo})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodyorganizacion");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarOrganizacionFromForm() {
try {
    const descripcion = document.getElementById("organizacion_descripcion").value;
    const nombre = document.getElementById("organizacion_nombre").value;
    const responsable = document.getElementById("organizacion_responsable").value;
    const telefono = document.getElementById("organizacion_telefono").value;
    const direccion = document.getElementById("organizacion_direccion").value;
    const tipo_entrega = document.getElementById("organizacion_tipo_entrega").value;
    const tipo_organizacion = document.getElementById("organizacion_tipo_organizacion").value;
    if (!nombre) return showToast("Nombre organización obligatorio", true);
    await apiPost("/registro_organizacion", {
    descripcion, nombre, responsable, telefono, direccion, tipo_entrega, tipo_organizacion
    });
    showToast("Organización creada");
    listarOrganizacion();
} catch (e) {
    showToast("Error creando organización", true);
}
}

async function eliminarOrganizacion(codigo) {
try {
    if (!confirm("¿Eliminar organización?")) return;
    await apiDelete(`/eliminar_organizacion/${codigo}`);
    showToast("Organización eliminada");
    listarOrganizacion();
} catch (e) {
    showToast("Error eliminando organización", true);
}
}

async function abrirEditarOrganizacion(codigo) {
try {
    const resp = await apiGet("/organizacion");
    const o = findInList("organizacion", "codigo", resp, codigo);
    if (!o) return showToast("Organización no encontrada", true);
    document.getElementById("edit_organizacion_codigo").value = o.codigo;
    document.getElementById("edit_organizacion_descripcion").value = o.descripcion || "";
    document.getElementById("edit_organizacion_nombre").value = o.nombre || "";
    document.getElementById("edit_organizacion_responsable").value = o.responsable || "";
    document.getElementById("edit_organizacion_telefono").value = o.telefono || "";
    document.getElementById("edit_organizacion_direccion").value = o.direccion || "";
    document.getElementById("edit_organizacion_tipo_entrega").value = o.tipo_entrega || "";
    document.getElementById("edit_organizacion_tipo_organizacion").value = o.tipo_organizacion || "";
    const modalEl = document.getElementById("modalEditarOrganizacion");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarOrganizacionFromForm() {
try {
    const codigo = document.getElementById("edit_organizacion_codigo").value;
    const descripcion = document.getElementById("edit_organizacion_descripcion").value;
    const nombre = document.getElementById("edit_organizacion_nombre").value;
    const responsable = document.getElementById("edit_organizacion_responsable").value;
    const telefono = document.getElementById("edit_organizacion_telefono").value;
    const direccion = document.getElementById("edit_organizacion_direccion").value;
    const tipo_entrega = document.getElementById("edit_organizacion_tipo_entrega").value;
    const tipo_organizacion = document.getElementById("edit_organizacion_tipo_organizacion").value;
    if (!codigo) return showToast("ID faltante", true);
    await apiPut(`/actualizar_organizacion/${codigo}`, { descripcion, nombre, responsable, telefono, direccion, tipo_entrega, tipo_organizacion });
    showToast("Organización actualizada");
    listarOrganizacion();
    const modalEl = document.getElementById("modalEditarOrganizacion");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando organización", true);
}
}

// -----------------------------
// --- USUARIO (listar) -------
// -----------------------------
async function listarUsuario() {
try {
    const resp = await apiGet("/usuarios");
    let html = "";
    (resp.usuario || []).forEach((u) => {
    html += `
        <tr>
        <td>${u.id_usuario}</td>
        <td>${u.nombre_completo}</td>
        <td>${u.numero_documento}</td>
        <td>${u.correo ?? u.gmail ?? ""}</td>
        <td>******</td>
        <td>${u.tipo_usuario}</td>
        <td>${u.tipo_documento}</td>
        <td>${u.estado}</td>
        </tr>`;
    });
    const el = document.getElementById("tbodyusuario");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

// -----------------------------
// --- GASTO ------------------
// -----------------------------
async function listarGasto() {
try {
    const resp = await apiGet("/gasto");
    let html = "";
    (resp.gasto || []).forEach((g) => {
    html += `
        <tr>
        <td>${g.id_gasto}</td>
        <td>${g.fecha}</td>
        <td>${g.monto}</td>
        <td>${g.descripcion}</td>
        <td>${g.tipo_gasto}</td>
        <td>${g.usuario ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarGasto(${g.id_gasto})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarGasto(${g.id_gasto})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodygasto");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarGastoFromForm() {
try {
    const fecha = document.getElementById("gasto_fecha").value;
    const monto = parseFloat(document.getElementById("gasto_monto").value || 0);
    const descripcion = document.getElementById("gasto_descripcion").value;
    const tipo_gasto = document.getElementById("gasto_tipo_gasto").value;
    if (!fecha || !monto) return showToast("Fecha y monto obligatorios", true);
    await apiPost("/registro_gasto", { fecha, monto, descripcion, tipo_gasto });
    showToast("Gasto registrado");
    listarGasto();
} catch (e) {
    showToast("Error registrando gasto", true);
}
}

async function eliminarGasto(codigo) {
try {
    if (!confirm("¿Eliminar gasto?")) return;
    await apiDelete(`/eliminar_gasto/${codigo}`);
    showToast("Gasto eliminado");
    listarGasto();
} catch (e) {
    showToast("Error eliminando gasto", true);
}
}

async function abrirEditarGasto(id) {
try {
    // En tu backend si existe /gasto/<id> lo usas; sino busco en la lista
    let item;
    try {
        const single = await apiGet(`/gasto/${id}`);
        item = single;
    } catch {
        const resp = await apiGet("/gasto");
        item = findInList("gasto", "id_gasto", resp, id);
    }
    if (!item) return showToast("Gasto no encontrado", true);
    document.getElementById("edit_gasto_id").value = item.id_gasto || id;
    document.getElementById("edit_gasto_fecha").value = item.fecha || "";
    document.getElementById("edit_gasto_monto").value = item.monto || "";
    document.getElementById("edit_gasto_descripcion").value = item.descripcion || "";
    document.getElementById("edit_gasto_tipo_gasto").value = item.tipo_gasto || "";
    const modalEl = document.getElementById("modalEditarGasto");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarGastoFromForm() {
try {
    const id = document.getElementById("edit_gasto_id").value;
    const fecha = document.getElementById("edit_gasto_fecha").value;
    const monto = parseFloat(document.getElementById("edit_gasto_monto").value || 0);
    const descripcion = document.getElementById("edit_gasto_descripcion").value;
    const tipo_gasto = document.getElementById("edit_gasto_tipo_gasto").value;
    if (!id) return showToast("ID faltante", true);
    await apiPut(`/actualizar_gasto/${id}`, { fecha, monto, descripcion, tipo_gasto });
    showToast("Gasto actualizado");
    listarGasto();
    const modalEl = document.getElementById("modalEditarGasto");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando gasto", true);
}
}

// -----------------------------
// --- CERTIFICADO DONANTE ----
// -----------------------------
async function listarCertificadoDonante() {
try {
    const resp = await apiGet("/certificado_donante");
    let html = "";
    (resp.certificado_donante || []).forEach((c) => {
    html += `
        <tr>
        <td>${c.id_certificado}</td>
        <td>${c.fecha}</td>
        <td>${c.valor_donado ?? ""}</td>
        <td>${c.firma_representante}</td>
        <td>${c.donante}</td>
        <td>${c.tipo_certificado ?? ""}</td>
        <td>
            <button class="btn btn-sm btn-primary" onclick="abrirEditarCertificado(${c.id_certificado})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarCertificado(${c.id_certificado})">Eliminar</button>
        </td>
        </tr>`;
    });
    const el = document.getElementById("tbodycertificado_donante");
    if (el) el.innerHTML = html;
} catch (e) {
    console.error(e);
}
}

async function agregarCertificadoFromForm() {
try {
    const fecha = document.getElementById("cert_fecha").value;
    const firma = document.getElementById("cert_firma").value;
    const donante = document.getElementById("cert_donante").value;
    const estado = document.getElementById("cert_estado").value;
    const tipo_documento = document.getElementById("cert_tipo_documento").value;
    const tipo_donante = document.getElementById("cert_tipo_donante").value;
    const tipo_donacion = document.getElementById("cert_tipo_donacion").value;
    if (!fecha || !donante) return showToast("Fecha y donante obligatorios", true);
    await apiPost("/registro_certificado_donante", { fecha, firma_representante: firma, donante, estado, tipo_documento, tipo_donante, tipo_donacion });
    showToast("Certificado creado");
    listarCertificadoDonante();
} catch (e) {
    showToast("Error creando certificado", true);
}
}

async function eliminarCertificado(codigo) {
try {
    if (!confirm("¿Eliminar certificado?")) return;
    await apiDelete(`/eliminar_certificado_donante/${codigo}`);
    showToast("Certificado eliminado");
    listarCertificadoDonante();
} catch (e) {
    showToast("Error eliminando certificado", true);
}
}

async function abrirEditarCertificado(codigo) {
try {
    const resp = await apiGet("/certificado_donante");
    const c = findInList("certificado_donante", "id_certificado", resp, codigo);
    if (!c) return showToast("Certificado no encontrado", true);
    document.getElementById("edit_cert_id").value = c.id_certificado;
    document.getElementById("edit_cert_fecha").value = c.fecha || "";
    document.getElementById("edit_cert_firma").value = c.firma_representante || "";
    document.getElementById("edit_cert_donante").value = c.donante || "";
    document.getElementById("edit_cert_estado").value = c.estado || "";
    document.getElementById("edit_cert_tipo_documento").value = c.tipo_documento || "";
    document.getElementById("edit_cert_tipo_donante").value = c.tipo_donante || "";
    document.getElementById("edit_cert_tipo_donacion").value = c.tipo_donacion || "";
    const modalEl = document.getElementById("modalEditarCertificado");
    if (modalEl) new bootstrap.Modal(modalEl).show();
} catch (e) {
    console.error(e);
}
}

async function actualizarCertificadoFromForm() {
try {
    const id = document.getElementById("edit_cert_id").value;
    const fecha = document.getElementById("edit_cert_fecha").value;
    const firma = document.getElementById("edit_cert_firma").value;
    const donante = document.getElementById("edit_cert_donante").value;
    const estado = document.getElementById("edit_cert_estado").value;
    const tipo_documento = document.getElementById("edit_cert_tipo_documento").value;
    const tipo_donante = document.getElementById("edit_cert_tipo_donante").value;
    const tipo_donacion = document.getElementById("edit_cert_tipo_donacion").value;
    if (!id) return showToast("ID faltante", true);
    await apiPut(`/actualizar_certificado_donante/${id}`, { fecha, firma_representante: firma, donante, estado, tipo_documento, tipo_donante, tipo_donacion });
    showToast("Certificado actualizado");
    listarCertificadoDonante();
    const modalEl = document.getElementById("modalEditarCertificado");
    if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
} catch (e) {
    showToast("Error actualizando certificado", true);
}
}

// -----------------------------
// --- Select populators ------
// -----------------------------
async function llamar_categoria() {
try {
    const resp = await apiGet("/categoria_producto");
    const select = document.getElementById("categoria");
    if (!select) return;
    select.innerHTML = "<option value=''>Seleccione una categoría</option>";
    (resp.categoria_producto || []).forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.codigo;
        opt.text = c.descripcion;
        select.appendChild(opt);
    });
} catch (e) {
    console.error("Error cargar categorias", e);
}
}

async function llamar_subcategoria() {
try {
    const resp = await apiGet("/subcategoria_producto");
    const select = document.getElementById("subcategoria");
    if (!select) return;
    select.innerHTML = "<option value=''>Seleccione una subcategoría</option>";
    (resp.subcategoria_producto || []).forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.codigo;
        opt.text = s.descripcion;
        select.appendChild(opt);
    });
} catch (e) {
    console.error("Error cargar subcategorias", e);
}
}

async function llamar_unidad_medida() {
    try {
    const resp = await apiGet("/unidad_de_medida");
    const select = document.getElementById("unidad_medida");
    if (!select) return;
    select.innerHTML = "<option value=''>Seleccione una unidad de medida</option>";
    (resp.unidad_de_medida || []).forEach(u => {
    const opt = document.createElement("option");
    opt.value = u.codigo;
    opt.text = u.nombre;
    select.appendChild(opt);
    });
} catch (e) {
    console.error("Error cargar unidades", e);
}
}

async function llamar_estado() {
try {
    const resp = await apiGet("/estado");
    const select = document.getElementById("estado");
    if (!select) return;
    select.innerHTML = "<option value=''>Seleccione un estado</option>";
    (resp.estado || []).forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.id_estado;
        opt.text = `${s.nombre} - ${s.descripcion}`;
        select.appendChild(opt);
    });
} catch (e) {
    console.error("Error cargar estados", e);
}
}

// -----------------------------
// --- Inicialización -------
// -----------------------------
async function inicializarTodo() {
  try {
    // Listados principales
    listarUnidadMedida();
    listarCategoriaProducto();
    listarSubcategoriaProducto();
    listarBodega();
    listarMovimientoProducto();
    listarProducto();
    listarDonante();
    listarOrganizacion();
    listarUsuario();
    listarGasto();
    listarCertificadoDonante();

    // poblar selects
    llamar_categoria();
    llamar_subcategoria();
    llamar_unidad_medida();
    llamar_estado();

    // (Opcional) attach listeners si tienes formularios con IDs:
    const addUnidadBtn = document.getElementById("btnAgregarUnidad");
    if (addUnidadBtn) addUnidadBtn.addEventListener("click", agregarUnidadMedidaFromForm);

    const addCategoriaBtn = document.getElementById("btnAgregarCategoria");
    if (addCategoriaBtn) addCategoriaBtn.addEventListener("click", agregarCategoriaFromForm);

    const addSubcategoriaBtn = document.getElementById("btnAgregarSubcategoria");
    if (addSubcategoriaBtn) addSubcategoriaBtn.addEventListener("click", agregarSubcategoriaFromForm);

    const addBodegaBtn = document.getElementById("btnAgregarBodega");
    if (addBodegaBtn) addBodegaBtn.addEventListener("click", agregarBodegaFromForm);

    const addProductoBtn = document.getElementById("btnAgregarProducto");
    if (addProductoBtn) addProductoBtn.addEventListener("click", agregarProductoFromForm);

    const addMovimientoBtn = document.getElementById("btnAgregarMovimiento");
    if (addMovimientoBtn) addMovimientoBtn.addEventListener("click", agregarMovimientoFromForm);

    const addDonanteBtn = document.getElementById("btnAgregarDonante");
    if (addDonanteBtn) addDonanteBtn.addEventListener("click", agregarDonanteFromForm);

    const addOrganizacionBtn = document.getElementById("btnAgregarOrganizacion");
    if (addOrganizacionBtn) addOrganizacionBtn.addEventListener("click", agregarOrganizacionFromForm);

    const addGastoBtn = document.getElementById("btnAgregarGasto");
    if (addGastoBtn) addGastoBtn.addEventListener("click", agregarGastoFromForm);

    const addCertBtn = document.getElementById("btnAgregarCertificado");
    if (addCertBtn) addCertBtn.addEventListener("click", agregarCertificadoFromForm);

    // Edit/update buttons (in modals)
    const updUnidadBtn = document.getElementById("btnActualizarUnidad");
    if (updUnidadBtn) updUnidadBtn.addEventListener("click", actualizarUnidadFromForm);

    const updCategoriaBtn = document.getElementById("btnActualizarCategoria");
    if (updCategoriaBtn) updCategoriaBtn.addEventListener("click", actualizarCategoriaFromForm);

    const updSubcategoriaBtn = document.getElementById("btnActualizarSubcategoria");
    if (updSubcategoriaBtn) updSubcategoriaBtn.addEventListener("click", actualizarSubcategoriaFromForm);

    const updBodegaBtn = document.getElementById("btnActualizarBodega");
    if (updBodegaBtn) updBodegaBtn.addEventListener("click", actualizarBodegaFromForm);

    const updMovimientoBtn = document.getElementById("btnActualizarMovimiento");
    if (updMovimientoBtn) updMovimientoBtn.addEventListener("click", actualizarMovimientoFromForm);

    const updProductoBtn = document.getElementById("btnActualizarProducto");
    if (updProductoBtn) updProductoBtn.addEventListener("click", actualizarProductoFromForm);

    const updDonanteBtn = document.getElementById("btnActualizarDonante");
    if (updDonanteBtn) updDonanteBtn.addEventListener("click", actualizarDonanteFromForm);

    const updOrganizacionBtn = document.getElementById("btnActualizarOrganizacion");
    if (updOrganizacionBtn) updOrganizacionBtn.addEventListener("click", actualizarOrganizacionFromForm);

    const updGastoBtn = document.getElementById("btnActualizarGasto");
    if (updGastoBtn) updGastoBtn.addEventListener("click", actualizarGastoFromForm);

    const updCertBtn = document.getElementById("btnActualizarCertificado");
    if (updCertBtn) updCertBtn.addEventListener("click", actualizarCertificadoFromForm);
} catch (e) {
    console.error("InicializarTodo error", e);
}
}

// auto-run inicialización cuando DOM cargue
document.addEventListener("DOMContentLoaded", inicializarTodo);
