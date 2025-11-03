from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS 
from flasgger import Swagger
import bcrypt 
import os

from db import get_db_connection
from routes.tipo_donante import tipo_donante_bp
from routes.donante import donantes_bp


# Obtenemos la ruta absoluta de la carpeta "backend"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
#BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(
    __name__,
      template_folder=os.path.join(BASE_DIR, 'templates'),
      #template_folder=os.path.join(BASE_DIR, 'templates', 'frontend'),
      static_folder=os.path.join(BASE_DIR, 'static')
      )


app.register_blueprint(tipo_donante_bp)
#app.register_blueprint(tipo_donante_bp, url_prefix='/tipo_donante')
app.register_blueprint(donantes_bp, url_prefix='/donantes')


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
    return render_template('frontend/index.html')


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

    # Buscar usuario en la BD
    query = "SELECT * FROM usuarios WHERE correo = %s AND contrasena = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user:
        # Guardamos info básica en la sesión
        session['usuario'] = user['nombre_completo']
        session['rol_id'] = user['rol_id']
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Correo o contraseña incorrectos'}), 401

# ==============================
# 4️ PÁGINA PRINCIPAL (POST LOGIN)
# ==============================
@app.route('/pagina_principal')
def pagina_principal():
    if 'usuario' not in session:
        return redirect(url_for('index'))  # Bloquear acceso si no hay sesión
    return render_template('frontend/pagina_principal.html', usuario=session['usuario'])


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
    return render_template('frontend/menu_central.html', usuario=usuario)

# Página principal del menú de Donantes
@app.route('/menu_de_parroquias')
def menu_de_parroquias():
    usuario = session["usuario"]  
    return render_template('frontend/menu_de_parroquias.html', usuario=usuario)

@app.route('/menu_producto')
def menu_producto():
    usuario = session["usuario"]  
    return render_template('frontend/menu_producto.html', usuario=usuario)

@app.route('/menu_gastos')
def menu_gastos():
    usuario = session["usuario"]  
    return render_template('frontend/menu_gastos.html', usuario=usuario)



# Página principal del menú de Donantes
@app.route('/menu_donante')
def menu_donante():
    usuario = session["usuario"]  # aquí puedes pasar la info real del usuario logueado
    return render_template('frontend/menu_donante.html', usuario=usuario)

# Página para crear/listar tipos de donante
@app.route('/tipo_donante')
def tipo_donante_page():
    usuario = session["usuario"]
    return render_template('frontend/tipo_donante.html', usuario=usuario)


# Página para crear/listar tipos de donante
@app.route('/donante')
def donante_page():
    usuario = session["usuario"]
    return render_template('frontend/donante.html', usuario=usuario)


if __name__ == '__main__':
    app.run(debug=True)
