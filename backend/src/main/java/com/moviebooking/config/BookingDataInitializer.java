package com.moviebooking.config;

import com.moviebooking.entity.*;
import com.moviebooking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(3) // Run after UserInitializer (which is @Order(2))
public class BookingDataInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final VenueRepository venueRepository;
    private final ShowRepository showRepository;
    private final SeatRepository seatRepository;
    private final MovieRepository movieRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting booking system data initialization...");
        
        initializeCities();
        initializeVenues();
        initializeShows();
        
        log.info("Booking system data initialization completed successfully");
    }

    private void initializeCities() {
        if (cityRepository.count() > 0) {
            log.info("Cities already exist, skipping city initialization");
            return;
        }

        log.info("Creating sample cities...");
        
        List<City> cities = List.of(
            City.builder().name("Bangalore").state("Karnataka").country("India").build(),
            City.builder().name("Mumbai").state("Maharashtra").country("India").build(),
            City.builder().name("Delhi").state("Delhi").country("India").build(),
            City.builder().name("Chennai").state("Tamil Nadu").country("India").build(),
            City.builder().name("Hyderabad").state("Telangana").country("India").build()
        );
        
        cityRepository.saveAll(cities);
        log.info("Created {} cities", cities.size());
    }

    private void initializeVenues() {
        if (venueRepository.count() > 0) {
            log.info("Venues already exist, skipping venue initialization");
            return;
        }

        log.info("Creating sample venues...");
        
        City bangalore = cityRepository.findByName("Bangalore")
            .orElseThrow(() -> new RuntimeException("Bangalore city not found"));
        
        List<Venue> venues = List.of(
            Venue.builder()
                .name("PVR Cinemas Forum Mall")
                .address("Forum Mall, Koramangala, Bangalore")
                .city(bangalore)
                .phoneNumber("+91-80-12345678")
                .isActive(true)
                .build(),
            Venue.builder()
                .name("INOX Garuda Mall")
                .address("Garuda Mall, Magrath Road, Bangalore")
                .city(bangalore)
                .phoneNumber("+91-80-87654321")
                .isActive(true)
                .build(),
            Venue.builder()
                .name("Multiplex Phoenix MarketCity")
                .address("Phoenix MarketCity, Whitefield, Bangalore")
                .city(bangalore)
                .phoneNumber("+91-80-11223344")
                .isActive(true)
                .build()
        );
        
        venueRepository.saveAll(venues);
        log.info("Created {} venues", venues.size());
    }

    private void initializeShows() {
        if (showRepository.count() > 0) {
            log.info("Shows already exist, skipping show initialization");
            return;
        }

        log.info("Creating sample shows...");
        
        List<Movie> movies = movieRepository.findAll();
        List<Venue> venues = venueRepository.findAll();
        
        if (movies.isEmpty() || venues.isEmpty()) {
            log.warn("No movies or venues found, skipping show initialization");
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);
        
        // Create shows for the next few days
        for (int day = 0; day < 7; day++) {
            LocalDate showDate = today.plusDays(day);
            
            // Avengers Endgame shows at PVR Forum Mall
            if (movies.size() > 0 && venues.size() > 0) {
                createShowsForMovieAndVenue(movies.get(0), venues.get(0), showDate, "Screen 1", 
                    List.of("10:00", "14:00", "18:00"), new BigDecimal("250"));
            }
            
            // KGF Chapter 2 shows at INOX Garuda Mall  
            if (movies.size() > 1 && venues.size() > 1) {
                createShowsForMovieAndVenue(movies.get(1), venues.get(1), showDate, "Screen 2", 
                    List.of("11:00", "15:30", "19:30"), new BigDecimal("280"));
            }
            
            // RRR shows at Phoenix MarketCity
            if (movies.size() > 2 && venues.size() > 2) {
                createShowsForMovieAndVenue(movies.get(2), venues.get(2), showDate, "Screen 3", 
                    List.of("12:00", "16:30", "20:00"), new BigDecimal("300"));
            }
        }
        
        log.info("Created shows for {} days", 7);
    }

    private void createShowsForMovieAndVenue(Movie movie, Venue venue, LocalDate showDate, 
                                           String screenName, List<String> showTimes, BigDecimal basePrice) {
        
        for (String timeStr : showTimes) {
            LocalTime showTime = LocalTime.parse(timeStr);
            
            // Adjust price based on show time (evening shows cost more)
            BigDecimal price = basePrice;
            if (showTime.isAfter(LocalTime.of(17, 0))) {
                price = price.add(new BigDecimal("50")); // Evening surcharge
            }
            
            Show show = Show.builder()
                .movie(movie)
                .venue(venue)
                .showDate(showDate)
                .showTime(showTime)
                .screenName(screenName)
                .price(price)
                .totalSeats(150)
                .availableSeats(150)
                .isActive(true)
                .build();
                
            Show savedShow = showRepository.save(show);
            
            // Create seat layout for this show
            createSeatsForShow(savedShow);
        }
    }

    private void createSeatsForShow(Show show) {
        // Create a typical cinema layout: 10 rows (A-J) with 15 seats each
        String[] rows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        
        for (String row : rows) {
            for (int seatNumber = 1; seatNumber <= 15; seatNumber++) {
                String seatType = "REGULAR";
                BigDecimal seatPrice = show.getPrice();
                
                // Premium seats in the middle rows (D-F)
                if (row.equals("D") || row.equals("E") || row.equals("F")) {
                    seatType = "PREMIUM";
                    seatPrice = seatPrice.add(new BigDecimal("50"));
                }
                
                // VIP seats in the back row
                if (row.equals("J")) {
                    seatType = "VIP";
                    seatPrice = seatPrice.add(new BigDecimal("100"));
                }
                
                Seat seat = Seat.builder()
                    .show(show)
                    .seatRow(row)
                    .seatNumber(seatNumber)
                    .seatType(seatType)
                    .price(seatPrice)
                    .isAvailable(true)
                    .isBlocked(false)
                    .build();
                    
                seatRepository.save(seat);
            }
        }
        
        log.debug("Created 150 seats for show: {} at {} on {}", 
                 show.getMovie().getTitle(), show.getVenue().getName(), show.getShowDate());
    }
}