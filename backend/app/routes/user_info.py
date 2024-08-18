from flask import Blueprint, jsonify, request
from mysql.connector import Error
from app.models.db import get_db
import json
info_bp = Blueprint('info', __name__)

@info_bp.route('/api/collect-user-base-info', methods=['POST'])
def collect_user_base_info():
    try:
        connection = get_db()
        cursor = connection.cursor()
        # Extract and decode the data from the request
        data = request.data.decode('utf-8')

        # Parse the outer JSON
        inner_data = json.loads(data)

        # Extract parameters from the inner data
        username = inner_data.get('username', '')
        real_name = inner_data.get('realName', '')
        sex = inner_data.get('sex', '')
        allergies = inner_data.get('allergies', [])
        food_types = inner_data.get('foodTypes', [])
        cuisines = inner_data.get('cuisines', [])
            
        # Update user info
        sex_to_save = 1 if sex == 'Male' else 2 if sex == 'Female' else 0
        cursor.execute("UPDATE Users SET realname=%s, sex=%s WHERE username=%s", (real_name, sex_to_save, username))
        connection.commit()

        # Insert allergies
        user_allergy_insert_query = "INSERT INTO User_Allergies (user_username, allergy_type) VALUES (%s, %s);"
        cursor.executemany(user_allergy_insert_query, [(username, allergy) for allergy in allergies])
        connection.commit()

        # Insert favorite cuisines
        user_favor_food_cuisine_insert_query = "INSERT INTO User_Favor_Food_Cuisines (user_username, cuisine_type) VALUES (%s, %s);"
        cursor.executemany(user_favor_food_cuisine_insert_query, [(username, cuisine_type) for cuisine_type in cuisines])
        connection.commit()

        # Insert favorite food types
        user_favor_food_type_insert_query = "INSERT INTO User_Favor_Food_Types (user_username, food_type) VALUES (%s, %s);"
        cursor.executemany(user_favor_food_type_insert_query, [(username, food_type) for food_type in food_types])
        connection.commit()

        return jsonify({"message": "Information received successfully!"}), 200
    except Exception as e:
        # Handle errors and return an error response
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing the data."}), 500
    finally:
        if connection.is_connected():
            cursor.close()
