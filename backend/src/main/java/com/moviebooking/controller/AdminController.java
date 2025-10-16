package com.moviebooking.controller;

import com.moviebooking.dto.UserRequest;
import com.moviebooking.dto.UserResponse;
import com.moviebooking.entity.Role;
import com.moviebooking.entity.User;
import com.moviebooking.repository.RoleRepository;
import com.moviebooking.repository.UserRepository;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get all users with pagination - Admin only
     */
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Page<User> usersPage = userRepository.findAll(PageRequest.of(page, size, sort));
        
        List<UserResponse> userResponses = usersPage.getContent().stream()
            .map(this::convertToUserResponse)
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", userResponses);
        response.put("totalElements", usersPage.getTotalElements());
        response.put("totalPages", usersPage.getTotalPages());
        response.put("size", usersPage.getSize());
        response.put("number", usersPage.getNumber());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new user - Admin only
     */
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Create new user
        User user = User.builder()
            .username(userRequest.getUsername())
            .email(userRequest.getEmail())
            .password(passwordEncoder.encode(userRequest.getPassword()))
            .firstName(userRequest.getFirstName())
            .lastName(userRequest.getLastName())
            .phoneNumber(userRequest.getPhoneNumber())
            .isActive(userRequest.getIsActive() != null ? userRequest.getIsActive() : true)
            .build();
        
        // Set roles
        Set<Role> roles = new HashSet<>();
        if (userRequest.getRoles() != null && !userRequest.getRoles().isEmpty()) {
            for (String roleName : userRequest.getRoles()) {
                Role role = roleRepository.findByName("ROLE_" + roleName.toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
        } else {
            // Default to USER role
            Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Default role USER not found"));
            roles.add(userRole);
        }
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToUserResponse(savedUser));
    }

    /**
     * Update user - Admin only
     */
    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, 
                                                  @Valid @RequestBody UserRequest userRequest) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if username or email is being changed and if they're available
        if (!user.getUsername().equals(userRequest.getUsername()) && 
            userRepository.existsByUsername(userRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        
        if (!user.getEmail().equals(userRequest.getEmail()) && 
            userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }
        
        // Update user fields
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setIsActive(userRequest.getIsActive() != null ? userRequest.getIsActive() : true);
        
        // Update password if provided
        if (userRequest.getPassword() != null && !userRequest.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }
        
        // Update roles
        if (userRequest.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (String roleName : userRequest.getRoles()) {
                Role role = roleRepository.findByName("ROLE_" + roleName.toUpperCase())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
                roles.add(role);
            }
            user.setRoles(roles);
        }
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToUserResponse(savedUser));
    }

    /**
     * Delete user - Admin only
     */
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id,
                                                         @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Prevent admin from deleting themselves
        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("You cannot delete your own account!");
        }
        
        userRepository.delete(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Toggle user status - Admin only
     */
    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id,
                                                        @RequestBody Map<String, Boolean> request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setIsActive(request.get("isActive"));
        User savedUser = userRepository.save(user);
        
        return ResponseEntity.ok(convertToUserResponse(savedUser));
    }

    /**
     * Update user role - Admin only
     */
    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long id,
                                                      @RequestBody Map<String, Long> request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        Role role = roleRepository.findById(request.get("roleId"))
            .orElseThrow(() -> new RuntimeException("Role not found"));
        
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToUserResponse(savedUser));
    }

    /**
     * Get all roles - Admin only
     */
    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        
        List<Map<String, Object>> roleResponses = roles.stream()
            .map(role -> {
                Map<String, Object> roleMap = new HashMap<>();
                roleMap.put("id", role.getId());
                roleMap.put("name", role.getName().replace("ROLE_", ""));
                return roleMap;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(roleResponses);
    }

    /**
     * Get admin dashboard statistics - Admin only
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get actual counts from database
        long totalUsers = userRepository.count();
        long totalMovies = movieRepository.count();
        long totalBookings = bookingRepository.count();
        
        // Calculate total revenue from bookings
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue().orElse(BigDecimal.ZERO);
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalMovies", totalMovies);
        stats.put("totalBookings", totalBookings);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Convert User entity to UserResponse DTO
     */
    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .phone(user.getPhoneNumber())
            .isActive(user.getIsActive())
            .createdAt(user.getCreatedAt())
            .role(user.getRoles().isEmpty() ? null : 
                Map.of("id", user.getRoles().iterator().next().getId(),
                       "name", user.getRoles().iterator().next().getName().replace("ROLE_", "")))
            .build();
    }
}