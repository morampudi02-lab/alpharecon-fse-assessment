# AlphaRecon User Management (Assessment App)

## Purpose

This repository contains a full-stack "User Management" application built for the AlphaRecon Full-Stack Software Engineer Skills Assessment.

It provides a CRUD experience for users (create, edit, delete, list) with a REST API backend and an Angular frontend.

## Technology Stack (versions used in this repo)

- Frontend: Angular 21.2.x (Angular packages ^21.2.0, Angular CLI ^21.2.6)
- Backend: Spring Boot 4.0.5
- Language: Java 25
- Frontend runtime: Node.js (recommended 22.12.0+; see `frontend/package.json` engines)
- Database: H2 in-memory (JPA, `ddl-auto=create-drop`)

## What This App Does

- Shows a user list with Edit and Delete actions
- Provides a create/edit modal form
- Validates input on the backend (required fields + email format)
- Rejects duplicate emails (HTTP 409)
- Returns consistent structured errors for common failures

## Run Locally (Windows)

### Prerequisites

- JDK 25
  - Recommended: Eclipse Adoptium Temurin 25
  - Ensure `JAVA_HOME` points to your JDK 25 install
- Node.js 22.12.0+ (or compatible with the repo engines range)

### Ports

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:4200`

## Start the Backend (Spring Boot, port 8080)

Open a PowerShell terminal and run:

```powershell
cd "C:\Users\pepper\Desktop\alpha recon\alpharecon-fse-assessment\backend"
$env:JAVA_HOME = "C:\Path\To\JDK-25"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
.\mvnw.cmd spring-boot:run
```

Backend endpoints:
- API base: `http://localhost:8080/api/v1/users`
- H2 console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:usermanagementdb`
  - Username: `sa`
  - Password: *(blank)*

Data note: the app uses an in-memory H2 database, so data resets when the backend restarts.

## Start the Frontend (Angular, port 4200)

Open a second PowerShell terminal and run:

```powershell
cd "C:\Users\pepper\Desktop\alpha recon\alpharecon-fse-assessment\frontend"
npm install
npm start
```

The `npm start` script runs:
- `ng serve --proxy-config proxy.conf.json`

In development, the Angular dev server proxies requests to `/api/...` to the Spring Boot backend (`http://127.0.0.1:8080`).

Frontend:
- `http://localhost:4200/`

## REST API Contract

All endpoints are under: `/api/v1/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/v1/users` | Get all users |
| GET    | `/api/v1/users/{id}` | Get user by id |
| POST   | `/api/v1/users` | Create user |
| PUT    | `/api/v1/users/{id}` | Update user |
| DELETE | `/api/v1/users/{id}` | Delete user |

### Request Payload (POST/PUT)

The backend expects a request DTO with:

- `firstName` (required)
- `lastName` (required)
- `email` (required, must be valid)
- `note` (optional)

### Response Payload (high level)

Successful responses include:

- `id`
- `firstName`, `lastName`, `email`, `note`
- `createdAt`, `updatedAt`

### Error Response Format

Errors are returned as JSON with:

- `timestamp`
- `status`
- `error`
- `message`

Common cases:

- `400`: validation errors
- `404`: user id not found
- `409`: duplicate email

## Project Layout (high level)

- `frontend/`
  - `src/app/components/user-list/`: list view + modal open/close
  - `src/app/components/user-form/`: create/edit modal form
  - `src/app/services/user.service.ts`: HTTP client for `/api/v1/users`
- `backend/`
  - `src/main/java/.../controller/`: REST endpoints
  - `src/main/java/.../service/`: business logic
  - `src/main/java/.../repository/`: JPA repository
  - `src/main/java/.../dto/`: request/response DTOs
  - `src/main/java/.../exception/`: exceptions + global handler

## Intended Tradeoffs / Limitations (assessment scope)

- H2 in-memory database: data is not persistent across backend restarts
- No authentication/authorization
- No pagination/search
- Minimal automated test coverage (assessment-focused implementation)

## Troubleshooting

1. Frontend API calls return `404`
   - Confirm Spring Boot is running on `8080`
   - Restart the Angular dev server after starting the backend
2. Port already in use
   - Stop the process using `8080` or `4200`, then retry
3. CORS issues
   - Backend is configured to allow `localhost:4200` and `127.0.0.1:4200`

