package com.manas.flowboard.dto;

public class DashboardReminderEntry {
    private String message;
    private String description;
    private String dueDate;

    public DashboardReminderEntry() {
    }

    public DashboardReminderEntry(String message, String description, String dueDate) {
        this.message = message;
        this.description = description;
        this.dueDate = dueDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}
