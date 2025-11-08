# 🧩 Customer Relationship Management (CRM) System

A **Customer Relationship Management system** built with the **MERN stack**  
(**MongoDB**, **Express**, **React**, and **Node.js**) — containerized using **Docker Compose**.

This CRM enables Sales Representatives to manage, import, and export customer data efficiently.

---

## 🚀 Quick Start

### ⚙️ Prerequisites
- **Node.js** (v18+)
- **npm**
- **Docker Desktop** (for containerized setup)
- **Git**

---

## 🧰 Project Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/pestechnology/PESU_RR_AIML_B_P08_Customer_Relationship_Management_carti-album.git
cd PESU_RR_AIML_B_P08_Customer_Relationship_Management_carti-album
```

### 2️⃣ Install dependencies
If you plan to run locally (without Docker):

```bash
# Install client dependencies
cd crm-system/client
npm install

# Install server dependencies
cd ../server
npm install
```

---

## ⚙️ Environment Setup

Each service (client and server) has its own environment configuration.  

| File | Purpose | Used When |
|------|----------|------------|
| `client/.env` | Frontend (local dev) | Running with `npm run dev` |
| `client/.env.docker` | Frontend (Docker) | Running via `docker compose up` |
| `server/.env` | Backend (local dev) | Running with `npm start` |
| `server/.env.docker` | Backend (Docker) | Running via `docker compose up` |

### 🧩 Example contents:

#### `client/.env`
```env
DOCKER_ENV=false
VITE_API_TARGET=http://localhost:5000
```

#### `client/.env.docker`
```env
DOCKER_ENV=true
VITE_API_TARGET=http://server:5000
```

#### `server/.env`
```env
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=crm-db
```

#### `server/.env.docker`
```env
MONGO_HOST=mongo
MONGO_PORT=27017
MONGO_DB=crm-db
```

---

## 🐳 Running the Application with Docker (Recommended)

### 🧠 What Docker does
`docker-compose.yml` automatically sets up:
- **MongoDB** (database)
- **Express server** (backend)
- **React + Vite app** (frontend)

Everything runs in isolated containers that talk to each other via internal Docker networking.

### ▶️ To start:
From the `crm-system` folder:
```bash
docker compose up --build
```

### 📍 URLs after startup:
| Service | URL | Description |
|----------|-----|-------------|
| **Frontend (React + Vite)** | http://localhost:5173 | Main UI |
| **Backend (Express)** | http://localhost:5000 | API + Health check |
| **MongoDB** | localhost:27018 | Exposed for local tools like Compass |

### 🩺 Check if everything’s running
```bash
docker ps
```
You should see containers for:
- `crm-system-client-1`
- `crm-system-server-1`
- `crm-system-mongo-1`

---

## 🧪 Running Locally (without Docker)

If you prefer to run services directly on your system:

1️⃣ Start MongoDB manually (ensure it’s running on `mongodb://localhost:27017`)

2️⃣ Start the backend:
```bash
cd crm-system/server
npm start
```

3️⃣ In a separate terminal, start the frontend:
```bash
cd crm-system/client
npm run dev
```

4️⃣ Visit:  
👉 http://localhost:5173

---

## 📂 Project Structure

```
crm-system/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # UI components (Customers, Pipeline, etc.)
│   │   ├── services/           # API utilities
│   │   └── main.jsx, App.jsx
│   ├── .env / .env.docker
│   └── vite.config.js
│
├── server/                     # Express + MongoDB backend
│   ├── src/
│   │   ├── controllers/        # Business logic (CRUD, import/export)
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API endpoints
│   │   ├── config/db.js        # MongoDB connection
│   │   └── index.js            # Server entry
│   ├── exports/                # CSV exports stored here
│   ├── .env / .env.docker
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## 💾 Useful Docker Commands

| Command | Description |
|----------|-------------|
| `docker compose up --build` | Build and start all containers |
| `docker compose down` | Stop all containers |
| `docker ps` | List running containers |
| `docker compose logs server` | View backend logs |
| `docker exec -it crm-system-server-1 sh` | Open terminal inside the server container |

---

## 💡 Development Workflow

1️⃣ Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2️⃣ Make your changes, test locally or in Docker.

3️⃣ Commit and push:
```bash
git add .
git commit -m "Implemented <feature>"
git push origin feature/your-feature-name
```

4️⃣ Open a Pull Request → Get it reviewed → Merge into `main`.

---

## 🧹 What NOT to Commit

Add these to `.gitignore`:
```
node_modules/
.env
.env.docker
dist/
build/
logs/
coverage/
```

---

## 🧪 Testing

### Backend Tests
```bash
cd crm-system/server
npm test
```

### Frontend Tests (when available)
```bash
cd crm-system/client
npm test
```

---

## 🩵 Credits

Developed by **Team PESU_RR_AIML_B_P08**  
Semester 5 Software Engineering Project — CRM System  

---

### ✅ TL;DR for Your Teammates
| Step | Command |
|------|----------|
| Clone repo | `git clone <url>` |
| Start everything (Docker) | `docker compose up --build` |
| Access frontend | http://localhost:5173 |
| Access backend | http://localhost:5000/health |
