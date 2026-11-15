# CareCircle - Elderly Care and Medication Management Platform

CareCircle is a compassionate, accessible elderly care and medication management platform built for hackathons and production deployment. It connects seniors, family members, and caregivers with simplified medication tracking, secure passcode-based access, OCR prescription reading, and non-clinical conversational assistance.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Python 3.10+, FastAPI, Uvicorn
- **Database & ORM**: PostgreSQL, SQLAlchemy 2.0
- **Database Migrations**: Alembic
- **Validation**: Pydantic v2 / Pydantic-Settings
- **Testing**: Pytest, HTTPX
- **Authentication**: Passcode-based role-based access control (RBAC) *(Phase 2)*
- **OCR Engine**: Tesseract OCR *(Phase 2)*
- **AI Assistance**: Gemini API (Non-clinical assistance only) *(Phase 2)*
- **Deployment Target**: Railway

---

## 📂 Project Architecture

```text
CareCircle/
├── .gitignore                          # Global git ignores
├── README.md                           # Documentation and setup guide
├── tests/                              # Integration & unit test suite
│   ├── __init__.py
│   ├── conftest.py                     # Pytest fixtures (TestClient)
│   └── test_health.py                  # API health-check test cases
├── backend/
│   ├── .env.example                    # Backend environment template
│   ├── requirements.txt                # Python backend dependencies
│   ├── alembic.ini                     # Database migration settings
│   ├── alembic/                        # Alembic migration environment
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   ├── storage/
│   │   └── uploads/                    # Private local storage for prescriptions
│   └── app/
│       ├── __init__.py
│       ├── main.py                     # FastAPI application entry & CORS
│       ├── core/
│       │   ├── config.py               # Pydantic BaseSettings configuration
│       │   ├── database.py             # PostgreSQL SQLAlchemy engine & sessions
│       │   └── security.py             # Auth & RBAC module placeholder
│       ├── api/
│       │   └── v1/
│       │       ├── api.py              # Root router for v1 endpoints
│       │       └── endpoints/
│       │           └── health.py       # GET /api/v1/health endpoint
│       ├── models/
│       │   ├── base.py                 # DeclarativeBase definition
│       │   └── __init__.py             # Model discovery for Alembic
│       ├── schemas/
│       │   ├── health.py               # Pydantic health response models
│       │   └── __init__.py
│       └── services/                   # Business logic (OCR, Gemini, etc.)
└── frontend/
    ├── .env.example                    # Frontend environment template
    ├── index.html                      # HTML root template
    ├── package.json                    # Dependencies & scripts
    ├── vite.config.js                  # Vite config with backend proxy
    ├── tailwind.config.js              # Tailwind styling configuration
    ├── postcss.config.js               # PostCSS configuration
    └── src/
        ├── main.jsx                    # React entry point
        ├── App.jsx                     # CareCircle landing page & health indicator
        └── index.css                   # Tailwind directives
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (v20+ recommended)
- **PostgreSQL**: (Optional for Phase 1; live database is not required for health check)

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   - On Windows (PowerShell):
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to configure your PostgreSQL credentials and secrets as needed.*

5. **Run the backend development server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Interactive API Documentation**:
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - Health check: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### 3. Running Backend Tests

From the project root:

```bash
pytest tests/ -v
```

---

### 4. Database Migrations (PostgreSQL)

When ready to apply or create Alembic migrations:

```bash
cd backend
# Create a new migration revision
alembic revision --autogenerate -m "initial migration"

# Apply migrations
alembic upgrade head
```

*Note: Missing or unconfigured PostgreSQL connection will gracefully report `database: "disconnected"` without crashing application startup or health endpoints.*

---

### 5. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**:
   ```bash
   cp .env.example .env
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at [http://localhost:5173](http://localhost:5173).

---

## 🔒 Security & Privacy Conventions

- **Prescription Storage**: File uploads are stored in `backend/storage/uploads/` which is outside the public frontend build and excluded from version control.
- **Passcode Authentication & RBAC**: Logic is isolated in `backend/app/core/security.py`.
- **Database Decoupling**: Database sessions are managed per-request via dependency injection with lazy pool initialization.
- **Secrets Management**: All sensitive configurations are managed via `.env` and `pydantic-settings`. No keys are hardcoded.

---

## 🚢 Railway Deployment Readiness

- **Backend**: Set the start command to:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
  Provide `DATABASE_URL` via Railway's PostgreSQL plugin.
- **Frontend**: Set build command to `npm run build` and output directory to `dist`.
