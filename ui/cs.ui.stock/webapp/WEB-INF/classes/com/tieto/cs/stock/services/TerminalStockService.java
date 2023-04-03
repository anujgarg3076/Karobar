package com.tieto.cs.stock.services;

import com.tieto.cs.stock.model.Terminal;
import com.tieto.cs.stock.services.builder.TerminalCriteriaBuilder;
import com.tieto.mda_services.service.lcm.LcmServiceInterface;
import com.tieto.mda_services_non_spring.service.lcm.LcmService;

import com.tieto.tlms_services_non_spring.service.terminal.TerminalService;
import lombok.extern.slf4j.Slf4j;
import com.tieto.mda_services.parameters.Sorting;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaQuery;
import com.tieto.cs.stock.dto.groups.GroupStatistics;
import com.tieto.cs.stock.dto.groups.Statistics;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class TerminalStockService {
    private EntityManager em;
    public TerminalStockService(final EntityManager em) {
        this.em = em;
    }

    public List<Terminal> findTerminals(CriteriaQuery<Terminal> criteria, int offset, int count, Sorting sort) {
        if (sort != null) {
            var cb = em.getCriteriaBuilder();
            var root = criteria.getRoots().stream().findFirst().get();
            String sortId = sort.getId();
            boolean desc = sort.getDesc();
            criteria.orderBy(desc ? cb.desc(root.get(sortId)) : cb.asc(root.get(sortId)));
        }
        return em.createQuery(criteria).
                setFirstResult(offset).
                setMaxResults(count).
                getResultList();
    }

    public List<Terminal> findTerminals(String rsql, int offset, int count, Sorting sort) {
        return findTerminals(TerminalCriteriaBuilder.build(rsql, em), offset, count, sort);
    }
    public List<GroupStatistics> getTerminalGroupStatistics() {
        String jpql = "SELECT t.group, t.state, COUNT(t) FROM Terminal t GROUP BY t.group, t.state";
        var results = em.createQuery(jpql, Object[].class).getResultList();
        var groupStatistics = new HashMap<String, GroupStatistics>();
        for (var result : results) {
            var groupName = (String) result[0];
            if (groupName == null || groupName.trim().isEmpty()) {
                continue; // Skipping empty or null group names
            }
            var stats = groupStatistics.get(groupName);
            if (stats == null) {
                var gs = new GroupStatistics();
                gs.setName(groupName);
                groupStatistics.put(groupName, gs);
                stats = groupStatistics.get(groupName);
            }
            String state = (String) result[1];
            if (state == null || state.trim().isEmpty()) {
                continue; // Skipping empty or null state names
            }
            Long count = (Long) result[2];
            if (count == null) {
                count = 0L;
            }
            stats.getStatistics().add(new Statistics(state, count));
        }

        return new ArrayList<>(groupStatistics.values());
    }
}