from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__)

# Current folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Serve index.html
@app.route("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")

# Serve JS files
@app.route("/<path:filename>")
def serve_file(filename):
    return send_from_directory(BASE_DIR, filename)

#API endpoint to send data to front trough the script in the html file
@app.route("/api/data")
def data():
    return jsonify({
    "message": "Hello from Python backend",
    "status": "success"
})

if __name__ == "__main__":
    app.run(port=5000)

