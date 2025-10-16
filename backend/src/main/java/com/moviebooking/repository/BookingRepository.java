package com.moviebooking.repository;

import com.moviebooking.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    Page<Booking> findByUserIdOrderByBookingDateDesc(Long userId, Pageable pageable);
    
    List<Booking> findByUserIdAndBookingStatus(Long userId, String bookingStatus);
    
    Page<Booking> findByBookingStatusOrderByBookingDateDesc(String bookingStatus, Pageable pageable);
    
    @Query("SELECT b FROM Booking b WHERE b.show.id = :showId ORDER BY b.bookingDate DESC")
    List<Booking> findByShowId(@Param("showId") Long showId);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND " +
           "b.bookingDate BETWEEN :startDate AND :endDate " +
           "ORDER BY b.bookingDate DESC")
    List<Booking> findUserBookingsBetweenDates(@Param("userId") Long userId,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.show.id = :showId AND " +
           "b.bookingStatus IN ('CONFIRMED', 'RESERVED')")
    long countActiveBookingsForShow(@Param("showId") Long showId);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.user.id = :userId AND " +
           "b.bookingStatus = 'CONFIRMED' AND b.paymentStatus = 'COMPLETED'")
    Double getTotalSpentByUser(@Param("userId") Long userId);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingStatus = 'RESERVED' AND " +
           "b.bookingDate < :expiryTime")
    List<Booking> findExpiredReservations(@Param("expiryTime") LocalDateTime expiryTime);
    
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE " +
           "b.bookingStatus = 'CONFIRMED' AND b.paymentStatus = 'COMPLETED'")
    Optional<java.math.BigDecimal> getTotalRevenue();
}