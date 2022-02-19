package com.rats.karobar.dto;

import java.math.BigDecimal;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import com.rats.karobar.entity.ITEMUNITS;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class ItemRequest {

	private Long id;
	
	private String name;

	private String code;

	@Enumerated(EnumType.STRING)
	private ITEMUNITS unit;

	private BigDecimal pricePerUnit;
}
