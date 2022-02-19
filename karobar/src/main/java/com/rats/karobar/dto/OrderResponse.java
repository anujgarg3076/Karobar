package com.rats.karobar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.rats.karobar.entity.OrderStaus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

	private Long id;

	private String billingName;

	private LocalDate orderDate;

	private BigDecimal totalAmount;

	private BigDecimal totalAmountRcvd;

	private OrderStaus orderStaus;

	private Long firmId;

	private Long partyId;

	@Builder.Default
	private List<OrderDetailResponse> details = new ArrayList<>();

	public void addDetail(OrderDetailResponse detailResponse) {
		if (this.details == null) {
			this.details = new ArrayList<>();
		}
		this.details.add(detailResponse);
	}
}
