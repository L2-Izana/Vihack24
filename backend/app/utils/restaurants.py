import numpy as np
import math
import requests
from flask import jsonify
from sklearn.preprocessing import MinMaxScaler
from gensim.models import KeyedVectors
from sklearn.metrics.pairwise import cosine_similarity

# Base
NUM_FEATURES = 4
#categories include cuisine and diet type
FEATURES = ['rating', 'distance-compatibility', 'budget-compatibility', 'categories-compatibility']

MIN_RATINGS_THRESHOLD = 10  # Minimum number of ratings required to be considered (a threshold).

# Fetch from database
BASE_COLLAB_FILTER_USER_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)
BASE_COLLAB_FILTER_ITEM_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)
BASE_CONTENT_FILTERING_W = np.repeat(1 / NUM_FEATURES, NUM_FEATURES)

# Urls
# GOOGLE_MAPS_API_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json" - old
GOOGLE_MAPS_API_PLACE_URL = "https://places.googleapis.com/v1/places:searchNearby"

# Private keys (need to put to .env later)
# GOOGLE_MAPS_API_KEY = "AIzaSyBPq_817fag1tlgDk9u18ceM_lSbrJCx1Y"
GOOGLE_MAPS_API_KEY = "AIzaSyDS3_F0Aer1Z2rq4jeqp7u3VCFrdqJLuFM"

# Parameters that needs an algorithm later
BASE_USER_BUDGET_LEVEL = 2.5

#available categories
valid_categories = [
    'American', 'Italian', 'Vietnamese', 'Chinese', 'Mexican', 'Indian', 'Thai', 'French',
    'Japanese', 'Spanish', 'Mediterranean', 'Greek', 'Turkish', 'Korean', 'Lebanese',
    'Brazilian', 'Argentinian', 'Cuban', 'Caribbean', 'Persian', 'Moroccan', 'Ethiopian',
    'Russian', 'German', 'Polish', 'Hungarian', 'Swedish', 'Danish', 'Norwegian', 'Portuguese',
    'British', 'Irish', 'Belgian', 'Dutch', 'Swiss', 'Austrian', 'Australian',
    'Pakistani', 'Nepalese', 'Bangladeshi', 'Filipino', 'Indonesian', 'Malaysian',
    'Singaporean', 'Singaporean', 'Australian', 'Kenyan', 'Tanzanian',
    'Ugandan', 'Ghanaian', 'Nigerian', 'Jamaican', 'MiddleEastern', 
        'Vegan',
        'Vegetarian',
        'Pescatarian',
        'Keto',
        'Paleo',
        'Gluten-Free',
        'Dairy-Free',
        'Low-Carb',
        'High-Protein',
        'Organic'
]

#word2vec model loading
model = KeyedVectors.load_word2vec_format('GoogleNews-vectors-negative300.bin', binary=True)


### FUNCTIONS DEFINITION

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


def get_distance_from_place(fetched_restaurants, input_latitude, input_longitude):
    # Fetch place details from Google Places API - old code
    # url = f"{GOOGLE_MAPS_API_PLACE_DETAILS_URL}?place_id={place_id}&key={GOOGLE_MAPS_API_KEY}"
    # response = requests.get(url)
    # data = response.json()

    # if 'result' in data and 'geometry' in data['result']:
    #     place_latitude = data['result']['geometry']['location']['lat']
    #     place_longitude = data['result']['geometry']['location']['lng']
    # else:
    #     raise ValueError("Error fetching place details or invalid Place ID")

    place_latitude = fetched_restaurants['Latitude']
    place_longitude = fetched_restaurants['Longitude']

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


def calculate_restaurants_budget_compatibility(fetched_restaurants, input_user_budget=2.5):
    try:
        restaurant_price_level = [fetched_restaurant['price_level'] or 2.5 for fetched_restaurant in fetched_restaurants_json]
        restaurant_price_level = np.array(restaurant_price_level)
        restaurants_price_level_compatibility = 1/np.exp(abs(restaurant_price_level - input_user_budget)/5)
        restaurants_price_level_compatibility = restaurants_price_level_compatibility.reshape(-1, 1)
        scaler = MinMaxScaler()
        scaled_restaurants_price_level_compatibility = scaler.fit_transform(restaurants_price_level_compatibility)
        return scaled_restaurants_price_level_compatibility
    except Exception as e:
        return np.repeat(0.5, len(fetched_restaurants)).reshape(-1, 1)

