import mysql.connector
from mysql.connector import Error
from werkzeug.security import check_password_hash, generate_password_hash


def authenticate_user(db_config, username, password):
    try:
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            cursor = connection.cursor(dictionary=True)
            
            # Check if the user exists in the database
            query = "SELECT username, password FROM Users WHERE username = %s"
            cursor.execute(query, (username,))
            user = cursor.fetchone()
            
            print(f"User fetched from DB: {user}")  # Debugging print
            
            if user:
                print(f"Password from DB: {user['password']}")  # Debugging print
                if check_password_hash(user['password'], password):
                    print(password)
                    print(username)
                    return {"message": "Login successful"}, 200
                else:
                    return {"message": "Invalid username or password"}, 401
            else:
                return {"message": "Invalid username or password"}, 401
    except Error as e:
        return {"message": "Error during authentication", "error": str(e)}, 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()


def register_user(db_config, username, password, retype_password):
    try:
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            cursor = connection.cursor()

            # Check if the passwords match
            if password != retype_password:
                return {"message": "Passwords do not match"}, 400

            # Check if the username already exists
            query = "SELECT username FROM Users WHERE username = %s"
            cursor.execute(query, (username,))
            existing_user = cursor.fetchone()
            
            if existing_user:
                return {"message": "Username already exists"}, 409

            # Hash the password
            hashed_password = generate_password_hash(password)

            # Insert the new user into the Users table
            insert_query = "INSERT INTO Users (username, password) VALUES (%s, %s)"
            cursor.execute(insert_query, (username, hashed_password))
            connection.commit()

            return {"message": "User registered successfully"}, 201
    except Error as e:
        return {"message": "Failed to register user", "error": str(e)}, 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
