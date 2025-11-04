import pymysql

def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='123456',
        db='banco_alimentos',
        cursorclass=pymysql.cursors.DictCursor
    )
