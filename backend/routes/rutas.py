from flask import Blueprint, app, render_template, render_template, session

# ==============================
# 4️ PÁGINA PRINCIPAL (POST LOGIN)
# ==============================
rutas_dp = Blueprint('rutas_dp', __name__)

@rutas_dp.route('/pagina_principal')
def pagina_principal():
    if 'usuario' not in session:
        return redirect(url_for('index'))  # Bloquear acceso si no hay sesión
    return render_template('pagina_principal.html', usuario=session['usuario'])



# Página principal del menú de Donantes
@rutas_dp.route('/menu_central')
def menu_central():
    usuario = session["usuario"]  
    return render_template('menu_central.html', usuario=usuario)



# Página principal del menú de Donantes
@rutas_dp.route('/menu_de_parroquias')
def menu_de_parroquias():
    usuario = session["usuario"]  
    return render_template('menu_de_parroquias.html', usuario=usuario)

@rutas_dp.route('/crear_organizacion')
def crear_organizacion():
    usuario = session["usuario"]  
    return render_template('crear_organizacion.html', usuario=usuario)

@rutas_dp.route('/gestion_parroquia')
def gestion_parroquia():
    usuario = session["usuario"]  
    return render_template('gestion_parroquia.html', usuario=usuario)

@rutas_dp.route('/fundaciones')
def fundaciones():
    usuario = session["usuario"]  
    return render_template('fundaciones.html', usuario=usuario)



# Página principal del menú de Productos
@rutas_dp.route('/menu_producto')
def menu_producto():
    usuario = session["usuario"]  
    return render_template('menu_producto.html', usuario=usuario)

@rutas_dp.route('/categoria')
def categoria():
    usuario = session["usuario"]  
    return render_template('categoria.html', usuario=usuario)

@rutas_dp.route('/subcategoria')
def subcategoria():
    usuario = session["usuario"]  
    return render_template('subcategoria.html', usuario=usuario)

@rutas_dp.route('/producto')
def producto():
    usuario = session["usuario"]  
    return render_template('producto.html', usuario=usuario)

@rutas_dp.route('/bodegas')
def bodegas():
    usuario = session["usuario"]  
    return render_template('bodegas.html', usuario=usuario)



# Página principal del menú de Donantes
@rutas_dp.route('/menu_donante')
def menu_donante():
    usuario = session["usuario"]  # aquí puedes pasar la info real del usuario logueado
    return render_template('menu_donante.html', usuario=usuario)

# Página para crear/listar tipos de donante
@rutas_dp.route('/tipo_donante')
def tipo_donante_page():
    usuario = session["usuario"]
    return render_template('tipo_donante.html', usuario=usuario)

# Página para crear/listar tipos de donante
@rutas_dp.route('/donante')
def donante_page():
    usuario = session["usuario"]
    return render_template('donante.html', usuario=usuario)



@rutas_dp.route('/lista_donaciones')
def lista_donaciones():
    usuario = session["usuario"]  
    return render_template('lista_donaciones.html', usuario=usuario)

@rutas_dp.route('/tabla_producto')
def tabla_producto():
    usuario = session["usuario"]  
    return render_template('tabla_producto.html', usuario=usuario)

@rutas_dp.route('/movimiento_inv')
def movimiento_inv():
    usuario = session["usuario"]  
    return render_template('movimiento_inv.html', usuario=usuario)



@rutas_dp.route('/menu_gastos')
def menu_gastos():
    usuario = session["usuario"]  
    return render_template('menu_gastos.html', usuario=usuario)

@rutas_dp.route('/tipo_gastos')
def tipo_gastos():
    usuario = session["usuario"]  
    return render_template('tipo_gastos.html', usuario=usuario)

@rutas_dp.route('/registrar_gastos')
def registrar_gastos():
    usuario = session["usuario"]  
    return render_template('registrar_gastos.html', usuario=usuario)



@rutas_dp.route('/menu_reportes')
def menu_reportes():
    usuario = session["usuario"]  
    return render_template('menu_reportes.html', usuario=usuario)

@rutas_dp.route('/reportes')
def reportes():
    usuario = session["usuario"]  
    return render_template('reportes.html', usuario=usuario)

@rutas_dp.route('/donaciones_producto')
def donaciones_producto():
    usuario = session["usuario"]  
    return render_template('donaciones_producto.html', usuario=usuario)

@rutas_dp.route('/semaforos')
def semaforos():
    usuario = session["usuario"]  
    return render_template('semaforos.html', usuario=usuario)

@rutas_dp.route('/certificacion_donante')
def certificacion_donante():
    usuario = session["usuario"]  
    return render_template('certificacion_donante.html', usuario=usuario)

@rutas_dp.route('/acta_vencimiento')
def acta_vencimiento():
    usuario = session["usuario"]  
    return render_template('acta_vencimiento.html', usuario=usuario)



@rutas_dp.route('/pag_confi')
def pag_confi():
    usuario = session["usuario"]  
    return render_template('pag_confi.html', usuario=usuario)

@rutas_dp.route('/permisos_asistentes')
def permisos_asistentes():
    usuario = session["usuario"]  
    return render_template('permisos_asistentes.html', usuario=usuario)

@rutas_dp.route('/plantilla4')
def plantilla4():
    usuario = session["usuario"]  
    return render_template('plantilla4.html', usuario=usuario)

@rutas_dp.route('/parametros')
def parametros():
    usuario = session["usuario"]  
    return render_template('parametros.html', usuario=usuario)

@rutas_dp.route('/configuracion')
def configuracion():
    usuario = session["usuario"]  
    return render_template('configuracion.html', usuario=usuario)



@rutas_dp.route('/menu_manual')
def menu_manual():
    usuario = session["usuario"]  
    return render_template('menu_manual.html', usuario=usuario)

@rutas_dp.route('/tecnico')
def tecnico():
    usuario = session["usuario"]  
    return render_template('tecnico.html', usuario=usuario)

@rutas_dp.route('/manual_usuario')
def manual_usuario():
    usuario = session["usuario"]  
    return render_template('manual_usuario.html', usuario=usuario)

@rutas_dp.route('/instalacion')
def instalacion():
    usuario = session["usuario"]  
    return render_template('instalacion.html', usuario=usuario)
