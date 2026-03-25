from logic.quiz_logic import QuizLogic
from logic.user_logic import UserLogic
from flask import Flask
import os

from pymongo import MongoClient
from logic.generic_api import GenericAPI

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configuration for the entity (change these for different entities)
ENTITY_NAME = "quiz"  # e.g., "quote", "product"
MONGO_CONNECTION_STRING = "mongodb://localhost:27017"  # Replace with your MongoDB connection string

# Replace with your Atlas connection string
client = MongoClient(MONGO_CONNECTION_STRING)

db = client["database_quiz_game"]          # database name
quiz_collection = db["quizzes"]    # collection name of quizzes
user_collection = db["users"]      # collection name of users

quiz_manager = QuizLogic(quiz_collection)

user_manager = UserLogic(user_collection)

#user_api = GenericAPI(app, user_manager, "user", base_dir=BASE_DIR)

quiz_api = GenericAPI(app, quiz_manager, ENTITY_NAME, base_dir=BASE_DIR)
quiz_api.register_static_routes()

user_api = GenericAPI(app, user_manager, "user", base_dir=BASE_DIR)

if __name__ == "__main__":
    app.run(port=5000)