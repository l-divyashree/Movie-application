package com.moviebooking.controller;

import com.moviebooking.dto.MessageResponse;
import com.moviebooking.entity.Show;
import com.moviebooking.service.ShowService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/shows")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ShowController {

    private final ShowService showService;

    /**
     * Get all active shows with pagination
     */
    @GetMapping
    public ResponseEntity<Page<Show>> getAllShows(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Show> shows = showService.getAllShows(page, size);
        return ResponseEntity.ok(shows);
    }

    /**
     * Get show by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(@PathVariable Long id) {
        Optional<Show> show = showService.getShowById(id);
        
        if (show.isPresent()) {
            return ResponseEntity.ok(show.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    /**
     * Get shows by movie ID - essential for booking flow
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<Show>> getShowsByMovieId(
            @PathVariable Long movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Show> shows = showService.getShowsByMovie(movieId, page, size);
        return ResponseEntity.ok(shows);
    }

    /**
     * Get shows by movie and city - for location-based filtering
     */
    @GetMapping("/movie/{movieId}/city/{cityId}")
    public ResponseEntity<Page<Show>> getShowsByMovieAndCity(
            @PathVariable Long movieId,
            @PathVariable Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Show> shows = showService.getShowsByMovieAndCity(movieId, cityId, page, size);
        return ResponseEntity.ok(shows);
    }

    /**
     * Get shows by specific date and city
     */
    @GetMapping("/date/{date}/city/{cityId}")
    public ResponseEntity<Page<Show>> getShowsByDateAndCity(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<Show> shows = showService.getShowsByDateAndCity(date, cityId, page, size);
        return ResponseEntity.ok(shows);
    }

    /**
     * Get shows by venue - useful for venue-specific listings
     */
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Show>> getShowsByVenueId(@PathVariable Long venueId) {
        
        List<Show> shows = showService.getShowsByVenue(venueId);
        return ResponseEntity.ok(shows);
    }

    // ===== ADMIN-ONLY ENDPOINTS =====

    /**
     * Create a new show - Admin only
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> createShow(@Valid @RequestBody Show show) {
        Show createdShow = showService.createShow(show);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdShow);
    }

    /**
     * Update an existing show - Admin only
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> updateShow(@PathVariable Long id, @Valid @RequestBody Show show) {
        Show updatedShow = showService.updateShow(id, show);
        return ResponseEntity.ok(updatedShow);
    }

    /**
     * Delete a show - Admin only
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteShow(@PathVariable Long id) {
        showService.deleteShow(id);
        return ResponseEntity.ok(new MessageResponse("Show deleted successfully"));
    }

    /**
     * Get total shows count - Admin statistics
     */
    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalShowsCount() {
        long count = showService.getTotalShowsCount();
        return ResponseEntity.ok(count);
    }
}