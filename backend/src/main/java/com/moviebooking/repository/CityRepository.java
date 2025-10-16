package com.moviebooking.repository;

import com.moviebooking.entity.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    
    Optional<City> findByName(String name);
    
    List<City> findByIsActiveTrueOrderByName();
    
    Page<City> findByIsActiveTrue(Pageable pageable);
    
    Optional<City> findByNameIgnoreCaseAndIsActiveTrue(String name);
    
    @Query("SELECT c FROM City c WHERE c.isActive = true AND " +
           "(LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.state) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<City> findBySearchTerm(@Param("search") String search, Pageable pageable);
    
    Boolean existsByNameIgnoreCase(String name);
}