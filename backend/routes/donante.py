from flask import Blueprint, request, jsonify
import pymysql.cursors
from db import get_db_connection  # Asegúrate que devuelva una conexión pymysql

donantes_bp = Blueprint('donantes_bp', __name__)

# ==============================
# LISTAR TODOS LOS DONANTES
# ==============================
@donantes_bp.route('/', methods=['GET'])
def listar_donantes():
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("""
            SELECT d.id_donante, d.nombre, 
                   td.nombre AS tipo_documento, 
                   d.numero_documento,
                   t.nombre AS tipo_nombre, 
                   d.correo, d.telefono, d.direccion, d.estado
            FROM donantes d
            LEFT JOIN tipo_documento td ON d.tipo_doc_id = td.id_tipo_doc
            LEFT JOIN tipo_donante t ON d.tipo_id = t.id_tipo
        """)
        donantes = cursor.fetchall()
        return jsonify(donantes)
    except Exception as e:
        print("Error listar_donantes:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# CREAR NUEVO DONANTE
# ==============================
@donantes_bp.route('/', methods=['POST'])
def crear_donante():
    data = request.get_json()
    nombre = data.get('nombre')
    tipo_doc_id = data.get('tipo_doc_id')
    numero_documento = data.get('numero_documento', '')
    tipo_id = data.get('tipo_id')
    correo = data.get('correo', '')
    telefono = data.get('telefono', '')
    direccion = data.get('direccion', '')

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        # Verificar si ya existe
        cursor.execute("""
            SELECT * FROM donantes 
            WHERE numero_documento = %s OR correo = %s
        """, (numero_documento, correo))
        existente = cursor.fetchone()
        if existente:
            return jsonify({
                'success': False,
                'message': 'El donante ya está registrado'
            }), 409

        # Insertar nuevo donante
        cursor.execute("""
            INSERT INTO donantes (nombre, tipo_doc_id, numero_documento, tipo_id, correo, telefono, direccion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (nombre, tipo_doc_id, numero_documento, tipo_id, correo, telefono, direccion))
        conn.commit()
        nuevo_id = cursor.lastrowid
        return jsonify({'success': True, 'id_donante': nuevo_id})
    except Exception as e:
        conn.rollback()
        print("Error crear_donante:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# ACTUALIZAR DONANTE
# ==============================
@donantes_bp.route('/<int:id_donante>', methods=['PUT'])
def actualizar_donante(id_donante):
    data = request.get_json()
    nombre = data.get('nombre')
    tipo_doc_id = data.get('tipo_doc_id')
    numero_documento = data.get('numero_documento', '')
    tipo_id = data.get('tipo_id')
    correo = data.get('correo', '')
    telefono = data.get('telefono', '')
    direccion = data.get('direccion', '')
    estado = data.get('estado', 'Activo')

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("""
            UPDATE donantes
            SET nombre=%s, tipo_doc_id=%s, numero_documento=%s, tipo_id=%s, correo=%s, telefono=%s, direccion=%s, estado=%s
            WHERE id_donante=%s
        """, (nombre, tipo_doc_id, numero_documento, tipo_id, correo, telefono, direccion, estado, id_donante))
        conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        print("Error actualizar_donante:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# ELIMINAR DONANTE
# ==============================
@donantes_bp.route('/<int:id_donante>', methods=['DELETE'])
def eliminar_donante(id_donante):
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("DELETE FROM donantes WHERE id_donante=%s", (id_donante,))
        conn.commit()
        return jsonify({'success': True})
    except Exception as e:
        conn.rollback()
        print("Error eliminar_donante:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# OBTENER TIPOS DE DONANTE
# ==============================
@donantes_bp.route('/tipos', methods=['GET'])
def obtener_tipos_donante():
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT id_tipo, nombre FROM tipo_donante WHERE estado='Activo'")
        tipos = cursor.fetchall()
        return jsonify(tipos)
    except Exception as e:
        print("Error obtener_tipos_donante:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# OBTENER TIPOS DE DOCUMENTO
# ==============================
@donantes_bp.route('/tipos_documento', methods=['GET'])
def obtener_tipos_documento():
    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT id_tipo_doc, nombre FROM tipo_documento")
        tipos = cursor.fetchall()
        return jsonify(tipos)
    except Exception as e:
        print("Error obtener_tipos_documento:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
