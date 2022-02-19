package com.rats.karobar.entity;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@Table(name = "order_details")
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsEntity extends BaseEntity {

	private BigDecimal qty;

	private BigDecimal unitPrice;

	@Enumerated(EnumType.STRING)
	private ITEMUNITS unit;

	private BigDecimal amount;

	private BigDecimal discount;

	@ManyToOne
	private ItemEntity item;

	@ManyToOne
	private OrderEntity order;

}
