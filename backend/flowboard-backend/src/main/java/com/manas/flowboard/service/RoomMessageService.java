package com.manas.flowboard.service;

import com.manas.flowboard.dto.RoomMessageRequest;
import com.manas.flowboard.entity.RoomMessage;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.RoomMessageRepository;
import com.manas.flowboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomMessageService {

    private final RoomMessageRepository repository;
    private final UserRepository userRepository;

    public RoomMessageService(RoomMessageRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public RoomMessage addMessage(RoomMessageRequest request) {
        RoomMessage msg = new RoomMessage();
        msg.setProjectId(request.getProjectId());
        msg.setContent(request.getContent());
        msg.setMessageType(request.getMessageType());

        if (request.getUserId() != null) {
            User u = userRepository.findById(request.getUserId()).orElse(null);
            msg.setUser(u);
        }

        if (request.getParentId() != null) {
            RoomMessage parent = repository.findById(request.getParentId()).orElse(null);
            msg.setParentMessage(parent);
        }

        return repository.save(msg);
    }

    public List<RoomMessage> getMessagesByProject(Long projectId) {
        return repository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }

}
