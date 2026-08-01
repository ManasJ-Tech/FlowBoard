package com.manas.flowboard.dto;

public class DashboardActivityEntry {
    private String message;
    private String timestamp;

    public DashboardActivityEntry() {
    }

    public DashboardActivityEntry(String message, String timestamp) {
        this.message = message;
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
