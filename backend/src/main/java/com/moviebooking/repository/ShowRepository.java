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
import java.util.Optional;

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
    
    // Methods with JOIN FETCH to avoid lazy loading issues
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    Page<Show> findAllWithMovieAndVenue(Pageable pageable);
    
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true AND s.movie.id = :movieId " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    Page<Show> findByMovieIdWithMovieAndVenue(@Param("movieId") Long movieId, Pageable pageable);
    
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true AND s.movie.id = :movieId AND v.city.id = :cityId " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    Page<Show> findByMovieIdAndVenueCityIdWithMovieAndVenue(@Param("movieId") Long movieId, 
                                                           @Param("cityId") Long cityId, 
                                                           Pageable pageable);
    
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true AND s.showDate = :date AND v.city.id = :cityId " +
           "ORDER BY s.showTime ASC")
    Page<Show> findByShowDateAndVenueCityIdWithMovieAndVenue(@Param("date") LocalDate date, 
                                                           @Param("cityId") Long cityId, 
                                                           Pageable pageable);
    
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true AND s.venue.id = :venueId " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    List<Show> findByVenueIdWithMovieAndVenue(@Param("venueId") Long venueId);
    
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "JOIN FETCH v.city " +
           "WHERE s.isActive = true AND s.id = :id")
    Optional<Show> findByIdWithMovieAndVenue(@Param("id") Long id);

    // New methods for booking flow
    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "WHERE s.isActive = true AND s.movie.id = :movieId " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    List<Show> findByMovieId(@Param("movieId") Long movieId);

    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "WHERE s.isActive = true AND s.movie.id = :movieId AND v.city = :city " +
           "ORDER BY s.showDate ASC, s.showTime ASC")
    List<Show> findByMovieIdAndCity(@Param("movieId") Long movieId, @Param("city") String city);

    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "WHERE s.isActive = true AND s.movie.id = :movieId AND s.showDate = :date " +
           "ORDER BY s.showTime ASC")
    List<Show> findByMovieIdAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Show s " +
           "JOIN FETCH s.movie m " +
           "JOIN FETCH s.venue v " +
           "WHERE s.isActive = true AND s.movie.id = :movieId AND v.city = :city AND s.showDate = :date " +
           "ORDER BY s.showTime ASC")
    List<Show> findByMovieIdAndCityAndDate(@Param("movieId") Long movieId, 
                                          @Param("city") String city, 
                                          @Param("date") LocalDate date);
}