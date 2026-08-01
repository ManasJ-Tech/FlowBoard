package com.manas.flowboard.controller;

import com.manas.flowboard.dto.CommentRequest;
import com.manas.flowboard.entity.Comment;
import com.manas.flowboard.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<String> addComment(
            @RequestBody CommentRequest request
    ) {
        return ResponseEntity.ok(
                commentService.addComment(request)
        );
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Comment>> getCommentByTask(
            @PathVariable Long taskId
    ) {
        return ResponseEntity.ok(
                commentService.getCommentByTask(taskId)
        );
    }
}
