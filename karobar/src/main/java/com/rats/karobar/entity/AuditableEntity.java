package com.rats.karobar.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.rats.karobar.config.DateTimeConfig;

import lombok.Getter;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
@ConditionalOnProperty(value = "spring.datasource.url")
public class AuditableEntity {

	@CreatedBy
	String createdBy;

	@LastModifiedBy
	String lastModifiedBy;

	@PrePersist
	protected void onCreate() {
		createdDate = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		modifiedDate = LocalDateTime.now();
	}

	@Column(updatable = false)
	@JsonFormat(pattern = DateTimeConfig.DATE_TIME_FORMAT)
	@DateTimeFormat(pattern = DateTimeConfig.DATE_TIME_FORMAT)
	LocalDateTime createdDate;

	@JsonFormat(pattern = DateTimeConfig.DATE_TIME_FORMAT)
	@DateTimeFormat(pattern = DateTimeConfig.DATE_TIME_FORMAT)
	LocalDateTime modifiedDate;

}
