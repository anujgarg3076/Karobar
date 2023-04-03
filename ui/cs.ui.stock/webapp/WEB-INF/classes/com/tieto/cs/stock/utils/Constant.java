package com.tieto.cs.stock.utils;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class Constant {
    static public class StatusType {
        public static final String SUCCESS = "success";
        public static final String ERROR = "error";
        public static final String WARNING = "warning";
    }
    public static class RefData {
        public static class Type {
            public static final String STOCK_ATTRIBUTE = "TLMS_STOCK_ATTRIBUTE";
        }
    }

    public static class TerminalMedia {
        public static final Map<String, String> PROPERTIES =  Map.of(
                "id",  "mediaId",
                "type", "mediaType",
                "state", "state");
    }
}
