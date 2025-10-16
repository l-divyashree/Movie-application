# Movie Booking Application

A production-ready movie booking web application similar to BookMyShow, built with React, Spring Boot, and MySQL.

## 🚀 Features

### 🎬 Core Features
- **Movie Catalog**: Browse movies with advanced filtering (genre, language, city)
- **Show Management**: Multiple showtimes, venues, and cities support
- **Seat Selection**: Interactive seat map with different categories (Regular, Premium, VIP)
- **Booking Flow**: Complete reservation system with confirmation
- **User Profiles**: Registration, login, booking history
- **Admin Dashboard**: Complete CRUD operations for movies, shows, venues

### 🏟️ Additional Content  
- **Events**: Special movie screenings, premieres, film festivals
- **Sports**: Live sports events, cricket matches, football games
- **Multi-city**: Support for multiple cities and venues

### 🔒 Security & Authentication
- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: USER and ADMIN roles
- **Password Encryption**: BCrypt hashing
- **CORS Protection**: Configurable cross-origin settings

### 💻 Technical Features
- **Responsive Design**: Mobile-first with TailwindCSS
- **Real-time Updates**: Live seat availability
- **API Documentation**: Swagger/OpenAPI integration  
- **Database Migrations**: Flyway schema versioning
- **Containerized**: Full Docker support
- **CI/CD Ready**: GitHub Actions workflow
- **Production Ready**: Nginx, security headers, optimizations

## 🏗️ Architecture

```
├── backend/          # Spring Boot API (Java 17+)
├── frontend/         # React + TailwindCSS
├── database/         # MySQL scripts & migrations
├── docker/           # Docker configurations
└── .github/          # CI/CD workflows
```

## 🛠️ Tech Stack

### Backend
- **Java 17+** with **Spring Boot 3.x**
- **Spring Security** with JWT authentication
- **JPA/Hibernate** for data persistence
- **MySQL** database
- **Flyway** for database migrations
- **Maven** for dependency management

### Frontend
- **React 18** with functional components
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Query** for state management

### DevOps
- **Docker & Docker Compose** for local development
- **GitHub Actions** for CI/CD
- **Nginx** for production deployment

## 🚦 Quick Start

### Prerequisites
- Docker & Docker Compose
- VS Code (recommended)
- Git

### One-Command Setup

1. **Clone and start the application**
   ```powershell
   git clone <your-repo-url>
   cd Movie-1
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - MySQL: localhost:3306

3. **Default Login Credentials**
   - Admin: `admin` / `admin123`
   - User: `john_doe` / `user123`

### VS Code Development

1. **Open in VS Code**
   ```powershell
   code .
   ```

2. **Use VS Code Tasks** (Ctrl+Shift+P → "Tasks: Run Task")
   - Start Movie Booking Application (Full Stack)
   - Build Backend (Maven)  
   - Start Frontend (React Dev Server)
   - Run Tests

3. **Extensions Installed**
   - Java Extension Pack
   - Spring Boot Tools  
   - React/JavaScript extensions
   - Docker support
   - MySQL client

### Manual Setup (without Docker)

See [DEVELOPMENT.md](DEVELOPMENT.md) for detailed manual setup instructions.

### Project Structure Overview

```
Movie-1/
├── backend/              # Spring Boot API (Port 8080)
│   ├── src/main/java/   # Java source code
│   │   ├── entity/      # JPA entities
│   │   ├── repository/  # Data repositories  
│   │   ├── security/    # JWT authentication
│   │   └── ...
│   ├── Dockerfile       # Development container
│   └── pom.xml         # Maven dependencies
│
├── frontend/            # React App (Port 3000)  
│   ├── src/            # React source code
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   └── ...
│   ├── Dockerfile      # Development container
│   └── package.json    # Node dependencies
│
├── database/           # MySQL setup
│   ├── schema.sql     # Complete database schema
│   └── init.sql       # Docker initialization
│
├── docker/            # Docker configurations
├── .github/           # CI/CD workflows
├── .vscode/           # VS Code tasks & settings
├── docker-compose.yml # Development setup
└── README.md          # This file
```

## 📊 Database Schema

### Core Entities
- `users` - User accounts and profiles
- `roles` - User roles (USER, ADMIN)
- `movies` - Movie information
- `venues` - Theater venues
- `shows` - Movie showtimes
- `seats` - Seat configurations
- `bookings` - User bookings
- `events` - Special events
- `sports` - Sports events
- `cities` - Available cities

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Movies
- `GET /api/movies` - List movies with pagination/filtering
- `GET /api/movies/{id}` - Get movie details
- `POST /api/admin/movies` - Create movie (Admin)
- `PUT /api/admin/movies/{id}` - Update movie (Admin)

### Bookings
- `POST /api/bookings/reserve` - Reserve seats
- `POST /api/bookings/confirm` - Confirm booking
- `DELETE /api/bookings/{id}` - Cancel booking

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test                    # Unit tests
mvn verify                  # Integration tests
```

### Frontend Tests
```bash
cd frontend
npm test                    # Jest unit tests
npm run test:e2e           # Cypress E2E tests
```

## 🚀 Production Deployment

### Docker Production Build
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production Setup
1. Build frontend: `npm run build`
2. Configure Nginx (see `docker/nginx/nginx.conf`)
3. Deploy Spring Boot JAR with production profile
4. Configure MySQL with proper security settings

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📝 Environment Variables

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=moviebooking
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: Image placeholders are used throughout the application. Replace `posterUrl` and `imageUrl` fields with actual image URLs when deploying to production.