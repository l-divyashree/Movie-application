# Development Setup Guide

## Quick Start with Docker (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - VS Code with recommended extensions

2. **Start the Application**
   ```powershell
   # Navigate to project directory
   cd "Movie-1"
   
   # Start all services (MySQL, Backend, Frontend)
   docker-compose up -d
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - MySQL: localhost:3306

4. **Default Credentials**
   - Admin: `admin` / `admin123`
   - User: `john_doe` / `user123`

## Manual Development Setup

### Backend (Spring Boot)

1. **Prerequisites**
   - Java 17+
   - Maven 3.6+
   - MySQL 8.0+

2. **Database Setup**
   ```sql
   CREATE DATABASE moviebooking;
   -- Import schema from database/schema.sql
   ```

3. **Run Backend**
   ```powershell
   cd backend
   mvn spring-boot:run
   ```

### Frontend (React)

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Install Dependencies**
   ```powershell
   cd frontend
   npm install
   ```

3. **Run Frontend**
   ```powershell
   npm start
   ```

## VS Code Tasks

Use Ctrl+Shift+P and type "Tasks: Run Task" to access:
- **Start Movie Booking Application (Full Stack)** - Starts everything with Docker
- **Build Backend (Maven)** - Compile Java code
- **Run Backend (Spring Boot)** - Start backend server
- **Start Frontend (React Dev Server)** - Start React development server
- **Stop Movie Booking Application** - Stop all Docker services

## Troubleshooting

### Port Conflicts
- Frontend: 3000
- Backend: 8080
- MySQL: 3306

### Database Connection Issues
- Check MySQL is running
- Verify connection settings in application.properties
- Import schema from database/schema.sql

### Docker Issues
```powershell
# Reset everything
docker-compose down -v
docker-compose up -d --build
```

## Testing

### Backend Tests
```powershell
cd backend
mvn test
```

### Frontend Tests
```powershell
cd frontend
npm test
```

## Production Deployment

```powershell
# Build production images
docker-compose -f docker-compose.prod.yml up -d
```

---

For detailed API documentation, visit http://localhost:8080/swagger-ui.html when the backend is running.