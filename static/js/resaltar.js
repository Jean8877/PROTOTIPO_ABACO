function resaltar() {
    // Obtener la URL actual
    const currentPage = window.location.pathname.split('/').pop();
    
    // Mapeo de páginas a enlaces del sidebar
    const pageMap = {
        'menu_central': 0,
        //mantiene el sidebar marcado en las paginas hijas
        'menu_de_parroquias': 1,
        'crear_organizacion': 1,
        'gestion_parroquia': 1,
        'fundaciones': 1,
        
        'menu_producto': 2,
        //mantiene el sidebar marcado en las paginas hijas
        'categoria': 2,
        'subcategoria': 2,
        'producto': 2,
        'bodegas': 2,
        
        'menu_donante': 3,
        //mantiene el sidebar marcado en las paginas hijas
        'tipo_donante': 3,
        'donante': 3,
        
        'pagina_principal': 4,
        'lista_donaciones': 5,
        'tabla_producto': 6,
        'movimiento_inv': 7,
        
        'menu_gastos': 8,
        //mantiene el sidebar marcado en las paginas hijas
        'tipo_gastos': 8,
        'registrar_gastos': 8,
        
        'menu_reportes': 9,
        //mantiene el sidebar marcado en las paginas hijas
        'reportes':9,
        'donaciones_producto':9,
        'semaforos':9,
        'certificacion_donante':9,
        'acta_vencimiento':9,
        
        'pag_confi': 10,
        //mantiene el sidebar marcado en las paginas hijas
        'permisos_asistentes': 10,
        'parametros': 10,
        'configuracion': 10,
        'menu_manual': 10,
        'tecnico':10,
        'instalacion':10,
        'manual_usuario':10
        
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