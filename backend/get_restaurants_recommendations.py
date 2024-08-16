import numpy as np
import math
import requests
from flask import jsonify
from sklearn.preprocessing import MinMaxScaler

# Base
NUM_FEATURES = 5
FEATURES = ['rating', 'distance-compatibility', 'budget-compatibility', 'cuisine-compatibility',
            'food-type-compatibility']

MIN_RATINGS_THRESHOLD = 10  # Minimum number of ratings required to be considered (a threshold).

# Fetch from database
BASE_COLLAB_FILTER_USER_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)
BASE_COLLAB_FILTER_ITEM_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)
BASE_CONTENT_FILTERING_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)

# Urls
GOOGLE_MAPS_API_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

# Private keys (need to put to .env later)
GOOGLE_MAPS_API_KEY = "AIzaSyBPq_817fag1tlgDk9u18ceM_lSbrJCx1Y"

# Parameters that needs an algorithm later
BASE_USER_BUDGET_LEVEL = 2.5


def calculate_collective_weights(collab_user_w=BASE_COLLAB_FILTER_USER_W, col_item_w=BASE_COLLAB_FILTER_ITEM_W, content_w=BASE_CONTENT_FILTERING_W):
    collective_weights = (collab_user_w + col_item_w) * content_w
    return collective_weights.reshape(-1, 1)


def calculate_restaurant_weighted_rating(fetched_restaurant_json, mean_rating):
    rating = fetched_restaurant_json['rating']
    rating_num = fetched_restaurant_json['user_ratings-total']
    weighted_rating = (rating * rating_num + mean_rating * MIN_RATINGS_THRESHOLD) / (rating_num + MIN_RATINGS_THRESHOLD)
    return weighted_rating


def calculate_restaurants_weighted_rating(fetched_restaurants_json):
    try:
        scaler = MinMaxScaler()
        restaurants_weighted_rating = []
        mean_rating = np.mean([fetched_restaurant['rating'] for fetched_restaurant in fetched_restaurants_json])
        for fetched_restaurant_json in fetched_restaurants_json:
            restaurant_weighted_rating = calculate_restaurant_weighted_rating(fetched_restaurant_json, mean_rating)
            restaurants_weighted_rating.append(restaurant_weighted_rating)
        restaurants_weighted_rating = np.array(restaurants_weighted_rating).reshape(-1,1)
        scaled_restaurants_weighted_rating = scaler.fit_transform(restaurants_weighted_rating)
        # assert scaled_restaurants_weighted_rating.shape == (len(fetched_restaurants_json), 1)
        return scaled_restaurants_weighted_rating
    except Exception as e:
        return np.repeat(0.5, len(fetched_restaurants_json)).reshape(-1, 1)


def get_distance_from_place(place_id, input_latitude, input_longitude):
    # Fetch place details from Google Places API
    url = f"{GOOGLE_MAPS_API_PLACE_DETAILS_URL}?place_id={place_id}&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(url)
    data = response.json()

    if 'result' in data and 'geometry' in data['result']:
        place_latitude = data['result']['geometry']['location']['lat']
        place_longitude = data['result']['geometry']['location']['lng']
    else:
        raise ValueError("Error fetching place details or invalid Place ID")

    # Calculate the distance using Haversine formula
    R = 6371.0  # Radius of the Earth in kilometers
    lat1_rad = math.radians(place_latitude)
    lon1_rad = math.radians(place_longitude)
    lat2_rad = math.radians(input_latitude)
    lon2_rad = math.radians(input_longitude)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance


