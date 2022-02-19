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
@Table(name = "firm")
@AllArgsConstructor
@NoArgsConstructor
public class FirmEntity extends BaseEntity {

	private String name;

	private String gstNumber;

	private String address;

	@OneToMany(mappedBy = "firm")
	private List<OrderEntity> orders;

}
