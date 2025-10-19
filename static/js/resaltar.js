function resaltar() {
    // Obtener la URL actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Mapeo de páginas a enlaces del sidebar
    const pageMap = {
        'menu_central.html': 0,
        //mantiene el sidebar marcado en las paginas hijas
        'menu_de_parroquias.html': 1,
        'crear_organizacion.html': 1,
        'gestion_parroquia.html': 1,
        'fundaciones.html': 1,
        
        'menu_producto.html': 2,
        //mantiene el sidebar marcado en las paginas hijas
        'categoria.html': 2,
        'subcategoria.html': 2,
        'Producto.html': 2,
        'Bodegas.html': 2,
        
        'menu_donante.html': 3,
        //mantiene el sidebar marcado en las paginas hijas
        'tipo_donante.html': 3,
        'donante.html': 3,
        
        'pagina_principal.html': 4,
        'lista_donaciones.html': 5,
        'tabla_producto.html': 6,
        'movimiento_inv.html': 7,
        
        'menu_gastos.html': 8,
        //mantiene el sidebar marcado en las paginas hijas
        'tipo_gastos.html': 8,
        'registrar_gastos.html': 8,
        
        'menu_reportes.html': 9,
        //mantiene el sidebar marcado en las paginas hijas
        'reportes.html':9,
        'donaciones_producto.html':9,
        'semaforos.html':9,
        'certificacion_donante.html':9,
        'acta_vencimiento.html':9,
        
        'pag_confi.html': 10,
        //mantiene el sidebar marcado en las paginas hijas
        'permisos_asistentes.html': 10,
        'parametros.html': 10,
        'configuracion.html': 10,
        
    };
    
    // Encontrar el índice del enlace activo
    const activeIndex = pageMap[currentPage];
    
    if (activeIndex !== undefined) {
        const sidebarLinks = document.querySelectorAll('.sidebar a');
        // Remover clase active de todos los enlaces
        sidebarLinks.forEach(link => link.classList.remove('active'));
        // Agregar clase active al enlace correspondiente
        sidebarLinks[activeIndex].classList.add('active');
    }
}
    document.addEventListener('DOMContentLoaded', resaltar
        
    );





function cerrar() {
                swal({
                    title: "¿Estás seguro?",
                    text: "Tu sesión se cerrará y deberás iniciar nuevamente.",
                    icon: "warning",
                    buttons: ["Cancelar", "Sí, cerrar sesión"],
                    dangerMode: true,
                }).then((cerrarSesion) => {
                    if (cerrarSesion) {
                        // Si el usuario confirma
                        swal({
                            title: "Sesión cerrada",
                            text: "Has cerrado sesión correctamente.",
                            icon: "success",
                            timer: 2000,
                            buttons: false
                        });
                        // Redirige después de un breve tiempo
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    }
                });
            }