def get_vector(model, word):
    try:
        return model[word].reshape(1, -1)
    except KeyError:
        print(f"'{word}' not found in the model. Using a fallback vector.")
        return np.zeros((1, model.vector_size))  # Fallback to a zero vector or some default vector
    
 #input: user input categories (diet type, cuisines), output: compatibility with the current restaurant cuisine(s)
def calculate_restaurants_categories_compatibility(fetched_restaurants, input_categories):
    input_vectors = []
    # No cuisine data => 0
    if input_categories == 'N/A':
        return 0.0 
        
    for category in input_categories:
        input_vectors.append(get_vector(model, category))

    if input_vectors:
        combined_input_vector = np.mean(input_vectors, axis=0).reshape(1, -1)
    else:
        return 0.0
    
    #process current categories:
    fetched_restaurants['Categories'] = fetched_restaurants['Categories'].apply(lambda x: x.split(', ') if x != 'N/A' else [])

    #Compute similarity scores 
    scores = []

    for category_list in fetched_restaurants['Categories']:
        category_vectors = [get_vector(model, category) for category in category_list]
        
        if category_vectors:
            combined_category_vector = np.mean(category_vectors, axis=0).reshape(1, -1)
            score = cosine_similarity(combined_input_vector, combined_category_vector)[0][0]
            scores.append(score)
        else:
            scores.append(0.0)


    scores = np.array(scores)
    scores = scores.reshape(-1, 1)
    return scores

def calculate_restaurants_feature_metric(fetched_restaurants_json, current_location):
    restaurants_weighted_rating = calculate_restaurants_weighted_rating(fetched_restaurants_json)
    restaurants_distance_compatibility = calculate_restaurants_distance_compatibility(fetched_restaurants_json, current_location)
    restaurants_budget_compatibility = calculate_restaurants_budget_compatibility(fetched_restaurants_json)
    restaurants_food_type_compatibility = calculate_restaurants_food_type_compatibility(fetched_restaurants_json)
    restaurants_food_cuisine_compatibility = calculate_restaurants_food_cuisine_compatibility(fetched_restaurants_json)
    restaurants_feature_metric = np.hstack((restaurants_weighted_rating, restaurants_distance_compatibility, restaurants_budget_compatibility, restaurants_food_type_compatibility, restaurants_food_cuisine_compatibility))
    return restaurants_feature_metric


def get_sorted_restaurants(fetched_restaurants, current_location):
    restaurants_feature_metric = calculate_restaurants_feature_metric(fetched_restaurants, current_location)
    collective_weights = calculate_collective_weights()

    restaurants_suitability = np.dot(restaurants_feature_metric, collective_weights)

    # sorted_indices = np.argsort(restaurants_suitability.flatten())
    # sorted_restaurants = [fetched_restaurants[i] for i in sorted_indices]
    fetched_restaurants_df = fetched_restaurants.copy()

    fetched_restaurants_df['Suitability'] = restaurants_suitability

    # Sort the DataFrame by 'Suitability' column in descending order
    sorted_restaurants_df = fetched_restaurants_df.sort_values(by='Suitability', ascending=False)

    return sorted_restaurants_df

