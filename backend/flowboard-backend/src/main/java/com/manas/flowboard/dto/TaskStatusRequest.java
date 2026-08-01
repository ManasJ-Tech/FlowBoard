package com.manas.flowboard.dto;

import com.manas.flowboard.entity.TaskStatus;

public class TaskStatusRequest {

    private TaskStatus status;

    public TaskStatusRequest() {
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
