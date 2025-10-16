# Movie Booking Application - Copilot Instructions

This is a production-ready Movie Booking web application similar to BookMyShow with:
- Frontend: React + TailwindCSS  
- Backend: Spring Boot 3.x with Java 17+, JPA/Hibernate, JWT authentication
- Database: MySQL with Docker support
- Complete local development setup with Docker Compose
- Unit/integration tests and CI/CD pipeline

## Project Structure
- `/backend` - Spring Boot application
- `/frontend` - React application  
- `/docker` - Docker configuration files
- `/database` - MySQL scripts and migrations

## Development Guidelines
- Use Java 17+ and Spring Boot 3.x for backend
- Implement JWT authentication with USER/ADMIN roles
- Use JPA entities: User, Role, Movie, Venue, Show, Seat, Booking, Event, Sport, City
- Frontend should be responsive and accessible
- Include placeholder handling for images (TODO: replace with real URLs)
- Follow REST API best practices with proper HTTP status codes