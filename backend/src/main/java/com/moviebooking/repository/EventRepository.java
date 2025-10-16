package com.moviebooking.repository;

import com.moviebooking.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    Page<Event> findByIsActiveTrueAndEventDateGreaterThanEqualOrderByEventDate(LocalDate date, Pageable pageable);
    
    List<Event> findByVenueIdAndIsActiveTrueAndEventDateGreaterThanEqualOrderByEventDate(Long venueId, LocalDate date);
    
    Page<Event> findByIsActiveTrueAndCategoryIgnoreCaseAndEventDateGreaterThanEqual(
            String category, LocalDate date, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.isActive = true AND e.eventDate >= :date AND " +
           "e.venue.city.id = :cityId ORDER BY e.eventDate ASC")
    List<Event> findEventsByCity(@Param("cityId") Long cityId, @Param("date") LocalDate date);
    
    @Query("SELECT e FROM Event e WHERE e.isActive = true AND e.eventDate >= :date AND " +
           "(LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Event> findBySearchTerm(@Param("search") String search, 
                                @Param("date") LocalDate date, 
                                Pageable pageable);
    
    List<String> findDistinctCategoryByIsActiveTrueOrderByCategory();
}