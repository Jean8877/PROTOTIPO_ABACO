from flask import Flask, jsonify, request
from flask_cors import CORS # para permitir el acceso a la API desde el frontend
import pymysql
# import pymysql.cursors
import bcrypt # incriptar contrasena
from flasgger import Swagger

app = Flask(__name__)
CORS(app)
# CORS(app, origins=["http://localhost:65233/", "http://10.4.215.103:5000"])

swagger = Swagger(app)

#conexion a la base de datos
def conectar(vhost, vuser, vpass, vdb):
    conn = pymysql.connect(host=vhost, user=vuser, passwd=vpass, db=vdb, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor )
    return conn

# ruta inicial
@app.route("/", methods=['GET'])
def index():
    return jsonify({"mensaje": "API del Banco de Alimentos"})

# ============================================================
# ===============   RUTA PARA TIPO_USUARIO   ===============
# ============================================================

@app.route("/tipo_usuario", methods=['GET'])
def tipo_usuario():
    """
    consulta de tipo_usuario
    ---
    tags:
      - tipo_usuario
    responses:
      200:
        description: lista de tipos de usuario
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM tipo_usuario") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
          return jsonify({'tipo_usuario':datos, 'mensaje': 'Lista De Tipo Usuario'})
        else:
          return jsonify ({'mensaje': 'Tipo de usuario no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'mensaje': 'Error'})
    
# ============================================================
# ===============   ELIMINAR TIPO USUARIO   ===============
# ============================================================
# Ruta para eliminar registro por ID tipo_usuario
@app.route("/eliminar_tipo_usuario/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_usuario(codigo):
    """
    Eliminar tipo de usuario por ID
    ---
    tags:
      - tipo_usuario
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Tipo de usuario eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_usuario WHERE id_tipo_usuario = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado el tipo de usuario exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ===============   RUTA PARA REGISTRO TIPO USUARIO   ========
# ============================================================

@app.route("/registro_tipo_usuario", methods=['POST'])
def registro_tipo_usuario():
    """
    Registrar un nuevo tipo de usuario
    ---
    tags:
      - tipo_usuario
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            properties:
              descripcion:
                type: string
    responses:
      200:
        description: Tipo de usuario registrado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO tipo_usuario (descripcion) 
                    VALUES (%s)""", (descripcion,))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    

# ============================================================
# ===============   RUTA PARA TIPO_DOCUMENTO   ===============
# ============================================================

@app.route("/tipo_documento", methods=['GET'])
def tipo_documento():
    """
    consulta de tipo_documento
    ---
    tags:
      - tipo_documento
    responses:
      200:
        description: lista de tipo de documento
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM tipo_documento") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_documento': datos, 'mensaje': 'Lista De Tipo Documento'})
        else:
            return jsonify({'mensaje': 'Tipo de documento no encontrado'})
        
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})

# ============================================================
# ===============   RUTA PARA REGISTRO TIPO_DOCUMENTO   ===============
# ============================================================

@app.route("/registro_tipo_documento", methods=['POST'])
def registro_tipo_documento():
    """
    Registrar un nuevo tipo de documento
    ---
    tags:
      - tipo_documento
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            properties:
              nombre:
                type: string
              abreviatura:
                type: string
    responses:
      200:
        description: Tipo de documento registrado exitosamente
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        abreviatura = data['abreviatura']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO tipo_documento (nombre, abreviatura) VALUES (%s, %s)", (nombre, abreviatura))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
# ============================================================
# ===============   RUTA PARA ELIMINAR TIPO_DOCUMENTO   ===============
# ============================================================

@app.route("/eliminar_tipo_documento/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_documento(codigo):
    """
    Eliminar tipo de documento por ID
    ---
    tags:
      - tipo_documento
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: tipo de documento eliminado
    """

    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_documento WHERE id_tipo_documento = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})




# ============================================================
# ===============   RUTA PARA TIPO_GASTO   ===============
# ============================================================


