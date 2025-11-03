import pymysql

def conectar():
    return pymysql.connectar(
        host='localhost',
        user='root',
        password='123456',
        db='proyecto',
        cursorclass=pymysql.cursors.DictCursor
    )
