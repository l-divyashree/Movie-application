-- Initial schema and data for Movie Booking Application
-- Flyway migration V1__init.sql

-- Roles table
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User roles junction table
CREATE TABLE user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Cities table
CREATE TABLE cities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE movies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    language VARCHAR(50),
    duration_minutes INT,
    rating VARCHAR(10),
    release_date DATE,
    poster_url VARCHAR(500),
    trailer_url VARCHAR(500),
    is_now_showing BOOLEAN DEFAULT FALSE,
    is_coming_soon BOOLEAN DEFAULT FALSE,
    director VARCHAR(255),
    cast TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Venues table
CREATE TABLE venues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city_id BIGINT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone_number VARCHAR(20),
    facilities JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Shows table
CREATE TABLE shows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    movie_id BIGINT NOT NULL,
    venue_id BIGINT NOT NULL,
    show_date DATE NOT NULL,
    show_time TIME NOT NULL,
    screen_name VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    available_seats INT DEFAULT 0,
    total_seats INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE CASCADE,
    UNIQUE KEY unique_show (movie_id, venue_id, show_date, show_time, screen_name)
);

-- Seats table
CREATE TABLE seats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    show_id BIGINT NOT NULL,
    seat_row VARCHAR(5) NOT NULL,
    seat_number INT NOT NULL,
    seat_type VARCHAR(20) DEFAULT 'REGULAR',
    price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat (show_id, seat_row, seat_number)
);

-- Bookings table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED',
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    booking_reference VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (show_id) REFERENCES shows(id)
);

-- Booking seats junction table
CREATE TABLE booking_seats (
    booking_id BIGINT,
    seat_id BIGINT,
    PRIMARY KEY (booking_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES seats(id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE,
    event_time TIME,
    venue_id BIGINT,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    poster_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- Sports table
CREATE TABLE sports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sport_type VARCHAR(100),
    event_date DATE,
    event_time TIME,
    venue_id BIGINT,
    teams JSON,
    price DECIMAL(10, 2),
    poster_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id)
);

-- Create indexes for performance
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_language ON movies(language);
CREATE INDEX idx_movies_release_date ON movies(release_date);
CREATE INDEX idx_movies_active ON movies(is_active);
CREATE INDEX idx_shows_date ON shows(show_date);
CREATE INDEX idx_shows_movie_venue ON shows(movie_id, venue_id);
CREATE INDEX idx_seats_show_available ON seats(show_id, is_available);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_venues_city ON venues(city_id);

-- Insert initial data

-- Roles
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'Administrator with full access'),
('USER', 'Regular user with booking access');

-- Cities
INSERT INTO cities (name, state, country) VALUES 
('Bangalore', 'Karnataka', 'India'),
('Mumbai', 'Maharashtra', 'India'),
('Delhi', 'Delhi', 'India'),
('Chennai', 'Tamil Nadu', 'India'),
('Hyderabad', 'Telangana', 'India'),
('Kolkata', 'West Bengal', 'India'),
('Pune', 'Maharashtra', 'India');

-- Admin user (password: admin123 - BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES 
('admin', 'admin@moviebooking.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewMpB7dTGaOWNCL6', 'Admin', 'User', '+91-9999999999');

-- Regular user (password: user123 - BCrypt encoded)
INSERT INTO users (username, email, password, first_name, last_name, phone_number) VALUES 
('john_doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewMpB7dTGaOWNCL6', 'John', 'Doe', '+91-9876543210');

-- Assign roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1); -- Admin role
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2); -- User role

-- Sample venues
INSERT INTO venues (name, address, city_id, phone_number, facilities) VALUES 
('PVR Cinemas Forum Mall', 'Forum Mall, Koramangala, Bangalore', 1, '+91-80-12345678', '["Parking", "Food Court", "Wheelchair Accessible"]'),
('INOX Garuda Mall', 'Garuda Mall, Magrath Road, Bangalore', 1, '+91-80-87654321', '["Parking", "Food Court", "IMAX"]'),
('Multiplex Phoenix MarketCity', 'Phoenix MarketCity, Whitefield, Bangalore', 1, '+91-80-11223344', '["Parking", "Food Court", "Gaming Zone"]');

