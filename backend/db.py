import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='123456',
            database='banco_alimentos'
        )
        return connection
    except Error as e:
        print(f"Error al conectar con MySQL: {e}")
        return None
