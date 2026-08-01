package com.manas.flowboard.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TaskUpdatePublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public TaskUpdatePublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publishTaskUpdate(Long taskId, String status) {

        TaskUpdateMessage message =
                new TaskUpdateMessage(taskId, status);

        messagingTemplate.convertAndSend(
                "/topic/topic",
                message
        );
    }
}
