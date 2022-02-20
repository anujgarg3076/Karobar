package com.rats.karobar.repository;

import org.springframework.stereotype.Repository;

import com.cosium.spring.data.jpa.entity.graph.repository.EntityGraphJpaRepository;
import com.rats.karobar.entity.PartyEntity;

@Repository
public interface PartyRepository extends EntityGraphJpaRepository<PartyEntity, Long> {

}
