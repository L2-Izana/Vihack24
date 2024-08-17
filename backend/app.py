from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from transformers import pipeline, AutoTokenizer, AutoModelForTokenClassification
from get_restaurants_recommendations import get_sorted_restaurants

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

if __name__ == '__main__':
    app.run(debug=True)
    