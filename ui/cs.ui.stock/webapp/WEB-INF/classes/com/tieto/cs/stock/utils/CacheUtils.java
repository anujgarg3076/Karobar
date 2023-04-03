package com.tieto.cs.stock.utils;

import java.util.concurrent.ConcurrentHashMap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CacheUtils {
  
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TypeStatusKey {
        private String type;
        private String currentState;
        private String event;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TerminalTypeData {
        private String refAttrName;
    }

    public static final ConcurrentHashMap<TypeStatusKey, String> TYPE_STATUS_CACHE = new ConcurrentHashMap<>();
    public static final ConcurrentHashMap<String, TerminalTypeData> TYPE_CACHE = new ConcurrentHashMap<>();
}
