# 🌟 Store Rating Application

A comprehensive full-stack web application designed to facilitate seamless interaction between Users, Store Owners, and System Administrators. This platform allows users to discover and rate stores, enables owners to manage their store presence, and provides administrators with robust tools for user and store management.

## 🚀 Key Features

*   **System Administrator**: "God mode" access to manage all users, stores, and view platform-wide analytics.
*   **Store Owner**: Manage personal store details and view user ratings/reviews.
*   **Normal User**: Search for stores, submit ratings, and manage personal profile.
*   **Role-Based Auth**: Secure JWT-based authentication with protected routes.
*   **Responsive Design**: Modern UI built with Tailwind CSS and Framer Motion.

---

## 🛠 Tech Stack

### Frontend
*   **Framework**: React (Vite)
*   **Styling**: Tailwind CSS, Vanilla CSS
*   **Icons**: Lucide React
*   **Animations**: Framer Motion

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Sequelize
*   **Authentication**: JSON Web Tokens (JWT) & Bcrypt

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 📋 Prerequisites

Ensure you have the following installed:
*   **Node.js** (v14 or higher)
*   **PostgreSQL** (Active local instance or cloud URL)
*   **Git**

### 🔧 Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd Store-Rating-Application
    ```

2.  **Install Dependencies**
    The project uses a concurrent setup. Install dependencies for root, server, and client.

    ```bash
    # Root dependencies
    npm install

    # Server dependencies
    cd server
    npm install

    # Client dependencies
    cd ../client
    npm install
    ```

### ⚙️ Configuration

1.  **Database Setup**
    Ensure your PostgreSQL server is running and create a database (e.g., `store_rating_db`).

2.  **Environment Variables**
    Create a `.env` file in the **`server/`** directory. copy the following content:

    ```env
    PORT=5000
    DB_NAME=store_rating_db
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    JWT_SECRET=your_super_secret_jwt_key
    ```

---

## 🏃 Usage Guide

### Development Server
Run the full-stack application (frontend + backend) with a single command from the **root** directory:

```bash
npm start
```
*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:5000](http://localhost:5000)

### Production Build
To build the frontend for production:

```bash
cd client
npm run build
```

---

## 🔑 Demo Credentials

Use these credentials to explore the different roles and functionalities:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@roxiler.com` | `Admin@123` | Full access, User/Store CRUD, Analytics |
| **Store Owner** | `owner@roxiler.com` | `Owner@123` | Manage own store, View Ratings |
| **Normal User** | `user@roxiler.com` | `User@123` | View Stores, Submit Ratings, Profile |

---

## 📡 API Reference

Below are some of the key API endpoints available in the application.

| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | User login | `{ "email": "user@test.com", "password": "..." }` |
| **POST** | `/auth/signup` | Register new user | `{ "name": "...", "email": "...", "password": "...", "address": "...", "role": "Normal User" }` |
| **GET** | `/stores` | Get all stores | N/A |
| **POST** | `/stores` | Create store (Admin/Owner) | `{ "name": "...", "address": "...", "email": "...", "ownerId": 1 }` |
| **PUT** | `/stores/:id` | Update store details | `{ "name": "New Name" }` |
| **POST** | `/ratings` | Submit a rating | `{ "storeId": 1, "rating": 5 }` |

---

## 📂 Project Structure

```text
Store-Rating-Application/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Shared UI components (Card, Button, Modal)
│   │   ├── layouts/            # Layout wrappers (Sidebar, Navbar)
│   │   ├── pages/              # Key Pages (AdminDashboard, StoreManager)
│   │   ├── context/            # AuthContext provider
│   │   └── lib/                # Utility functions
│
├── server/                     # Backend Application
│   ├── config/                 # Database configuration
│   ├── controllers/            # Logic for Users, Stores, Ratings
│   ├── models/                 # Sequelize Schemas
│   ├── middleware/             # AuthMiddleware, RoleCheck
│   └── routes/                 # API Routes definitions
│
└── package.json                # Root automation scripts
```

---

## 🤝 Contributing

We welcome contributions to improve the Store Rating Application!

1.  **Fork** the repository.
2.  Create a **Feature Branch** (`git checkout -b feature/NewFeature`).
3.  **Commit** your changes (`git commit -m 'Add NewFeature'`).
4.  **Push** to the branch (`git push origin feature/NewFeature`).
5.  Open a **Pull Request**.

---

**Developed for Roxiler Systems**
