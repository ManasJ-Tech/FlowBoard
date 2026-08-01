package com.manas.flowboard.repository;

import com.manas.flowboard.entity.Comment;
import com.manas.flowboard.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTask(Task task);
}
