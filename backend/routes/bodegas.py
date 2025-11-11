from flask import Blueprint, request, jsonify
from db import get_db_connection

bodegas_bp = Blueprint('bodegas', __name__)

# LISTAR BODEGAS
@bodegas_bp.route('/api/bodegas', methods=['GET'])
def obtener_bodegas():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_bodega, nombre_bodega, ubicacion, descripcion FROM bodegas")
    bodegas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(bodegas)

# CREAR BODEGA
@bodegas_bp.route('/api/bodegas', methods=['POST'])
def crear_bodega():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO bodegas (nombre_bodega, ubicacion, descripcion)
        VALUES (%s, %s, %s)
    """, (data['nombre_bodega'], data['ubicacion'], data['descripcion']))

    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Bodega registrada correctamente"}), 201

# ACTUALIZAR BODEGA
@bodegas_bp.route('/api/bodegas/<int:id>', methods=['PUT'])
def actualizar_bodega(id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE bodegas
        SET nombre_bodega = %s, ubicacion = %s, descripcion = %s
        WHERE id_bodega = %s
    """, (data['nombre_bodega'], data['ubicacion'], data['descripcion'], id))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Bodega actualizada correctamente"})

# ELIMINAR BODEGA
@bodegas_bp.route('/api/bodegas/<int:id>', methods=['DELETE'])
def eliminar_bodega(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM bodegas WHERE id_bodega = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Bodega eliminada correctamente"})
