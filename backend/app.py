from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '1234',
    'db': 'proyecto',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db():
    return pymysql.connect(**DB_CONFIG)

@app.route('/')
def home():
    return jsonify({'message': 'API Banco de Alimentos ABACO', 'status': 'active'})

# ==================== DONANTES ====================
@app.route('/donantes', methods=['GET'])
def get_donantes():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT d.*, td.nombre as tipo_documento_nombre, tdo.descripcion as tipo_donante_desc
                FROM donante d
                LEFT JOIN tipo_documento td ON d.tipo_documento = td.id_tipo_documento
                LEFT JOIN tipo_donante tdo ON d.tipo_donante = tdo.ID
            """)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/donantes', methods=['POST'])
def create_donante():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO donante (nombre, numero_documento, telefono, gmail, direccion, tipo_documento, tipo_donante, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['nombre'], data['numero_documento'], data['telefono'],
                data['gmail'], data['direccion'], data['tipo_documento'], 
                data['tipo_donante'], data.get('estado', 1)
            ))
        conn.commit()
        return jsonify({'success': True, 'message': 'Donante creado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/donantes/<int:id>', methods=['PUT'])
def update_donante(id):
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                UPDATE donante SET nombre=%s, numero_documento=%s, telefono=%s, gmail=%s, direccion=%s
                WHERE id_donante=%s
            """, (data['nombre'], data['numero_documento'], data['telefono'], data['gmail'], data['direccion'], id))
        conn.commit()
        return jsonify({'success': True, 'message': 'Donante actualizado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/donantes/<int:id>', methods=['DELETE'])
def delete_donante(id):
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM donante WHERE id_donante = %s", (id,))
        conn.commit()
        return jsonify({'success': True, 'message': 'Donante eliminado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== TIPO DONANTE ====================
@app.route('/tipo-donante', methods=['GET'])
def get_tipo_donante():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tipo_donante")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/tipo-donante', methods=['POST'])
def create_tipo_donante():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO tipo_donante (descripcion) VALUES (%s)", (data['descripcion'],))
        conn.commit()
        return jsonify({'success': True, 'message': 'Tipo donante creado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== PRODUCTOS ====================
@app.route('/productos', methods=['GET'])
def get_productos():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT p.*, cp.descripcion as categoria, sp.descripcion as subcategoria
                FROM producto p
                LEFT JOIN categoria_producto cp ON p.categoria_producto = cp.codigo
                LEFT JOIN subcategoria_producto sp ON p.subcategoria_producto = sp.codigo
            """)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/productos', methods=['POST'])
def create_producto():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO producto (nombre, descripcion, cantidad, codigo_barras, stock, categoria_producto, subcategoria_producto, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['nombre'], data.get('descripcion', ''), data.get('cantidad', 0),
                data['codigo_barras'], data.get('stock', 0), data['categoria_producto'],
                data['subcategoria_producto'], data.get('estado', 1)
            ))
        conn.commit()
        return jsonify({'success': True, 'message': 'Producto creado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== CATEGORIAS ====================
@app.route('/categorias', methods=['GET'])
def get_categorias():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM categoria_producto")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/categorias', methods=['POST'])
def create_categoria():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO categoria_producto (descripcion) VALUES (%s)", (data['descripcion'],))
        conn.commit()
        return jsonify({'success': True, 'message': 'Categoría creada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== SUBCATEGORIAS ====================
@app.route('/subcategorias', methods=['GET'])
def get_subcategorias():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT sp.*, cp.descripcion as categoria_nombre
                FROM subcategoria_producto sp
                LEFT JOIN categoria_producto cp ON sp.categoria_producto = cp.codigo
            """)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/subcategorias', methods=['POST'])
def create_subcategoria():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO subcategoria_producto (descripcion, categoria_producto) 
                VALUES (%s, %s)
            """, (data['descripcion'], data['categoria_producto']))
        conn.commit()
        return jsonify({'success': True, 'message': 'Subcategoría creada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== GASTOS ====================
@app.route('/gastos', methods=['GET'])
def get_gastos():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT g.*, tg.nombre as tipo_gasto_nombre
                FROM gasto g
                LEFT JOIN tipo_gasto tg ON g.tipo_gasto = tg.id_tipo_gasto
                ORDER BY g.fecha DESC
            """)
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/gastos', methods=['POST'])
def create_gasto():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO gasto (fecha, monto, descripcion, tipo_gasto)
                VALUES (%s, %s, %s, %s)
            """, (data['fecha'], data['monto'], data['descripcion'], data['tipo_gasto']))
        conn.commit()
        return jsonify({'success': True, 'message': 'Gasto registrado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== TIPO GASTO ====================
@app.route('/tipo-gasto', methods=['GET'])
def get_tipo_gasto():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM tipo_gasto")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/tipo-gasto', methods=['POST'])
def create_tipo_gasto():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO tipo_gasto (nombre, descripcion) VALUES (%s, %s)", 
                        (data['nombre'], data['descripcion']))
        conn.commit()
        return jsonify({'success': True, 'message': 'Tipo gasto creado'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

# ==================== DONACIONES ====================
@app.route('/donaciones', methods=['GET'])
def get_donaciones():
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM donacion ORDER BY fecha_donacion DESC")
            result = cursor.fetchall()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@app.route('/donaciones', methods=['POST'])
def create_donacion():
    data = request.json
    conn = get_db()
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                INSERT INTO donacion (cantidad_donada, fecha_donacion, forma_donacion, observaciones, responsable)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['cantidad_donada'], data['fecha_donacion'], data['forma_donacion'],
                data.get('observaciones', ''), data['responsable']
            ))
        conn.commit()
        return jsonify({'success': True, 'message': 'Donación registrada'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

if __name__ == '_main_':
    print("🚀 Iniciando API Banco de Alimentos...")
    print("📍 URL: http://localhost:5000")
    app.run(debug=True)