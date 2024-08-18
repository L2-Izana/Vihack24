CREATE TABLE Users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(50),
    realname VARCHAR(50) DEFAULT 'New User',
    sex TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0: unidentified, 1: male, 2: female'
);

CREATE TABLE User_Allergies (
    user_allergy_id INT PRIMARY KEY AUTO_INCREMENT,
    user_username VARCHAR(50) NOT NULL,
    allergy_type ENUM(
        'Nuts',
        'Dairy',
        'Seafood',
        'Grains',
        'Fruits',
        'Vegetables',
        'Legumes',
        'Spices',
        'Other'
    ) NOT NULL,
    FOREIGN KEY (user_username) REFERENCES Users(username)
);

    CREATE TABLE User_Favor_Food_Types (
        user_favor_food_type_id INT PRIMARY KEY AUTO_INCREMENT,
        user_username VARCHAR(50) NOT NULL,
        food_type ENUM(
            'Vegan',
            'Vegetarian',
            'Pescatarian',
            'Keto',
            'Paleo',
            'Gluten-Free',
            'Dairy-Free',
            'Low-Carb',
            'High-Protein',
            'Organic',
            'Other'
        ) NOT NULL,
        FOREIGN KEY (user_username) REFERENCES Users(username)
    );

CREATE TABLE User_Favor_Food_Cuisines (
    user_favor_food_cuisine_id INT PRIMARY KEY AUTO_INCREMENT,
    user_username VARCHAR(50) NOT NULL,
    cuisine_type ENUM(
        'Italian',
        'Mexican',
        'Chinese',
        'Japanese',
        'Indian',
        'Mediterranean',
        'French',
        'Thai',
        'American',
        'Greek',
        'Spanish',
        'Middle Eastern',
        'Vietnamese',
        'Korean',
        'African',
        'Caribbean',
        'Other'
    ) NOT NULL,
    FOREIGN KEY (user_username) REFERENCES Users(username)
);

CREATE TABLE Restaurants(
    place_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50),
    rating FLOAT,
    rating_num INT,
    latitude FLOAT,
    longitude FLOAT,
    price_level FLOAT
);

CREATE TABLE Restaurant_Comments(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    place_id VARCHAR(20) NOT NULL,
    FOREIGN KEY (place_id) REFERENCES Restaurants(place_id),
    comment_content TEXT
);