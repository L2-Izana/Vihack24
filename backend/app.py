from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from get_restaurants_recommendations import get_sorted_restaurants
import re
import mysql.connector
from mysql.connector import Error

# Database connection details
db_config = {
    'user': 'root',             
    'password': 'dodinhluat180705', 
    'host': '127.0.0.1',        
    'database': 'test_env'
}

app = Flask(__name__)
CORS(app)  

GOOGLE_MAPS_API_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json"
GOOGLE_MAPS_API_KEY="AIzaSyBPq_817fag1tlgDk9u18ceM_lSbrJCx1Y"

@app.route('/api/get-restaurant-recommendations', methods=['GET'])
def get_data():
    # Retrieve query parameters
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    # Fetch nearby restaurants
    url = f'{GOOGLE_MAPS_API_URL}?location={latitude},{longitude}&radius=1000&type=restaurant&key={GOOGLE_MAPS_API_KEY}'
    response = requests.get(url)
    response_data = response.json().get('results')
    restaurant_recommendations = get_sorted_restaurants(response_data, (latitude, longitude))
    return jsonify(restaurant_recommendations)


model_name = "tner/roberta-large-mit-restaurant"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)
parsed_input = {'Budget': [],
                'Cuisine/ Preference': [],
                'Dish': []}
# Create the pipeline
pipe = pipeline("token-classification", model=model, tokenizer=tokenizer)

@app.route('/api/get-ner-voice-record', methods=['GET'])
def get_ner_analysis():
    user_prompt = request.args.get('transcript')
    for entity in pipe(user_prompt):
        if entity['entity'] == 'B-Price' or entity['entity'] == 'I-Price':
            parsed_input['Budget'].append(entity['word'][1:])
        elif entity['entity'] == 'B-Cuisine' or entity['entity'] == 'I-Cuisine':
            parsed_input['Cuisine/ Preference'].append(entity['word'][1:])
        elif entity['entity'] == 'B-Dish' or entity['entity'] == 'I-Dish':
            parsed_input['Dish'].append(entity['word'][1:])
    return jsonify(parsed_input)            

@app.route('/api/register', methods=["POST"])
def register_user():
    # Get JSON data from the request
    data = request.json
    username = data.get('username')
    password = data.get('password')
    retype_password = data.get('retypePassword')
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(**db_config)

        if connection.is_connected():
            cursor = connection.cursor()

            # Validate the input data
            if not username or not password or not retype_password:
                return jsonify({"message": "Username, password, and retypePassword are required"}), 400

            # Check if username already exists
            cursor.execute("SELECT username FROM Users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()
            if existing_user:
                return jsonify({"message": "Username already exists"}), 409

            # Validate password strength
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

            # Check if passwords match
            if password != retype_password:
                return jsonify({"message": "Passwords do not match"}), 400

            # Insert new user into the Users table
            insert_query = "INSERT INTO Users (username, password) VALUES (%s, %s)"
            cursor.execute(insert_query, (username, password))
            connection.commit()

            return jsonify({"message": "User registered successfully"}), 201

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"message": "Failed to register user", "error": str(e)}), 500

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()    

@app.route('/api/login', methods=["POST"])
def authenticate_user():
    # Get JSON data from the request
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        # Connect to MySQL
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
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
            connection.close()    


@app.route('/api/collect-user-base-info', methods=['POST'])
def collect_user_base_info():
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            cursor = connection.cursor()

            # Extract JSON data from the request
            data = request.json

            # Extract parameters from the JSON data
            username = data.get('username', '')
            real_name = data.get('realName', '')
            sex = data.get('sex', '')
            allergies = data.get('allergies', [])
            food_types = data.get('foodTypes', [])
            cuisines = data.get('cuisines', [])

            # Check if user base info exists
            cursor.execute("SELECT realname FROM Users WHERE username = %s", (username,))
            existing_user_real_name = cursor.fetchone()[0]
            if existing_user_real_name != 'New User':
                return jsonify({"message": "User base info has already existed"}), 400

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
            connection.close()    


if __name__ == '__main__':
    app.run(debug=True)
    