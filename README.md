# Distributed API Uptime & Latency Monitor

A modern, dark-themed distributed API uptime and latency monitoring dashboard built with **React**, **Django REST Framework**, and **PostgreSQL** (with zero-configuration SQLite fallback for development).

---

## Architecture Overview

```text
┌───────────────────────────────┐
│     React Frontend (Vite)     │  http://localhost:5173
│  Tailwind CSS + React Router  │
└───────────────┬───────────────┘
                │
                │ HTTP / REST API (Axios)
                ▼
┌───────────────────────────────┐
│       Django REST API         │  http://localhost:8000
│  Health Checks & Controllers  │
└───────────────┬───────────────┘
                │
                │ Database Layer
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │  (SQLite automatic fallback)
│  (Configured via .env)        │
└───────────────────────────────┘
```

> **Note on Future Capabilities**: Advanced distributed capabilities (including Redis, BullMQ / Celery workers, cron jobs, automated heartbeat probing, alerting webhooks, email dispatch, and incident management) are deliberately scheduled for upcoming milestones. This phase establishes the clean, tested foundation.

---

## Technology Stack

- **Frontend**: React 19, Vite, JavaScript, Tailwind CSS v4, React Router 7, Axios, Lucide React icons
- **Backend**: Python 3.12+, Django 6+, Django REST Framework, django-cors-headers, psycopg2-binary, python-dotenv
- **Database**: PostgreSQL ready (automatic SQLite fallback if PostgreSQL is not active)

---

## Project Structure

```text
distributed-api-monitor/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── api/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── urls.py
│       ├── views.py
│       └── migrations/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── components/
│       │   ├── Sidebar.jsx
│       │   ├── Header.jsx
│       │   ├── StatCard.jsx
│       │   ├── MonitorCard.jsx
│       │   └── StatusBadge.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Monitors.jsx
│       │   └── Settings.jsx
│       │
│       └── services/
│           └── api.js
│
├── .gitignore
└── README.md
```

---

## Setup & Running Locally

### 1. Backend Setup (Django)

In a terminal:

```powershell
cd backend
```

Create virtual environment (Windows):

```powershell
python -m venv venv
```

Activate the virtual environment:

```powershell
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Initialize environment configuration:

```powershell
# Copy the example .env if you haven't already
cp .env.example .env
```

Run migrations:

```powershell
python manage.py migrate
```

Start the Django development server:

```powershell
python manage.py runserver
```

The Django server will run at: **http://localhost:8000**

---

### 2. Frontend Setup (React + Vite)

In a separate terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

The Vite dev server will run at: **http://localhost:5173**

---

## Expected URLs & Endpoints

| Service / Page | URL | Description |
| :--- | :--- | :--- |
| **Frontend Application** | `http://localhost:5173` | React monitoring dashboard |
| **Dashboard Route** | `http://localhost:5173/dashboard` | Overview & operational metrics |
| **Monitors Route** | `http://localhost:5173/monitors` | Monitor status & empty state |
| **Settings Route** | `http://localhost:5173/settings` | System, appearance & environment configuration |
| **Backend Base API** | `http://localhost:8000/api/` | Base API information endpoint |
| **Backend Health Check** | `http://localhost:8000/api/health/` | Real-time backend status probe (`status: ok`) |

---

## Health Check API Contract

```http
GET /api/health/
```

**Response (200 OK)**:

```json
{
  "status": "ok",
  "message": "API Monitor backend is running"
}
```
