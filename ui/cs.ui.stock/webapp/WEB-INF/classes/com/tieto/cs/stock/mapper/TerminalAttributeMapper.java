package com.tieto.cs.stock.mapper;

import com.tieto.cs.stock.model.Terminal;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.Map;

@Mapper
public interface TerminalAttributeMapper {
    TerminalAttributeMapper INSTANCE = Mappers.getMapper(TerminalAttributeMapper.class);
    Terminal mapToTerminal(Map<String, String> terminalAttributes);
}
