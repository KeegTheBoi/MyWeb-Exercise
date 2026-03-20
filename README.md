# 🌐 Web Examples Collection

## 📌 Overview

This repository contains example web applications built using **Python (Flask)** for the backend, **HTML + JavaScript** for the frontend, and **MongoDB** for data persistence. Each project demonstrates different aspects of full-stack web development.

---

## 📁 Projects

### 🎯 Mini Quiz Game (MongoDB)

An interactive quiz application with CRUD operations for managing quiz questions and user scores.

**Location:** `mini-quiz-game-mongodb/`

**Features:**

- Create, read, update, and delete quiz questions
- User management and scoring system
- RESTful API endpoints
- Dynamic frontend interface

### 😊 Mood Trending App (MongoDB)

A mood tracking application that allows users to log their moods and visualize trends over time.

**Location:** `mood-trending-mongodb/`

**Features:**

- Log moods with timestamps
- View mood history and trends
- Simple data visualization
- Intuitive user interface

---

## 🛠️ Common Tech Stack

- **Backend:** Python + Flask
- **Frontend:** HTML, JavaScript
- **Database:** MongoDB
- **Communication:** Fetch API (RESTful endpoints)

---

## ⚙️ Prerequisites

Before running any of these applications, ensure you have:

1. **Python 3.x** installed
2. **MongoDB** installed and running
3. **Git** for cloning repositories

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/web-examples.git
cd web-examples
```

### 2. Set up MongoDB

Make sure MongoDB is installed and running on your system. You can download it from [mongodb.com](https://www.mongodb.com/).

### 3. Choose a project

Navigate to the project you want to run:

```bash
cd mini-quiz-game-mongodb
# or
cd mood-trending-mongodb
```

### 4. Install dependencies

```bash
pip install flask pymongo
```

---

## ▶️ Running the Applications

Each project includes:

- `server.py`: Flask application server
- `index.html`: Frontend interface
- `app.js`: Client-side JavaScript logic
- `styles.css`: Basic styling

To run a project:

```bash
python server.py
```

Then open your browser to `http://127.0.0.1:5000/`

---

## 🧠 Learning Objectives

These examples demonstrate:

- Full-stack web development with Flask
- RESTful API design
- MongoDB integration with PyMongo
- Client-server communication with JavaScript
- CRUD operations
- Basic data visualization
- Modular code organization

---

## 📦 Dependencies

```
flask
pymongo
```

---

## 🧪 Future Improvements

- Add user authentication across projects
- Implement more advanced UI frameworks (React, Vue.js)
- Add comprehensive testing suites
- Containerize applications with Docker
- Add deployment configurations

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests. Each project can be extended or modified independently.

---

## 📄 License

This project is open-source and available under the MIT License.
