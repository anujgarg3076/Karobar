package com.rats.karobar.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rats.karobar.dto.OrderDetailRequest;
import com.rats.karobar.dto.OrderDetailResponse;
import com.rats.karobar.dto.OrderRequest;
import com.rats.karobar.dto.OrderResponse;
import com.rats.karobar.entity.FirmEntity;
import com.rats.karobar.entity.ItemEntity;
import com.rats.karobar.entity.OrderDetailsEntity;
import com.rats.karobar.entity.OrderEntity;
import com.rats.karobar.entity.OrderStaus;
import com.rats.karobar.entity.PartyEntity;
import com.rats.karobar.repository.FirmRepository;
import com.rats.karobar.repository.ItemRepository;
import com.rats.karobar.repository.OrderRepository;
import com.rats.karobar.repository.PartyRepository;

@Service
public class OrderService {

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private ItemRepository itemRepository;

	@Autowired
	private FirmRepository firmRepository;

	@Autowired
	private PartyRepository partyRepository;

	@Transactional
	public Long createOrUpdateOrder(OrderRequest request) {
		FirmEntity firm = firmRepository.findById(request.getFirmId()).orElseThrow(RuntimeException::new);
		PartyEntity party = null;
		if (request.getPartyId() != null) {
			party = partyRepository.findById(request.getPartyId()).orElse(null);
		}
		BigDecimal totalAmounnt = getTotalAmount(request);
		if (request.getTotalAmountRcvd() != null && request.getTotalAmountRcvd().compareTo(totalAmounnt) > 0) {
			throw new RuntimeException("Total Recevied amount should be less than total amount");
		}
		OrderEntity orderEntity = null;
		if (request.getId() != null) {
			orderEntity = orderRepository.findById(request.getId()).orElseThrow(RuntimeException::new);
		} else {
			orderEntity = new OrderEntity();
		}
		orderEntity.setBillingName(request.getBillingName());
		orderEntity.setFirm(firm);
		orderEntity.setOrderDate(request.getOrderDate());
		orderEntity.setOrderStaus(OrderStaus.DRAFT);
		orderEntity.setParty(party);
		orderEntity.setTotalAmountRcvd(request.getTotalAmountRcvd());
		orderEntity.setTotalAmount(totalAmounnt);

		addOrderDetails(request, orderEntity);
		orderEntity = orderRepository.save(orderEntity);
		return orderEntity.getId();
	}

	private BigDecimal getTotalAmount(OrderRequest request) {
		BigDecimal totalAmount = BigDecimal.ZERO;
		for (OrderDetailRequest detailRequest : request.getDetails()) {
			totalAmount = totalAmount
					.add(getAmount(detailRequest.getQty(), detailRequest.getUnitPrice(), detailRequest.getDiscount()));
		}
		return totalAmount;
	}

	private Map<Long, OrderDetailRequest> toHashMap(List<OrderDetailRequest> list) {
		if (list == null) {
			return new HashMap<Long, OrderDetailRequest>();
		}
		Map<Long, OrderDetailRequest> map = list.stream()
				.collect(Collectors.toMap(OrderDetailRequest::getItemId, Function.identity()));
		return map;
	}

	private void addOrderDetails(OrderRequest request, OrderEntity orderEntity) {
		Map<Long, OrderDetailRequest> addedSons = toHashMap(request.getDetails());
		if (orderEntity.getDetails() != null) {
			orderEntity.getDetails()
					.removeIf(existingDetails -> !addedSons.containsKey(existingDetails.getItem().getId()));
		}

		if (request.getDetails() != null) {
			for (OrderDetailRequest detailRequest : request.getDetails()) {
				ItemEntity item = itemRepository.findById(detailRequest.getItemId()).orElseThrow(RuntimeException::new);
				OrderDetailsEntity entity = OrderDetailsEntity.builder().discount(detailRequest.getDiscount())
						.item(item).qty(detailRequest.getQty()).unit(detailRequest.getUnit())
						.unitPrice(detailRequest.getUnitPrice()).amount(getAmount(detailRequest.getQty(),
								detailRequest.getUnitPrice(), detailRequest.getDiscount()))
						.build();
				orderEntity.addOrderDetail(entity);
			}
		}
	}

	private BigDecimal getAmount(BigDecimal qty, BigDecimal unitPrice, BigDecimal discount) {
		return (qty.multiply(unitPrice)).subtract(discount);
	}

	public List<OrderResponse> findAll() {
		List<OrderEntity> entities = orderRepository.findAll();
		List<OrderResponse> responses = new ArrayList<>();
		for (OrderEntity entity : entities) {
			responses.add(getResponse(entity));
		}
		return responses;
	}

	private OrderResponse getResponse(OrderEntity entity) {
		OrderResponse response = new OrderResponse();
		BeanUtils.copyProperties(entity, response, "details");
		response.setFirmId(entity.getFirm().getId());
		response.setPartyId(entity.getParty() == null ? null : entity.getParty().getId());
		for (OrderDetailsEntity detailEntity : entity.getDetails()) {
			OrderDetailResponse detailResponse = new OrderDetailResponse();
			BeanUtils.copyProperties(detailEntity, detailResponse);
			detailResponse.setItemId(detailEntity.getItem().getId());
			response.addDetail(detailResponse);
		}
		return response;
	}

	public OrderResponse findById(Long id) {
		OrderEntity entity = orderRepository.findById(id).orElseThrow(RuntimeException::new);
		return getResponse(entity);
	}
}
