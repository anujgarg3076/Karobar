package com.rats.karobar.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import com.cosium.spring.data.jpa.entity.graph.repository.EntityGraphJpaRepository;
import com.rats.karobar.entity.OrderEntity;

@Repository
public interface OrderRepository extends EntityGraphJpaRepository<OrderEntity, Long> {

	@EntityGraph(attributePaths = { "firm", "party", "details" })
	List<OrderEntity> findAll();

	@EntityGraph(attributePaths = { "firm", "party", "details" })
	Optional<OrderEntity> findById(Long id);

}
