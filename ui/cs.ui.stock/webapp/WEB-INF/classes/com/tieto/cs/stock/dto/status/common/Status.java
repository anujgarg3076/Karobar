package com.tieto.cs.stock.dto.status.common;

import com.tieto.cs.stock.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class Status {
    public Status() {
        type = Constant.StatusType.SUCCESS;
        message = "";
    }
    private String type;
    private String message;
}
