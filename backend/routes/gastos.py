# rutas_gastos.py
from flask import Blueprint, request, jsonify
from db import get_db_connection

gastos_bp = Blueprint("gastos_bp", __name__, url_prefix="/api/gastos")

# ==============================
# LISTAR TODOS LOS GASTOS
# ==============================
@gastos_bp.route("/", methods=["GET"])
def listar_gastos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT g.id_gasto, g.descripcion, g.monto, g.fecha, g.id_tipo_gasto, t.nombre AS tipo_nombre
            FROM gastos g
            LEFT JOIN tipos_gasto t ON g.id_tipo_gasto = t.id_tipo_gasto
            ORDER BY g.id_gasto DESC
        """)
        gastos = cursor.fetchall()
        return jsonify(gastos)
    finally:
        cursor.close()
        conn.close()

# ==============================
# OBTENER GASTO POR ID
# ==============================
@gastos_bp.route("/<int:id_gasto>", methods=["GET"])
def obtener_gasto(id_gasto):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT g.id_gasto, g.descripcion, g.monto, g.fecha, g.id_tipo_gasto, t.nombre AS tipo_nombre
            FROM gastos g
            LEFT JOIN tipos_gasto t ON g.id_tipo_gasto = t.id_tipo_gasto
            WHERE g.id_gasto = %s
        """, (id_gasto,))
        gasto = cursor.fetchone()
        if not gasto:
            return jsonify({"success": False, "message": "Gasto no encontrado"}), 404
        return jsonify(gasto)
    finally:
        cursor.close()
        conn.close()

# ==============================
# CREAR GASTO
# ==============================
@gastos_bp.route("/", methods=["POST"])
def crear_gasto():
    data = request.get_json()
    id_tipo_gasto = data.get("id_tipo_gasto")
    descripcion = data.get("descripcion")
    monto = data.get("monto")
    fecha = data.get("fecha")

    if not all([id_tipo_gasto, descripcion, monto, fecha]):
        return jsonify({"success": False, "message": "Todos los campos son obligatorios"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO gastos (id_tipo_gasto, descripcion, monto, fecha)
            VALUES (%s, %s, %s, %s)
        """, (id_tipo_gasto, descripcion, monto, fecha))
        conn.commit()
        nuevo_id = cursor.lastrowid
        return jsonify({"success": True, "id_gasto": nuevo_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# ACTUALIZAR GASTO
# ==============================
@gastos_bp.route("/<int:id_gasto>", methods=["PUT"])
def actualizar_gasto(id_gasto):
    data = request.get_json()
    id_tipo_gasto = data.get("id_tipo_gasto")
    descripcion = data.get("descripcion")
    monto = data.get("monto")
    fecha = data.get("fecha")

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM gastos WHERE id_gasto = %s", (id_gasto,))
        if not cursor.fetchone():
            return jsonify({"success": False, "message": "Gasto no encontrado"}), 404

        cursor.execute("""
            UPDATE gastos
            SET id_tipo_gasto = %s, descripcion = %s, monto = %s, fecha = %s
            WHERE id_gasto = %s
        """, (id_tipo_gasto, descripcion, monto, fecha, id_gasto))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# ELIMINAR GASTO
# ==============================
@gastos_bp.route("/<int:id_gasto>", methods=["DELETE"])
def eliminar_gasto(id_gasto):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM gastos WHERE id_gasto = %s", (id_gasto,))
        conn.commit()
        return jsonify({"success": True})
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
