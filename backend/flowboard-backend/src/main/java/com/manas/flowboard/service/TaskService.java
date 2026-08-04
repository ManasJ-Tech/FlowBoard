package com.manas.flowboard.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import com.manas.flowboard.dto.TaskRequest;
import com.manas.flowboard.dto.TaskStatusRequest;
import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.Task;
import com.manas.flowboard.entity.TaskStatus;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.ProjectRepository;
import com.manas.flowboard.repository.TaskRepository;
import com.manas.flowboard.repository.UserRepository;
import com.manas.flowboard.websocket.TaskUpdatePublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TaskService {

    public final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskUpdatePublisher taskUpdatePublisher;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            TaskUpdatePublisher taskUpdatePublisher
    ) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskUpdatePublisher = taskUpdatePublisher;
    }



    public Task createTask(TaskRequest request, User currentUser) {
        if (currentUser == null || currentUser.getRole() == null || !currentUser.getRole().name().equals("PROJECT_MANAGER")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only project managers can create tasks");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        if (project.getOwner() == null || !project.getOwner().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only create tasks for your own projects");
        }

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        task.setProject(project);

        if (request.getAssignedUserId() != null) {
            User user = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            task.setAssignedUser(user);
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getDueDate() != null && !request.getDueDate().isBlank()) {
            try {
                // Try full ISO date-time first
                task.setDueDate(LocalDateTime.parse(request.getDueDate(), DateTimeFormatter.ISO_DATE_TIME));
            } catch (Exception ex) {
                try {
                    // Fallback: accept ISO date (yyyy-MM-dd) and convert to start of day
                    java.time.LocalDate d = java.time.LocalDate.parse(request.getDueDate(), java.time.format.DateTimeFormatter.ISO_DATE);
                    task.setDueDate(d.atStartOfDay());
                } catch (Exception ex2) {
                    // Invalid date format
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Invalid dueDate format. Use ISO date or ISO date-time"
                    );
                }
            }
        }

        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        return task;
    }



    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    public Task getTaskById(Long id) {

        return taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));
    }



    public Task updateTask(Long id, TaskRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);

        if (request.getAssignedUserId() != null) {
            User user = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedUser(user);
        } else {
            task.setAssignedUser(null);
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getDueDate() != null && !request.getDueDate().isBlank()) {
            try {
                // Try full ISO date-time first
                task.setDueDate(LocalDateTime.parse(request.getDueDate(), DateTimeFormatter.ISO_DATE_TIME));
            } catch (Exception ex) {
                try {
                    // Fallback: accept ISO date (yyyy-MM-dd) and convert to start of day
                    java.time.LocalDate d = java.time.LocalDate.parse(request.getDueDate(), java.time.format.DateTimeFormatter.ISO_DATE);
                    task.setDueDate(d.atStartOfDay());
                } catch (Exception ex2) {
                    // Invalid date format
                    throw new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.BAD_REQUEST,
                            "Invalid dueDate format. Use ISO date or ISO date-time"
                    );
                }
            }
        } else {
            task.setDueDate(null);
        }

        task.setUpdatedAt(LocalDateTime.now());

        taskRepository.save(task);

        taskUpdatePublisher.publishTaskUpdate(
                task.getId(),
                task.getStatus().name()
        );

        return task;

    }



    public Task updateTaskStatus(Long id, TaskStatusRequest request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setStatus(request.getStatus());
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        taskUpdatePublisher.publishTaskUpdate(
                task.getId(),
                task.getStatus().name()
        );

        return task;
    }



    public List<Task> getTaskByProject(Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        return taskRepository.findByProject(project);
    }


    public List<Task> getTasksByProjectAndStatus(
            Long projectId,
            TaskStatus status
    ) {

        return taskRepository.findByProjectIdAndStatus(
                projectId,
                status
        );
    }


}
