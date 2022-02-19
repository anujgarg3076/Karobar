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

import com.rats.karobar.dto.FirmRequest;
import com.rats.karobar.dto.FirmResponse;
import com.rats.karobar.service.FirmService;

@RestController
@RequestMapping("/firm")
public class FirmController {

	private static final Logger LOGGER = LoggerFactory.getLogger(FirmController.class);

	@Autowired
	private FirmService firmService;

	@GetMapping
	public ResponseEntity<List<FirmResponse>> getFirms() {
		return ResponseEntity.ok(firmService.findAll());
	}

	@PostMapping
	public ResponseEntity<?> createCustomer(@RequestBody @Valid FirmRequest request) {
		LOGGER.info("Creating firm: {}", request);
		firmService.save(request);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping("/{id}")
	public ResponseEntity<FirmResponse> getById(@PathVariable("id") Long id) {
		LOGGER.info("Fetching firm with id: {}", id);
		return ResponseEntity.ok(firmService.findById(id));
	}

	@PutMapping("/{id}")
	public ResponseEntity<Long> getById(@PathVariable("id") Long id, @RequestBody @Valid FirmRequest request) {
		LOGGER.info("Updating firm with id: {}", id);
		return ResponseEntity.ok(firmService.update(id, request));
	}
}
