package com.moviebooking.controller;

import com.moviebooking.dto.MessageResponse;
import com.moviebooking.dto.movie.*;
import com.moviebooking.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class MovieController {

    private final MovieService movieService;

    // Public endpoints for browsing movies
    
    @GetMapping
    public ResponseEntity<Page<MovieResponse>> getAllMovies(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String rating,
            @RequestParam(required = false) Boolean nowShowing,
            @RequestParam(required = false) Boolean comingSoon,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        
        MovieFilterRequest filterRequest = new MovieFilterRequest();
        filterRequest.setSearch(search);
        filterRequest.setGenre(genre);
        filterRequest.setLanguage(language);
        filterRequest.setRating(rating);
        filterRequest.setNowShowing(nowShowing);
        filterRequest.setComingSoon(comingSoon);
        filterRequest.setPage(page);
        filterRequest.setSize(size);
        filterRequest.setSortBy(sortBy);
        filterRequest.setSortDirection(sortDirection);
        
        Page<MovieResponse> movies = movieService.getAllMovies(filterRequest);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ResponseEntity.ok(movie);
    }

    @GetMapping("/now-showing")
    public ResponseEntity<Page<MovieResponse>> getNowShowingMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<MovieResponse> movies = movieService.getNowShowingMovies(page, size);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/coming-soon")
    public ResponseEntity<Page<MovieResponse>> getComingSoonMovies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Page<MovieResponse> movies = movieService.getComingSoonMovies(page, size);
        return ResponseEntity.ok(movies);
    }

    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = movieService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/languages")
    public ResponseEntity<List<String>> getAllLanguages() {
        List<String> languages = movieService.getAllLanguages();
        return ResponseEntity.ok(languages);
    }

    // Admin-only endpoints

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieResponse> createMovie(@Valid @RequestBody MovieCreateRequest request) {
        MovieResponse movie = movieService.createMovie(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movie);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MovieResponse> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieUpdateRequest request) {
        
        MovieResponse movie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(movie);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(new MessageResponse("Movie deleted successfully"));
    }

    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalMoviesCount() {
        long count = movieService.getTotalMoviesCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/stats/upcoming")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getUpcomingMoviesCount() {
        long count = movieService.getUpcomingMoviesCount();
        return ResponseEntity.ok(count);
    }
}