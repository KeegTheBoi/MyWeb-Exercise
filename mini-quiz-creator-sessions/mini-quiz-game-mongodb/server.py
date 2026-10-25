from logic.quiz_logic import QuizLogic
from logic.user_registration import UserRegistrationLogic
from flask import Flask, jsonify, send_from_directory, session
import os

from pymongo import MongoClient
from logic.generic_api import GenericAPI
from logic.registration_api import RegistrationAPI
from logic.authentication_api import AuthenticationAPI

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or os.urandom(32)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = os.environ.get(
    "SESSION_COOKIE_SECURE", "false"
).lower() == "true"

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

user_collection.create_index(
    "email",
    unique=True,
    partialFilterExpression={"email": {"$type": "string"}},
)
admin_emails = os.environ.get("ADMIN_EMAILS", "").split(",")
registration_manager = UserRegistrationLogic(user_collection, admin_emails)
registration_manager.ensure_profile_fields()
registration_api = RegistrationAPI(app, registration_manager)
authentication_api = AuthenticationAPI(app, registration_manager, BASE_DIR)

def authorize_quiz_write():
    email = session.get("user_email")
    if not email:
        return jsonify(success=False, message="Log in as an admin to manage quizzes."), 401
    if not registration_manager.is_admin(email):
        return jsonify(success=False, message="Only admins can manage quizzes."), 403
    return None


quiz_api = GenericAPI(
    app,
    quiz_manager,
    ENTITY_NAME,
    base_dir=BASE_DIR,
    write_authorizer=authorize_quiz_write,
)
quiz_api.register_static_routes()

@app.route("/login.html")
def login_page():
    return send_from_directory(BASE_DIR, "login.html")


if __name__ == "__main__":
    app.run(port=5000)