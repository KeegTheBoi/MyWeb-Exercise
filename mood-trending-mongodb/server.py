from crud_mongodb import MoodTracker
from flask import Flask, jsonify, request, send_from_directory
import os

from pymongo import MongoClient

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Configuration for the entity (change these for different entities)
ENTITY_NAME = "mood"  # e.g., "quote", "product"
FILE_PATH_JSON = f"{ENTITY_NAME}s.json"
MONGO_CONNECTION_STRING = "mongodb://localhost:27017"  # Replace with your MongoDB connection string

# Replace with your Atlas connection string
client = MongoClient(MONGO_CONNECTION_STRING)

db = client["database_mood_tracking"]          # database name
quotes_collection = db["moods"]    # collection name

manager = MoodTracker(quotes_collection)

def bad_response(message: str, data=None, status_code: int = 400):
    response = {"success": False, "message": message}
    if data is not None:
        response[ENTITY_NAME + "s"] = data
    return jsonify(response), status_code

def good_response(message: str, data=None, status_code: int = 200):
    response = {"success": True, "message": message}
    if data is not None:
        response[ENTITY_NAME + "s"] = data
    return jsonify(response), status_code

# Serve index.html
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

# Serve JS files
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(BASE_DIR, filename)

# API endpoint to get all items
@app.route(f"/api/all_{ENTITY_NAME}s")
def get_all_items():
    items = manager.read_all()
    return jsonify({f"{ENTITY_NAME}s": items})

# API endpoint to get a single item by id
@app.route(f"/api/{ENTITY_NAME}/<item_id>")
def get_item(item_id):
    item = manager.read_by_id(item_id)
    if item:
        return jsonify({ENTITY_NAME: item})
    return bad_response(f"{ENTITY_NAME.capitalize()} not found", status_code=404)

# API endpoint to create a new item
@app.route(f"/api/{ENTITY_NAME}", methods=["POST"])
def create_item():
    data = request.get_json()
    if not data:
        return bad_response("No data provided")
    item = manager.create(data)
    return good_response(f"{ENTITY_NAME.capitalize()} created successfully", manager.read_without_id())

# API endpoint to update an item
@app.route(f"/api/{ENTITY_NAME}/<item_id>", methods=["PUT"])
def update_item(item_id):
    data = request.get_json()
    if not data:
        return bad_response("No data provided")
    updated_item = manager.update(item_id, data)
    if updated_item:
        return good_response(f"{ENTITY_NAME.capitalize()} updated successfully", manager.read_without_id())
    return bad_response(f"{ENTITY_NAME.capitalize()} not found", status_code=404)

# API endpoint to delete an item
@app.route(f"/api/{ENTITY_NAME}/<item_id>", methods=["DELETE"])
def delete_item(item_id):
    deleted = manager.delete(item_id)
    print(f"Deleted: {deleted}")
    if deleted:
        return good_response(f"{ENTITY_NAME.capitalize()} deleted successfully", manager.read_without_id())
    return bad_response(f"{ENTITY_NAME.capitalize()} not found", status_code=404)

if __name__ == "__main__":
    app.run(port=5000)