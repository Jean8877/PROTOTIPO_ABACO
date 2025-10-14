import pymysql

def conectar():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='123456',
        db='proyecto',
        cursorclass=pymysql.cursors.DictCursor
    )
