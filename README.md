# 🎬 Movie Booking Application

> A production-ready movie booking web application similar to BookMyShow, built with React, Spring Boot, and MySQL.

<img width="3788" height="2077" alt="image" src="https://github.com/user-attachments/assets/401c7f12-42eb-4cfd-b46a-03a6c27a8d65" />

## 🗺️ Roadmap
# CinemaFlix — Movie Booking Application

This repository contains the CinemaFlix movie booking web application (React frontend + Spring Boot backend). Below are curated screenshots for the User Dashboard and Admin Dashboard, plus instructions to add the images into the repository so they appear in the README.

### User Dashboard

1. Overview / Hero

<img width="3772" height="2068" alt="Screenshot 2025-10-30 105101" src="https://github.com/user-attachments/assets/0ba0c0cc-4387-4c6f-a958-641a3aa1b873" />


2. Featured movies grid

<img width="3765" height="1892" alt="Screenshot 2025-10-30 105116" src="https://github.com/user-attachments/assets/31ead5b2-7f09-4d80-95f2-28408a2516cb" />


3. Show selection / dates & shows

<img width="3796" height="2009" alt="Screenshot 2025-10-30 105136" src="https://github.com/user-attachments/assets/ee398d81-6a44-4335-8cdd-7dbdbf69909c" />


4. Seat selection

<img width="3767" height="2009" alt="Screenshot 2025-10-30 105147" src="https://github.com/user-attachments/assets/98dbdf2a-cb56-4f75-b2c0-aa4d6664f18a" />


5. Payment summary

<img width="3825" height="2084" alt="Screenshot 2025-10-30 105208" src="https://github.com/user-attachments/assets/4ae2d597-ca5c-44ac-a7f3-1d0247de21e5" />


---

### Admin Dashboard

1. Admin - Dashboard overview

<img width="3838" height="2088" alt="Screenshot 2025-10-30 104805" src="https://github.com/user-attachments/assets/d06edd1f-12d8-42fe-9c72-512760626c58" />


2. Admin - Movies management

<img width="3825" height="2097" alt="Screenshot 2025-10-30 104830" src="https://github.com/user-attachments/assets/430c8ba5-b9e0-479b-a85f-1d2d6b069ae8" />


3. Admin - Shows management

<img width="3828" height="2098" alt="Screenshot 2025-10-30 104843" src="https://github.com/user-attachments/assets/3542742c-21a2-42d3-bfd0-ae327de36a62" />


4. Admin - Bookings list
5. 
<img width="3832" height="2080" alt="Screenshot 2025-10-30 104858" src="https://github.com/user-attachments/assets/17ed851c-5550-4f51-8ee0-4426704d414f" />


6. Admin - Users list

<img width="3833" height="1984" alt="Screenshot 2025-10-30 104910" src="https://github.com/user-attachments/assets/9862180e-1423-4a59-b5cd-bfbd33fb0c8e" />


6. Admin - Venues

<img width="3828" height="2002" alt="Screenshot 2025-10-30 104920" src="https://github.com/user-attachments/assets/9c42e389-21d5-4778-a857-1264c5d06cd6" />


7. Admin - Seats layout editor

<img width="3827" height="1981" alt="Screenshot 2025-10-30 104952" src="https://github.com/user-attachments/assets/1cccbf27-fdcb-48fe-a61a-dc855efafb12" />


8. Admin - Analytics

<img width="3769" height="1847" alt="Screenshot 2025-10-30 105031" src="https://github.com/user-attachments/assets/761af826-fdae-455f-aef4-b11e6fed909e" />

<img width="3764" height="1897" alt="Screenshot 2025-10-30 105043" src="https://github.com/user-attachments/assets/535ed61a-d37b-45d3-ab70-5a793f8602e0" />


## Quick Overview

- Frontend: React 18 + TailwindCSS
- Backend: Spring Boot 3.x (Java 17+)
- Database: MySQL (8+)
- Containerization: Docker & Docker Compose

---

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 16+ (recommended 18 or 22 LTS)
- npm 8+ or 9+
- Docker & Docker Compose (for local containerized dev)

---

## Local development (recommended: with Docker Compose)

1. Clone the repository:

```powershell
git clone https://github.com/l-divyashree/Movie-application.git
cd Movie-1
```

2. Start services with Docker Compose:

```powershell
docker-compose up -d
```

This starts the backend API, the frontend (if configured in compose), and the MySQL database.

3. Open the frontend in your browser:

```
http://localhost:3000
```

And the backend API at:

```
http://localhost:8080/api
```

---

## Running services locally without Docker

Backend (Spring Boot):

```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

Frontend (React):

```powershell
cd frontend
npm install
npm start
```

Note: ensure your backend is running and the `REACT_APP_API_URL` environment variable points to it.

---

## Environment variables

Create a `.env` file in the `backend` and `frontend` folders (or use system environment variables). Example values:

Backend (`backend/.env` or system env):

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=moviebooking
DB_USER=movieuser
DB_PASSWORD=moviepassword
JWT_SECRET=your-secret-key
SPRING_PROFILES_ACTIVE=development
```

Frontend (`frontend/.env`):

```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Useful VS Code tasks

The repo includes VS Code tasks for common workflows (see `.vscode/tasks.json`). Typical tasks:

- Start Movie Booking Application (Full Stack) — runs `docker-compose up -d`
- Build Backend (Maven) — `mvn clean compile`
- Run Backend (Spring Boot) — `mvn spring-boot:run`
- Install Frontend Dependencies — `npm install` in `frontend`
- Start Frontend — `npm start` in `frontend`

---

## Running tests

Backend:

```powershell
cd backend
mvn test

# optionally run integration tests
mvn verify
```

Frontend:

```powershell
cd frontend
npm test
```

---

## Building production artifacts

Frontend production build:

```powershell
cd frontend
npm run build
```

Backend production jar:

```powershell
cd backend
mvn clean package -DskipTests
```

These builds can be used within your CI/CD pipeline or to create Docker images for production.

---

## Docker production deploy

```powershell
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## API overview (short)

Authentication
- POST /api/auth/register
- POST /api/auth/login

Movies
- GET /api/movies
- GET /api/movies/{id}
- POST /api/admin/movies (admin)

Bookings
- POST /api/bookings/reserve
- POST /api/bookings/confirm

Refer to the backend controllers and `application.properties` for the full list of endpoints and request shapes.

---

## Troubleshooting

- If `npm start` fails with a syntax error, verify your Node.js version (`node --version`) and use a modern LTS (16+). Use `nvm` to switch versions if needed.
- If database migrations fail, inspect `database/init.sql` and backend logs for detailed errors.
- If Docker compose fails to start, run `docker-compose logs` and `docker-compose ps` to inspect the services.

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add feature"`
4. Push and open a PR





