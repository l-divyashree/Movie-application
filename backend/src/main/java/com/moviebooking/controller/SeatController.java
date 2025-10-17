package com.moviebooking.controller;

import com.moviebooking.entity.Seat;
import com.moviebooking.dto.SeatDTO;
import com.moviebooking.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<SeatDTO>> getSeatsByShowId(@PathVariable Long showId) {
        try {
            List<Seat> seats = seatRepository.findByShowIdOrderBySeatRowAscSeatNumberAsc(showId);
            List<SeatDTO> seatDTOs = seats.stream()
                .map(this::convertToSeatDTO)
                .collect(Collectors.toList());
            return ResponseEntity.ok(seatDTOs);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            throw e;
        }
    }

    private SeatDTO convertToSeatDTO(Seat seat) {
        return SeatDTO.builder()
            .id(seat.getId())
            .seatRow(seat.getSeatRow())
            .seatNumber(seat.getSeatNumber())
            .seatType(seat.getSeatType())
            .price(seat.getPrice())
            .isAvailable(seat.getIsAvailable())
            .isBlocked(seat.getIsBlocked())
            .displayName(seat.getSeatLabel())
            .build();
    }

    /**
     * Debug endpoint to get total seat count
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalSeatCount() {
        try {
            long count = seatRepository.count();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Debug endpoint to get all seats (limited)
     */
    @GetMapping("/all")
    public ResponseEntity<List<Seat>> getAllSeats() {
        try {
            List<Seat> seats = seatRepository.findAll();
            // Return only first 10 to avoid huge response
            return ResponseEntity.ok(seats.subList(0, Math.min(10, seats.size())));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
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