package com.rats.karobar.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Version;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Entity
@Table(name = "order_tbl")
@NoArgsConstructor
@AllArgsConstructor
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

	@OneToMany(mappedBy = "order", orphanRemoval = true, cascade = CascadeType.ALL)
	@Builder.Default
	private List<OrderDetailsEntity> details = new ArrayList<>();

	public void addOrderDetail(OrderDetailsEntity detail) {
		if (this.details == null) {
			this.details = new ArrayList<>();
		}
		this.details.add(detail);
		detail.setOrder(this);
	}

}
