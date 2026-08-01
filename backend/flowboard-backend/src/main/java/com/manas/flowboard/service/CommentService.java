package com.manas.flowboard.service;

import com.manas.flowboard.dto.CommentRequest;
import com.manas.flowboard.entity.Comment;
import com.manas.flowboard.entity.Task;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.CommentRepository;
import com.manas.flowboard.repository.TaskRepository;
import com.manas.flowboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TaskRepository taskRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public String addComment(CommentRequest request) {

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Comment comment = new Comment();

        comment.setContent(request.getContent());
        comment.setTask(task);
        comment.setUser(user);

        commentRepository.save(comment);

        return "Comment added successfully!";
    }

    public List<Comment> getCommentByTask(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        return commentRepository.findByTask(task);
    }
}
