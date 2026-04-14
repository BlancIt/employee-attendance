# Employee Attendance - Aplikasi untuk absensi karyawan secara WFH (Work From Home) - IN PROGRESS

Fullstack web application for employee WFH attendance management built with **NestJS** (backend) and **React** (frontend).

## Tech Stack

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL
- **Frontend:** React.js, TypeScript
- **Auth:** JWT (JSON Web Token)

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose

## Quick Start

### 1. Start Database (PostgreSQL)

```bash
docker compose up -d
```

This will start PostgreSQL (main DB) on port `5432`.

### 2. Start Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run on `http://localhost:3000`. On first run, it automatically seeds demo data.

## Demo Accounts

| Role     | Email                 | Password    |
|----------|-----------------------|-------------|
| Admin    | admin.hrd@gmail.com   | password123 |
| Employee | mhaikalb@gmail.com    | password123 |
| Employee | testingguy@gmail.com  | password123 |
| Admin    | randi.putra@gmail.com | password123 |

## Current Implemented Features

### Backend
- Database schema (Employee + Attendance tables)
- JWT authentication (login)
- Employee profile API (view, update photo/phone, change password)
- Auto-seed demo data on first run

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with email & password

### Employees (requires JWT)
- `GET /api/employees/me` - Get own profile
- `PATCH /api/employees/me` - Update own profile (phone, photo)
- `POST /api/employees/me/change-password` - Change password

## Architecture

```
┌──────────────┐
│   NestJS     │
│  (Backend)   │
└──────┬───────┘
       │
┌──────▼───────┐
│  PostgreSQL  │
│  (Main DB)   │
└──────────────┘
```

## To Be Worked/Added

- Attendance APIs (clock in/out, summary), Admin APIs, alert notification and message log queueing (Using RabbitMQ)
- Frontend - Employee app (Login, Profile, Attendance pages)
- Frontend - Admin app
- Testing, Polishing and finishing
