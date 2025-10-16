package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "shows", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"movie_id", "venue_id", "show_date", "show_time", "screen_name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Show extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @NotNull
    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @NotNull
    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @Column(name = "screen_name", length = 50)
    private String screenName;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "available_seats")
    private Integer availableSeats = 0;

    @Builder.Default
    @Column(name = "total_seats")
    private Integer totalSeats = 0;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Show(Movie movie, Venue venue, LocalDate showDate, LocalTime showTime, BigDecimal price) {
        this.movie = movie;
        this.venue = venue;
        this.showDate = showDate;
        this.showTime = showTime;
        this.price = price;
        this.isActive = true;
        this.availableSeats = 0;
        this.totalSeats = 0;
    }
}