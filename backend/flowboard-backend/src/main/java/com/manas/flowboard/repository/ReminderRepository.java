package com.manas.flowboard.repository;

import com.manas.flowboard.entity.Reminder;
import com.manas.flowboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByCreatedByAndDueDateBetweenOrderByDueDateAsc(User createdBy, LocalDate start, LocalDate end);

    List<Reminder> findByCreatedByOrderByDueDateAsc(User createdBy);

}
