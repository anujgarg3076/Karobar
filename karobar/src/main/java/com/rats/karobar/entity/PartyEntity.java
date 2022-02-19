package com.rats.karobar.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
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
@Table(name = "party")
@AllArgsConstructor
@NoArgsConstructor
public class PartyEntity extends BaseEntity {

	private String name;

	private String phoneno;

	private String email;

	private String townName;

	private String address;

	private String gstNumber;

	@OneToMany(mappedBy = "party")
	private List<OrderEntity> orders;

}
