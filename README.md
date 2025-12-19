
# 🌟 Store Rating Application

The **Store Rating Application** is a full-stack platform designed to bridge the gap between shoppers, store owners, and administrators. It empowers users to discover and rate local businesses while providing store owners with valuable insights and administrators with powerful management tools.

Focused on performance and user experience, this application features a modern, responsive interface and a robust, secure backend.

---

## 🚀 Key Features

*   **Role-Based Access Control**: specialized dashboards for System Administrators, Store Owners, and Normal Users.
*   **Store Management**: Owners can manage their store profiles; Admins have full system oversight.
*   **Rating System**: Users can submit 1-5 star ratings for stores, with real-time average calculation.
*   **Secure Authentication**: JWT-based login with encrypted passwords.
*   **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium feel.

---

## 🛠 Tech Stack

**Frontend**
*   ⚛️ **React (Vite)** - Fast, modern UI library.
*   🎨 **Tailwind CSS** - Utility-first styling.
*   ✨ **Framer Motion** - Smooth animations.
*   🔌 **Lucide React** - Beautiful vector icons.

**Backend**
*   🟢 **Node.js & Express** - Scalable server runtime.
*   🐘 **PostgreSQL** - Relational database.
*   ⚙️ **Sequelize** - ORM for safe database interactions.
*   🔐 **JWT & Bcrypt** - Security best practices.

---

## 🏁 Getting Started

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16+)
*   [PostgreSQL](https://www.postgresql.org/) (Local instance or Cloud provider)
*   [Git](https://git-scm.com/)

### 🔧 Installation

1.  **Clone the Repository**
    ```bash
    git clone <your-repo-url>
    cd Store-Rating-Application
    ```

2.  **Install Dependencies**
    We use a concurrent setup. Install dependencies for the root, server, and client.

    ```bash
    # Root (Automation scripts)
    npm install

    # Server (Backend)
    cd server
    npm install

    # Client (Frontend)
    cd ../client
    npm install
    cd ..
    ```

### ⚙️ Configuration

1.  **Database**: Create a new PostgreSQL database (e.g., `store_rating_db`).
2.  **Environment Variables**: Create a `.env` file in the **`server/`** directory using the template below:

    ```env
    # server/.env
    PORT=5000
    DB_NAME=store_rating_db
    DB_USER=postgres
    DB_PASSWORD=your_password
    DB_HOST=localhost
    JWT_SECRET=your_super_safe_secret_key
    ```

---

## 🏃 Usage Guide

### Start Development Server
Run the full-stack application (frontend + backend) simultaneously with a single command from the **root** folder:

```bash
npm start
```

*   **Frontend**: [http://localhost:5173](http://localhost:5173)
*   **Backend API**: [http://localhost:5000](http://localhost:5000)

### Production Build
To create an optimized production build of the frontend:

```bash
cd client
npm run build
```

---

## � Demo Credentials

Use these credentials to explore the different roles and functionalities:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@roxiler.com` | `Admin@123` | Full access, User/Store CRUD, Analytics |
| **Store Owner** | `owner@roxiler.com` | `Owner@123` | Manage own store, View Ratings |
| **Normal User** | `user@roxiler.com` | `User@123` | View Stores, Submit Ratings, Profile |

---

## �📡 API Reference

Here are the top 3 core endpoints for interacting with the system.

| Method | Endpoint | Description | Expected Payload |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/login` | Authenticate user & get Token | `{ "email": "user@test.com", "password": "password123" }` |
| **POST** | `/stores` | Register a new Store | `{ "name": "Tech Store", "address": "123 Main St", "email": "contact@tech.com", "ownerId": 1 }` |
| **POST** | `/ratings` | Submit a Store Rating | `{ "storeId": 5, "score": 4 }` |

---

## 📂 Project Structure

```text
Store-Rating-Application/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Buttons, Cards, Inputs)
│   │   ├── pages/          # Application Pages (Dashboard, Login)
│   │   ├── context/        # Global State (AuthContext)
│   │   └── lib/            # Utilities (Validation, Formatting)
│
├── server/                 # Backend (Node + Express)
│   ├── config/             # Database connection setup
│   ├── controllers/        # Request logic & business rules
│   ├── models/             # Database schemas (User, Store, Rating)
│   ├── routes/             # API Route definitions
│   └── middleware/         # Auth & Role verification
│
└── package.json            # Root configuration & scripts
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1.  **Fork** the project.
2.  Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

**Built with ❤️ for Roxiler Systems**
