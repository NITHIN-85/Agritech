package com.agritech.agrisync.controller;

import com.agritech.agrisync.model.Booking;
import com.agritech.agrisync.repository.BookingRepository;
import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @PostMapping("/user/{userId}")
    public Booking createBooking(@PathVariable Long userId, @RequestBody Booking booking) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        booking.setUser(user);
        return bookingRepository.save(booking);
    }
}
