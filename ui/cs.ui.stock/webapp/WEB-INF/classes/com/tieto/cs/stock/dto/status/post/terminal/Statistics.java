package com.tieto.cs.stock.dto.status.post.terminal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Statistics {
    private int count = 0;
    private List<Detail> details = new ArrayList<>();
    public void incCount() {
        count++;
    }
}
