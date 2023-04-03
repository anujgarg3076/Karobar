package com.tieto.cs.stock.dto.groups;

import java.util.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupStatistics {
    private String name;
    private List<Statistics> statistics = new ArrayList<>();
}
