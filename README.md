# 🔄 Simple Session Display

## 📌 Overview

This is a web application that demonstrates **session management** and **data persistence** across page navigations using localStorage. It combines a Flask backend API with a JavaScript frontend to show how data can be stored and retrieved across different pages.

---

## 🚀 Features

- Flask backend server with REST API
- Random quote generator API endpoint
- Multi-page navigation (Home and New Page)
- Local storage for session data persistence
- Dynamic content updates via JavaScript
- Data flow demonstration between API → localStorage → pages

---

## 🛠️ Tech Stack

- **Backend:** Python + Flask
- **Frontend:** HTML, JavaScript
- **Data Storage:** Browser localStorage (session persistence)
- **Communication:** Fetch API

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/simple-session-display.git
cd simple-session-display
```

### 2. Install dependencies

```bash
pip install flask
```

---

## ▶️ Running the App

```bash
python server.py
```

Then open your browser and go to:

```
http://127.0.0.1:5000/
```

---

## 🎮 Usage

1. **Home Page**: Click "Get data from server API" to fetch a random quote
2. **Navigation**: Use "Page" button to navigate to the new page
3. **Data Persistence**: Notice how the quote data persists across page navigation
4. **Session Demo**: The new page shows how data flows between pages using localStorage

---

## 🧠 How It Works

### Data Flow:

1. User clicks "Get data from server API"
2. JavaScript fetches random quote from Flask API (`/api/quote`)
3. Quote is displayed and stored in localStorage
4. When navigating to new page, data is retrieved from localStorage
5. New page demonstrates data concatenation and persistence

### Session Management:

- **localStorage**: Persists data across browser sessions
- **Page Navigation**: Maintains state between different HTML pages
- **Data Sharing**: Variables and content shared between pages

---

## 📁 Project Structure

```
simple-session-display/
├── server.py          # Flask backend with quote API
├── index.html         # Home page with quote generator
├── newpage.html       # Secondary page demonstrating data persistence
├── script.js          # Main page JavaScript logic
├── newpage.js         # Secondary page JavaScript logic
└── styles.css         # Basic styling
```

---

## 📦 Dependencies

```
flask
```

---

## 🧪 Learning Objectives

This example demonstrates:

- Flask API endpoint creation
- Client-server communication with Fetch API
- Browser localStorage for data persistence
- Multi-page application navigation
- JavaScript event handling and DOM manipulation
- Data flow between API, storage, and UI

---

## 🔧 API Endpoints

- `GET /` - Serves the home page
- `GET /api/quote` - Returns a random quote as JSON
- `GET /<filename>` - Serves static files (JS, CSS, HTML)

---

## 🧪 Future Improvements

- Add session expiration and cleanup
- Implement server-side session storage
- Add user authentication
- Create more complex multi-page workflows
- Add data validation and error handling

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

---

## 📄 License

This project is open-source and available under the MIT License.
