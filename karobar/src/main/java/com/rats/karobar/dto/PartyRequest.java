package com.rats.karobar.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
public class PartyRequest {

	private Long id;

	private String name;

	private String phoneno;

	private String email;

	private String townName;

	private String address;

	private String gstNumber;
}
