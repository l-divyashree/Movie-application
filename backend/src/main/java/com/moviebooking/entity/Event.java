package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time")
    private LocalTime eventTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @Size(max = 100)
    @Column(length = 100)
    private String category; // PREMIERE, SPECIAL_SCREENING, etc.

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Size(max = 500)
    @Column(name = "poster_url", length = 500)
    private String posterUrl; // TODO: Replace with real URLs

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Event(String title, LocalDate eventDate, LocalTime eventTime, Venue venue) {
        this.title = title;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.venue = venue;
        this.isActive = true;
    }
}