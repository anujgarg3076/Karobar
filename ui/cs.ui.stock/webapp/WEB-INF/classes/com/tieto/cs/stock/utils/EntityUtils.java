package com.tieto.cs.stock.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tieto.cs.stock.dto.status.post.terminal.Attribute;
import com.tieto.cs.stock.model.Terminal;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Class for entity utilities
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class EntityUtils {
    public static Map<String, String> getTerminalAttributeFields(Terminal terminal) {
        var mapper = new ObjectMapper();
        Map<String, Object> terminalEntries = mapper.convertValue(terminal, Map.class);
        var tlmsAttributes = terminalEntries.entrySet()
                .stream()
                .filter(e -> e.getKey().toUpperCase().startsWith("TLMS_"))
                .filter(e -> e.getValue() != null)
                .collect(Collectors.toMap(
                        e -> e.getKey().toUpperCase(),
                        e -> e.getValue().toString()
                ));
        return tlmsAttributes;
    }

    public static List<Attribute> toAttributeList(Map<String, String> terminalAttributes) {
        return terminalAttributes.entrySet()
                .stream()
                .map(e -> new Attribute(e.getKey().toLowerCase(), e.getValue()))
                .collect(Collectors.toList());
    }
}
