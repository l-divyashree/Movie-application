package com.moviebooking.repository;

import com.moviebooking.entity.Venue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    
    Page<Venue> findByIsActiveTrueOrderByName(Pageable pageable);
    
    List<Venue> findByCityIdAndIsActiveTrueOrderByName(Long cityId);
    
    @Query("SELECT v FROM Venue v WHERE v.isActive = true AND " +
           "(LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.address) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Venue> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT v FROM Venue v WHERE v.city.id = :cityId AND v.isActive = true AND " +
           "(LOWER(v.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.address) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Venue> findByCityAndSearchTerm(@Param("cityId") Long cityId, 
                                       @Param("search") String search, 
                                       Pageable pageable);
    
    Boolean existsByNameIgnoreCaseAndCityId(String name, Long cityId);
}