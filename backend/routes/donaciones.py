from flask import Blueprint, request, jsonify
from database import conectar
import datetime

donacion_bp = Blueprint('donacion_bp', __name__)

# Registrar donación de productos
@donacion_bp.route('/donacion/producto', methods=['POST'])
def registrar_donacion_producto():
    try:
        data = request.get_json()
        id_donante = data.get('id_donante')
        fecha = data.get('fecha')
        usuario = data.get('usuario')
        observaciones = data.get('observaciones')
        productos = data.get('productos')

        conn = conectar()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO donacion (donante, fecha, observaciones, usuario, tipo_donacion)
            VALUES (%s, %s, %s, %s, %s)
        """, (id_donante, fecha, observaciones, usuario, 1))
        id_donacion = cur.lastrowid

        for p in productos:
            cur.execute("""
                INSERT INTO detalle_donacion_producto (id_donacion, id_producto, cantidad)
                VALUES (%s, %s, %s)
            """, (id_donacion, p['id_producto'], p['cantidad']))

        conn.commit()
        return jsonify({"mensaje": "Donación registrada correctamente", "id_donacion": id_donacion}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Error al registrar la donación"}), 500
    finally:
        cur.close()
        conn.close()
