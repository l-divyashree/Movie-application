package com.moviebooking.service;

import com.moviebooking.dto.movie.*;
import com.moviebooking.entity.Movie;
import com.moviebooking.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieResponse createMovie(MovieCreateRequest request) {
        log.info("Creating new movie with title: {}", request.getTitle());
        
        Movie movie = Movie.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .genre(request.getGenre())
                .language(request.getLanguage())
                .durationMinutes(request.getDurationMinutes())
                .rating(request.getRating())
                .releaseDate(request.getReleaseDate())
                .posterUrl(request.getPosterUrl())
                .trailerUrl(request.getTrailerUrl())
                .director(request.getDirector())
                .cast(request.getCast())
                .isNowShowing(request.getIsNowShowing() != null ? request.getIsNowShowing() : false)
                .isComingSoon(request.getIsComingSoon() != null ? request.getIsComingSoon() : false)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        Movie savedMovie = movieRepository.save(movie);
        log.info("Successfully created movie with ID: {}", savedMovie.getId());
        
        return mapToResponse(savedMovie);
    }

    @Transactional(readOnly = true)
    public MovieResponse getMovieById(Long id) {
        log.info("Fetching movie with ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + id));
        
        return mapToResponse(movie);
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> getAllMovies(MovieFilterRequest filterRequest) {
        log.info("Fetching movies with filters: {}", filterRequest);
        
        Pageable pageable = createPageable(filterRequest);
        Page<Movie> moviePage;

        if (filterRequest.getSearch() != null && !filterRequest.getSearch().trim().isEmpty()) {
            moviePage = movieRepository.findBySearchTerm(filterRequest.getSearch().trim(), pageable);
        } else if (hasFilters(filterRequest)) {
            moviePage = movieRepository.findMoviesWithFilters(
                    filterRequest.getGenre(),
                    filterRequest.getLanguage(),
                    filterRequest.getNowShowing(),
                    filterRequest.getComingSoon(),
                    pageable
            );
        } else {
            moviePage = movieRepository.findByIsActiveTrue(pageable);
        }

        return moviePage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> getNowShowingMovies(int page, int size) {
        log.info("Fetching now showing movies - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("releaseDate").descending());
        Page<Movie> moviePage = movieRepository.findByIsActiveTrueAndIsNowShowingTrue(pageable);
        
        return moviePage.map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<MovieResponse> getComingSoonMovies(int page, int size) {
        log.info("Fetching coming soon movies - page: {}, size: {}", page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("releaseDate").ascending());
        Page<Movie> moviePage = movieRepository.findByIsActiveTrueAndIsComingSoonTrue(pageable);
        
        return moviePage.map(this::mapToResponse);
    }

    public MovieResponse updateMovie(Long id, MovieUpdateRequest request) {
        log.info("Updating movie with ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + id));

        // Update fields
        movie.setTitle(request.getTitle());
        movie.setDescription(request.getDescription());
        movie.setGenre(request.getGenre());
        movie.setLanguage(request.getLanguage());
        movie.setDurationMinutes(request.getDurationMinutes());
        movie.setRating(request.getRating());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setDirector(request.getDirector());
        movie.setCast(request.getCast());
        
        if (request.getIsNowShowing() != null) {
            movie.setIsNowShowing(request.getIsNowShowing());
        }
        if (request.getIsComingSoon() != null) {
            movie.setIsComingSoon(request.getIsComingSoon());
        }
        if (request.getIsActive() != null) {
            movie.setIsActive(request.getIsActive());
        }

        Movie updatedMovie = movieRepository.save(movie);
        log.info("Successfully updated movie with ID: {}", updatedMovie.getId());
        
        return mapToResponse(updatedMovie);
    }

    public void deleteMovie(Long id) {
        log.info("Soft deleting movie with ID: {}", id);
        
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with ID: " + id));

        movie.setIsActive(false);
        movieRepository.save(movie);
        
        log.info("Successfully soft deleted movie with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<String> getAllGenres() {
        log.info("Fetching all distinct genres");
        return movieRepository.findDistinctGenreByIsActiveTrueOrderByGenre();
    }

    @Transactional(readOnly = true)
    public List<String> getAllLanguages() {
        log.info("Fetching all distinct languages");
        return movieRepository.findDistinctLanguageByIsActiveTrueOrderByLanguage();
    }

    @Transactional(readOnly = true)
    public long getTotalMoviesCount() {
        return movieRepository.countByIsActiveTrue();
    }

    @Transactional(readOnly = true)
    public long getUpcomingMoviesCount() {
        return movieRepository.countUpcomingMovies(LocalDate.now());
    }

    private MovieResponse mapToResponse(Movie movie) {
        return MovieResponse.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .description(movie.getDescription())
                .genre(movie.getGenre())
                .language(movie.getLanguage())
                .durationMinutes(movie.getDurationMinutes())
                .rating(movie.getRating())
                .releaseDate(movie.getReleaseDate())
                .posterUrl(movie.getPosterUrl())
                .trailerUrl(movie.getTrailerUrl())
                .director(movie.getDirector())
                .cast(movie.getCast())
                .isNowShowing(movie.getIsNowShowing())
                .isComingSoon(movie.getIsComingSoon())
                .isActive(movie.getIsActive())
                .createdAt(movie.getCreatedAt())
                .updatedAt(movie.getUpdatedAt())
                .build();
    }

    private Pageable createPageable(MovieFilterRequest filterRequest) {
        Sort sort = Sort.by(
                "desc".equalsIgnoreCase(filterRequest.getSortDirection()) 
                    ? Sort.Direction.DESC 
                    : Sort.Direction.ASC,
                filterRequest.getSortBy()
        );
        
        return PageRequest.of(filterRequest.getPage(), filterRequest.getSize(), sort);
    }

    private boolean hasFilters(MovieFilterRequest filterRequest) {
        return filterRequest.getGenre() != null ||
               filterRequest.getLanguage() != null ||
               filterRequest.getNowShowing() != null ||
               filterRequest.getComingSoon() != null ||
               filterRequest.getRating() != null;
    }
}