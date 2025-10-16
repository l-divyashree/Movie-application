package com.moviebooking.repository;

import com.moviebooking.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    
    Page<Movie> findByIsActiveTrue(Pageable pageable);
    
    Page<Movie> findByIsActiveTrueAndIsNowShowingTrue(Pageable pageable);
    
    Page<Movie> findByIsActiveTrueAndIsComingSoonTrue(Pageable pageable);
    
    Page<Movie> findByIsActiveTrueAndGenreIgnoreCase(String genre, Pageable pageable);
    
    Page<Movie> findByIsActiveTrueAndLanguageIgnoreCase(String language, Pageable pageable);
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND " +
           "(LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.genre) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.language) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.director) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Movie> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT m FROM Movie m WHERE m.isActive = true AND " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:language IS NULL OR LOWER(m.language) = LOWER(:language)) AND " +
           "(:nowShowing IS NULL OR m.isNowShowing = :nowShowing) AND " +
           "(:comingSoon IS NULL OR m.isComingSoon = :comingSoon)")
    Page<Movie> findMoviesWithFilters(@Param("genre") String genre,
                                    @Param("language") String language,
                                    @Param("nowShowing") Boolean nowShowing,
                                    @Param("comingSoon") Boolean comingSoon,
                                    Pageable pageable);
    
    @Query("SELECT DISTINCT m.genre FROM Movie m WHERE m.isActive = true ORDER BY m.genre")
    List<String> findDistinctGenreByIsActiveTrueOrderByGenre();
    
    @Query("SELECT DISTINCT m.language FROM Movie m WHERE m.isActive = true ORDER BY m.language")
    List<String> findDistinctLanguageByIsActiveTrueOrderByLanguage();
    
    @Query("SELECT COUNT(m) FROM Movie m WHERE m.isActive = true AND m.releaseDate > :date")
    long countUpcomingMovies(@Param("date") LocalDate date);
    
    long countByIsActiveTrue();
}