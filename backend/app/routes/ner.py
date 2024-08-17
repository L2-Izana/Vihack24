from flask import Blueprint, jsonify, request
from app.utils.ner import parse_ner

ner_bp = Blueprint('ner', __name__)

@ner_bp.route('/api/get-ner-voice-record', methods=['GET'])
def get_ner_analysis():
    user_prompt = request.args.get('transcript')
    parsed_input = parse_ner(user_prompt)
    return jsonify(parsed_input)
