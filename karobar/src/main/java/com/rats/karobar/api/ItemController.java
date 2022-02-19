package com.rats.karobar.api;

import java.util.List;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rats.karobar.dto.ItemRequest;
import com.rats.karobar.dto.ItemResponse;
import com.rats.karobar.service.ItemService;

@RestController
@RequestMapping("/item")
public class ItemController {

	private static final Logger LOGGER = LoggerFactory.getLogger(ItemController.class);

	@Autowired
	private ItemService itemService;

	@GetMapping
	public ResponseEntity<List<ItemResponse>> getItems() {
		return ResponseEntity.ok(itemService.findAll());
	}

	@PostMapping
	public ResponseEntity<?> createCustomer(@RequestBody @Valid ItemRequest request) {
		LOGGER.info("Creating item: {}", request);
		itemService.save(request);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ItemResponse> getById(@PathVariable("id") Long id) {
		LOGGER.info("Fetching item with id: {}", id);
		return ResponseEntity.ok(itemService.findById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Long> getById(@PathVariable("id") Long id, @RequestBody @Valid ItemRequest request) {
		LOGGER.info("Updating item with id: {}", id);
		return ResponseEntity.ok(itemService.update(id, request));
	}
}