@app.route("/tipo_gasto", methods=['GET'])
def tipo_gasto():
    """
    Consulta de lista de tipos de gasto
    ---
    tags:
      - tipo_gasto
    responses:
      200:
        description: lista de tipos de gasto
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM tipo_gasto") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_gasto': datos, 'mensaje': 'Lista De Tipo Gasto'})
        else:
            return jsonify({'mensaje': 'Tipo de gasto no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})

# ============================================================
# ===============   RUTA PARA CONSULTAR TIPO_GASTO POR ID   ===============
# ============================================================

@app.route("/tipo_gasto/<int:codigo>", methods=['GET'])
def tipo_gasto_por_id(codigo):
    """
    Obtener un tipo de gasto por su ID
    ---
    tags:
      - tipo_gasto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Tipo de gasto encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM tipo_gasto WHERE id_tipo_gasto = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_gasto': datos, 'mensaje': 'Tipo de gasto encontrado'})
        else:
            return jsonify({'mensaje': 'Tipo de gasto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===============   RUTA PARA REGISTRAR TIPO_GASTO   ===============
# ============================================================

@app.route("/registro_tipo_gasto", methods=['POST'])
def registro_tipo_gasto():
    """
    Registrar un nuevo tipo de gasto
    ---
    tags:
      - tipo_gasto
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
    responses:
      200:
        description: Tipo de gasto registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO tipo_gasto (nombre, descripcion) VALUES (%s, %s)", (nombre, descripcion))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    

# ============================================================
# =============== ELIMINAR TIPO_GASTO =======================
# ============================================================

@app.route("/eliminar_tipo_gasto/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_gasto(codigo):
    """
    Eliminar un tipo de gasto
    ---
    tags:
      - tipo_gasto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: tipo de gasto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_gasto WHERE id_tipo_gasto = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===============   ESTADO   ===============
# ============================================================

@app.route("/estado", methods=['GET'])
def estado():
    """
    Consulta de lista de estados
    ---
    tags:
      - estado
    responses:
      200:
        description: lista de estados
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM estado") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'estado': datos, 'mensaje': 'Lista De Estado'})
        else:
            return jsonify({'mensaje': 'Estado no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})
      

# ============================================================
# ===============   REGISTRAR ESTADO   ===============
# ============================================================

@app.route("/registro_estado", methods=['POST'])
def registro_estado():
    """
    Registrar un nuevo estado
    ---
    tags:
      - estado
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
            descripcion:
              type: string
    responses:
      200:
        description: Estado registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO estado (nombre, descripcion) VALUES (%s, %s)", (nombre, descripcion))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ===============   ELIMINAR ESTADO   ===============
# ============================================================

@app.route("/eliminar_estado/<int:codigo>", methods=['DELETE'])
def eliminar_estado(codigo):
    """
    Eliminar un estado
    ---
    tags:
      - estado
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Estado eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM estado WHERE id_estado = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# ===============   RUTA PARA GASTO   ===============
# ============================================================

@app.route("/gasto", methods=['GET'])
def gasto():
    """
    Consulta de lista de gastos
    ---
    tags:
      - gasto
    responses:
      200:
        description: lista de gastos
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM gasto") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'gasto': datos, 'mensaje': 'Lista De Gasto'})
        else:
            return jsonify({'mensaje': 'Gasto no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})


# ============================================================
# ===============   RUTA PARA CONSULTAR GASTO POR ID   ===============
# ============================================================

@app.route("/gasto/<int:codigo>", methods=['GET'])
def gasto_por_id(codigo):
    """
    Obtener un gasto por su ID
    ---
    tags:
      - gasto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Gasto encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM gasto WHERE id_gasto = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'gasto': datos, 'mensaje': 'Gasto encontrado'})
        else:
            return jsonify({'mensaje': 'Gasto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ===============   RUTA PARA REGISTRAR GASTO   ===============
# ============================================================

@app.route("/registro_gasto", methods=['POST'])
def registro_gasto():
    """
    Registrar un nuevo gasto
    ---
    tags:
      - gasto
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_gasto:
              type: string
            fecha:
              type: string
            monto:
              type: number
            descripcion:
              type: string
            tipo_gasto:
              type: string
            usuario:
              type: string
    responses:
      200:
        description: Gasto registrado
    """
    try:
        data = request.get_json()
        fecha = data['fecha']
        monto = data['monto']
        descripcion = data['descripcion']
        tipo_gasto = data['tipo_gasto']
        usuario = data['usuario']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO gasto (fecha, monto, descripcion, tipo_gasto, usuario) VALUES (%s, %s, %s, %s, %s)", (fecha, monto, descripcion, tipo_gasto, usuario))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    

# ============================================================
# ===============   RUTA PARA ACTUALIZAR GASTO   ===============
# ============================================================

@app.route("/actualizar_gasto/<codigo>", methods=["PUT"])
def actualizar_gasto(codigo):
    """
    Actualizar un gasto
    ---
    tags:
      - gasto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_gasto:
              type: string
            fecha:
              type: string
            monto:
              type: number
            descripcion:
              type: string
            tipo_gasto:
              type: string
            usuario:
              type: string
    responses:
      200:
        description: Gasto actualizado
    """
    try:
        data = request.get_json()
        fecha = data['fecha']
        monto = data['monto']
        descripcion = data['descripcion']
        tipo_gasto = data['tipo_gasto']
        usuario = data['usuario']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("UPDATE gasto SET fecha=%s, monto=%s, descripcion= %s, tipo_gasto= %s, usuario= %s WHERE id_gasto= %s" , 
                    (fecha,monto,descripcion,tipo_gasto,usuario,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ===============   ELIMINAR GASTO   ===============
# ============================================================

@app.route("/eliminar_gasto/<int:codigo>", methods=['DELETE'])
def eliminar_gasto(codigo):
    """
    Eliminar un gasto
    ---
    tags:
      - gasto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Gasto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM gasto WHERE id_gasto = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===========   RUTA PARA CONSULTAR USUARIOS   ==============
# ============================================================

@app.route("/usuarios", methods=['GET'])
def usuarios():
    """
    Consulta de lista de usuarios
    ---
    tags:
      - usuario
    responses:
      200:
        description: lista de usuarios
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM usuario") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'usuario': datos, 'mensaje': 'Lista De Usuario'})
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})
      
# ============================================================
# =======   RUTA PARA CONSULTAR USUARIO POR ID   ============
# ============================================================

@app.route("/usuarios/<int:codigo>", methods=['GET'])
def usuario_por_id(codigo):
    """
    Obtener un usuario por su ID
    ---
    tags:
      - usuario
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Usuario encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM usuario WHERE id_usuario = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'usuario': datos, 'mensaje': 'Usuario encontrado'})
        else:
            return jsonify({'mensaje': 'Usuario no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===============   RUTA PARA REGISTRAR USUARIOS   ===============
# ============================================================

@app.route("/registro_usuarios", methods=['POST'])
def registro_usuarios():
    """
    Registrar un nuevo usuario
    ---
    tags:
      - usuario
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            nombre_completo:
              type: string
            numero_documento:
              type: string
            correo:
              type: string
            contrasena:
              type: string
            tipo_usuario:
              type: string
            tipo_documento:
              type: string
            estado:
              type: string
    responses:
      200:
        description: Usuario registrado
    """
    try:
        data = request.get_json()
        nombre_completo = data['nombre_completo']
        numero_documento = data['numero_documento']
        correo = data['correo']
        contrasena = data['contrasena']
        tipo_usuario = data['tipo_usuario']
        tipo_documento = data['tipo_documento']
        estado = data['estado']
        
        # Validación extra
        if not all([nombre_completo, numero_documento, correo, contrasena, tipo_usuario, tipo_documento, estado]):
            return jsonify({'mensaje': 'Faltan campos obligatorios'}), 400

        # ENCRIPTAR CONTRASEÑA
        hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO usuario (nombre_completo, numero_documento, correo, contrasena, tipo_usuario, tipo_documento, estado) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nombre_completo, numero_documento, correo, hashed_password, tipo_usuario, tipo_documento, estado))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============   RUTA PARA ACTUALIZAR USUARIOS   ===========
# ============================================================

@app.route("/actualizar_usuarios/<codigo>", methods=["PUT"])
def actualizar_usuarios(codigo):
    """
    Actualizar un usuario
    ---
    tags:
      - usuario
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            nombre_completo:
              type: string
            numero_documento:
              type: string
            gmail:
              type: string
            tipo_usuario:
              type: string
            tipo_documento:
              type: string
            estado:
              type: string
            gasto:
              type: string
    responses:
      200:
        description: Usuario actualizado
    """
    try:
        data = request.get_json()
        nombre_completo = data['nombre_completo']
        numero_documento = data['numero_documento']
        correo = data['correo']
        contrasena = data['contrasena']
        tipo_usuario = data['tipo_usuario']
        tipo_documento = data['tipo_documento']
        estado = data['estado']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE usuario SET nombre_completo= %s, numero_documento= %s, correo= %s, contrasena= %s, tipo_usuario= %s, tipo_documento= %s, estado= %s WHERE id_usuario= %s
                    """, (nombre_completo, numero_documento, correo, contrasena, tipo_usuario, tipo_documento, estado, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# Ruta para eliminar usuario
@app.route("/eliminar_usuarios/<int:codigo>", methods=['DELETE'])
def eliminar_usuarios(codigo):
    """Eliminar un usuario por su ID
    ---
    tags:
      - usuario
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Usuario eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM usuario WHERE id_usuario = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
      
  # ============================================================
  # =============   RUTA PARA CONSULTAR TIPOS DE DONANTE   ===========
  # ============================================================

@app.route("/tipo_donante", methods=['GET'])
def tipo_donante():
    """
    Consulta de lista de tipos de donante
    ---
    tags:
      - tipo_donante
    responses:
      200:
        description: lista de tipos de donante
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM tipo_donante")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify ({'tipo_donante': datos, 'mensaje': 'Lista De tipo_Donante'})
        else:
            return jsonify ({'mensaje': 'Tipo de donante no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})
      
# ============================================================
# ========   RUTA PARA REGISTRAR TIPOS DE DONANTE   ==========
# ============================================================
  
@app.route("/registro_tipo_donante", methods=['POST'])
def registro_tipo_donante():
    """
    Registrar un nuevo tipo de donante
    ---
    tags:
      - tipo_donante
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
    responses:
      200:
        description: Tipo de donante registrado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO tipo_donante (descripcion) VALUES (%s)
                    """, (descripcion,))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ======   RUTA PARA ACTUALIZAR TIPOS DE DONANTE   ==========
# ============================================================

@app.route("/actualizar_tipo_donante/<codigo>", methods=["PUT"])
def actualizar_tipo_donante(codigo):
    """
    Actualizar un tipo de donante por su ID
    ---
    tags:
      - tipo_donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
    responses:
      200:
        description: Tipo de donante actualizado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE tipo_donante SET descripcion= %s WHERE id_tipo_donante= %s
                    """, (descripcion,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ========   RUTA PARA ELIMINAR TIPOS DE DONANTE   ===========
# ============================================================

@app.route("/eliminar_tipo_donante/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_donante(codigo):
    """
    Eliminar un tipo de donante por su ID
    ---
    tags:
      - tipo_donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Tipo de donante eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                  DELETE FROM tipo_donante WHERE id_tipo_donante = %s
                  """, (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# =============   RUTA PARA CONSULTAR DONANTES   ===========
# ============================================================

@app.route("/donante", methods=['GET'])
def donante():
    """
    Consulta de lista de donantes
    ---
    tags:
      - donante
    responses:
      200:
        description: lista de donantes
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM donante")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify ({'donante': datos, 'mensaje': 'Lista De Donante'})
        else:
            return jsonify ({'mensaje': 'Donante no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})

# ============================================================
# =============   RUTA PARA CONSULTAR DONANTES POR ID   ===========
# ============================================================

@app.route("/donante/<int:codigo>", methods=['GET'])
def donante_por_id(codigo):
    """
    Obtener un donante por su ID
    ---
    tags:
      - donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Donante encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM donante WHERE id_donante = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'donante': datos, 'mensaje': 'Donante encontrado'})
        else:
            return jsonify({'mensaje': 'Donante no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============   RUTA PARA REGISTRAR DONANTE   ===========
# ============================================================

@app.route("/registro_donante", methods=['POST'])
def registro_donante():
    """
    Registrar un nuevo donante
    ---
    tags:
      - donante
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_donante:
              type: string
            nombre:
              type: string
            numero_documento:
              type: string
            telefono:
              type: string
            correo:
              type: string
            direccion:
              type: string
            estado:
              type: string
            tipo_documento:
              type: string
            tipo_donante:
              type: string
    responses:
      200:
        description: Donante registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        numero_documento = data['numero_documento']
        telefono = data['telefono']
        correo = data['correo']
        direccion = data['direccion']
        estado = data['estado']
        tipo_documento = data['tipo_documento']
        tipo_donante = data['tipo_donante']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO donante (nombre, numero_documento, telefono, correo, direccion, estado, tipo_documento, tipo_donante)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""", (nombre, numero_documento, telefono, correo, direccion, estado, tipo_documento, tipo_donante))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# =============   RUTA PARA ACTUALIZAR DONANTE   ===========
# ============================================================

@app.route("/actualizar_donante/<codigo>", methods=["PUT"])
def actualizar_donante(codigo):
    """
    Actualizar un donante por su ID
    ---
    tags:
      - donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            nombre:
              type: string
            numero_documento:
              type: string
            telefono:
              type: string
            correo:
              type: string
            direccion:
              type: string
            estado:
              type: string
            tipo_documento:
              type: string
            tipo_donante:
              type: string
    responses:
      200:
        description: Donante actualizado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        numero_documento = data['numero_documento']
        telefono = data['telefono']
        correo = data['correo']
        direccion = data['direccion']
        estado = data['estado']
        tipo_documento = data['tipo_documento']
        tipo_donante = data['tipo_donante']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE donante SET nombre= %s, numero_documento= %s, telefono= %s, correo= %s, direccion= %s, estado= %s, tipo_documento= %s, tipo_donante= %s WHERE id_donante= %s
                    """, (nombre, numero_documento, telefono, correo, direccion, estado, tipo_documento, tipo_donante, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============   RUTA PARA ELIMINAR DONANTE   ===========
# ============================================================

@app.route("/eliminar_donante/<int:codigo>", methods=['DELETE'])
def eliminar_donante(codigo):
    """
    Eliminar donante por ID
    ---
    tags:
      - donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Donante eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM donante WHERE id_donante = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# =========   RUTA PARA CONSULTAR TIPO DONACION   ===========
# ============================================================

@app.route("/tipo_donacion", methods=['GET'])
def tipo_donacion():
    """
    Consulta de lista de tipos de donación
    ---
    tags:
      - tipo_donacion
    responses:
      200:
        description: lista de tipos de donación
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto')
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM tipo_donacion") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_donacion': datos, 'mensaje': 'Lista De Tipo Donacion'})
        else:
            return jsonify({'mensaje': 'Tipo de donacion no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})
      


# ============================================================
# ==========   RUTA PARA REGISTRAR TIPO DONACION   ===========
# ============================================================

@app.route("/registro_tipo_donacion", methods=['POST'])
def registro_tipo_donacion():
    """
    Registrar un nuevo tipo de donación
    ---
    tags:
      - tipo_donacion
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
    responses:
      200:
        description: Tipo de donación registrado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO tipo_donacion (descripcion) 
                    VALUES (%s)""", (descripcion,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# =========   RUTA PARA ACTUALIZAR TIPO DONACION   ===========
# ============================================================

@app.route("/actualizar_tipo_donacion/<codigo>", methods=["PUT"])
def actualizar_tipo_donacion(codigo):
    """
    Actualizar un tipo de donación por su ID
    ---
    tags:
      - tipo_donacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
    responses:
      200:
        description: Tipo de donación actualizado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE tipo_donacion SET descripcion= %s WHERE codigo= %s""",
                    (descripcion,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===========   RUTA PARA ELIMINAR TIPO DONACION   ===========
# ============================================================

@app.route("/eliminar_tipo_donacion/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_donacion(codigo):
    """
    Eliminar tipo de donación por ID
    ---
    tags:
      - tipo_donacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Tipo de donación eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_donacion WHERE codigo = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar'})

# ============================================================
# =============   RUTA PARA CONSULTAR DONACIONES   ===========
# ============================================================

@app.route("/donacion", methods=['GET'])
def donacion():
    """
    Consulta de lista de donaciones
    ---
    tags:
      - donacion
    responses:
      200:
        description: lista de donaciones
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto',)
        cur= conn.cursor()
        cur.execute("SELECT * FROM donacion")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'donacion': datos, 'mensaje': 'donacion'})
        else:
            return jsonify ({'mensaje': 'Donacion no encontrada'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error al consultar'})
      
# ============================================================
# ========   RUTA PARA CONSULTAR DONACION POR ID   ==========
# ============================================================

@app.route("/donacion/<int:codigo>", methods=['GET'])
def donacion_por_id(codigo):
    """
    Obtener una donación por su ID
    ---
    tags:
      - donacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Donación encontrada
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM donacion WHERE id_donacion = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'donacion': datos, 'mensaje': 'Donación encontrada'})
        else:
            return jsonify({'mensaje': 'Donación no encontrada'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al consultar'})

# ============================================================
# =============   RUTA PARA REGISTRAR DONACION   ===========
# ============================================================

@app.route("/registro_donacion", methods=['POST'])
def registro_donacion():
    """
    Registrar una nueva donación
    ---
    tags:
      - donacion
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_donacion:
              type: number
            donante:
              type: string
            fecha:
                type: string
            observaciones:
                type: string
            usuario:
                type: string
            tipo_donacion:
                type: string
    responses:
      200:
        description: donación registrada
    """
    try:
        data = request.get_json()
        donante = data['donante']
        fecha = data['fecha']
        observaciones = data['observaciones']
        usuario = data['usuario']
        tipo_donacion = data['tipo_donacion']
        
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO donacion (donante, fecha, observaciones, usuario, tipo_donacion)
                    VALUES (%s, %s, %s, %s, %s)""", (donante, fecha, observaciones, usuario, tipo_donacion))
        conn.commit() 
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al registrar la donación'})

# # ============================================================
# =============   RUTA PARA ACTUALIZAR DONACION   ===========
# ============================================================

@app.route("/actualizar_donacion/<codigo>", methods=["PUT"])
def actualizar_donacion(codigo):
    """
    Actualizar una donación por su ID
    ---
    tags:
      - donacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_donacion:
              type: string
            donante:
              type: string
            fecha:
              type: string
            observaciones:
              type: string
            usuario:
              type: string
            tipo_donacion:
              type: string
    responses:
      200:
        description: donación actualizada
    """
    try:
        data = request.get_json()
        id_donacion = data['id_donacion']
        donante = data['donante']
        fecha = data['fecha']
        observaciones = data['observaciones']
        usuario = data['usuario']
        tipo_donacion = data['tipo_donacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""UPDATE donacion SET donante= %s, fecha= %s, observaciones= %s, usuario= %s, tipo_donacion= %s WHERE id_donacion= %s""",
                    (donante, fecha, observaciones, usuario, tipo_donacion, id_donacion))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar la donación'})

# ============================================================
# ============= RUTA ELIMINAR DONACION  ===========
# ============================================================

@app.route("/eliminar_donacion/<int:codigo>", methods=['DELETE'])
def eliminar_donacion(codigo):
    """
    Eliminar donación por ID
    ---
    tags:
      - donacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Donación eliminada
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM donacion WHERE id_donacion = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar la donación'})


# ============================================================
# ============= DONACION_MONETARIA ===========
# ============================================================

@app.route("/donacion_monetaria", methods=['GET'])
def donacion_monetaria():
    """
    Consulta de lista de donacion_monetaria
    ---
    tags:
      - donacion_monetaria
    responses:
      200:
        description: lista de donacion_monetaria
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM donacion_monetaria") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'donacion_monetaria': datos, 'mensaje': 'Lista De donacion_monetaria'})
        else:
            return jsonify({'mensaje': 'donacion_monetaria no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})




# ============================================================
# ============= REGISTRO DONACION MONETARIA ===========
# ============================================================

@app.route("/registro_donacion_monetaria", methods=['POST'])
def registro_donacion_monetaria():
    """
    Registrar una donacion_monetaria
    ---
    tags:
      - donacion_monetaria
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ID:
              type: string
            id_donacion_monetaria:
              type: string
            donante:
              type: string
            monto:
              type: string
            fecha:
              type: string
            banco:
              type: string
            numero_transferencia:
              type: string
            usuario:
              type: string
            tipo_donacion:
              type: string
    responses:
      200:
        description: donacion_monetaria registrado
    """
    try:
        data = request.get_json()
        donante = data['donante']
        monto = data['monto']
        fecha = data['fecha']
        banco = data['banco']
        numero_transferencia = data['numero_transferencia']
        usuario = data['usuario']
        tipo_donacion = data['tipo_donacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO donacion_monetaria (donante, monto, fecha, banco, numero_transferencia, usuario, tipo_donacion) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)""", (donante, monto, fecha, banco, numero_transferencia, usuario, tipo_donacion))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al registrar la donacion_monetaria'})

# ============================================================
# =============   ACTUALIZAR DONACION MONETARIA ===========
# ============================================================

@app.route("/actualizar_donacion_monetaria/<codigo>", methods=["PUT"])
def actualizar_donacion_monetaria(codigo):
    """
    Actualizar una donacion_monetaria por su ID
    ---
    tags:
      - donacion_monetaria
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_donacion_monetaria:
              type: string
            donante:
              type: string
            monto:
              type: string
            fecha:
              type: string
            banco:
              type: string 
            numero_transferencia:
              type: string
            usuario:
              type: string
            tipo_donacion:
              type: string
      
    responses:
      200:
        description: donacion_monetaria actualizado
    """
    try:
        data = request.get_json()
        id_donacion_monetaria = data['id_donacion_monetaria']
        donante = data['donante']
        monto = data['monto']
        fecha = data['fecha']
        banco = data['banco']
        numero_transferencia = data['numero_transferencia']
        usuario = data['usuario']
        tipo_donacion = data['tipo_donacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE donacion_monetaria SET donante= %s, monto= %s, fecha= %s, banco= %s, numero_transferencia= %s, usuario= %s, tipo_donacion= %s WHERE id_donacion_monetaria= %s""",
                    (donante, monto, fecha, banco, numero_transferencia, usuario, tipo_donacion, id_donacion_monetaria))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar la donacion_monetaria'})

# ============================================================
# =============   ELIMINAR DONACION MONETARIA ===========
# ============================================================
  
@app.route("/eliminar_donacion_monetaria/<int:codigo>", methods=['DELETE'])
def eliminar_donacion_monetaria(codigo):
    """
    Eliminar donacion_monetaria por ID
    ---
    tags:
      - donacion_monetaria
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: donacion_monetaria eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM donacion_monetaria WHERE ID = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar la donacion_monetaria'})

# ============================================================
# =============   CERTIFICADO DONANTE ===========
# ============================================================

@app.route("/certificado_donante", methods=['GET'])
def certificado_donante():
    """
    Obtener todos los certificados de donante
    ---
    tags:
      - certificado_donante
    responses:
      200:
        description: Lista de certificados de donante
    """
    try:
        conn = conectar('localhost','root','lupi19','proyecto') # se conecta a la base de datos
        cur = conn.cursor() # cursor para ejecutar consultas
        cur.execute("SELECT * FROM certificado_donante") 
        datos = cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'certificado_donante': datos, 'mensaje': 'Lista De certificado_donante'})
        else:
            return jsonify({'mensaje': 'certificado_donante no encontrado'})
    except Exception as ex:
        print(ex) # imprime el error
        return jsonify ({'mensaje': 'Error'})


# ============================================================
# =============   CERTIFICADO DONANTE POR ID  ===========
# ============================================================


@app.route("/certificado_donante/<int:codigo>", methods=['GET'])
def certificado_donante_por_id(codigo):
    """
    Obtener un certificado de donante por su ID
    ---
    tags:
      - certificado_donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Certificado de donante encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM certificado_donante WHERE id_certificado = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'certificado_donante': datos, 'mensaje': 'Certificado de donante encontrado'})
        else:
            return jsonify({'mensaje': 'Certificado de donante no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# =============  ACTUALIZAR CERTIFICADO DONANTE  ===========
# ============================================================

@app.route("/registro_certificado_donante", methods=['POST'])
def registro_certificado_donante():
    """
    Registrar un nuevo certificado de donante
    ---
    tags:
      - certificado_donante
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            fecha:
              type: string
            valor_donado:
              type: string
            firma_representante:
              type: string
            id_donante:
              type: string
            tipo_certificado:
              type: string
            id_donacion:
              type: string
            id_donacion_monetaria:
              type: string
    responses:
      200:
        description: Certificado de donante registrado
    """
    try:
        data = request.get_json()
        fecha = data['fecha']
        valor_donado = data['valor_donado']
        firma_representante = data['firma_representante']
        id_donante = data['id_donante']
        tipo_certificado = data['tipo_certificado']
        id_donacion = data['id_donacion']
        id_donacion_monetaria = data['id_donacion_monetaria']

        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""INSERT INTO certificado_donante (fecha, valor_donado, firma_representante, id_donante, tipo_certificado, id_donacion, id_donacion_monetaria) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s)""", (fecha, valor_donado, firma_representante, id_donante, tipo_certificado, id_donacion, id_donacion_monetaria))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al registrar el certificado de donante'})

# ============================================================
# =============   ACTUALIZAR CERTIFICADO DONANTE  ===========
# ============================================================

@app.route("/actualizar_certificado_donante/<codigo>", methods=["PUT"])
def actualizar_certificado_donante(codigo):
    """
    Actualizar un certificado de donante por su ID
    ---
    tags:
      - certificado_donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            fecha:
              type: string
            valor_donado:
              type: string
            firma_representante:
              type: string
            id_donante:
              type: string
            tipo_certificado:
              type: string
            id_donacion:
              type: string  
            id_donacion_monetaria:
              type: string
    responses:
      200:
        description: Certificado de donante actualizado
    """
    try:
        data = request.get_json()
        fecha = data['fecha']
        valor_donado = data['valor_donado']
        firma_representante = data['firma_representante']
        id_donante = data['id_donante']
        tipo_certificado = data['tipo_certificado']
        id_donacion = data['id_donacion']
        id_donacion_monetaria = data['id_donacion_monetaria']
        tipo_donacion = data['tipo_donacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE certificado_donante SET fecha= %s, valor_donado= %s, firma_representante= %s, id_donante= %s, tipo_certificado= %s, id_donacion= %s, id_donacion_monetaria= %s, tipo_donacion= %s WHERE id_certificado= %s
                    """, (fecha, valor_donado, firma_representante, id_donante, tipo_certificado, id_donacion, id_donacion_monetaria, tipo_donacion, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar el certificado de donante'})



# ============================================================
# =============   ELIMINAR CERTIFICADO DONANTE  ===========
# ============================================================

@app.route("/eliminar_certificado_donante/<int:codigo>", methods=['DELETE'])
def eliminar_certificado_donante(codigo):
    """
    Eliminar certificado_donante por ID
    ---
    tags:
      - certificado_donante
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: certificado_donante eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM certificado_donante WHERE id_certificado = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar el certificado de donante'})


# ============================================================
# =============  RUTA CATEGORIA PRODUCTO  ===========
# ============================================================

@app.route("/categoria_producto", methods=['GET'])
def categoria_producto():
    """
    Consulta de lista de categorias de producto
    ---
    tags:
      - categoria_producto
    responses:
      200:
        description: lista de categorias de producto
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM categoria_producto")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'categoria_producto': datos, 'mensaje': 'Lista De categoria_producto'})
        else:
            return jsonify({'mensaje': 'categoria_producto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})


# ============================================================
# ============= RUTA REGISTRO CATEGORIA PRODUCTO ===========
# ============================================================

@app.route("/registro_categoria_producto", methods=['POST'])
def registro_categoria_producto():
    """
    Registrar un nuevo categoria_producto
    ---
    tags:
      - categoria_producto
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              descripcion:
                type: string
    responses:
      200:
        description: Categoria_producto registrado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO categoria_producto (descripcion)
                    VALUES (%s)""", (descripcion,))
        conn.commit() 
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============  RUTA ACTUALIZAR CATEGORIA PRODUCTO  ===========
# ============================================================


@app.route("/actualizar_categoria_producto/<codigo>", methods=["PUT"])
def actualizar_categoria_producto(codigo):
    """
    Actualizar una categoria_producto por su ID
    ---
    tags:
      - categoria_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
    responses:
      200:
        description: Categoria_producto actualizado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE categoria_producto SET descripcion= %s WHERE id_categoria_producto= %s
                    """, (descripcion,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar categoria_producto'})


# ============================================================
# =============   RUTA ELIMINAR CATEGORIA PRODUCTO  ===========
# ============================================================

@app.route("/eliminar_categoria_producto/<int:codigo>", methods=['DELETE'])
def eliminar_categoria_producto(codigo):
    """
    Eliminar categoria_producto por ID
    ---
    tags:
      - categoria_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: categoria_producto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM categoria_producto WHERE codigo = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al eliminar categoria_producto'})



# ============================================================
# ============= RUTA SUBCATEGORIA  ===========
# ============================================================

@app.route("/subcategoria_producto", methods=['GET'])
def subcategoria_producto():
    """
    Consulta de lista de subcategorias de producto
    ---
    tags:
      - subcategoria_producto
    responses:
      200:
        description: lista de subcategorias de producto
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM subcategoria_producto")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'subcategoria_producto': datos, 'mensaje': 'Lista De subcategoria_producto'})
        else:
            return jsonify({'mensaje': 'subcategoria_producto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error '})
      
      
# ============================================================
# ============= RUTA REGISTRO SUBCATEGORIA  ===========
# ============================================================
      
@app.route("/registro_subcategoria_producto", methods=['POST'])
def registro_subcategoria_producto():
    """
    Registro de un nuevo subcategoria_producto
    ---
    tags:
      - subcategoria_producto
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
            categoria_producto:
              type: integer
    responses:
      200:
        description: subcategoria_producto registrado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        categoria_producto = data['categoria_producto']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO subcategoria_producto (descripcion, categoria_producto)
                    VALUES (%s, %s)""", (descripcion, categoria_producto))
        conn.commit()  
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============  RUTA ACTUALIZAR SUBCATEGORIA ===========
# ============================================================

@app.route("/actualizar_subcategoria_producto/<codigo>", methods=["PUT"])
def actualizar_subcategoria_producto(codigo):
    """
    Actualizar una subcategoria_producto por su ID
    ---
    tags:
      - subcategoria_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            descripcion:
              type: string
            categoria_producto:
              type: integer
    responses:
      200:
        description: subcategoria_producto actualizado
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        categoria_producto = data['categoria_producto']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE subcategoria_producto SET descripcion= %s, categoria_producto= %s WHERE id_subcategoria= %s""", 
                    (descripcion,categoria_producto,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
      
# ============================================================
# ================ ELIMINAR SUBCATEGORIA  ====================
# ============================================================

@app.route("/eliminar_subcategoria_producto/<int:codigo>", methods=['DELETE'])
def eliminar_subcategoria_producto(codigo):
    """
    Eliminar subcategoria_producto por ID
    ---
    tags:
      - subcategoria_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: subcategoria_producto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM subcategoria_producto WHERE codigo = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ============= RUTA FECHA VENCIMIENTO  ===========
# ============================================================

@app.route("/fecha_vencimiento", methods=['GET'])
def fecha_vencimiento():
    """
    Consulta de lista de fechas de vencimiento
    ---
    tags:
      - fecha_vencimiento
    responses:
      200:
        description: lista de fechas de vencimiento
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM fecha_vencimiento")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'fecha_vencimiento': datos, 'mensaje': 'Lista De fecha_vencimiento'})
        else:
            return jsonify({'mensaje': 'fecha_vencimiento no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})

# ============================================================
# ============= RUTA FECHA VENCIMIENTO POR ID ==============
# ============================================================

@app.route("/fecha_vencimiento/<int:codigo>", methods=['GET'])
def fecha_vencimiento_por_id(codigo):
    """
    Obtener una fecha_vencimiento por su ID
    ---
    tags:
      - fecha_vencimiento
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Fecha de vencimiento encontrada
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM fecha_vencimiento WHERE id_vencimiento = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'fecha_vencimiento': datos, 'mensaje': 'Fecha de vencimiento encontrada'})
        else:
            return jsonify({'mensaje': 'Fecha de vencimiento no encontrada'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ============= RUTA REGISTRO FECHA VENCIMIENTO  ===========
# ============================================================

@app.route("/registro_fecha_vencimiento", methods=['POST'])
def registro_fecha_vencimiento():
    """
    Registrar un nuevo fecha_vencimiento
    ---
    tags:
      - fecha_vencimiento
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id_donacion:
                type: string
              id_producto:
                type: string
              cantidad:
                type: string
    responses:
      200:
        description: fecha_vencimiento registrado
    """
    try:
        data = request.get_json()
        id_donacion = data['id_donacion']
        id_producto = data['id_producto']
        cantidad = data['cantidad']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO fecha_vencimiento (id_donacion, id_producto, cantidad)
                    VALUES (%s, %s, %s)""", (id_donacion, id_producto, cantidad))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ============= RUTA ELIMINAR FECHA VENCIMIENTO   ===========
# ============================================================

@app.route("/eliminar_fecha_vencimiento/<int:codigo>", methods=['DELETE'])
def eliminar_fecha_vencimiento(codigo):
    """
    Eliminar fecha_vencimiento por ID
    ---
    tags:
      - fecha_vencimiento
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: fecha_vencimiento eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM fecha_vencimiento WHERE id_vencimiento = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============   ACTUALIZAR FECHA VENCIMIENTO  ===========
# ============================================================

@app.route("/actualizar_fecha_vencimiento/<codigo>", methods=["PUT"])
def actualizar_fecha_vencimiento(codigo):
    """
    Actualizar una fecha de vencimiento por su ID
    ---
    tags:
      - fecha vencimiento
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            id_donacion:
              type: string
            id_producto:
              type: string
            cantidad:
              type: string
    responses:
      200:
        description: Fecha de vencimiento actualizada
    """
    try:
        data = request.get_json()
        id_donacion= ['id_donacion']
        id_producto= ['id_producto']
        cantidad= ['cantidad']
        
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE fecha_vencimiento SET id_donacion= %s, id_producto= %s, cantidad= %s WHERE id_vencimiento= %s""",
                    (id_donacion,id_producto,cantidad,codigo))

        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado correctamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error al actualizar la fecha de vencimiento'})


# ============================================================
# =============  RUTA DE ACTA DE VENCIMIENTO ===========
# ============================================================

@app.route("/acta_vencimiento", methods=['GET'])
def acta_vencimiento():
    """
    Consulta de lista de actas de vencimiento
    ---
    tags: 
      - acta_vencimiento
    responses:
      200:
        description: lista de actas de vencimiento
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM acta_vencimiento")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'acta_vencimiento': datos, 'mensaje': 'Lista De acta_vencimiento'})
        else:
            return jsonify({'mensaje': 'acta_vencimiento no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})
      

# ============================================================
# ============= RUTA ATUALIZAR ACTA VENCIMIENTO  =============
# ============================================================

@app.route("/registro_acta_vencimiento", methods=['POST'])
def registro_acta_vencimiento():
    """
    Registrar un nuevo acta_vencimiento
    ---
    tags:
      - acta_vencimiento
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              fecha:
                type: string
              descripcion:
                type: string
    responses:
      200:
        description: acta_vencimiento registrado
    """
    try:
        data = request.get_json()
        fecha = data['fecha']
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO acta_vencimiento (fecha, descripcion)
                    VALUES (%s, %s)""", (fecha, descripcion))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# ============= ELIMINAR ACTA DE VENCIMIENTO  ================
# ============================================================

@app.route("/eliminar_acta_vencimiento/<int:codigo>", methods=['DELETE'])
def eliminar_acta_vencimiento(codigo):
    """
    Eliminar acta_vencimiento por ID
    ---
    tags:
      - acta_vencimiento
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: acta_vencimiento eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM acta_vencimiento WHERE id_acta = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


# ============================================================
# ================= RUTA DE PARA BODEGA   ====================
# ============================================================

@app.route("/bodega", methods=['GET'])
def bodega():
    """
    Consulta de lista de bodegas
    ---
    tags:
      - bodega
    responses:
      200:
        description: lista de bodegas
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM bodega")
        datos= cur.fetchall()
        print(datos)
        cur.close()
        conn.close()
        if datos:
            return jsonify({'bodega': datos, 'mensaje': 'Lista De bodega'})
        else:
            return jsonify({'mensaje': 'bodega no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify ({'Mensaje': 'Error'})


# ============================================================
# ============= RUTA DE BODEGA POR ID   ================
# ============================================================

@app.route("/bodega/<int:codigo>", methods=['GET'])
def bodega_por_id(codigo):
    """
    Obtener una bodega por su ID
    ---
    tags:
      - bodega
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Bodega encontrada
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM bodega WHERE id_bodega = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'bodega': datos, 'mensaje': 'Bodega encontrada'})
        else:
            return jsonify({'mensaje': 'Bodega no encontrada'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============  RUTA PARA AGREGAR BODEGA  ==================
# ============================================================

@app.route("/registro_bodega", methods=['POST'])
def registro_bodega():
    """
    Registrar una nueva bodega
    ---
    tags:
      - bodega
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre_bodega:
                type: string
              capacidad:
                type: integer
              estado:
                type: string
    responses:
      200:
        description: Bodega registrada
    """
    try:
        data = request.get_json()
        nombre_bodega = data['nombre_bodega']
        ubicacion =['ubicacion']
        capacidad = data['capacidad']
        estado = data['estado']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO bodega (nombre_bodega, ubicacion, capacidad, estado) VALUES (%s, %s, %s, %s)", (nombre_bodega, ubicacion, capacidad, estado))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
# ============================================================
# ============= RUTA PARA ACTUALIZAR BODEGA   ================
# ============================================================

@app.route("/actualizar_bodega/<codigo>", methods=["PUT"])
def actualizar_bodega(codigo):
    """
    Actualizar una bodega
    ---
    tags:
      - bodega
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre_bodega:
                type: string
              capacidad:
                type: integer
              estado:
                type: string
    responses:
      200:
        description: Bodega actualizada
    """
    try:
        data = request.get_json()
        nombre_bodega = data['nombre_bodega']
        ubicacion = ['ubicacion']
        capacidad = data['capacidad']
        estado = data['estado']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("UPDATE bodega SET nombre_bodega= %s, ubicacion=%s, capacidad= %s, estado= %s WHERE id_bodega= %s", 
                    (nombre_bodega, ubicacion, capacidad, estado, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ============= RUTA PARA ELIMINAR BODEGA  ================
# ============================================================

@app.route("/eliminar_bodega/<int:codigo>", methods=['DELETE'])
def eliminar_bodega(codigo):
    """
    Eliminar bodega por ID
    ---
    tags:
      - bodega
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: bodega eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM bodega WHERE id_bodega = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminada Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
    
# ============================================================
# ============= RUTA PARA UNIDAD DE MEDIDA  ==================
# ============================================================

@app.route("/unidad_de_medida", methods=['GET'])
def unidad_de_medida():
    """
    Obtener lista de unidades de medida
    ---
    tags: 
      - unidad_de_medida
    responses:
      200:
        description: Lista de unidades de medida
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM unidad_de_medida")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'unidad_de_medida': datos, 'mensaje': 'Lista De unidad_de_medida'})
        else:
            return jsonify({'mensaje': 'unidad_de_medida no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})
        
# ============================================================
# ========== RUTA PARA AGREGAR UNIDAD DE MEDIDA  =============
# ============================================================

@app.route("/registro_unidad_de_medida", methods=['POST'])
def registro_unidad_de_medida():
    """
    Registrar una nueva unidad de medida
    ---
    tags:
      - unidad_de_medida
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: integer
    responses:
      200:
        description: Unidad de medida registrada
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO unidad_de_medida (nombre) VALUES (%s)", (nombre,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =========== RUTA PARA ACTUALIZAR UNIDAD MEDIDA  ============
# ============================================================

@app.route("/actualizar_unidad_de_medida/<codigo>", methods=["PUT"])
def actualizar_unidad_de_medida(codigo):
    """
    Actualizar una unidad de medida
    ---
    tags:
      - unidad_de_medida
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
    responses:
      200:
        description: Unidad de medida actualizada
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE unidad_de_medida SET nombre= %s WHERE id_unidad_de_medida= %s""", 
                    (nombre, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ===========   RUTA PARA ELIMINAR UNDAD MEDIDA  =============
# ============================================================

@app.route("/eliminar_unidad_de_medida/<int:codigo>", methods=['DELETE'])
def eliminar_unidad_de_medida(codigo):
    """
    Eliminar unidad_de_medida por ID
    ---
    tags:
      - unidad_de_medida
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: unidad_de_medida eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM unidad_de_medida WHERE codigo = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# =============  RUTA PARA TIPO ORGANIZACION  ================
# ============================================================

@app.route("/tipo_organizacion", methods=['GET'])
def tipo_organizacion():
    """
    Consulta de lista de tipo_organizacion
    ---
    tags:
      - tipo_organizacion
    responses:
      200:
        description: lista de tipo_organizacion
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM tipo_organizacion")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_organizacion': datos, 'mensaje': 'Lista De tipo_organizacion'})
        else:
            return jsonify({'mensaje': 'tipo_organizacion no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# ============================================================
# =========  RUTA PARA AGREGAR TIPO ORGANIZACION =============
# ============================================================

@app.route("/registro_tipo_organizacion", methods=['POST'])
def registro_tipo_organizacion():
    """
    Registrar un nuevo tipo de organización
    ---
    tags:
      - tipo_organizacion
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
    responses:
      200:
        description: Tipo de organización registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = ['descripcion']
        
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute(""" 
                    INSERT INTO tipo_organizacion (nombre, descripcion) VALUES (%s, %s)""", (nombre, descripcion))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
# ============================================================
# ============ RUTA ACTUALIZAR TIPO ORGANIZACION =============
# ============================================================

@app.route("/actualizar_tipo_organizacion/<codigo>", methods=["PUT"])
def actualizar_tipo_organizacion(codigo):
    """
    Actualizar un tipo de organización
    ---
    tags:
      - tipo_organizacion
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
    responses:
      200:
        description: Tipo de organización actualizado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion =['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("UPDATE tipo_organizacion SET nombre= %s, descripcion= %s, WHERE id_tipo_organizacion= %s", 
                    (nombre,descripcion,codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =========== RUTA ELIMINAR TIPO ORGANIZACION ================
# ============================================================

@app.route("/eliminar_tipo_organizacion/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_organizacion(codigo):
    """
    Eliminar tipo_organizacion por ID
    ---
    tags:
      - tipo_organizacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: tipo_organizacion eliminada
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_organizacion WHERE id_tipo_organizacion = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
    
# ============================================================
# ===============  RUTA PARA TIPO ENTREGA ====================
# ============================================================

@app.route("/tipo_entrega", methods=['GET'])
def tipo_entrega():
    """
    Consulta de lista de tipo_entrega
    ---
    tags:
      - tipo_entrega
    responses:
      200:
        description: lista de tipo_entrega
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM tipo_entrega")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_entrega': datos, 'mensaje': 'Lista De tipo_entrega'})
        else:
            return jsonify({'mensaje': 'tipo_entrega no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# ============================================================
# =============  RUTA DE TIPO ENTREGA POR ID =================
# ============================================================

@app.route("/tipo_entrega/<int:codigo>", methods=['GET'])
def tipo_entrega_por_id(codigo):
    """
    Obtener un tipo_entrega por su ID
    ---
    tags:
      - tipo_entrega
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Tipo de entrega encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM tipo_entrega WHERE id_tipo_entrega = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'tipo_entrega': datos, 'mensaje': 'Tipo de entrega encontrado'})
        else:
            return jsonify({'mensaje': 'Tipo de entrega no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============  RUTA PARA AGREGAR TIPO ENTREGA ==============
# ============================================================

@app.route("/registro_tipo_entrega", methods=['POST'])
def registro_tipo_entrega():
    """
    Registro de un nuevo tipo de entrega
    ---
    tags:
      - tipo_entrega
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
    responses:
      200:
        description: Tipo de entrega registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = data['descripcion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("INSERT INTO tipo_entrega (nombre, descripcion) VALUES (%s, %s)", (nombre, descripcion))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ============ RUTA PARA ELIMINAR TIPO ENTREGA  ==============
# ============================================================

@app.route("/eliminar_tipo_entrega/<int:codigo>", methods=['DELETE'])
def eliminar_tipo_entrega(codigo):
    """
    Eliminar tipo_entrega por ID
    ---
    tags:
      - tipo_entrega
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: tipo_entrega eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM tipo_entrega WHERE id_tipo_entrega = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# ================  RUTA PARA ORGANIZACION ===================
# ============================================================

@app.route("/organizacion", methods=['GET'])
def organizacion():
    """
    Consulta de lista de organizacion
    ---
    tags:
      - organizacion
    responses:
      200:
        description: lista de organizacion
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM organizacion")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'organizacion': datos, 'mensaje': 'Lista De organizacion'})
        else:
            return jsonify({'mensaje': 'organizacion no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# ============================================================
# =============  RUTA AGREGAR ORGANIZACION   =================
# ============================================================

@app.route("/registro_organizacion", methods=['POST'])
def registro_organizacion():
    """
    Registrar una nueva organización
    ---
    tags:
      - organizacion
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              descripcion:
                type: string
              nombre:
                type: string
              responsable:
                type: string
              telefono:
                type: string
              direccion:
                type: string
              tipo_entrega:
                type: string
              tipo_organizacion:
                type: string
    responses:
      200:
        description: Organización registrada
    """
    try:
        data = request.get_json()
        descripcion = data['descripcion']
        nombre = data['nombre']
        responsable = data['responsable']
        telefono = data['telefono']
        direccion = data['direccion']
        tipo_entrega = data['tipo_entrega']
        tipo_organizacion = data['tipo_organizacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO organizacion (descripcion, nombre, responsable, telefono, direccion, tipo_entrega, tipo_organizacion)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)""", (descripcion, nombre, responsable, telefono, direccion, tipo_entrega, tipo_organizacion))
        conn.commit()  # Para confirmar la inserción de la información
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =========== RUTA PARA ACTUALIZAR ORGANIZACION   ============
# ============================================================

@app.route("/actualizar_organizacion/<codigo>", methods=["PUT"])
def actualizar_organizacion(codigo):
    """
    Actualizar una organización existente
    ---
    tags:
      - organizacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              descripcion:
                type: string
              nombre:
                type: string
              responsable:
                type: string
              telefono:
                type: string
              direccion:
                type: string
              tipo_entrega:
                type: string
              tipo_organizacion:
                type: string
    responses:
      200:
        description: Organización actualizada
    """
    try:
        data = request.get_json()
        codigo = data['codigo']
        descripcion = data['descripcion']
        nombre = data['nombre']
        responsable = data['responsable']
        telefono = data['telefono']
        direccion = data['direccion']
        tipo_entrega = data['tipo_entrega']
        tipo_organizacion = data['tipo_organizacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE organizacion SET descripcion= %s, nombre= %s, responsable= %s, telefono= %s, direccion= %s, tipo_entrega= %s, tipo_organizacion= %s WHERE codigo= %s""", 
                    (descripcion, nombre, responsable, telefono, direccion, tipo_entrega, tipo_organizacion, codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =========== RUTA PARA ELIMINAR ORGANIZACION  ===============
# ============================================================

@app.route("/eliminar_organizacion/<int:codigo>", methods=['DELETE'])
def eliminar_organizacion(codigo):
    """
    Eliminar organizacion por ID
    ---
    tags:
      - organizacion
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: organizacion eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM organizacion WHERE codigo = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    
    
# ============================================================
# ============= RUTA PARA MOVIMIENTO PRODUCTO  ===============
# ============================================================

@app.route("/movimiento_producto", methods=['GET'])
def movimiento_producto():
    """
    Consulta de lista de movimiento_producto
    ---
    tags:
      - movimiento_producto
    responses:
      200:
        description: lista de movimiento_producto
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM movimiento_producto")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'movimiento_producto': datos, 'mensaje': 'Lista De movimiento_producto'})
        else:
            return jsonify({'mensaje': 'movimiento_producto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# ============================================================
# =========== RUTA MOVIMIENTO PRODUCTO POR ID  ===============
# ============================================================

@app.route("/movimiento_producto/<int:codigo>", methods=['GET'])
def movimiento_producto_por_id(codigo):
    """
    Obtener un movimiento_producto por su ID
    ---
    tags:
      - movimiento_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: Movimiento encontrado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("SELECT * FROM movimiento_producto WHERE ID = %s", (codigo,))
        datos = cur.fetchone()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'movimiento_producto': datos, 'mensaje': 'Movimiento encontrado'})
        else:
            return jsonify({'mensaje': 'Movimiento no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =========== RUTA AGREGAR MOVIMIENTO PRODUCTO  ==============
# ============================================================

@app.route("/registro_movimiento_producto", methods=['POST'])
def registro_movimiento_producto():
    """
    Registrar un nuevo movimiento_producto
    ---
    tags:
      - movimiento_producto
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id_producto:
                type: string
              movimiento:
                type: integer
              fecha:
                type: string
              cantidad:
                type: integer
              observacion:
                type: string
              tipo_donacion:
                type: string
              organizacion:
                type: string
    responses:
      200:
        description: Movimiento registrado
    """
    try:
        data = request.get_json()
        id_producto = data['id_producto']
        movimiento = data['movimiento']
        cantidad = data['cantidad']
        fecha = data['fecha']
        observacion = data['observacion']
        tipo_donacion = data['tipo_donacion']
        organizacion = data['organizacion']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO movimiento_producto (id_producto, movimiento, cantidad, fecha, observacion, tipo_donacion, organizacion)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)""", 
                    (id_producto, movimiento, cantidad, fecha, observacion, tipo_donacion, organizacion))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ========== RUTA ACTUALIZAR MOVIMIENTO PRODUCTO  ============
# ============================================================

@app.route("/actualizar_movimiento_producto/<id>", methods=["PUT"])
def actualizar_movimiento_producto(id):
    """
    Actualizar un movimiento_producto existente
    ---
    tags:
      - movimiento_producto
    parameters:
      - name: id
        in: path
        required: true
        type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id_producto:
                type: string
              movimiento:
                type: string
              cantidad:
                type: integer
              observacion:
                type: string
              tipo_donacion:
                type: string
              organizacion:
                type: string
              tipo_organizacion:
                type: string
              tipo_entrega:
                type: string
    responses:
      200:
        description: Movimiento actualizado
    """
    try:
        data = request.get_json()
        id_producto =['id_producto']
        movimiento = data['movimiento']
        cantidad = data['cantidad']
        observacion = data['observacion']
        tipo_donacion = data['tipo_donacion']
        organizacion = data['organizacion']
        tipo_organizacion = data['tipo_organizacion']
        tipo_entrega = data['tipo_entrega']
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE movimiento_producto SET id_producto= %s, movimiento= %s, cantidad= %s, observacion= %s, tipo_donacion= %s, organizacion= %s, tipo_organizacion= %s, tipo_entrega= %s WHERE id= %s""", 
                    (id_producto,movimiento, cantidad, observacion, tipo_donacion, organizacion, tipo_organizacion, tipo_entrega, id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ========== RUTA ELIMINAR MOVIMIENTO PRODUCTO   =============
# ============================================================

@app.route("/eliminar_movimiento_producto/<int:codigo>", methods=['DELETE'])
def eliminar_movimiento_producto(codigo):
    """
    Eliminar movimiento_producto por ID
    ---
    tags:
      - movimiento_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: movimiento_producto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM movimiento_producto WHERE id = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado Exitosamente'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    


# ============================================================
# ================= RUTA PARA PRODUCTO  ======================
# ============================================================

@app.route("/producto", methods=['GET'])
def producto():

    """
    Obtener la lista de productos
    ---
    tags:
      - producto
    responses:
      200:
        description: Lista de productos
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM producto")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'producto': datos})
        else:
            return jsonify({'mensaje': 'producto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# ============================================================
# ============== RUTA AGREGAR PRODUCTOS   ====================
# ============================================================

@app.route("/registro_producto", methods=['POST'])
def registro_producto():
    """
    Registrar un nuevo producto
    ---
    tags:
      - producto
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
              cantidad:
                type: string
              codigo_barras:
                type: string
              stock:
                type: string
              stock_maximo:
                type: string
              stock_minimo:
                type: string
              categoria_producto:
                type: string
              subcategoria_producto:
                type: string
              estado:
                type: string
              unidad_de_medida:
                type: string
    responses:
      200:
        description: Producto registrado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = data['descripcion']
        cantidad = data['cantidad']
        codigo_barras = data['codigo_barras']
        stock = data['stock']
        stock_maximo = data['stock_maximo']
        stock_minimo = data['stock_minimo']
        categoria_producto = data['categoria_producto']
        subcategoria_producto = data['subcategoria_producto']
        estado = data['estado']
        unidad_de_medida = data['unidad_de_medida']
        
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO producto (nombre, descripcion, cantidad, codigo_barras, stock, stock_maximo, stock_minimo, categoria_producto, subcategoria_producto, estado, unidad_de_medida)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (nombre, descripcion, cantidad, codigo_barras, stock, stock_maximo, stock_minimo, categoria_producto, subcategoria_producto, estado, unidad_de_medida))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# =============  RUTA PARA ACTUALIZAR PRODUCTO ===============
# ============================================================

@app.route("/actualizar_producto/<id>", methods=["PUT"])
def actualizar_producto(id):
    """
    Actualizar un producto existente
    ---
    tags:
      - producto
    parameters:
      - name: id
        in: path
        required: true
        type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              nombre:
                type: string
              descripcion:
                type: string
              cantidad:
                type: string
              codigo_barras:
                type: string
              stock:
                type: string
              stock_maximo:
                type: string
              stock_minimo:
                type: string
              categoria_producto:
                type: string
              subcategoria_producto:
                type: string
              estado:
                type: string
              unidad_de_medida:
                type: string
    responses:
      200:
        description: Producto actualizado
    """
    try:
        data = request.get_json()
        nombre = data['nombre']
        descripcion = data['descripcion']
        cantidad = data['cantidad']
        codigo_barras = data['codigo_barras']
        stock = data['stock']
        stock_maximo = data['stock_maximo']
        stock_minimo = data['stock_minimo']
        categoria_producto = data['categoria_producto']
        subcategoria_producto = data['subcategoria_producto']
        estado = data['estado']
        unidad_de_medida = data['unidad_de_medida']

        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE producto SET nombre= %s, descripcion= %s, cantidad= %s, codigo_barras= %s, stock= %s, stock_maximo= %s, stock_minimo= %s, categoria_producto= %s, subcategoria_producto= %s, estado= %s, unidad_de_medida= %s WHERE id_producto= %s""", 
                    (nombre, descripcion, cantidad, codigo_barras, stock, stock_maximo, stock_minimo, categoria_producto, subcategoria_producto, estado, unidad_de_medida,id))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    


# ============================================================
# =============  RUTA PARA ELIMINAR PRODUCTO  ================
# ============================================================

@app.route("/eliminar_producto/<int:codigo>", methods=['DELETE'])
def eliminar_producto(codigo):
    """
    Eliminar producto por ID
    ---
    tags:
      - producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: producto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM producto WHERE id_producto = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})
    

# ============================================================
# ==============  DETALLE_DONACION_PRODUCTO   ================
# ============================================================

@app.route("/detalle_donacion_producto", methods=['GET'])
def detalle_donacion_producto():
    """
    Consulta de lista de detalle_donacion_producto
    ---
    tags:
      - detalle_donacion_producto
    responses:
      200:
        description: lista de detalle_donacion_producto
    """
    try:
        conn= conectar('localhost','root','lupi19','proyecto')
        cur= conn.cursor()
        cur.execute("SELECT * FROM detalle_donacion_producto")
        datos= cur.fetchall()
        cur.close()
        conn.close()
        if datos:
            return jsonify({'detalle_donacion_producto': datos, 'mensaje': 'Lista De detalle_donacion_producto'})
        else:
            return jsonify({'mensaje': 'detalle_donacion_producto no encontrado'})
    except Exception as ex:
        print(ex)
        return jsonify({'Mensaje': 'Error'})

# Ruta para registrar un nuevo detalle_donacion_producto
@app.route("/registro_detalle_donacion_producto", methods=['POST'])
def registro_detalle_donacion_producto():
    """
    Registrar un nuevo detalle_donacion_producto
    ---
    tags:
      - detalle_donacion_producto
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id_donacion:
                type: string
              id_producto:
                type: string
              cantidad:
                type: string
    responses:
      200:
        description: Producto registrado
    """
    try:
        data = request.get_json()
        id_donacion = data['id_donacion']
        id_producto = data['id_producto']
        cantidad = data['cantidad']

        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    INSERT INTO detalle_donacion_producto (id_donacion, id_producto, cantidad) 
                    VALUES (%s, %s, %s)""", (id_donacion, id_producto, cantidad))
        conn.commit()  
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro agregado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})

# ============================================================
# ============= RUTA DETALLE_DONACION_PRODUCTO  ==============
# ============================================================

@app.route("/detalle_donacion_producto/<codigo>", methods=["PUT"])
def actualizar_detalle_donacion_producto(codigo):
    """
    Actualizar un detalle_donacion_producto existente
    ---
    tags:
      - detalle_donacion_producto
    parameters:
      - name: id
        in: path
        required: true
        type: integer
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              id_donacion:
                type: string
              id_producto:
                type: string
              cantidad:
                type: string
    responses:
      200:
        description: Producto actualizado
    """
    try:
        data = request.get_json()
        id_donacion = data['id_donacion']
        id_producto = data['id_producto']
        cantidad = data['cantidad']
        
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("""
                    UPDATE detalle_donacion_producto SET id_donacion= %s, id_producto= %s, cantidad= %s WHERE ID= %s""", 
                    (id_donacion, id_producto, cantidad,  codigo))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Registro Actualizado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})



# ============================================================
# ========= RUTA ELIMINAR DETALLE_DONACION_PRODUCTO  =========
# ============================================================
@app.route("/eliminar_detalle_donacion_producto/<int:codigo>", methods=['DELETE'])
def eliminar_detalle_donacion_producto(codigo):
    """
    Eliminar detalle_donacion_producto por ID
    ---
    tags:
      - detalle_donacion_producto
    parameters:
      - name: codigo
        in: path
        required: true
        type: integer
    responses:
      200:
        description: detalle_donacion_producto eliminado
    """
    try:
        conn = conectar('localhost', 'root', 'lupi19', 'proyecto')
        cur = conn.cursor()
        cur.execute("DELETE FROM detalle_donacion_producto WHERE ID = %s", (codigo,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({'mensaje': 'Eliminado'})
    except Exception as ex:
        print(ex)
        return jsonify({'mensaje': 'Error'})


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000, debug=True)
      app.run(debug=True)