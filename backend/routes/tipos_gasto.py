from flask import Blueprint, request, jsonify
from db import get_db_connection

tipos_gasto_bp = Blueprint('tipos_gasto_bp', __name__, url_prefix='/api/tipos_gasto')

# LISTAR
@tipos_gasto_bp.route('/', methods=['GET'])
def obtener_tipos_gasto():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_tipo_gasto, nombre, descripcion FROM tipos_gasto")
    tipos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tipos)

# CREAR
@tipos_gasto_bp.route('/', methods=['POST'])
def crear_tipo_gasto():
    data = request.json
    nombre = data['nombre'].strip()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # ✅ Validar duplicado
    cursor.execute("SELECT id_tipo_gasto FROM tipos_gasto WHERE nombre = %s", (nombre,))
    existente = cursor.fetchone()
    if existente:
        return jsonify({"error": "Ya existe un tipo de gasto con ese nombre"}), 400

    cursor.execute("""
        INSERT INTO tipos_gasto (nombre, descripcion)
        VALUES (%s, %s)
    """, (data['nombre'], data['descripcion']))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Tipo de gasto registrado correctamente"}), 201

# ACTUALIZAR
@tipos_gasto_bp.route('/<int:id>', methods=['PUT'])
def actualizar_tipo_gasto(id):
    data = request.json
    nombre = data['nombre'].strip()

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # ✅ Validar duplicado (excepto el mismo registro)
    cursor.execute("""
        SELECT id_tipo_gasto FROM tipos_gasto 
        WHERE nombre = %s AND id_tipo_gasto != %s
    """, (nombre, id))
    existente = cursor.fetchone()
    if existente:
        return jsonify({"error": "Ya existe otro tipo de gasto con ese nombre"}), 400

    cursor.execute("""
        UPDATE tipos_gasto
        SET nombre = %s, descripcion = %s
        WHERE id_tipo_gasto = %s
    """, (data['nombre'], data['descripcion'], id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Tipo de gasto actualizado correctamente"})

# ELIMINAR
@tipos_gasto_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_tipo_gasto(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM tipos_gasto WHERE id_tipo_gasto = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Tipo de gasto eliminado correctamente"})
