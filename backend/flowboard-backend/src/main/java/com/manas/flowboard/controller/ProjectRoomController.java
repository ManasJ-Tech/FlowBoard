package com.manas.flowboard.controller;

import com.manas.flowboard.dto.RoomMessageRequest;
import com.manas.flowboard.entity.RoomMessage;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import com.manas.flowboard.service.RoomMessageService;
import com.manas.flowboard.websocket.RoomMessagePublisher;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/room")
public class ProjectRoomController {

    private final RoomMessageService service;
    private final RoomMessagePublisher publisher;
    private final UserRepository userRepository;

    public ProjectRoomController(RoomMessageService service, RoomMessagePublisher publisher, UserRepository userRepository) {
        this.service = service;
        this.publisher = publisher;
        this.userRepository = userRepository;
    }

    @PostMapping("/messages")
    public ResponseEntity<RoomMessage> postMessage(
            @PathVariable Long projectId,
            @RequestBody RoomMessageRequest request
    ) {
        request.setProjectId(projectId);
        // If the client didn't set userId, derive it from the authenticated principal
        if (request.getUserId() == null) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null) {
                User u = userRepository.findByEmail(auth.getName()).orElse(null);
                if (u != null) request.setUserId(u.getId());
            }
        }

        RoomMessage msg = service.addMessage(request);
        publisher.publish(msg);
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<RoomMessage>> getMessages(
            @PathVariable Long projectId
    ) {
        return ResponseEntity.ok(
                service.getMessagesByProject(projectId)
        );
    }

}
