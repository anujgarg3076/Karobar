package com.rats.karobar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class PartyResponse {

	private Long id;

	private String name;

	private String phoneno;

	private String email;

	private String townName;

	private String address;

	private String gstNumber;

}
