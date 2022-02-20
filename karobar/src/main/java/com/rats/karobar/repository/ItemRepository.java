package com.rats.karobar.repository;

import org.springframework.stereotype.Repository;

import com.cosium.spring.data.jpa.entity.graph.repository.EntityGraphJpaRepository;
import com.rats.karobar.entity.ItemEntity;

@Repository
public interface ItemRepository extends EntityGraphJpaRepository<ItemEntity, Long> {

}
