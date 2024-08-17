import mysql.connector
from flask import current_app

def db_init(app):
    app.config['db'] = mysql.connector.connect(
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        host=app.config['MYSQL_HOST'],
        database=app.config['MYSQL_DB']
    )

def get_db():
    return current_app.config['db']
