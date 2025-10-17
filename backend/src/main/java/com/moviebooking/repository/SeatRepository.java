package com.moviebooking.repository;

import com.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId ORDER BY s.seatRow ASC, s.seatNumber ASC")
    List<Seat> findByShowIdOrderBySeatRowAscSeatNumberAsc(@Param("showId") Long showId);
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.isAvailable = true ORDER BY s.seatRow ASC, s.seatNumber ASC")
    List<Seat> findByShowIdAndIsAvailableTrueOrderBySeatRowAscSeatNumberAsc(@Param("showId") Long showId);
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.isAvailable = false ORDER BY s.seatRow ASC, s.seatNumber ASC")
    List<Seat> findByShowIdAndIsAvailableFalseOrderBySeatRowAscSeatNumberAsc(@Param("showId") Long showId);
    
    List<Seat> findByIdInAndIsAvailableTrue(List<Long> seatIds);
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.seatRow = :row ORDER BY s.seatNumber ASC")
    List<Seat> findByShowIdAndSeatRow(@Param("showId") Long showId, @Param("row") String row);
    
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.show.id = :showId AND s.isAvailable = true")
    int countAvailableSeatsByShowId(@Param("showId") Long showId);
    
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.show.id = :showId")
    int countTotalSeatsByShowId(@Param("showId") Long showId);
    
    // New methods for booking flow
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.isAvailable = true AND s.isBlocked = false")
    List<Seat> findByShowIdAndIsAvailableTrueAndIsBlockedFalse(@Param("showId") Long showId);
    
    @Query("SELECT s FROM Seat s WHERE s.id IN :seatIds AND s.show.id = :showId")
    List<Seat> findByIdInAndShowId(@Param("seatIds") List<Long> seatIds, @Param("showId") Long showId);
    
    @Query("SELECT s FROM Seat s WHERE s.isBlocked = true AND s.blockedUntil < :currentTime")
    List<Seat> findExpiredBlockedSeats(@Param("currentTime") LocalDateTime currentTime);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isBlocked = :blocked WHERE s.id IN :seatIds")
    void updateSeatBlockStatus(@Param("seatIds") List<Long> seatIds, @Param("blocked") Boolean blocked);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isAvailable = false WHERE s.id IN :seatIds")
    void markSeatsAsBooked(@Param("seatIds") List<Long> seatIds);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isAvailable = true WHERE s.id IN :seatIds")
    void markSeatsAsAvailable(@Param("seatIds") List<Long> seatIds);
    
    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Seat s WHERE s.show.id = :showId AND s.seatRow = :seatRow AND s.seatNumber = :seatNumber")
    Boolean existsByShowIdAndSeatRowAndSeatNumber(@Param("showId") Long showId, @Param("seatRow") String seatRow, @Param("seatNumber") Integer seatNumber);
}