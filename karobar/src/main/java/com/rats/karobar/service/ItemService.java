package com.rats.karobar.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rats.karobar.dto.ItemRequest;
import com.rats.karobar.dto.ItemResponse;
import com.rats.karobar.entity.ItemEntity;
import com.rats.karobar.repository.ItemRepository;

@Service
public class ItemService {

	@Autowired
	private ItemRepository itemRepository;

	public long save(ItemRequest request) {
		ItemEntity entity = new ItemEntity();
		BeanUtils.copyProperties(request, entity, "id");
		entity = itemRepository.save(entity);
		return entity.getId();
	}

	public long update(Long id, ItemRequest request) {
		ItemEntity entity = itemRepository.findById(id).orElseThrow(RuntimeException::new);
		BeanUtils.copyProperties(request, entity, "id");
		entity = itemRepository.save(entity);
		return entity.getId();
	}

	public List<ItemResponse> findAll() {
		List<ItemEntity> entities = itemRepository.findAll();
		List<ItemResponse> responses = new ArrayList<>();
		for (ItemEntity entity : entities) {
			ItemResponse itemResponse = new ItemResponse();
			BeanUtils.copyProperties(entity, itemResponse);
			responses.add(itemResponse);
		}

		return responses;
	}

	public ItemResponse findById(Long id) {
		ItemEntity entity = itemRepository.findById(id).orElseThrow(RuntimeException::new);
		ItemResponse itemResponse = new ItemResponse();
		BeanUtils.copyProperties(entity, itemResponse);
		return itemResponse;
	}
}
