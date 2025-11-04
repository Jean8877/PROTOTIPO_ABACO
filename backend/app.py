from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS 
from flasgger import Swagger
import bcrypt 
import os
from datetime import datetime, timedelta

from db import get_db_connection
from routes.tipo_donante import tipo_donante_bp
from routes.donante import donantes_bp

from routes.tipo_documento import tipo_documento_bp

# Obtenemos la ruta absoluta de la carpeta "backend"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
#BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
      #template_folder=os.path.join(BASE_DIR, 'templates'),
      template_folder=os.path.join(BASE_DIR, 'templates', 'frontend'),
      static_folder=os.path.join(BASE_DIR, 'static')
      )


app.register_blueprint(tipo_donante_bp)
app.register_blueprint(donantes_bp, url_prefix='/api/donantes')
app.register_blueprint(tipo_documento_bp, url_prefix='/api/tipo_documento')


CORS(app)  # Habilitar CORS para todas las rutas
swagger = Swagger(app)

@app.route('/static/<path:filename>')
def static_files(filename):
    return app.send_static_file(filename)#para llamar archivos estaticos


app.secret_key = 'clave-segura'  #  Necesario para manejar sesiones


# ==============================
# 2️ RUTA PRINCIPAL - LOGIN
# ==============================
@app.route('/')
def index():
    return render_template('index.html')


# ==============================
# 3️ PROCESAR LOGIN
# ==============================

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'message': 'No se enviaron datos'}), 400

    username = data.get('username')
    password = data.get('password')

    connection = get_db_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Error al conectar con la base de datos'}), 500

    cursor = connection.cursor(dictionary=True)

    # Buscar usuario por correo
    cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (username,))
    user = cursor.fetchone()

    if not user:
        cursor.close()
        connection.close()
        return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 401

    #  Verificar si el usuario está bloqueado
    if user['bloqueado_hasta'] and user['bloqueado_hasta'] > datetime.now():
        tiempo_restante = (user['bloqueado_hasta'] - datetime.now()).seconds // 60
        return jsonify({
            'success': False,
            'message': f'Cuenta bloqueada. Intenta de nuevo en {tiempo_restante} minutos.'
        }), 403

    # 🔑 Validar contraseña (sin hash)
    if user['contrasena'] == password:
        # Reiniciar intentos fallidos si el login es correcto
        cursor.execute("""
            UPDATE usuarios 
            SET intentos_fallidos = 0, bloqueado_hasta = NULL
            WHERE id_usuario = %s
        """, (user['id_usuario'],))
        connection.commit()

        # Guardar sesión
        session['usuario'] = user['nombre_completo']
        session['rol_id'] = user['rol_id']

        cursor.close()
        connection.close()

        return jsonify({'success': True})

    else:
        # Incrementar contador de intentos fallidos
        nuevos_intentos = user['intentos_fallidos'] + 1
        bloqueado_hasta = None

        if nuevos_intentos >= 3:
            bloqueado_hasta = datetime.now() + timedelta(hours=2)
            mensaje = "Cuenta bloqueada por 2 horas debido a múltiples intentos fallidos."
        else:
            mensaje = f"Contraseña incorrecta. Intento {nuevos_intentos}/3."

        cursor.execute("""
            UPDATE usuarios 
            SET intentos_fallidos = %s, bloqueado_hasta = %s 
            WHERE id_usuario = %s
        """, (nuevos_intentos, bloqueado_hasta, user['id_usuario']))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'success': False, 'message': mensaje}), 401

# ==============================
# 4️ PÁGINA PRINCIPAL (POST LOGIN)
# ==============================
@app.route('/pagina_principal')
def pagina_principal():
    if 'usuario' not in session:
        return redirect(url_for('index'))  # Bloquear acceso si no hay sesión
    return render_template('pagina_principal.html', usuario=session['usuario'])


# ==============================
# 5️ CERRAR SESIÓN
# ==============================
@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('index'))




# Página principal del menú de Donantes
@app.route('/menu_central')
def menu_central():
    usuario = session["usuario"]  
    return render_template('menu_central.html', usuario=usuario)

# Página principal del menú de Donantes
@app.route('/menu_de_parroquias')
def menu_de_parroquias():
    usuario = session["usuario"]  
    return render_template('menu_de_parroquias.html', usuario=usuario)

@app.route('/menu_producto')
def menu_producto():
    usuario = session["usuario"]  
    return render_template('menu_producto.html', usuario=usuario)



# Página principal del menú de Donantes
@app.route('/menu_donante')
def menu_donante():
    usuario = session["usuario"]  # aquí puedes pasar la info real del usuario logueado
    return render_template('menu_donante.html', usuario=usuario)

# Página para crear/listar tipos de donante
@app.route('/tipo_donante')
def tipo_donante_page():
    usuario = session["usuario"]
    return render_template('tipo_donante.html', usuario=usuario)


# Página para crear/listar tipos de donante
@app.route('/donante')
def donante_page():
    usuario = session["usuario"]
    return render_template('donante.html', usuario=usuario)




@app.route('/lista_donaciones')
def lista_donaciones():
    usuario = session["usuario"]  
    return render_template('lista_donaciones.html', usuario=usuario)

@app.route('/tabla_producto')
def tabla_producto():
    usuario = session["usuario"]  
    return render_template('tabla_producto.html', usuario=usuario)

@app.route('/movimiento_inv')
def movimiento_inv():
    usuario = session["usuario"]  
    return render_template('movimiento_inv.html', usuario=usuario)

@app.route('/menu_gastos')
def menu_gastos():
    usuario = session["usuario"]  
    return render_template('menu_gastos.html', usuario=usuario)

@app.route('/menu_reportes')
def menu_reportes():
    usuario = session["usuario"]  
    return render_template('menu_reportes.html', usuario=usuario)

@app.route('/pag_confi')
def pag_confi():
    usuario = session["usuario"]  
    return render_template('pag_confi.html', usuario=usuario)

@app.route('/parametros')
def parametros():
    usuario = session["usuario"]  
    return render_template('parametros.html', usuario=usuario)



if __name__ == '__main__':
    app.run(debug=True)
