package com.manas.flowboard.repository;

import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.Task;
import com.manas.flowboard.entity.TaskStatus;
import com.manas.flowboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByProjectIdAndStatus(
            Long projectId, TaskStatus status
    );

    Long countByProjectOwner(User owner);

    Long countByProjectOwnerAndStatus(User owner, TaskStatus status);

    List<Task> findTop5ByProjectOwnerOrderByCreatedAtDesc(User owner);
    List<Task> findTop5ByProjectOwnerOrderByUpdatedAtDesc(User owner);

    List<Task> findByProjectOwnerAndDueDateAfterOrderByDueDateAsc(User owner, LocalDateTime after);

    List<Task> findByProjectOwnerAndDueDateBetweenOrderByDueDateAsc(User owner, LocalDateTime start, LocalDateTime end);

    Long countByAssignedUser(User assignedUser);

    Long countByAssignedUserAndStatus(User assignedUser, TaskStatus status);

    List<Task> findTop5ByAssignedUserOrderByCreatedAtDesc(User assignedUser);
    List<Task> findTop5ByAssignedUserOrderByUpdatedAtDesc(User assignedUser);

    List<Task> findByAssignedUserAndDueDateAfterOrderByDueDateAsc(User assignedUser, LocalDateTime after);

    List<Task> findByAssignedUserAndDueDateBetweenOrderByDueDateAsc(User assignedUser, LocalDateTime start, LocalDateTime end);
}
