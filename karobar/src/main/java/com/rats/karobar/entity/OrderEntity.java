package com.rats.karobar.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Version;

import org.springframework.beans.BeanUtils;

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
@Table(name = "order_tbl")
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderEntity extends BaseEntity {

	private String billingName;

	private LocalDate orderDate;

	private BigDecimal totalAmount;

	private BigDecimal totalAmountRcvd;

	@Enumerated(EnumType.STRING)
	private OrderStaus orderStaus;

	@ManyToOne
	private FirmEntity firm;

	@ManyToOne
	private PartyEntity party;

	@Version
	private Long version;

	@OneToMany(mappedBy = "order", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@Builder.Default
	private Set<OrderDetailsEntity> details = new HashSet<>();

	public void addOrderDetail(OrderDetailsEntity detail) {
		if (this.details == null) {
			this.details = new HashSet<>();
		}
		for (OrderDetailsEntity obj : this.details) {
			if (detail.equals(obj)) {
				BeanUtils.copyProperties(detail, obj, "id", "order");
				break;
			}
		}
		this.details.add(detail);
		detail.setOrder(this);
	}

}
