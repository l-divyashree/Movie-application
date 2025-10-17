package com.moviebooking.service;

import com.moviebooking.entity.Seat;
import com.moviebooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;

    /**
     * Get all seats for a show
     */
    public List<Seat> getSeatsForShow(Long showId) {
        return seatRepository.findByShowIdOrderBySeatRowAscSeatNumberAsc(showId);
    }

    /**
     * Get available seats for a show
     */
    public List<Seat> getAvailableSeatsForShow(Long showId) {
        return seatRepository.findByShowIdAndIsAvailableTrueAndIsBlockedFalse(showId);
    }

    /**
     * Reserve seats temporarily during booking process
     */
    @Transactional
    public boolean reserveSeats(Long showId, List<Long> seatIds, Integer reservationTimeMinutes) {
        List<Seat> seats = seatRepository.findByIdInAndShowId(seatIds, showId);
        
        // Check if all seats are available
        for (Seat seat : seats) {
            if (!seat.getIsAvailable() || seat.getIsBlocked()) {
                return false;
            }
        }
        
        // Block the seats temporarily
        LocalDateTime blockUntil = LocalDateTime.now().plusMinutes(reservationTimeMinutes);
        for (Seat seat : seats) {
            seat.setIsBlocked(true);
            seat.setBlockedUntil(blockUntil);
        }
        
        seatRepository.saveAll(seats);
        return true;
    }

    /**
     * Release reserved seats
     */
    @Transactional
    public void releaseSeats(Long showId, List<Long> seatIds) {
        List<Seat> seats = seatRepository.findByIdInAndShowId(seatIds, showId);
        
        for (Seat seat : seats) {
            if (seat.getIsBlocked()) {
                seat.setIsBlocked(false);
                seat.setBlockedUntil(null);
            }
        }
        
        seatRepository.saveAll(seats);
    }

    /**
     * Book seats permanently
     */
    @Transactional
    public void bookSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllById(seatIds);
        
        for (Seat seat : seats) {
            seat.setIsAvailable(false);
            seat.setIsBlocked(false);
            seat.setBlockedUntil(null);
        }
        
        seatRepository.saveAll(seats);
    }

    /**
     * Release expired seat blocks
     */
    @Transactional
    public void releaseExpiredBlocks() {
        List<Seat> expiredBlockedSeats = seatRepository.findExpiredBlockedSeats(LocalDateTime.now());
        
        for (Seat seat : expiredBlockedSeats) {
            seat.setIsBlocked(false);
            seat.setBlockedUntil(null);
        }
        
        seatRepository.saveAll(expiredBlockedSeats);
    }
}