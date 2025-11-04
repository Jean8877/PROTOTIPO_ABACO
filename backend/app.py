from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS 
from flasgger import Swagger
import bcrypt 
import os
from datetime import datetime, timedelta

from routes.rutas import rutas_dp
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

app.register_blueprint(rutas_dp)
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



# ==============================
# 5️ CERRAR SESIÓN
# ==============================
@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
