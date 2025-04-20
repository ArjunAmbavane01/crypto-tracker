package org.example.cryptoportfolio.controller;

import org.example.cryptoportfolio.model.User;
import org.example.cryptoportfolio.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<String> syncUser(@RequestBody User user) {
        try {
            User existingUser = userRepository.findById(user.getClerkId()).orElse(null);

            if (existingUser != null) {
                // Update existing user
                existingUser.setEmail(user.getEmail());
                existingUser.setName(user.getName());
                existingUser.setImageUrl(user.getImageUrl());
                userRepository.save(existingUser);
            } else {
                // Create new user
                userRepository.save(user);
            }
            return ResponseEntity.ok("User synced successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error syncing user: " + e.getMessage());
        }
    }
}
