# CRM System

A Customer Relationship Management system built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (or Docker for containerized setup)
- Git

### For First-Time Setup

1. Clone the repository:
```bash
git clone https://github.com/pestechnology/PESU_RR_AIML_B_P08_Customer_Relationship_Management_carti-album.git
cd PESU_RR_AIML_B_P08_Customer_Relationship_Management_carti-album
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd crm-system/client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In crm-system/server directory
cp .env.example .env
# Edit .env with your MongoDB connection string and other settings
```

### Running the Application

#### Option 1: Using Docker (Recommended)

```bash
# In crm-system directory
docker-compose up --build
```
This will start:
- MongoDB at mongodb://localhost:27017
- Backend at http://localhost:5000
- Frontend at http://localhost:5173

#### Option 2: Running Locally

1. Start the backend:
```bash
cd crm-system/server
npm start
# Server will run on http://localhost:5000
```

2. Start the frontend (in a new terminal):
```bash
cd crm-system/client
npm run dev
# Client will run on http://localhost:5173
```

## 📁 What to Commit

When working on the project, commit these files:

✅ DO commit:
- All source code files (*.js, *.jsx)
- Configuration files (package.json, vite.config.js, etc.)
- Documentation (*.md)
- Docker and CI configurations
- Tests

❌ DON'T commit:
- node_modules/
- .env files (only commit .env.example)
- build/ or dist/ directories
- Local IDE settings
- Log files

## 🔧 Development Workflow

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally

3. Create a pull request to the main branch

4. Wait for CI checks and code review

See CONTRIBUTING.md for more detailed guidelines.

## 🧪 Running Tests

```bash
# Run server tests
cd crm-system/server
npm test

# Frontend tests (when added)
cd crm-system/client
npm test
```

## 📚 Project Structure

```
Repository Root
├── .github/
│   └── workflows/        # GitHub Actions CI/CD
│       └── ci.yml       # Main CI workflow
└── crm-system/
    ├── client/          # React frontend
    │   ├── src/
    │   │   ├── components/   # Reusable UI components
    │   │   ├── pages/       # Route components
    │   │   ├── services/    # API calls
    │   │   └── store/       # State management
    │   └── ...
    ├── server/         # Express backend
    │   ├── src/
    │   │   ├── controllers/ # Route controllers
    │   │   ├── models/      # Mongoose models
    │   │   ├── routes/      # Express routes
    │   │   └── ...
    │   └── ...
    └── docs/          # Project documentation
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.
