# 🌤️ Horizon Weather App

> **A modern full-stack weather dashboard built with FastAPI and React.**
> Horizon delivers real-time weather information through a high-performance asynchronous backend and a fast, responsive frontend. The application demonstrates clean architecture, RESTful API design, database integration, and modern frontend development practices.

---

## 📖 Overview

Horizon Weather App is a full-stack web application designed to provide users with a seamless weather lookup experience. Users can search for weather information, view results instantly, and maintain a persistent search history stored in a relational database.

The project emphasizes modern software engineering principles including:

* Clean separation between frontend and backend
* Asynchronous API development
* Component-driven UI architecture
* Persistent database storage
* Type-safe request validation
* Responsive user interface
* Scalable project structure

Whether you're learning full-stack development or showcasing production-ready architecture, Horizon demonstrates best practices across the entire stack.

---

# ✨ Features

### 🌦️ Real-Time Weather Search

* Search weather information by city.
* Fast API responses powered by asynchronous endpoints.
* Clean and intuitive user interface.

### 🗄️ Persistent Search History

* Every successful search is stored in a SQLite database.
* Easily retrieve previous searches.
* Database managed through SQLAlchemy ORM.

### ⚡ High Performance Backend

* Built using asynchronous FastAPI routes.
* Lightweight and optimized for concurrent requests.
* Automatic request validation using Pydantic.

### 🎨 Modern Responsive Frontend

* Built with React 19.
* Fast development workflow using Vite.
* Responsive design powered by Tailwind CSS v4.

### 📚 Interactive API Documentation

* Automatic Swagger UI documentation.
* Explore and test API endpoints directly from the browser.

---

# 🏗️ Project Architecture

```text
Horizon Weather App
│
├── weather-backend
│   ├── FastAPI
│   ├── SQLAlchemy
│   ├── SQLite
│   ├── Pydantic
│   └── REST API
│
└── weather-frontend
    ├── React
    ├── Vite
    ├── Tailwind CSS
    └── Component-Based UI
```

The application follows a decoupled architecture where the frontend communicates with the backend through REST APIs.

---

# 🛠️ Tech Stack

## ⚡ Backend (`weather-backend`)

| Technology  | Purpose                                     |
| ----------- | ------------------------------------------- |
| FastAPI     | High-performance asynchronous web framework |
| Python      | Backend programming language                |
| SQLAlchemy  | ORM for database operations                 |
| SQLite      | Lightweight relational database             |
| Pydantic v2 | Data validation and serialization           |
| Uvicorn     | ASGI server                                 |

---

## ⚛️ Frontend (`weather-frontend`)

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React 19        | Component-based frontend library  |
| Vite            | Lightning-fast development server |
| Tailwind CSS v4 | Utility-first CSS framework       |
| JavaScript      | Client-side application logic     |

---

# 📂 Project Structure

```text
Horizon-Weather-App/
│
├── weather-backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── ...
│
├── weather-frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, ensure you have installed:

* Python 3.10+
* Node.js 18+
* npm
* Git

---

# ⚡ Backend Setup

Navigate to the backend directory:

```bash
cd weather-backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

### Windows (Git Bash)

```bash
source venv/Scripts/activate
```

### Windows (PowerShell)

```powershell
venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the development server:

```bash
uvicorn main:app --reload
```

Backend Server:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal:

```bash
cd weather-frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🔗 Application Flow

```text
User
   │
   ▼
React Frontend
   │
REST API
   │
   ▼
FastAPI Backend
   │
   ├────────► Weather API
   │
   └────────► SQLite Database
```

---

# 📚 API Documentation

After starting the backend server, FastAPI automatically generates interactive API documentation.

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

From here you can:

* Test endpoints
* View request schemas
* Inspect responses
* Explore API models

---

# 💡 Development Highlights

* Fully asynchronous backend using `async/await`
* RESTful API architecture
* Modular project organization
* Strong input validation with Pydantic
* Database persistence using SQLAlchemy ORM
* Fast frontend development with Vite
* Responsive UI using Tailwind CSS
* Component-based React architecture
* Clean separation of concerns between client and server


---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 📄 License

This project is available for educational and personal use. Feel free to modify and extend it according to your needs.

---

# 👨‍💻 Author

Developed as a modern full-stack project demonstrating contemporary web development practices using **FastAPI**, **React**, **SQLAlchemy**, **Vite**, and **Tailwind CSS**.

---

⭐ **If you found this project helpful, consider giving it a star on GitHub!**
