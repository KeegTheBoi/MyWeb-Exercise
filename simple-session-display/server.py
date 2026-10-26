from flask import Flask, jsonify, send_from_directory
import os
import random

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

quotes = [
    "Life is what happens when you're busy making other plans.",
    "Do not take life too seriously. You will never get out of it alive.",
    "Be yourself; everyone else is already taken.",
    "In the middle of every difficulty lies opportunity."
]

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
def get_quote():
    return jsonify({"quote": getCorrectQuote()})


def getCorrectQuote():
    return random.choice(quotes)

if __name__ == "__main__":
    app.run(port=5000)

