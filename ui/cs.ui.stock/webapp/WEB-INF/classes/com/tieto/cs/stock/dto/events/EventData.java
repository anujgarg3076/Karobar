package com.tieto.cs.stock.dto.events;

import lombok.Data;

@Data
public class EventData {
    private String id;
    private String type;
    private String currentState;
    private String event;
    private String note;
}