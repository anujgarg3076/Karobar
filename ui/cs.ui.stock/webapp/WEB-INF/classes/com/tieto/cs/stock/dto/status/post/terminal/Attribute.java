package com.tieto.cs.stock.dto.status.post.terminal;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
public class Attribute{
    private String name;
    private String value;
}

