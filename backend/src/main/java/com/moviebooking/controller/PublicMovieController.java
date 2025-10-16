package com.moviebooking.controller;

import com.moviebooking.dto.movie.*;
import com.moviebooking.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public/movies")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicMovieController {

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

    @GetMapping("/search")
    public ResponseEntity<Page<MovieResponse>> searchMovies(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        MovieFilterRequest filterRequest = new MovieFilterRequest();
        filterRequest.setSearch(query);
        filterRequest.setPage(page);
        filterRequest.setSize(size);
        
        Page<MovieResponse> movies = movieService.getAllMovies(filterRequest);
        return ResponseEntity.ok(movies);
    }
}