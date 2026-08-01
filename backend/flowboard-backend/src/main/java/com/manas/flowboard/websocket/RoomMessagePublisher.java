package com.manas.flowboard.websocket;

import com.manas.flowboard.entity.RoomMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class RoomMessagePublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public RoomMessagePublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(RoomMessage message) {
        String topic = "/topic/project." + message.getProjectId();
        messagingTemplate.convertAndSend(topic, message);
    }
}
