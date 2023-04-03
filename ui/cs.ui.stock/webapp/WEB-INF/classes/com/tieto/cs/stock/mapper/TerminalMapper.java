package com.tieto.cs.stock.mapper;

import com.tieto.cs.stock.model.Terminal;
import com.tieto.mda_entities.model.lcm.Media;

import java.util.stream.Collectors;

public class TerminalMapper {
    public static Terminal mapToTerminal(Media media) {
        var mediaAttrs = media.getMediaAttrs()
                .stream()
                .collect(Collectors.toMap(
                        es -> es.getAttr().getAttrName().toLowerCase(),
                        es -> es.getAttrValue() == null ? "" : es.getAttrValue()
                ));
        var terminal = TerminalAttributeMapper.INSTANCE.mapToTerminal(mediaAttrs);
        terminal.setId(media.getMediaId());
        terminal.setType(media.getMediaType().getMediaType());
        terminal.setState(media.getState());
        terminal.setGroup(media.getMediaType().getMediaTypeGroup());
        terminal.setTypeclass(media.getMediaType().getTypeclass());
        terminal.setInstitution(media.getMediaType().getInstitution());
        return terminal;
    }
}
