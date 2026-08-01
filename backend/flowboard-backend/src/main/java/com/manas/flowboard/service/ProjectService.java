package com.manas.flowboard.service;

import java.util.List;
import com.manas.flowboard.dto.ProjectRequest;
import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.ProjectRepository;
import org.springframework.stereotype.Service;


@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(ProjectRequest request, User owner) {
        if (owner == null || owner.getRole() == null || !owner.getRole().name().equals("PROJECT_MANAGER")) {
            throw new RuntimeException("Only users with PROJECT_MANAGER role can create projects");
        }

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setOwner(owner);

        return projectRepository.save(project);
    }


    public List<Project> getAllProjects(User currentUser) {
        if (currentUser.getRole() == null) {
            return List.of();
        }

        if (currentUser.getRole().name().equals("PROJECT_MANAGER")) {
            return projectRepository.findAllByOwnerOrderByCreatedAtDesc(currentUser);
        }

        return projectRepository.findDistinctByTasks_AssignedUserOrderByCreatedAtDesc(currentUser);
    }


    public Project getProjectById(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (currentUser.getRole() != null && currentUser.getRole().name().equals("PROJECT_MANAGER")) {
            if (project.getOwner() == null || !project.getOwner().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Project not found or access denied");
            }
            return project;
        }

        boolean isAssigned = project.getTasks().stream()
                .anyMatch(task -> task.getAssignedUser() != null && task.getAssignedUser().getId().equals(currentUser.getId()));

        if (!isAssigned) {
            throw new RuntimeException("Project not found or access denied");
        }

        return project;
    }


    public String updateProject(Long id, ProjectRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        projectRepository.save(project);

        return "Project updated successfully!";
    }


    public String deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        projectRepository.delete(project);

        return "Project deleted successfully!";
    }
}
