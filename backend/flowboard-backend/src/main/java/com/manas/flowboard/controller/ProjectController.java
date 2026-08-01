package com.manas.flowboard.controller;

import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import java.util.List;
import com.manas.flowboard.dto.ProjectRequest;
import com.manas.flowboard.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    public ProjectController(ProjectService projectService, UserRepository userRepository) {
        this.projectService = projectService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {

        User currentUser = findCurrentUser(authentication);
        Project created = projectService.createProject(request, currentUser);

        return ResponseEntity.ok(created);
    }


    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(
            Authentication authentication
    ) {
        User currentUser = findCurrentUser(authentication);

        return ResponseEntity.ok(
                projectService.getAllProjects(currentUser)
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        User currentUser = findCurrentUser(authentication);

        return ResponseEntity.ok(
                projectService.getProjectById(id, currentUser)
        );
    }

    private User findCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }


    @PutMapping("/{id}")
    public ResponseEntity<String> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectRequest request
    ) {

        String response = projectService.updateProject(id, request);

        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProject(
            @PathVariable Long id
    ) {

        String response = projectService.deleteProject(id);

        return ResponseEntity.ok(response);
    }

}
