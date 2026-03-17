

import random, json

from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))


def get_json_data():
    with open("quotes.json", "r") as f:
        return json.load(f)  # data is now a dict
    
def wite_json_data(data):
    # Write the updated data back to the file
    with open("quotes.json", "w") as f:
        json.dump(data, f, indent=2)

def add_quote(new_quote):
    data = get_json_data()  # Get the existing data as a dict
    # Add the new quote to the list
    data["quotes"].append(new_quote)
    # Write the updated data back to the file
    wite_json_data(data)

# Serve index.html
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

# Serve JS files
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(BASE_DIR, filename)

#API endpoint to send data to front trough the script in the html file
@app.route("/api/quote")
def get_quotes():
    return jsonify({"quote": random.choice(get_json_data()["quotes"])})

@app.route("/api/submit_quote", methods=["POST"])
def submit_quote():
    # Here you would handle the submitted quote, e.g., save it to a database
    data = request.get_json()
    posted_quote = data.get("quote", "")
    if(posted_quote == ""):
        return jsonify({"success": False, "message": "No quote provided!", "quotes": []}), 400
    
    add_quote(posted_quote)  # Add the new quote to the JSON file
    return jsonify({"success": True, "message": "Quote {posted_quote} submitted successfully!", "quotes": get_json_data()["quotes"]})

if __name__ == "__main__":
    app.run(port=5000)