def fetch_restaurants(api_key, latitude, longitude, radius=3000):   
    url = "https://places.googleapis.com/v1/places:searchNearby"

    payload = {
        "includedTypes": ['restaurant'],
        "maxResultCount": 20, #max 20
        "locationRestriction": {
            "circle": {
                "center": {"latitude": latitude, "longitude": longitude},
                "radius": radius,
            }
        },
    }

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,  
        "X-Goog-FieldMask": "places.id,places.types,places.priceLevel,places.userRatingCount,places.rating,places.location,places.reviews",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        restaurants = response.json()

        results = []

        if restaurants:
            for restaurant in restaurants['places']:
                location = restaurant.get('location', [])
                reviews = restaurant.get('reviews', []) # Access reviews from the 'place' dictionary
                review_texts = [review.get('text', 'No review available') for review in reviews]
                review_texts_2 = [review['text'] for review in review_texts]

                if location:
                    restaurant_lat = location.get("latitude")
                    restaurant_lng = location.get("longitude")

                results.append({
                    'PlaceId': restaurant.get('id', 'N/A'),
                    'Type': restaurant.get('types', 'N/A'), #may contain dietary type or some shit, just for checking
                    'Price Level': restaurant.get('priceLevel', 'N/A'),
                    'Rating': restaurant.get('rating', 'N/A'),
                    'User Ratings Total': restaurant.get('userRatingCount', 'N/A'),
                    'PrimaryType': restaurant.get('primaryType', 'N/A'), #cuisine,
                    'Latitude': restaurant_lat,
                    'Longitude': restaurant_lng,
                    'Reviews': ' | '.join(review_texts_2),  # Join reviews with a delimiter
                }) 
        return results
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data from Google Places API (New): {e}')
        return None
    
def filter_categories(types):
    # Handle the case where 'types' is empty or None
    if not types:
        return 'N/A'
    
    # Split the string into a list
    types_list = [t.strip() for t in types.split(',')]
    
    # Filter to keep only valid cuisines
    filtered_list = [t for t in types_list if t in valid_categories]
    
    # If there are valid cuisines, return them joined; otherwise, return 'N/A'
    return ', '.join(filtered_list) if filtered_list else 'N/A'

## MAIN

if __name__ == '__main__':
    GOOGLE_MAPS_API_URL="https://maps.googleapis.com/maps/api/place/nearbysearch/json"

    latitude = -37.8136
    longitude =  144.9631

    # Fetch nearby restaurants
    # url = f'{GOOGLE_MAPS_API_URL}?location={latitude},{longitude}&radius=1000&type=restaurant&key={GOOGLE_MAPS_API_KEY}'
    # response = requests.get(url)
    # response_data = response.json().get('results')

    #test input_categories
    input_categories = ['Vegan', 'Korean']

    #Fetch nearby restaurants
    response = fetch_restaurants(GOOGLE_MAPS_API_KEY, latitude, longitude)

    #Data Processing
    header = ['PlaceId', 'Type', 'Price Level', 'Rating', 'User Ratings Total', 'Latitude', 'Longitude', 'Reviews']
    
    data = pd.DataFrame(response, columns=header)

    data.drop_duplicates(subset='PlaceId', inplace=True)

    data['Type'] = data['Type'].astype(str)
    data['Type'] = data['Type'].apply(lambda x: ', '.join(eval(x)))

    #Extract the Cuisine types
    data['Filtered_Restaurant_Types'] = data['Type'].apply(
        lambda x: ', '.join([item.replace('_restaurant', '').capitalize() 
                            for item in x.split(', ') 
                            if 'restaurant' in item.lower()])
    )
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].apply(
        lambda x: 'N/A' if not x or all(item.lower() == 'restaurant' for item in x.split(', ')) else x
    )

    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace('Restaurant', '', case=False, regex=True).str.strip()
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r',\s*,', ', ', regex=True)  # Replace multiple commas
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r'^,\s*', '', regex=True)  # Remove leading comma
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r',\s*$', '', regex=True)  # Remove trailing comma
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.strip()  # Remove any remaining whitespace

    data['Categories'] = data['Filtered_Restaurant_Types'].apply(filter_categories)

    data = data[data['Categories'] != '']
    #Price Levels: 
    # - inexspensive: 1
    # - moderate: 2
    # - expensive: 3
    # - very_expensive: 4

    data['Price Level'] = data['Price Level'].replace('N/A', np.nan)

    data['Price Level'] = data['Price Level'].replace({
        'PRICE_LEVEL_INEXPENSIVE': 1,
        'PRICE_LEVEL_MODERATE': 2,
        'PRICE_LEVEL_EXPENSIVE': 3,
        'PRICE_LEVEL_VERY_EXPENSIVE': 4
    })

    data['Price Level'] = pd.to_numeric(data['Price Level'])

    
    #replace no price level with mean price level
    mean_price_level = data['Price Level'].mean()
    data.fillna({'Price Level': mean_price_level}, inplace=True)

result = get_sorted_restaurants(data, (latitude, longitude), input_categories) #vegan, korean

print(result)


