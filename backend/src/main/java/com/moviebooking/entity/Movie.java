package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie extends BaseEntity {

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 100)
    @Column(length = 100)
    private String genre;

    @Size(max = 50)
    @Column(length = 50)
    private String language;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Size(max = 10)
    @Column(length = 10)
    private String rating; // U, UA, A

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Size(max = 500)
    @Column(name = "poster_url", length = 500)
    private String posterUrl; // TODO: Replace with real URLs

    @Size(max = 500)
    @Column(name = "trailer_url", length = 500)
    private String trailerUrl; // TODO: Replace with real URLs

    @Builder.Default
    @Column(name = "is_now_showing", nullable = false)
    private Boolean isNowShowing = false;

    @Builder.Default
    @Column(name = "is_coming_soon", nullable = false)
    private Boolean isComingSoon = false;

    @Size(max = 255)
    @Column(length = 255)
    private String director;

    @Column(name = "movie_cast", columnDefinition = "TEXT")
    private String cast; // JSON array of cast members

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Movie(String title, String genre, String language, Integer durationMinutes, String rating) {
        this.title = title;
        this.genre = genre;
        this.language = language;
        this.durationMinutes = durationMinutes;
        this.rating = rating;
        this.isActive = true;
        this.isNowShowing = false;
        this.isComingSoon = false;
    }
}