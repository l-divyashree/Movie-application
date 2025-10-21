package com.moviebooking.controller;

import com.moviebooking.entity.Role;
import com.moviebooking.entity.User;
import com.moviebooking.repository.RoleRepository;
import com.moviebooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/setup")
@RequiredArgsConstructor
public class SetupController {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/init")
    public ResponseEntity<?> initializeData() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Create roles if they don't exist
            createRoleIfNotExists("ROLE_USER", "Standard user role with basic permissions");
            createRoleIfNotExists("ROLE_ADMIN", "Administrator role with full permissions");
            
            response.put("rolesCreated", true);
            
            // Create test users if they don't exist
            try {
                createUserIfNotExists("admin@moviebook.com", "password123", "Admin", "User", Set.of("ROLE_ADMIN", "ROLE_USER"));
                response.put("adminCreated", true);
            } catch (Exception e) {
                response.put("adminError", e.getMessage());
            }
            
            try {
                createUserIfNotExists("user@moviebook.com", "password123", "Regular", "User", Set.of("ROLE_USER"));
                response.put("userCreated", true);
            } catch (Exception e) {
                response.put("userError", e.getMessage());
            }
            
            try {
                createUserIfNotExists("demo@moviebook.com", "demo123", "Demo", "User", Set.of("ROLE_USER"));
                response.put("demoCreated", true);
            } catch (Exception e) {
                response.put("demoError", e.getMessage());
            }
            
            response.put("success", true);
            response.put("message", "Database initialized (check individual user creation status)");
            response.put("users", Map.of(
                "admin", "admin@moviebook.com / password123",
                "user", "user@moviebook.com / password123", 
                "demo", "demo@moviebook.com / demo123"
            ));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            response.put("stackTrace", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/status")
    public ResponseEntity<?> getStatus() {
        Map<String, Object> response = new HashMap<>();
        
        long roleCount = roleRepository.count();
        long userCount = userRepository.count();
        
        response.put("roles", roleCount);
        response.put("users", userCount);
        response.put("initialized", roleCount >= 2 && userCount >= 3);
        
        return ResponseEntity.ok(response);
    }

    private void createRoleIfNotExists(String roleName, String description) {
        if (!roleRepository.existsByName(roleName)) {
            Role role = Role.builder()
                    .name(roleName)
                    .description(description)
                    .build();
            roleRepository.save(role);
        }
    }

    private void createUserIfNotExists(String email, String password, String firstName, String lastName, Set<String> roleNames) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .username(email.substring(0, email.indexOf('@')))
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .isActive(true)
                    .build();
            
            // Add roles
            Set<Role> roles = new java.util.HashSet<>();
            for (String roleName : roleNames) {
                roleRepository.findByName(roleName).ifPresent(roles::add);
            }
            user.setRoles(roles);
            
            userRepository.save(user);
        }
    }

    @PostMapping("/reset-admin")
    public ResponseEntity<?> resetAdminPassword() {
        Map<String, Object> response = new HashMap<>();
        try {
            String adminEmail = "admin@moviebook.com";
            userRepository.findByEmail(adminEmail).ifPresent(user -> {
                user.setPassword(passwordEncoder.encode("password123"));
                userRepository.save(user);
                System.out.println("[SetupController] reset-admin: password reset for " + adminEmail);
            });
            response.put("success", true);
            response.put("message", "Admin password reset to 'password123' for '" + adminEmail + "' if user existed.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}