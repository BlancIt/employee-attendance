# Employee Attendance

Fullstack web application for employee WFH attendance management built with **NestJS** (backend) and **React** (frontend).

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend:** React (Vite), TypeScript, Ant Design
- **Auth:** JWT (JSON Web Token)
- **Message Queue:** RabbitMQ
- **Real-time:** Socket.IO (WebSocket)
- **Database:** PostgreSQL (main database) + PostgreSQL (change logs database)

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose

## Quick Start

### 1. Start Infrastructure

```bash
docker compose up -d
```

This will start:
- PostgreSQL (main DB) on port `5432`
- PostgreSQL (logs DB) on port `5433`
- RabbitMQ on port `5672` (management UI: `http://localhost:15672`)

### 2. Start Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on `http://localhost:3000`. On first run, it automatically seeds demo data.

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`.

## Demo Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin.hrd@gmail.com   | password123 |
| Employee | mhaikalb@gmail.com    | password123 |
| Employee | testingguy@gmail.com  | password123 |
| Admin    | randi.putra@gmail.com | password123 |

## Implemented Features

### Backend
- Database schema (Employee + Attendance tables)
- JWT authentication (login)
- Employee profile API (view, update photo/phone, change password)
- Attendance API (clock in, clock out, summary with date filter)
- Admin API (manage employees, view all attendance)
- Real-time WebSocket notifications to admin on profile changes
- RabbitMQ message queue for change logging to separate database
- Auto-seed demo data on first run

### Frontend (Employee)
- Login page with JWT authentication
- Employee layout with collapsible sidebar (drawer on mobile)
- Profile page (view info, update photo, edit phone, change password)
- Attendance page (live clock, clock in/out with status tracking)
- Attendance summary page (table with date range filter, duration calculation)
- Responsive design (mobile, tablet, desktop)

### Frontend (Admin)
- Admin layout with separate navigation
- Employee management (list, create, edit employees with admin toggle)
- Attendance monitoring (view all employees' attendance with date filter)
- Real-time WebSocket notifications on employee profile changes
- Admin can access own employee features (profile, attendance)
- Self-protection (cannot revoke own admin access)
- Role-based route protection (admin-only pages)

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with email & password

### Employees (requires JWT)
- `GET /api/employees/me` - Get current user profile
- `PATCH /api/employees/me` - Update current user profile (phone, photo)
- `POST /api/employees/me/change-password` - Change current user password
- `GET /api/employees` - [Admin] List all employees
- `POST /api/employees` - [Admin] Create employee
- `PATCH /api/employees/:id` - [Admin] Update employee

### Attendance (requires JWT)
- `POST /api/attendances/clock-in` - Submit Clock in record
- `POST /api/attendances/clock-out` - Submit Clock out record
- `GET /api/attendances/me?from=&to=` - Get own attendance summary
- `GET /api/attendances?from=&to=` - [Admin] Get all attendance

## Architecture

```
┌──────────────┐     ┌──────────────┐
│    React     │────>│   NestJS     │
│  (Frontend)  │     │  (Backend)   │
└──────────────┘     └──┬───┬───┬──┘
                        │   │   │
               ┌────────┘   │   └────────┐
               │            │            │
      ┌────────▼───┐ ┌─────▼─────┐ ┌────▼────────┐
      │ PostgreSQL │ │ RabbitMQ  │ │ PostgreSQL  │
      │ (Main DB)  │ │ (Queue)   │ │ (Logs DB)   │
      └────────────┘ └───────────┘ └─────────────┘
```

## Project Structure

```
employee-attendance/
├── backend/
│   └── src/
│       ├── auth/           # JWT authentication
│       ├── employee/       # Employee CRUD & profile
│       ├── attendance/     # Clock in/out & summaries
│       ├── notification/   # WebSocket & RabbitMQ
│       ├── entities/       # TypeORM entities
│       ├── seed/           # Demo data seeder
│       └── config/         # Database configurations
├── frontend/
│   └── src/
│       ├── api/            # Axios instance & interceptors
│       ├── context/        # Auth context (React Context)
│       ├── components/     # Reusable components
│       ├── layouts/        # Employee & Admin layouts
│       └── pages/
│           ├── employee/   # Profile, Attendance, Summary
│           └── admin/      # Employee management, Monitoring
└── docker-compose.yml      # PostgreSQL, RabbitMQ
```
