

import random, json

from api.quote_manager import QuoteManager

from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

FILE_PATH_JSON = "quotes.json"
q_manager = QuoteManager(FILE_PATH_JSON)

# Serve index.html
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

# Serve JS files
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(BASE_DIR, filename)

#API endpoint to send data to front trough the script in the html file
@app.route("/api/random_quote")
def get_random_quote():
    return jsonify({"quote": q_manager.get_random_quote()})

#API endpoint to send all quotes to front trough the script in the html file
@app.route("/api/all_quotes")
def get_all_quotes():
    return jsonify({"quotes": q_manager.get_quotes()})

@app.route("/api/submit_quote", methods=["POST"])
def submit_quote():
    # Here you would handle the submitted quote, e.g., save it to a database
    data = request.get_json()
    posted_quote = data.get("quote", "")
    if(posted_quote == ""):
        return jsonify({"success": False, "message": "No quote provided!", "quotes": []}), 400
    
    q_manager.add_quote(posted_quote)  # Add the new quote to the JSON file
    return jsonify({"success": True, "message": "Quote {posted_quote} submitted successfully!", "quotes": q_manager.get_quotes()})

if __name__ == "__main__":
    app.run(port=5000)

