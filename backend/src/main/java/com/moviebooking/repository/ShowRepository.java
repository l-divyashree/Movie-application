package com.moviebooking.repository;

import com.moviebooking.entity.Show;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, Long> {
    
    Page<Show> findByIsActiveTrueAndShowDateGreaterThanEqual(LocalDate date, Pageable pageable);
    
    List<Show> findByMovieIdAndIsActiveTrueAndShowDateGreaterThanEqualOrderByShowDateAscShowTimeAsc(
            Long movieId, LocalDate date);
    
    List<Show> findByVenueIdAndIsActiveTrueAndShowDateGreaterThanEqualOrderByShowDateAscShowTimeAsc(
            Long venueId, LocalDate date);
    
    @Query("SELECT s FROM Show s WHERE s.isActive = true AND s.movie.id = :movieId AND " +
           "s.venue.city.id = :cityId AND s.showDate >= :date " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    List<Show> findShowsByMovieAndCity(@Param("movieId") Long movieId, 
                                     @Param("cityId") Long cityId, 
                                     @Param("date") LocalDate date);
    
    @Query("SELECT s FROM Show s WHERE s.isActive = true AND s.showDate = :date AND " +
           "s.venue.city.id = :cityId ORDER BY s.showTime ASC")
    List<Show> findShowsByDateAndCity(@Param("date") LocalDate date, @Param("cityId") Long cityId);
    
    @Query("SELECT COUNT(s) FROM Show s WHERE s.movie.id = :movieId AND s.isActive = true AND " +
           "s.showDate BETWEEN :startDate AND :endDate")
    long countShowsForMovieInDateRange(@Param("movieId") Long movieId,
                                     @Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);
    
    Boolean existsByMovieIdAndVenueIdAndShowDateAndShowTimeAndScreenName(
            Long movieId, Long venueId, LocalDate showDate, java.time.LocalTime showTime, String screenName);
}