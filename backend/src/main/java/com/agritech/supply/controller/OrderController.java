package com.agritech.supply.controller;

import com.agritech.auth.model.User;
import com.agritech.auth.repository.UserRepository;
import com.agritech.marketplace.model.Product;
import com.agritech.marketplace.repository.ProductRepository;
import com.agritech.supply.dto.OrderItemRequest;
import com.agritech.supply.model.Order;
import com.agritech.supply.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.agritech.supply.repository.SupplyTrackingRepository trackingRepository;

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByBuyerId(userId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Order> getFarmerOrders(@PathVariable Long farmerId) {
        return orderRepository.findByProductFarmerId(farmerId);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody List<com.agritech.supply.dto.OrderRequest> orderRequests) {
        try {
            List<Order> savedOrders = new ArrayList<>();
            for (com.agritech.supply.dto.OrderRequest orderRequest : orderRequests) {
                User user = userRepository.findById(orderRequest.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                Product product = productRepository.findById(orderRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                Order order = new Order();
                order.setBuyer(user);
                order.setProduct(product);
                order.setQuantity(orderRequest.getQuantity());
                order.setTotalPrice(product.getPrice() * orderRequest.getQuantity());
                order.setOrderDate(LocalDateTime.now());
                order.setStatus("DELIVERED");
                
                Order savedOrder = orderRepository.save(order);

                createTrackingStep(savedOrder, "PLACED", "Farmer's Field", 0);
                createTrackingStep(savedOrder, "PACKED", "Regional Hub", 1);
                createTrackingStep(savedOrder, "SHIPPED", "In Transit", 2);
                createTrackingStep(savedOrder, "DELIVERED", "Buyer Address", 3);
                
                savedOrders.add(savedOrder);
            }
            return ResponseEntity.ok(savedOrders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private void createTrackingStep(Order order, String status, String location, int hoursOffset) {
        com.agritech.supply.model.SupplyTracking tracking = new com.agritech.supply.model.SupplyTracking();
        tracking.setOrder(order);
        tracking.setStatus(status);
        tracking.setLocation(location);
        tracking.setTimestamp(LocalDateTime.now().minusHours(4 - hoursOffset));
        trackingRepository.save(tracking);
    }

    @GetMapping("/test")
    public String test() {
        return "Order API is working";
    }
}
