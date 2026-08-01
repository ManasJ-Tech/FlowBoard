package com.manas.flowboard.controller;

import java.util.List;

import com.manas.flowboard.dto.TaskStatusRequest;
import com.manas.flowboard.entity.Task;
import com.manas.flowboard.dto.TaskRequest;
import com.manas.flowboard.entity.TaskStatus;
import com.manas.flowboard.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<Task> createTask(
            @Valid @RequestBody TaskRequest request
    ) {

        Task task = taskService.createTask(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                taskService.getTaskById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {

        Task task = taskService.updateTask(id, request);

        return ResponseEntity.ok(task);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskStatusRequest request
    ) {

        Task task = taskService.updateTaskStatus(id, request);

        return ResponseEntity.ok(task);
    }


    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(
            @PathVariable Long projectId
    ) {

        return ResponseEntity.ok(
                taskService.getTaskByProject(projectId)
        );
    }


    @GetMapping("/project/{projectId}/status/{status}")
    public ResponseEntity<List<Task>> getTaskByProjectAndStatus(
            @PathVariable Long projectId,
            @PathVariable TaskStatus status
    ) {

        return ResponseEntity.ok(
                taskService.getTasksByProjectAndStatus(
                        projectId,
                        status
                )
        );
    }
}
