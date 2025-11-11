# routes/productos.py
from flask import Blueprint, request, jsonify, session, redirect, url_for
from db import get_db_connection
from difflib import SequenceMatcher
import pymysql

productos_bp = Blueprint('productos_bp', __name__, url_prefix='/api/productos')

# ==============================
# FUNCION DE SIMILARIDAD
# ==============================
def es_similar(a, b, umbral=0.85):
    """
    Retorna True si las cadenas son muy similares según el umbral
    """
    return SequenceMatcher(None, a.lower(), b.lower()).ratio() >= umbral

# ==============================
# LISTAR TODOS LOS PRODUCTOS
# ==============================
@productos_bp.route('/', methods=['GET'])
def listar_productos():
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("""
            SELECT p.id_producto, p.nombre, p.stock_minimo, p.id_unidad, p.descripcion,
                   p.id_categoria, p.id_subcategoria, c.nombre AS categoria, s.nombre AS subcategoria
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id_categoria
            JOIN subcategorias s ON p.id_subcategoria = s.id_subcategoria
        """)
        productos = cursor.fetchall()
        return jsonify(productos)
    except Exception as e:
        print("Error listar_productos:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# OBTENER PRODUCTO POR ID
# ==============================
@productos_bp.route('/<int:id_producto>', methods=['GET'])
def obtener_producto(id_producto):
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT p.id_producto, p.nombre, p.stock_minimo, p.id_unidad, p.descripcion,
                   p.id_categoria, p.id_subcategoria, c.nombre AS categoria, s.nombre AS subcategoria
            FROM productos p
            JOIN categorias c ON p.id_categoria = c.id_categoria
            JOIN subcategorias s ON p.id_subcategoria = s.id_subcategoria
            WHERE p.id_producto=%s
        """, (id_producto,))
        producto = cursor.fetchone()
        if not producto:
            return jsonify({'success': False, 'message': 'Producto no encontrado'}), 404
        return jsonify(producto)
    except Exception as e:
        print("Error obtener_producto:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# CREAR PRODUCTO
# ==============================
@productos_bp.route('/', methods=['POST'])
def crear_producto():
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401

    data = request.get_json()
    nombre = data.get('nombre')
    stock_minimo = data.get('stock_minimo')
    id_unidad = data.get('id_unidad')
    descripcion = data.get('descripcion', None)
    id_categoria = data.get('id_categoria')
    id_subcategoria = data.get('id_subcategoria')

    # ✅ Convertir correctamente los valores
    try:
        stock_minimo = int(stock_minimo)
        id_unidad = int(id_unidad)
        id_categoria = int(id_categoria)
        id_subcategoria = int(id_subcategoria)
    except:
        return jsonify({'success': False, 'message': 'Los valores numéricos no son válidos'}), 400

    if not nombre or not id_categoria or not id_subcategoria or not id_unidad or stock_minimo is None:
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        # Verificar similaridad de nombre
        cursor.execute("SELECT nombre FROM productos WHERE id_subcategoria=%s", (id_subcategoria,))
        nombres_existentes = [row['nombre'] for row in cursor.fetchall()]
        for nombre_existente in nombres_existentes:
            if es_similar(nombre, nombre_existente):
                return jsonify({
                    'success': False,
                    'message': f'Ya existe un producto muy similar en esta subcategoría: "{nombre_existente}"'
                }), 400

        # ✅ Aquí ya los valores son enteros y no causan errores
        cursor.execute("""
            INSERT INTO productos (id_categoria, id_subcategoria, nombre, stock_minimo, id_unidad, descripcion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (id_categoria, id_subcategoria, nombre, stock_minimo, id_unidad, descripcion))
        conn.commit()

        nuevo_id = cursor.lastrowid
        cursor.execute("SELECT * FROM productos WHERE id_producto=%s", (nuevo_id,))
        producto = cursor.fetchone()
        return jsonify({'success': True, 'producto': producto}), 201

    except Exception as e:
        conn.rollback()
        print("Error crear_producto:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()



# ==============================
# ACTUALIZAR PRODUCTO
# ==============================
@productos_bp.route('/<int:id_producto>', methods=['PUT'])
def actualizar_producto(id_producto):
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401

    data = request.get_json()
    nombre = data.get('nombre')
    stock_minimo = data.get('stock_minimo')
    id_unidad = data.get('id_unidad')
    descripcion = data.get('descripcion', '')
    id_categoria = data.get('id_categoria')
    id_subcategoria = data.get('id_subcategoria')

    if not nombre or not id_categoria or not id_subcategoria or not id_unidad or stock_minimo is None:
        return jsonify({'success': False, 'message': 'Todos los campos son obligatorios'}), 400

    conn = get_db_connection()
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    try:
        cursor.execute("SELECT * FROM productos WHERE id_producto=%s", (id_producto,))
        if not cursor.fetchone():
            return jsonify({'success': False, 'message': 'Producto no encontrado'}), 404

        cursor.execute("""
            UPDATE productos
            SET id_categoria=%s, id_subcategoria=%s, nombre=%s, stock_minimo=%s, id_unidad=%s, descripcion=%s
            WHERE id_producto=%s
        """, (id_categoria, id_subcategoria, nombre, stock_minimo, id_unidad, descripcion, id_producto))
        conn.commit()

        cursor.execute("SELECT * FROM productos WHERE id_producto=%s", (id_producto,))
        producto = cursor.fetchone()
        return jsonify({'success': True, 'producto': producto})

    except Exception as e:
        conn.rollback()
        print("Error actualizar_producto:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ==============================
# ELIMINAR PRODUCTO
# ==============================
@productos_bp.route('/<int:id_producto>', methods=['DELETE'])
def eliminar_producto(id_producto):
    if 'usuario' not in session:
        return jsonify({'success': False, 'message': 'Sesión expirada'}), 401
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM productos WHERE id_producto=%s", (id_producto,))
        conn.commit()
        return jsonify({'success': True, 'message': 'Producto eliminado'})
    except Exception as e:
        conn.rollback()
        print("Error eliminar_producto:", e)
        return jsonify({'success': False, 'message': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
