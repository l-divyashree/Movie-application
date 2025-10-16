package com.moviebooking.dto.movie;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MovieUpdateRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    @NotBlank(message = "Genre is required")
    @Size(max = 100, message = "Genre must not exceed 100 characters")
    private String genre;
    
    @NotBlank(message = "Language is required")
    @Size(max = 50, message = "Language must not exceed 50 characters")
    private String language;
    
    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;
    
    @NotBlank(message = "Rating is required")
    @Size(max = 10, message = "Rating must not exceed 10 characters")
    private String rating;
    
    @NotNull(message = "Release date is required")
    private LocalDate releaseDate;
    
    @Size(max = 500, message = "Poster URL must not exceed 500 characters")
    private String posterUrl;
    
    @Size(max = 500, message = "Trailer URL must not exceed 500 characters")
    private String trailerUrl;
    
    @Size(max = 255, message = "Director name must not exceed 255 characters")
    private String director;
    
    @Size(max = 2000, message = "Cast must not exceed 2000 characters")
    private String cast;
    
    private Boolean isNowShowing;
    
    private Boolean isComingSoon;
    
    private Boolean isActive;
}