def calculate_restaurants_distance_compatibility(fetched_restaurants_json, current_location):
    try:
        scaler = MinMaxScaler()
        restaurants_distance_compatibility = []
        for fetched_restaurant_json in fetched_restaurants_json:
            restaurant_place_id = fetched_restaurant_json['place_id']
            current_location_latitude, current_location_longitude = current_location[0], current_location[1]
            restaurant_distance = get_distance_from_place(restaurant_place_id, current_location_latitude, current_location_longitude)
            restaurants_distance_compatibility.append(restaurant_distance)
        restaurants_distance_compatibility = np.array(restaurants_distance_compatibility).reshape(-1, 1)
        scaled_restaurants_distance_compatibility = scaler.fit_transform(restaurants_distance_compatibility)
        # assert scaled_restaurants_distance_compatibility.shape == (len(fetched_restaurants_json), 1)
        return scaled_restaurants_distance_compatibility
    except Exception as e:
        return np.repeat(0.5, len(fetched_restaurants_json)).reshape(-1, 1)


def calculate_restaurants_budget_compatibility(fetched_restaurants_json, input_user_budget=2.5):
    try:
        restaurant_price_level = [fetched_restaurant['price_level'] or 2.5 for fetched_restaurant in fetched_restaurants_json]
        restaurant_price_level = np.array(restaurant_price_level)
        restaurants_price_level_compatibility = 1/np.exp(abs(restaurant_price_level - input_user_budget)/5)
        restaurants_price_level_compatibility = restaurants_price_level_compatibility.reshape(-1, 1)
        scaler = MinMaxScaler()
        scaled_restaurants_price_level_compatibility = scaler.fit_transform(restaurants_price_level_compatibility)
        # assert scaled_restaurants_price_level_compatibility.shape == (len(fetched_restaurants_json), 1)
        return scaled_restaurants_price_level_compatibility
    except Exception as e:
        return np.repeat(0.5, len(fetched_restaurants_json)).reshape(-1, 1)


def calculate_restaurants_food_type_compatibility(fetched_restaurants_json):
    return np.repeat(0.5, len(fetched_restaurants_json)).reshape(-1, 1)


def calculate_restaurants_food_cuisine_compatibility(fetched_restaurants_json):
    return np.repeat(0.5, len(fetched_restaurants_json)).reshape(-1, 1)


def calculate_restaurants_feature_metric(fetched_restaurants_json, current_location):
    restaurants_weighted_rating = calculate_restaurants_weighted_rating(fetched_restaurants_json)
    restaurants_distance_compatibility = calculate_restaurants_distance_compatibility(fetched_restaurants_json, current_location)
    restaurants_budget_compatibility = calculate_restaurants_budget_compatibility(fetched_restaurants_json)
    restaurants_food_type_compatibility = calculate_restaurants_food_type_compatibility(fetched_restaurants_json)
    restaurants_food_cuisine_compatibility = calculate_restaurants_food_cuisine_compatibility(fetched_restaurants_json)
    restaurants_feature_metric = np.hstack((restaurants_weighted_rating, restaurants_distance_compatibility, restaurants_budget_compatibility, restaurants_food_type_compatibility, restaurants_food_cuisine_compatibility))
    # assert restaurants_weighted_rating.shape[0] > 1
    return restaurants_feature_metric


def get_sorted_restaurants(fetched_restaurants, current_location):
    restaurants_feature_metric = calculate_restaurants_feature_metric(fetched_restaurants, current_location)
    collective_weights = calculate_collective_weights()
    # assert restaurants_feature_metric.shape[1] == 5
    restaurants_suitability = restaurants_feature_metric @ collective_weights
    # Get the sorted indices based on the suitability scores
    sorted_indices = np.argsort(restaurants_suitability.flatten())
    print(sorted_indices)
    sorted_restaurants = [fetched_restaurants[i] for i in sorted_indices]
    return sorted_restaurants


if __name__ == '__main__':
    GOOGLE_MAPS_API_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    latitude = -37.70036407433657
    longitude = 145.06058114290337

    # Fetch nearby restaurants
    url = f'{GOOGLE_MAPS_API_URL}?location={latitude},{longitude}&radius=1000&type=restaurant&key={GOOGLE_MAPS_API_KEY}'
    response = requests.get(url)
    response_data = response.json().get('results')

    print(get_sorted_restaurants(response_data, (latitude, longitude)))