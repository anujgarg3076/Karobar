package com.rats.karobar.entity;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
@Table(name = "item")
@NoArgsConstructor
@AllArgsConstructor
public class ItemEntity extends BaseEntity {

	private String name;

	private String code;

	@Enumerated(EnumType.STRING)
	private ITEMUNITS unit;

	private BigDecimal pricePerUnit;

}
