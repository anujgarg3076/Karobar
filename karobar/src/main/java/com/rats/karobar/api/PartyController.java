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

import com.rats.karobar.dto.PartyRequest;
import com.rats.karobar.dto.PartyResponse;
import com.rats.karobar.service.PartyService;

@RestController
@RequestMapping("/party")
public class PartyController {

	private static final Logger LOGGER = LoggerFactory.getLogger(PartyController.class);

	@Autowired
	private PartyService partyService;

	@GetMapping
	public ResponseEntity<List<PartyResponse>> getPartys() {
		return ResponseEntity.ok(partyService.findAll());
	}

	@PostMapping
	public ResponseEntity<?> createCustomer(@RequestBody @Valid PartyRequest request) {
		LOGGER.info("Creating party: {}", request);
		partyService.save(request);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<PartyResponse> getById(@PathVariable("id") Long id) {
		LOGGER.info("Fetching party with id: {}", id);
		return ResponseEntity.ok(partyService.findById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Long> getById(@PathVariable("id") Long id, @RequestBody @Valid PartyRequest request) {
		LOGGER.info("Updating party with id: {}", id);
		return ResponseEntity.ok(partyService.update(id, request));
	}
}
