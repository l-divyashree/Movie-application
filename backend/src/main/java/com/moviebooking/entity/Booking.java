package com.moviebooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking extends BaseEntity {

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Builder.Default
    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Builder.Default
    @Column(name = "booking_status", length = 20)
    private String bookingStatus = "CONFIRMED"; // RESERVED, CONFIRMED, CANCELLED

    @Builder.Default
    @Column(name = "payment_status", length = 20)
    private String paymentStatus = "PENDING"; // PENDING, COMPLETED, FAILED

    @Size(max = 50)
    @Column(name = "payment_method", length = 50)
    private String paymentMethod; // CREDIT_CARD, DEBIT_CARD, UPI, etc.

    @Size(max = 100)
    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "booking_reference", unique = true, length = 20)
    private String bookingReference;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "booking_seats",
        joinColumns = @JoinColumn(name = "booking_id"),
        inverseJoinColumns = @JoinColumn(name = "seat_id")
    )
    @Builder.Default
    private Set<Seat> seats = new HashSet<>();

    public Booking(User user, Show show, BigDecimal totalAmount) {
        this.user = user;
        this.show = show;
        this.totalAmount = totalAmount;
        this.bookingDate = LocalDateTime.now();
        this.bookingStatus = "CONFIRMED";
        this.paymentStatus = "PENDING";
    }

    @PrePersist
    public void generateBookingReference() {
        if (this.bookingReference == null) {
            // Generate booking reference: BK + timestamp + random
            this.bookingReference = "BK" + System.currentTimeMillis() % 10000000;
        }
    }

    public void addSeat(Seat seat) {
        this.seats.add(seat);
    }

    public void removeSeat(Seat seat) {
        this.seats.remove(seat);
    }

    public int getTotalSeats() {
        return seats.size();
    }
}