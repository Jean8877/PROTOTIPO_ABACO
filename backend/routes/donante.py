from flask import Blueprint, request, jsonify
from db import get_db_connection


donantes_bp = Blueprint('donantes_bp', __name__)

# ==============================
# LISTAR TODOS LOS DONANTES
# ==============================
@donantes_bp.route('/', methods=['GET'])
def listar_donantes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT d.*, t.nombre AS tipo_nombre
        FROM donantes d
        JOIN tipo_donante t ON d.tipo_id = t.id_tipo
    """)
    donantes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(donantes)


# ==============================
# CREAR NUEVO DONANTE
# ==============================
@donantes_bp.route('/', methods=['POST'])
def crear_donante():
    data = request.get_json()
    nombre = data.get('nombre')
    tipo_id = data.get('tipo_id')
    correo = data.get('correo', '')
    telefono = data.get('telefono', '')
    direccion = data.get('direccion', '')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO donantes (nombre, tipo_id, correo, telefono, direccion)
            VALUES (%s, %s, %s, %s, %s)
        """, (nombre, tipo_id, correo, telefono, direccion))
        conn.commit()
        nuevo_id = cursor.lastrowid
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 400

    cursor.close()
    conn.close()
    return jsonify({'success': True, 'id_donante': nuevo_id})


# ==============================
# ACTUALIZAR DONANTE
# ==============================
@donantes_bp.route('/<int:id_donante>', methods=['PUT'])
def actualizar_donante(id_donante):
    data = request.get_json()
    nombre = data.get('nombre')
    tipo_id = data.get('tipo_id')
    correo = data.get('correo')
    telefono = data.get('telefono')
    direccion = data.get('direccion')
    estado = data.get('estado', 'Activo')

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE donantes
            SET nombre=%s, tipo_id=%s, correo=%s, telefono=%s, direccion=%s, estado=%s
            WHERE id_donante=%s
        """, (nombre, tipo_id, correo, telefono, direccion, estado, id_donante))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 400

    cursor.close()
    conn.close()
    return jsonify({'success': True})


# ==============================
# ELIMINAR DONANTE
# ==============================
@donantes_bp.route('/<int:id_donante>', methods=['DELETE'])
def eliminar_donante(id_donante):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM donantes WHERE id_donante=%s", (id_donante,))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'success': False, 'message': str(e)}), 400

    cursor.close()
    conn.close()
    return jsonify({'success': True})
# ==============================