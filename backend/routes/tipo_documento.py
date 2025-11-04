from flask import Blueprint, jsonify, request
from database import get_db_connection

tipo_documento_bp = Blueprint('tipo_documento', __name__)

# ------------------ OBTENER TODOS LOS TIPOS ------------------
@tipo_documento_bp.route('/', methods=['GET'])
def obtener_tipos_documento():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM tipo_documento")
    tipos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tipos)


# ------------------ CREAR NUEVO TIPO ------------------
@tipo_documento_bp.route('/', methods=['POST'])
def agregar_tipo_documento():
    data = request.get_json()
    tipo = data.get('tipo')
    numero = data.get('numero')

    if not tipo or not numero:
        return jsonify({"error": "Faltan campos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO tipo_documento (tipo, numero) VALUES (%s, %s)",
            (tipo, numero)
        )
        conn.commit()
        return jsonify({"message": "Documento guardado correctamente"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ------------------ ACTUALIZAR TIPO ------------------
@tipo_documento_bp.route('/<int:id>', methods=['PUT'])
def actualizar_tipo_documento(id):
    data = request.get_json()
    tipo = data.get('tipo')
    numero = data.get('numero')

    if not tipo or not numero:
        return jsonify({"error": "Faltan campos"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE tipo_documento SET tipo=%s, numero=%s WHERE id=%s",
            (tipo, numero, id)
        )
        conn.commit()
        return jsonify({"message": "Documento actualizado correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ------------------ ELIMINAR TIPO ------------------
@tipo_documento_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_tipo_documento(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM tipo_documento WHERE id=%s", (id,))
        conn.commit()
        return jsonify({"message": "Documento eliminado correctamente"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
