package com.tieto.cs.stock.dto.status.post.terminal;

import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
public class Detail {
    private String message;
    private String type;
    private List<Attribute> attributes = new ArrayList<>();
}
