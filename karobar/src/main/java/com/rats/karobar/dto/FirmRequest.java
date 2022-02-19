package com.rats.karobar.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class FirmRequest {

	private Long id;

	private String name;

	private String gstNumber;

	private String address;
}
