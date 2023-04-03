package com.tieto.cs.stock.services.builder;

import com.github.tennaito.rsql.jpa.JpaCriteriaQueryVisitor;
import com.tieto.cs.stock.model.Terminal;
import com.tieto.mda_services.criteria_builder.CriteriaBuilderException;
import cz.jirutka.rsql.parser.RSQLParser;
import cz.jirutka.rsql.parser.RSQLParserException;
import cz.jirutka.rsql.parser.ast.RSQLVisitor;
import lombok.extern.slf4j.Slf4j;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaQuery;

@Slf4j
public class TerminalCriteriaBuilder {
    public static CriteriaQuery<Terminal> build(String rsql, EntityManager em) {
        CriteriaQuery<Terminal> retQuery;

        try {
            RSQLVisitor<CriteriaQuery<Terminal>, EntityManager> visitor = new JpaCriteriaQueryVisitor<Terminal>();
            var rootNode = new RSQLParser().parse(rsql);
            retQuery = rootNode.accept(visitor, em);
        } catch (RSQLParserException ex) {
            log.error("{}: failed to parse RSQL query", CriteriaBuilderException.Message.PARSING_FAILED.getValue());
            throw new CriteriaBuilderException(CriteriaBuilderException.Message.PARSING_FAILED);
        } catch (Exception ex) {
            log.error("{}: failed to build RSQL query: {}", CriteriaBuilderException.Message.BUILDING_FAILED.getValue(), ex.getMessage());
            throw new CriteriaBuilderException(CriteriaBuilderException.Message.BUILDING_FAILED);
        }

        return retQuery;
    }
}