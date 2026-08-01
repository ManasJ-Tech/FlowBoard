package com.manas.flowboard.websocket;

public class TaskUpdateMessage {

    private Long taskId;
    private String status;

    public TaskUpdateMessage() {
    }

    public TaskUpdateMessage(Long taskId, String status) {
        this.taskId = taskId;
        this.status = status;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