-- Sample movies
INSERT INTO movies (title, description, genre, language, duration_minutes, rating, release_date, poster_url, trailer_url, is_now_showing, is_coming_soon, director, cast) VALUES 
('Avengers: Endgame', 'The grave course of events set in motion by Thanos that wiped out half the universe and fractured the Avengers ranks compels the remaining Avengers to take one final stand.', 'Action', 'English', 181, 'UA', '2019-04-26', 'https://placeholder.com/300x450/movie1', 'https://placeholder.com/trailer1', TRUE, FALSE, 'Anthony Russo, Joe Russo', '["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo", "Chris Hemsworth", "Scarlett Johansson"]'),
('KGF Chapter 2', 'Rocky whose name strikes fear in the heart of his foes. His allies look up to Rocky as their savior, the government sees him as a threat to law and order.', 'Action', 'Kannada', 168, 'UA', '2022-04-14', 'https://placeholder.com/300x450/movie2', 'https://placeholder.com/trailer2', TRUE, FALSE, 'Prashanth Neel', '["Yash", "Sanjay Dutt", "Raveena Tandon", "Srinidhi Shetty"]'),
('RRR', 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.', 'Action', 'Telugu', 187, 'UA', '2022-03-25', 'https://placeholder.com/300x450/movie3', 'https://placeholder.com/trailer3', TRUE, FALSE, 'S.S. Rajamouli', '["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt", "Ajay Devgn"]'),
('Spider-Man: No Way Home', 'With Spider-Mans identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.', 'Action', 'English', 148, 'UA', '2021-12-17', 'https://placeholder.com/300x450/movie4', 'https://placeholder.com/trailer4', FALSE, TRUE, 'Jon Watts', '["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon"]'),
('Pushpa: The Rise', 'Violence erupts between red sandalwood smugglers and the police charged with bringing down their organization in the Seshachalam forests of South India.', 'Action', 'Telugu', 179, 'UA', '2021-12-17', 'https://placeholder.com/300x450/movie5', 'https://placeholder.com/trailer5', TRUE, FALSE, 'Sukumar', '["Allu Arjun", "Fahadh Faasil", "Rashmika Mandanna"]');

-- Sample shows for current date
INSERT INTO shows (movie_id, venue_id, show_date, show_time, screen_name, price, available_seats, total_seats) VALUES 
(1, 1, CURDATE(), '10:00:00', 'Screen 1', 250.00, 150, 150),
(1, 1, CURDATE(), '14:00:00', 'Screen 1', 300.00, 150, 150),
(1, 1, CURDATE(), '18:00:00', 'Screen 1', 350.00, 150, 150),
(2, 2, CURDATE(), '11:00:00', 'Screen 2', 280.00, 120, 120),
(2, 2, CURDATE(), '15:30:00', 'Screen 2', 320.00, 120, 120),
(3, 3, CURDATE(), '12:00:00', 'Screen 3', 300.00, 100, 100),
(3, 3, CURDATE(), '16:30:00', 'Screen 3', 350.00, 100, 100);

-- Sample events
INSERT INTO events (title, description, event_date, event_time, venue_id, category, price, poster_url) VALUES 
('Avengers Endgame Fan Screening', 'Special fan screening with exclusive merchandise', CURDATE() + INTERVAL 3 DAY, '20:00:00', 1, 'SPECIAL_SCREENING', 500.00, 'https://placeholder.com/300x450/event1'),
('Film Festival Opening', 'Annual Bangalore Film Festival opening ceremony', CURDATE() + INTERVAL 7 DAY, '19:00:00', 2, 'PREMIERE', 1000.00, 'https://placeholder.com/300x450/event2');

-- Sample sports events
INSERT INTO sports (title, description, sport_type, event_date, event_time, venue_id, teams, price, poster_url) VALUES 
('IPL Final 2024', 'Indian Premier League Final Match', 'CRICKET', CURDATE() + INTERVAL 10 DAY, '19:30:00', 1, '["Mumbai Indians", "Chennai Super Kings"]', 2000.00, 'https://placeholder.com/300x450/sport1'),
('Football Premier League', 'Local football championship final', 'FOOTBALL', CURDATE() + INTERVAL 5 DAY, '16:00:00', 3, '["Bangalore FC", "Chennai FC"]', 800.00, 'https://placeholder.com/300x450/sport2');