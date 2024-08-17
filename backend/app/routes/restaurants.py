from flask import Blueprint, jsonify, request
import requests
from app.utils.restaurants import get_sorted_restaurants

restaurants_bp = Blueprint('restaurants', __name__)

@restaurants_bp.route('/api/get-restaurant-recommendations', methods=['GET'])
def get_data():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    GOOGLE_MAPS_API_KEY = "AIzaSyBPq_817fag1tlgDk9u18ceM_lSbrJCx1Y"
    url = f'{GOOGLE_MAPS_API_URL}?location={latitude},{longitude}&radius=1000&type=restaurant&key={GOOGLE_MAPS_API_KEY}'

    response = requests.get(url)
    response_data = response.json().get('results')
    restaurant_recommendations = get_sorted_restaurants(response_data, (latitude, longitude))
    return jsonify(restaurant_recommendations)
