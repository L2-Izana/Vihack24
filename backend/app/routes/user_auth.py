from flask import Blueprint, request, jsonify
from app.models.db import get_db  
import re
import mysql.connector
from mysql.connector import Error

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=["POST"])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    retype_password = data.get('retypePassword')
    
    if not username or not password or not retype_password:
        return jsonify({"message": "Username, password, and retypePassword are required"}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400
    if not re.search(r"[A-Z]", password):
        return jsonify({"message": "Password must contain at least one uppercase letter"}), 400
    if not re.search(r"[a-z]", password):
        return jsonify({"message": "Password must contain at least one lowercase letter"}), 400
    if not re.search(r"\d", password):
        return jsonify({"message": "Password must contain at least one digit"}), 400
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return jsonify({"message": "Password must contain at least one special character"}), 400

    if password != retype_password:
        return jsonify({"message": "Passwords do not match"}), 400

    try:
        connection = get_db()
        cursor = connection.cursor()

        # Check if username already exists
        cursor.execute("SELECT username FROM Users WHERE username = %s", (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"message": "Username already exists"}), 409

        # Insert new user into the Users table
        insert_query = "INSERT INTO Users (username, password) VALUES (%s, %s)"
        cursor.execute(insert_query, (username, password))
        connection.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"message": "Failed to register user", "error": str(e)}), 500

    finally:
        cursor.close()
        

@auth_bp.route('/api/login', methods=["POST"])
def authenticate_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        connection = get_db()
        cursor = connection.cursor()

        # Validate the input data
        if not username or not password:
            return jsonify({"message": "Username, password, are required"}), 400

        # Check if username already exists
        cursor.execute("SELECT username FROM Users WHERE username = %s", (username,))
        existing_user = cursor.fetchone()
        if not existing_user:
            return jsonify({"message": "Cannot find username"}), 409
        cursor.execute("SELECT password FROM Users WHERE username = %s", (username,))
        user_password = cursor.fetchone()
        # Check if passwords match
        if password != user_password[0]:
            return jsonify({"message": "Passwords do not match"}), 400

        return jsonify({"message": "User logined successfully"}), 201
    except Error as e:
        print(f"Error: {e}")
        return jsonify({"message": "Failed to register user", "error": str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()

