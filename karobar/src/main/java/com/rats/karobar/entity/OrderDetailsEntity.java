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
import lombok.ToString;

@Getter
@Setter
@Builder
@Entity
@Table(name = "order_details")
@NoArgsConstructor
@AllArgsConstructor
@ToString
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((item == null) ? 0 : item.getId().hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OrderDetailsEntity other = (OrderDetailsEntity) obj;
		if (item == null) {
			if (other.item != null)
				return false;
		} else if (item.getId().longValue() != other.getItem().getId()) {
			return false;
		}

		return true;
	}

}
