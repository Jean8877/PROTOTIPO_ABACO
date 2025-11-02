# backend/routes/app.py

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import Error
import os

# Obtenemos la ruta absoluta de la carpeta "backend"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))




app = Flask(
    __name__,
      template_folder=os.path.join(BASE_DIR, 'templates', 'frontend'),
      static_folder=os.path.join(BASE_DIR, 'static')
      )

app.secret_key = 'clave-segura'  # 🔒 Necesario para manejar sesiones
# ==============================
# 1️⃣ CONEXIÓN A LA BASE DE DATOS
# ==============================
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',         # Cambia si usas otro usuario
            password='123456',         # Coloca tu contraseña
            database='banco_alimentos'
        )
        return connection
    except Error as e:
        print(f"❌ Error al conectar con MySQL: {e}")
        return None


# ==============================
# 2️⃣ RUTA PRINCIPAL - LOGIN
# ==============================
@app.route('/')
def index():
    return render_template('frontend/index.html')


# ==============================
# 3️⃣ PROCESAR LOGIN
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
# 4️⃣ PÁGINA PRINCIPAL (POST LOGIN)
# ==============================
@app.route('/pagina_principal')
def pagina_principal():
    if 'usuario' not in session:
        return redirect(url_for('index'))  # Bloquear acceso si no hay sesión
    return render_template('pagina_principal.html', usuario=session['usuario'])


# ==============================
# 5️⃣ CERRAR SESIÓN
# ==============================
@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente', 'info')
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True)
