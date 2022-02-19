package com.rats.karobar.entity;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
@ConditionalOnProperty(value = "spring.datasource.url")
public abstract class BaseEntity extends AuditableEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;
}
