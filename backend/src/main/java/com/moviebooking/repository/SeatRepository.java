package com.moviebooking.repository;

import com.moviebooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    
    List<Seat> findByShowIdOrderBySeatRowAscSeatNumberAsc(Long showId);
    
    List<Seat> findByShowIdAndIsAvailableTrueOrderBySeatRowAscSeatNumberAsc(Long showId);
    
    List<Seat> findByShowIdAndIsAvailableFalseOrderBySeatRowAscSeatNumberAsc(Long showId);
    
    List<Seat> findByIdInAndIsAvailableTrue(List<Long> seatIds);
    
    @Query("SELECT s FROM Seat s WHERE s.show.id = :showId AND s.seatRow = :row ORDER BY s.seatNumber ASC")
    List<Seat> findByShowIdAndSeatRow(@Param("showId") Long showId, @Param("row") String row);
    
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.show.id = :showId AND s.isAvailable = true")
    int countAvailableSeatsByShowId(@Param("showId") Long showId);
    
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.show.id = :showId")
    int countTotalSeatsByShowId(@Param("showId") Long showId);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isBlocked = :blocked WHERE s.id IN :seatIds")
    void updateSeatBlockStatus(@Param("seatIds") List<Long> seatIds, @Param("blocked") Boolean blocked);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isAvailable = false WHERE s.id IN :seatIds")
    void markSeatsAsBooked(@Param("seatIds") List<Long> seatIds);
    
    @Modifying
    @Query("UPDATE Seat s SET s.isAvailable = true WHERE s.id IN :seatIds")
    void markSeatsAsAvailable(@Param("seatIds") List<Long> seatIds);
    
    Boolean existsByShowIdAndSeatRowAndSeatNumber(Long showId, String seatRow, Integer seatNumber);
}