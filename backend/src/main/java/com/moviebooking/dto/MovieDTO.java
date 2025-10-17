package com.moviebooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private String genre;
    private String language;
    private Integer duration;
    private String rating;
    private String posterUrl;
    private String trailerUrl;
    private String director;
    private String cast;
    private Boolean nowShowing;
    private Boolean comingSoon;
}