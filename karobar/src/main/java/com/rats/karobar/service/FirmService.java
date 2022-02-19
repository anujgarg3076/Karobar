package com.rats.karobar.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rats.karobar.dto.FirmRequest;
import com.rats.karobar.dto.FirmResponse;
import com.rats.karobar.entity.FirmEntity;
import com.rats.karobar.repository.FirmRepository;

@Service
public class FirmService {

	@Autowired
	private FirmRepository firmRepository;

	public long save(FirmRequest request) {
		FirmEntity entity = new FirmEntity();
		BeanUtils.copyProperties(request, entity, "id");
		entity = firmRepository.save(entity);
		return entity.getId();
	}

	public long update(Long id, FirmRequest request) {
		FirmEntity entity = firmRepository.findById(id).orElseThrow(RuntimeException::new);
		BeanUtils.copyProperties(request, entity, "id");
		entity = firmRepository.save(entity);
		return entity.getId();
	}

	public List<FirmResponse> findAll() {
		List<FirmEntity> entities = firmRepository.findAll();
		List<FirmResponse> responses = new ArrayList<>();
		for (FirmEntity entity : entities) {
			FirmResponse firmResponse = new FirmResponse();
			BeanUtils.copyProperties(entity, firmResponse);
			responses.add(firmResponse);
		}

		return responses;
	}

	public FirmResponse findById(Long id) {
		FirmEntity entity = firmRepository.findById(id).orElseThrow(RuntimeException::new);
		FirmResponse firmResponse = new FirmResponse();
		BeanUtils.copyProperties(entity, firmResponse);
		return firmResponse;
	}
}
