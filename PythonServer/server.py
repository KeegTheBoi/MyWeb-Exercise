from flask import Flask, jsonify

app = Flask(__name__)

#API endpoint to send data to front trough the script in the html file
@app.route("/api/data")
def data():
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=5000)

#Data to be sent to the frontend
data = {
    "message": "Hello from Python backend",
    "status": "success"
}