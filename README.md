# 🌐 Web Examples Collection

## 📌 Overview

This repository contains a comprehensive collection of Python Flask web application examples, demonstrating various aspects of full-stack web development. The examples are organized by topic and showcase different techniques for building web applications with Flask.

---

## 📁 Project Organization

All examples are located in the `Python_Server/` directory and organized by category:

### 📊 JSON Examples

**Location:** `Python_Server/JSON/`

- **basics/**: Fundamental JSON handling with Flask
- **simple-content-backdisplay/**: Basic content display from JSON data
- **step-by-step/**: Progressive JSON processing examples

### 🎯 Quiz Applications

**Location:** `Python_Server/Mini-quiz/`

- **mini-quiz-game-mongodb/**: Interactive quiz game with MongoDB backend
  - CRUD operations for quiz questions
  - User scoring system
  - RESTful API endpoints

### 🍃 MongoDB Integration

**Location:** `Python_Server/MongoDB/`

- **mini-quiz-game-mongodb/**: Quiz application with MongoDB persistence
- **mood-trending-mongodb/**: Mood tracking with database storage

### 😊 Mood Tracking Applications

**Location:** `Python_Server/Mood_Trending/`

- **mood-trending-mongodb/**: Mood logging and trend visualization
  - Log moods with timestamps
  - View historical mood data
  - Simple trend visualization
- **mood-trenind-proj/**: Alternative mood tracking implementation

### 🔐 Session Management

**Location:** `Python_Server/Sessions/`

- **simple-session-display/**: Basic Flask session handling examples

### 📋 Template System

**Location:** `Python_Server/Templates/`

- **generic-crud-template/**: Reusable CRUD template for any entity
  - Generic Python classes for data operations
  - Adaptable API endpoints
  - Modular UI components

---

## 🛠️ Common Tech Stack

- **Backend:** Python + Flask
- **Database:** MongoDB (where applicable)
- **Frontend:** HTML, JavaScript
- **Data Formats:** JSON
- **Communication:** RESTful APIs, Fetch API

---

## ⚙️ Prerequisites

Before running any examples:

1. **Python 3.x** installed
2. **MongoDB** installed and running (for MongoDB examples)
3. **Git** for cloning repositories

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/web-examples.git
cd web-examples
```

### 2. Set up MongoDB (for database examples)

Install and start MongoDB:

```bash
# On Ubuntu/Debian
sudo apt install mongodb
sudo systemctl start mongodb

# On macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# On Windows, download from mongodb.com
```

### 3. Navigate to an example

```bash
cd Python_Server/Mini-quiz/mini-quiz-game-mongodb
# or any other example directory
```

### 4. Install dependencies

Most examples use Flask. Install if needed:

```bash
pip install flask pymongo
```

---

## ▶️ Running Examples

Each example typically includes:

1. **server.py**: Flask application server
2. **index.html**: Frontend interface
3. **app.js**: Client-side JavaScript logic
4. **styles.css**: Basic styling

To run an example:

```bash
python server.py
```

Then open your browser to `http://127.0.0.1:5000/`

---

## 🧠 Learning Objectives

These examples demonstrate:

- Flask application structure and routing
- RESTful API design patterns
- MongoDB integration with PyMongo
- Client-server communication
- Session management
- Template organization
- CRUD operation patterns
- JSON data handling
- Basic frontend development
- Modular code architecture

---

## 📦 Dependencies

Common dependencies:

```
flask
pymongo  # For MongoDB examples
```

Project-specific dependencies are documented in individual project folders.

---

## 🧪 Example Categories

### Beginner Friendly

- JSON basics
- Simple content display
- Session handling

### Intermediate

- Generic CRUD template
- Mood tracking (basic)
- Quiz applications

### Advanced

- Full MongoDB integration
- Complex data relationships
- Multi-feature applications

---

## 🤝 Contributing

Feel free to:

- Add new examples to existing categories
- Create new categories for different topics
- Improve existing code
- Add documentation and comments
- Submit pull requests

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
