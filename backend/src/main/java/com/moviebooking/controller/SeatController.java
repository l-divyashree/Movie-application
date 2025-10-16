package com.moviebooking.controller;

import com.moviebooking.entity.Seat;
import com.moviebooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class SeatController {

    private final SeatRepository seatRepository;

    /**
     * Get all seats for a show - essential for seat selection
     */
    @GetMapping("/show/{showId}")
    public ResponseEntity<List<Seat>> getSeatsByShowId(@PathVariable Long showId) {
        List<Seat> seats = seatRepository.findByShowIdOrderBySeatRowAscSeatNumberAsc(showId);
        return ResponseEntity.ok(seats);
    }

    /**
     * Get only available seats for a show
     */
    @GetMapping("/show/{showId}/available")
    public ResponseEntity<List<Seat>> getAvailableSeatsByShowId(@PathVariable Long showId) {
        List<Seat> availableSeats = seatRepository.findByShowIdAndIsAvailableTrueOrderBySeatRowAscSeatNumberAsc(showId);
        return ResponseEntity.ok(availableSeats);
    }

    /**
     * Get seats by row for a specific show
     */
    @GetMapping("/show/{showId}/row/{row}")
    public ResponseEntity<List<Seat>> getSeatsByShowAndRow(
            @PathVariable Long showId, 
            @PathVariable String row) {
        List<Seat> seats = seatRepository.findByShowIdAndSeatRow(showId, row);
        return ResponseEntity.ok(seats);
    }

    /**
     * Get seat availability count for a show
     */
    @GetMapping("/show/{showId}/availability")
    public ResponseEntity<Map<String, Integer>> getSeatAvailability(@PathVariable Long showId) {
        int totalSeats = seatRepository.countTotalSeatsByShowId(showId);
        int availableSeats = seatRepository.countAvailableSeatsByShowId(showId);
        int bookedSeats = totalSeats - availableSeats;
        
        Map<String, Integer> availability = Map.of(
            "totalSeats", totalSeats,
            "availableSeats", availableSeats,
            "bookedSeats", bookedSeats
        );
        
        return ResponseEntity.ok(availability);
    }

    /**
     * Temporarily block seats during booking process
     * This prevents other users from selecting the same seats
     */
    @PostMapping("/block")
    @Transactional
    public ResponseEntity<String> blockSeats(@RequestBody Map<String, List<Long>> request) {
        List<Long> seatIds = request.get("seatIds");
        
        if (seatIds == null || seatIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Seat IDs are required");
        }

        // Verify all seats are available before blocking
        List<Seat> seatsToBlock = seatRepository.findByIdInAndIsAvailableTrue(seatIds);
        
        if (seatsToBlock.size() != seatIds.size()) {
            return ResponseEntity.badRequest().body("Some seats are no longer available");
        }

        // Block the seats temporarily (5 minutes typically)
        seatRepository.updateSeatBlockStatus(seatIds, true);
        
        return ResponseEntity.ok("Seats blocked successfully for 5 minutes");
    }

    /**
     * Unblock seats (cancel seat selection)
     */
    @PostMapping("/unblock")
    @Transactional
    public ResponseEntity<String> unblockSeats(@RequestBody Map<String, List<Long>> request) {
        List<Long> seatIds = request.get("seatIds");
        
        if (seatIds == null || seatIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Seat IDs are required");
        }

        seatRepository.updateSeatBlockStatus(seatIds, false);
        
        return ResponseEntity.ok("Seats unblocked successfully");
    }

    /**
     * Get seat details by IDs - for booking confirmation
     */
    @PostMapping("/details")
    public ResponseEntity<List<Seat>> getSeatDetails(@RequestBody Map<String, List<Long>> request) {
        List<Long> seatIds = request.get("seatIds");
        
        if (seatIds == null || seatIds.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Seat> seats = seatRepository.findAllById(seatIds);
        return ResponseEntity.ok(seats);
    }
}