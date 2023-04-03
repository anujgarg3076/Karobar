package com.tieto.cs.stock.dto.status.post.terminal;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PostTerminalStatus {
    private Statistics succeeded = new Statistics();
    private Statistics skipped = new Statistics();
    private Statistics failed = new Statistics();

    public void addSucceeded() {
        succeeded.incCount();
    }

    protected void addStat(Statistics stat, String terminalTypeName, String message, List<Attribute> attributes) {
        stat.incCount();
        var builder = Detail.builder()
                .type(terminalTypeName)
                .message(message);
        if (attributes != null) {
            builder.attributes(attributes);
        }

        stat.getDetails().add(builder.build());
    }

    public void addSkipped(String terminalTypeName, String message, List<Attribute> attributes) {
        addStat(skipped, terminalTypeName, message, attributes);
    }

    public void addFailed(String terminalTypeName, String message, List<Attribute> attributes) {
        addStat(failed, terminalTypeName, message, attributes);
    }

    public void addFailed(String terminalTypeName, String message) {
        addStat(failed, terminalTypeName, message, null);
    }
}
