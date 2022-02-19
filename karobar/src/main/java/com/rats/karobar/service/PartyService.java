package com.rats.karobar.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rats.karobar.dto.PartyRequest;
import com.rats.karobar.dto.PartyResponse;
import com.rats.karobar.entity.PartyEntity;
import com.rats.karobar.repository.PartyRepository;

@Service
public class PartyService {

	@Autowired
	private PartyRepository partyRepository;

	public long save(PartyRequest request) {
		PartyEntity entity = new PartyEntity();
		BeanUtils.copyProperties(request, entity, "id");
		entity = partyRepository.save(entity);
		return entity.getId();
	}

	public long update(Long id, PartyRequest request) {
		PartyEntity entity = partyRepository.findById(id).orElseThrow(RuntimeException::new);
		BeanUtils.copyProperties(request, entity, "id");
		entity = partyRepository.save(entity);
		return entity.getId();
	}

	public List<PartyResponse> findAll() {
		List<PartyEntity> entities = partyRepository.findAll();
		List<PartyResponse> responses = new ArrayList<>();
		for (PartyEntity entity : entities) {
			PartyResponse partyResponse = new PartyResponse();
			BeanUtils.copyProperties(entity, partyResponse);
			responses.add(partyResponse);
		}

		return responses;
	}

	public PartyResponse findById(Long id) {
		PartyEntity entity = partyRepository.findById(id).orElseThrow(RuntimeException::new);
		PartyResponse partyResponse = new PartyResponse();
		BeanUtils.copyProperties(entity, partyResponse);
		return partyResponse;
	}
}
