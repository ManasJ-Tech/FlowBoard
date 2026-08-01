package com.manas.flowboard.repository;

import com.manas.flowboard.entity.Project;
import com.manas.flowboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    Long countByOwner(User owner);

    List<Project> findAllByOwnerOrderByCreatedAtDesc(User owner);

    List<Project> findDistinctByTasks_AssignedUserOrderByCreatedAtDesc(User assignedUser);
}
