package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"show_id", "seat_row", "seat_number"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    @JsonIgnoreProperties({"seats", "movie", "venue"}) // Prevent circular reference
    private Show show;

    @NotBlank
    @Column(name = "seat_row", nullable = false, length = 5)
    private String seatRow; // A, B, C, etc.

    @NotNull
    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber; // 1, 2, 3, etc.

    @Builder.Default
    @Column(name = "seat_type", length = 20)
    private String seatType = "REGULAR"; // REGULAR, PREMIUM, VIP

    @DecimalMin(value = "0.0", inclusive = true)
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(name = "is_blocked", nullable = false)
    private Boolean isBlocked = false; // Temporarily blocked during booking

    @Column(name = "blocked_until")
    private LocalDateTime blockedUntil; // When the block expires

    public Seat(Show show, String seatRow, Integer seatNumber, String seatType, BigDecimal price) {
        this.show = show;
        this.seatRow = seatRow;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.price = price;
        this.isAvailable = true;
        this.isBlocked = false;
    }

    public String getSeatLabel() {
        return seatRow + seatNumber;
    }
}