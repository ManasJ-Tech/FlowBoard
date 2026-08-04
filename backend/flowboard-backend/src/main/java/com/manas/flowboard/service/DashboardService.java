package com.manas.flowboard.service;

import com.manas.flowboard.dto.DashboardProjectSummary;
import com.manas.flowboard.dto.DashboardResponse;
import com.manas.flowboard.dto.DashboardActivityEntry;
import com.manas.flowboard.dto.DashboardReminderEntry;
import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.Task;
import com.manas.flowboard.entity.TaskStatus;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.ProjectRepository;
import com.manas.flowboard.repository.TaskRepository;
import com.manas.flowboard.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ReminderService reminderService;

    public DashboardService(
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            ReminderService reminderService
    ) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.reminderService = reminderService;
    }

    public DashboardResponse getDashboard(User currentUser) {
        DashboardResponse response = new DashboardResponse();

        boolean isManager = currentUser.getRole() != null && currentUser.getRole().name().equals("PROJECT_MANAGER");
        response.setTeamMemberCount(0L);

        if (isManager) {
            List<Project> projects = projectRepository.findAllByOwnerOrderByCreatedAtDesc(currentUser);
            response.setProjectCount((long) projects.size());
            response.setTaskCount(taskRepository.countByProjectOwner(currentUser));
            response.setCompletedTaskCount(taskRepository.countByProjectOwnerAndStatus(currentUser, TaskStatus.DONE));
            response.setTeamMemberCount(userRepository.countByManager(currentUser));
            response.setRecentProjects(projects.stream()
                    .limit(5)
                    .map(this::toSummary)
                    .collect(Collectors.toList())
            );

            List<Task> recentTasks = taskRepository.findTop5ByProjectOwnerOrderByUpdatedAtDesc(currentUser);
            response.setActivityLog(buildManagerActivityLog(projects, recentTasks));
            response.setUpcomingReminders(buildUpcomingRemindersForManager(currentUser));
        } else {
            // Projects assigned to the team user
            List<Project> assignedProjects = projectRepository.findDistinctByTasks_AssignedUserOrderByCreatedAtDesc(currentUser);

            if (currentUser.getManager() != null) {
                response.setTeamMemberCount(userRepository.countByManager(currentUser.getManager()));
            }

            response.setProjectCount((long) assignedProjects.size());
            response.setTaskCount(taskRepository.countByAssignedUser(currentUser));
            response.setCompletedTaskCount(taskRepository.countByAssignedUserAndStatus(currentUser, TaskStatus.DONE));

            response.setRecentProjects(assignedProjects.stream()
                    .limit(5)
                    .map(this::toSummary)
                    .collect(Collectors.toList())
            );

            List<Task> recentTasks = taskRepository.findTop5ByAssignedUserOrderByUpdatedAtDesc(currentUser);
            response.setActivityLog(buildTeamActivityLog(currentUser, recentTasks));
            response.setUpcomingReminders(buildUpcomingRemindersForTeam(currentUser));
        }

        return response;
    }

    private DashboardProjectSummary toSummary(Project project) {
        return new DashboardProjectSummary(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt() != null ? project.getCreatedAt().toString() : ""
        );
    }

    private List<DashboardActivityEntry> buildManagerActivityLog(List<Project> projects, List<Task> recentTasks) {
        List<DashboardActivityEntry> log = new ArrayList<>();

        for (Project project : projects.stream().limit(3).collect(Collectors.toList())) {
            String msg = String.format("New project created: %s", project.getName());
            String ts = project.getCreatedAt() != null ? project.getCreatedAt().toString() : LocalDateTime.now().toString();
            log.add(new DashboardActivityEntry(msg, ts));
        }

        for (Task task : recentTasks) {
            String msg = String.format("Task updated: %s (%s)", task.getTitle(), task.getStatus().name());
            String ts = task.getCreatedAt() != null ? task.getCreatedAt().toString() : LocalDateTime.now().toString();
            log.add(new DashboardActivityEntry(msg, ts));
        }

        if (log.isEmpty()) {
            log.add(new DashboardActivityEntry("No recent activity yet. Create a project or assign tasks to get started.", LocalDateTime.now().toString()));
        }

        return log.stream().limit(7).collect(Collectors.toList());
    }

    private List<DashboardActivityEntry> buildTeamActivityLog(User currentUser, List<Task> recentTasks) {
        List<DashboardActivityEntry> log = new ArrayList<>();

        if (currentUser.getManager() != null) {
            String msg = String.format("Assigned by %s", currentUser.getManager().getFullName());
            log.add(new DashboardActivityEntry(msg, currentUser.getManager().getCreatedAt() != null ? currentUser.getManager().getCreatedAt().toString() : LocalDateTime.now().toString()));
        }

        for (Task task : recentTasks) {
            String msg;
            if (task.getStatus() == TaskStatus.DONE) {
                msg = String.format("Completed task: %s", task.getTitle());
            } else {
                msg = String.format("Assigned task: %s", task.getTitle());
            }
            String ts = task.getCreatedAt() != null ? task.getCreatedAt().toString() : LocalDateTime.now().toString();
            log.add(new DashboardActivityEntry(msg, ts));
        }

        if (log.isEmpty()) {
            log.add(new DashboardActivityEntry("No recent activity yet. Check your assigned tasks to stay up to date.", LocalDateTime.now().toString()));
        }

        return log.stream().limit(7).collect(Collectors.toList());
    }

    private List<DashboardReminderEntry> buildUpcomingRemindersForManager(User currentUser) {
        var today = java.time.LocalDate.now();
        var end = today.plusDays(7);
        List<Task> dueTasks = taskRepository.findByProjectOwnerAndDueDateBetweenOrderByDueDateAsc(currentUser, java.time.LocalDateTime.now(), java.time.LocalDateTime.now().plusDays(7));
        List<DashboardReminderEntry> reminders = dueTasks.stream()
                .map(task -> new DashboardReminderEntry(
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate() != null ? task.getDueDate().toLocalDate().toString() : ""
                ))
                .collect(Collectors.toList());

        // include manager-created reminders within next 7 days
        try {
            var managerRems = reminderService.getManagerRemindersBetween(currentUser, today, end);
            managerRems.forEach(r -> reminders.add(new DashboardReminderEntry(
                    r.getMessage(),
                    r.getDescription(),
                    r.getDueDate() != null ? r.getDueDate().toString() : ""
            )));
        } catch (Exception ignored) {
        }

        return reminders;
    }

    private List<DashboardReminderEntry> buildUpcomingRemindersForTeam(User currentUser) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime end = now.plusDays(7);
        List<Task> dueTasks = taskRepository.findByAssignedUserAndDueDateBetweenOrderByDueDateAsc(currentUser, now, end);
        List<DashboardReminderEntry> reminders = dueTasks.stream()
                .map(task -> new DashboardReminderEntry(
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate() != null ? task.getDueDate().toLocalDate().toString() : ""
                ))
                .collect(Collectors.toList());

        // include reminders from the manager
        if (currentUser.getManager() != null) {
            try {
                var managerRems = reminderService.getManagerRemindersBetween(currentUser.getManager(), java.time.LocalDate.now(), java.time.LocalDate.now().plusDays(7));
                managerRems.forEach(r -> reminders.add(new DashboardReminderEntry(
                        r.getMessage(),
                        r.getDescription(),
                        r.getDueDate() != null ? r.getDueDate().toString() : ""
                )));
            } catch (Exception ignored) {
            }
        }

        return reminders;
    }
}
