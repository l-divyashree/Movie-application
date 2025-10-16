package com.moviebooking.controller;

import com.moviebooking.dto.VenueRequest;
import com.moviebooking.entity.Venue;
import com.moviebooking.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/venues")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class VenueController {

    private final VenueService venueService;

    /**
     * Get all active venues
     */
    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        List<Venue> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    /**
     * Get venues by city - essential for location-based booking
     */
    @GetMapping("/city/{cityId}")
    public ResponseEntity<List<Venue>> getVenuesByCity(@PathVariable Long cityId) {
        List<Venue> venues = venueService.getVenuesByCity(cityId);
        return ResponseEntity.ok(venues);
    }

    /**
     * Search venues by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<Venue>> searchVenues(@RequestParam String name) {
        List<Venue> venues = venueService.getVenuesByName(name);
        return ResponseEntity.ok(venues);
    }

    /**
     * Get venue by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        Venue venue = venueService.getVenueById(id);
        return ResponseEntity.ok(venue);
    }

    // ===== ADMIN-ONLY ENDPOINTS =====

    /**
     * Create a new venue - Admin only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody VenueRequest venueRequest) {
        Venue venue = venueService.createVenue(venueRequest);
        return ResponseEntity.ok(venue);
    }

    /**
     * Update an existing venue - Admin only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @Valid @RequestBody VenueRequest venueRequest) {
        Venue venue = venueService.updateVenue(id, venueRequest);
        return ResponseEntity.ok(venue);
    }

    /**
     * Delete a venue - Admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Venue deleted successfully");
        return ResponseEntity.ok(response);
    }
}