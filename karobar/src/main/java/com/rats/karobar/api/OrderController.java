package com.rats.karobar.api;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rats.karobar.dto.OrderRequest;
import com.rats.karobar.dto.OrderResponse;
import com.rats.karobar.service.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {

	private static final Logger LOGGER = LoggerFactory.getLogger(OrderController.class);

	@Autowired
	private OrderService orderService;

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getOrders() {
		return ResponseEntity.ok(orderService.findAll());
	}

	@PostMapping
	public ResponseEntity<Long> createCustomer(@RequestBody @Valid OrderRequest request) {
		LOGGER.info("Creating order: {}", request);
		Long id = orderService.createOrUpdateOrder(request);
		return ResponseEntity.ok(id);
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderResponse> getById(@PathVariable("id") Long id) {
		LOGGER.info("Fetching order with id: {}", id);
		return ResponseEntity.ok(orderService.findById(id));
	}

}
