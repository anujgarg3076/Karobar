package com.rats.karobar.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.validation.constraints.NotNull;

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
public class OrderRequest {

	private Long id;

	private String billingName;

	@NotNull
	private LocalDate orderDate;

	private BigDecimal totalAmountRcvd;

	private OrderStaus orderStaus;

	@NotNull
	private Long firmId;

	private Long partyId;

	private List<OrderDetailRequest> details;
}
