package com.moviebooking.dto.movie;

import lombok.Data;

@Data
public class MovieFilterRequest {
    
    private String search;
    private String genre;
    private String language;
    private String rating;
    private Boolean nowShowing;
    private Boolean comingSoon;
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt";
    private String sortDirection = "desc";
}