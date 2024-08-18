from flask import Blueprint, jsonify, request
import requests
from app.utils.restaurants import get_sorted_restaurants, fetch_restaurants, filter_categories
import pandas as pd
from gensim.models import KeyedVectors
import numpy as np
import aiohttp
import asyncio
import random

GOOGLE_MAPS_API_KEY = "AIzaSyDS3_F0Aer1Z2rq4jeqp7u3VCFrdqJLuFM"
model = KeyedVectors.load_word2vec_format('app/utils/GoogleNews-vectors-negative300.bin', binary=True)

async def fetch_restaurant_details(place_id):
    async with aiohttp.ClientSession() as session:
        async with session.get(f'https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&key={GOOGLE_MAPS_API_KEY}') as response:
            response_json = await response.json()
            return response_json

async def process_recommendations(restaurant_recommendations):
    tasks = [process_restaurant(place_id, rating) for place_id, rating in restaurant_recommendations.items()]
    restaurant_recommendation_cards = await asyncio.gather(*tasks)
    return restaurant_recommendation_cards

async def process_restaurant(place_id, rating):
    try:
        restaurant_json = await fetch_restaurant_details(place_id)
        result = restaurant_json.get('result', {})
        restaurant_name = result.get('name', 'Unknown')
        is_opening = result.get('current_opening_hours', {}).get('open_now', False)
        photos = result.get('photos', [])
        photo_reference = photos[0].get('photo_reference') if photos else None

        img_url = (f'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={GOOGLE_MAPS_API_KEY}'
                   if photo_reference
                   else 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600')

        return {
            'image': img_url,
            'name': restaurant_name,
            'rating': rating,
            'isOpening': is_opening
        }
    except Exception as e:
        print(f"Error fetching restaurant details: {e}")
        return {
            'image': 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600',
            'name': 'Unknown',
            'rating': rating,
            'isOpening': False
        }

restaurants_bp = Blueprint('restaurants', __name__)
@restaurants_bp.route('/api/get-restaurant-recommendations', methods=['POST'])
def get_data():
    data = request.get_json()

    latitude = data.get('latitude')
    longitude = data.get('longitude')
    budget_level = data.get('budgetLevel')
    food_types = data.get('foodTypes')
    cuisines = data.get('cuisines')
    
    print("cc1")
    print(budget_level)
    print(food_types)
    print(cuisines)
    print("cc2")
    input_categories = food_types + cuisines
    print(input_categories)
    # Fetch nearby restaurants
    response = fetch_restaurants(GOOGLE_MAPS_API_KEY, latitude, longitude)

    # Data Processing
    header = ['PlaceId', 'Type', 'Price Level', 'Rating', 'User Ratings Total', 'Latitude', 'Longitude', 'Reviews']
    data = pd.DataFrame(response, columns=header)

    data.drop_duplicates(subset='PlaceId', inplace=True)
    data['Type'] = data['Type'].astype(str)
    data['Type'] = data['Type'].apply(lambda x: ', '.join(eval(x)))

    # Extract the Cuisine types
    data['Filtered_Restaurant_Types'] = data['Type'].apply(
         lambda x: ', '.join([item.replace('_restaurant', '').capitalize() 
                            for item in x.split(', ') 
                            if 'restaurant' in item.lower()])
    )
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].apply(
        lambda x: 'N/A' if not x or all(item.lower() == 'restaurant' for item in x.split(', ')) else x
    )
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace('Restaurant', '', case=False, regex=True).str.strip()
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r',\s*,', ', ', regex=True)
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r'^,\s*', '', regex=True)
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.replace(r',\s*$', '', regex=True)
    data['Filtered_Restaurant_Types'] = data['Filtered_Restaurant_Types'].str.strip()
    data['Categories'] = data['Filtered_Restaurant_Types'].apply(filter_categories)
    data = data[data['Categories'] != '']
    data['Price Level'] = data['Price Level'].replace('N/A', np.nan)
    data['Price Level'] = data['Price Level'].replace({
        'PRICE_LEVEL_INEXPENSIVE': 1,
        'PRICE_LEVEL_MODERATE': 2,
        'PRICE_LEVEL_EXPENSIVE': 3,
        'PRICE_LEVEL_VERY_EXPENSIVE': 4
    })

    data['Price Level'] = pd.to_numeric(data['Price Level'])    
    mean_price_level = data['Price Level'].mean()
    data.fillna({'Price Level': mean_price_level}, inplace=True)

    print(budget_level)
    if input_categories:           
        restaurant_recommendations = get_sorted_restaurants(data, (latitude, longitude), input_categories, model, budget_level)
    else:
        restaurant_recommendations = get_sorted_restaurants(data, (latitude, longitude), "Gluten-Free", model, budget_level)

    # Simplify the output to only include PlaceId and Rating
    simplified_data = restaurant_recommendations[['PlaceId', 'Rating']]
    simplified_dict = simplified_data.set_index('PlaceId').to_dict()['Rating']

    # Run async function
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    recommendations = loop.run_until_complete(process_recommendations(simplified_dict))
    
    return jsonify(recommendations)

