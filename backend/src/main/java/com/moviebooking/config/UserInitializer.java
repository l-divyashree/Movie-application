package com.moviebooking.config;

import com.moviebooking.entity.Movie;
import com.moviebooking.entity.Role;
import com.moviebooking.entity.User;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.RoleRepository;
import com.moviebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2) // Run after RoleInitializer
public class UserInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting user initialization...");
        try {
            initializeDefaultUsers();
            initializeSampleMovies();
            log.info("User initialization completed successfully");
        } catch (Exception e) {
            log.error("Error during user initialization", e);
            throw e;
        }
    }

    private void initializeDefaultUsers() {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@moviebook.com")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> 
                new RuntimeException("ROLE_ADMIN not found"));
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> 
                new RuntimeException("ROLE_USER not found"));
            
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@moviebook.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Admin")
                    .lastName("User")
                    .phoneNumber("+1-555-0001")
                    .isActive(true)
                    .roles(Set.of(adminRole, userRole))
                    .build();
            
            userRepository.save(adminUser);
            log.info("Created admin user: admin@moviebook.com / password123");
        }

        // Create regular user if it doesn't exist
        if (!userRepository.existsByEmail("user@moviebook.com")) {
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> 
                new RuntimeException("ROLE_USER not found"));
            
            User regularUser = User.builder()
                    .username("user")
                    .email("user@moviebook.com")
                    .password(passwordEncoder.encode("password123"))
                    .firstName("Regular")
                    .lastName("User")
                    .phoneNumber("+1-555-0002")
                    .isActive(true)
                    .roles(Set.of(userRole))
                    .build();
            
            userRepository.save(regularUser);
            log.info("Created regular user: user@moviebook.com / password123");
        }

        // Create demo user if it doesn't exist
        if (!userRepository.existsByEmail("demo@moviebook.com")) {
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> 
                new RuntimeException("ROLE_USER not found"));
            
            User demoUser = User.builder()
                    .username("demo")
                    .email("demo@moviebook.com")
                    .password(passwordEncoder.encode("demo123"))
                    .firstName("Demo")
                    .lastName("User")
                    .phoneNumber("+1-555-0003")
                    .isActive(true)
                    .roles(Set.of(userRole))
                    .build();
            
            userRepository.save(demoUser);
            log.info("Created demo user: demo@moviebook.com / demo123");
        }
    }

    private void initializeSampleMovies() {
        if (movieRepository.count() == 0) {
            log.info("No movies found, creating sample movies...");
            
            Movie movie1 = Movie.builder()
                    .title("The Avengers: Endgame")
                    .description("After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all.")
                    .genre("Action")
                    .language("English")
                    .durationMinutes(181)
                    .rating("PG-13")
                    .releaseDate(LocalDate.of(2019, 4, 26))
                    .posterUrl("https://via.placeholder.com/300x450/0066CC/FFFFFF?text=Avengers+Endgame")
                    .trailerUrl("https://www.youtube.com/watch?v=TcMBFSGVi1c")
                    .director("Anthony Russo, Joe Russo")
                    .cast("Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson")
                    .isNowShowing(true)
                    .isComingSoon(false)
                    .isActive(true)
                    .build();

            Movie movie2 = Movie.builder()
                    .title("Spider-Man: No Way Home")
                    .description("With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.")
                    .genre("Action")
                    .language("English")
                    .durationMinutes(148)
                    .rating("PG-13")
                    .releaseDate(LocalDate.of(2021, 12, 17))
                    .posterUrl("https://via.placeholder.com/300x450/FF0000/FFFFFF?text=Spider-Man")
                    .trailerUrl("https://www.youtube.com/watch?v=JfVOs4VSpmA")
                    .director("Jon Watts")
                    .cast("Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Jon Favreau")
                    .isNowShowing(true)
                    .isComingSoon(false)
                    .isActive(true)
                    .build();

            Movie movie3 = Movie.builder()
                    .title("Dune: Part Two")
                    .description("Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe.")
                    .genre("Sci-Fi")
                    .language("English")
                    .durationMinutes(166)
                    .rating("PG-13")
                    .releaseDate(LocalDate.of(2024, 3, 1))
                    .posterUrl("https://via.placeholder.com/300x450/8B4513/FFFFFF?text=Dune+Part+Two")
                    .trailerUrl("https://www.youtube.com/watch?v=Way9Dexny3w")
                    .director("Denis Villeneuve")
                    .cast("Timothée Chalamet, Zendaya, Rebecca Ferguson, Josh Brolin, Austin Butler")
                    .isNowShowing(false)
                    .isComingSoon(true)
                    .isActive(true)
                    .build();

            Movie movie4 = Movie.builder()
                    .title("The Batman")
                    .description("When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.")
                    .genre("Action")
                    .language("English")
                    .durationMinutes(176)
                    .rating("PG-13")
                    .releaseDate(LocalDate.of(2022, 3, 4))
                    .posterUrl("https://via.placeholder.com/300x450/000000/FFFFFF?text=The+Batman")
                    .trailerUrl("https://www.youtube.com/watch?v=mqqft2x_Aa4")
                    .director("Matt Reeves")
                    .cast("Robert Pattinson, Zoë Kravitz, Paul Dano, Jeffrey Wright, Colin Farrell")
                    .isNowShowing(true)
                    .isComingSoon(false)
                    .isActive(true)
                    .build();

            Movie movie5 = Movie.builder()
                    .title("Inception")
                    .description("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.")
                    .genre("Sci-Fi")
                    .language("English")
                    .durationMinutes(148)
                    .rating("PG-13")
                    .releaseDate(LocalDate.of(2010, 7, 16))
                    .posterUrl("https://via.placeholder.com/300x450/4169E1/FFFFFF?text=Inception")
                    .trailerUrl("https://www.youtube.com/watch?v=YoHD9XEInc0")
                    .director("Christopher Nolan")
                    .cast("Leonardo DiCaprio, Marion Cotillard, Tom Hardy, Elliot Page, Ken Watanabe")
                    .isNowShowing(false)
                    .isComingSoon(false)
                    .isActive(true)
                    .build();

            movieRepository.save(movie1);
            movieRepository.save(movie2);
            movieRepository.save(movie3);
            movieRepository.save(movie4);
            movieRepository.save(movie5);
            
            log.info("Created 5 sample movies");
        }
    }
}