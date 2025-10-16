package com.moviebooking.repository;

import com.moviebooking.entity.Sport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    
    Page<Sport> findByIsActiveTrueAndEventDateGreaterThanEqualOrderByEventDate(LocalDate date, Pageable pageable);
    
    List<Sport> findByVenueIdAndIsActiveTrueAndEventDateGreaterThanEqualOrderByEventDate(Long venueId, LocalDate date);
    
    Page<Sport> findByIsActiveTrueAndSportTypeIgnoreCaseAndEventDateGreaterThanEqual(
            String sportType, LocalDate date, Pageable pageable);
    
    @Query("SELECT s FROM Sport s WHERE s.isActive = true AND s.eventDate >= :date AND " +
           "s.venue.city.id = :cityId ORDER BY s.eventDate ASC")
    List<Sport> findSportsByCity(@Param("cityId") Long cityId, @Param("date") LocalDate date);
    
    @Query("SELECT s FROM Sport s WHERE s.isActive = true AND s.eventDate >= :date AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.sportType) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Sport> findBySearchTerm(@Param("search") String search, 
                                @Param("date") LocalDate date, 
                                Pageable pageable);
    
    List<String> findDistinctSportTypeByIsActiveTrueOrderBySportType();
}