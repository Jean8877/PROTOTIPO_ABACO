from flask import Blueprint, jsonify, session
from db import get_db_connection
import pymysql

unidades_bp = Blueprint('unidades_bp', __name__, url_prefix='/api/unidades')

@unidades_bp.route('/', methods=['GET'])
def listar_unidades():
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("""
            SELECT id_unidad, nombre, abreviatura, factor_kg, estado
            FROM unidades_medida
        """)
        unidades = cursor.fetchall()
        return jsonify(unidades)
    except Exception as e:
        print("Error listar_unidades:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()



@unidades_bp.route('/desactivar/<int:id_unidad>', methods=['PUT'])
def desactivar_unidad(id_unidad):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE unidades_medida SET estado='Inactivo' WHERE id_unidad = %s", (id_unidad,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Unidad desactivada correctamente"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@unidades_bp.route('/activar/<int:id_unidad>', methods=['PUT'])
def activar_unidad(id_unidad):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE unidades_medida SET estado='Activo' WHERE id_unidad = %s", (id_unidad,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Unidad activada correctamente"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500