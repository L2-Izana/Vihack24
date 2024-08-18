from flask import Flask
from flask_cors import CORS
from app.routes.user_auth import auth_bp
from app.routes.user_info import info_bp
from app.models.db import db_init
from app.routes.restaurants import restaurants_bp
from app.routes.ner import ner_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})

    app.config.from_object('app.config.Config')

    # Initialize database
    db_init(app)

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(info_bp)
    app.register_blueprint(ner_bp)
    app.register_blueprint(restaurants_bp)


    return app
