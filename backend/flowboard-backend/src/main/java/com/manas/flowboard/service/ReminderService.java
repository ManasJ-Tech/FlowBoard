package com.manas.flowboard.service;

import com.manas.flowboard.entity.Reminder;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public ReminderService(ReminderRepository reminderRepository) {
        this.reminderRepository = reminderRepository;
    }

    public Reminder createReminder(Reminder reminder, User createdBy) {
        reminder.setCreatedBy(createdBy);
        if (reminder.getCreatedAt() == null) reminder.setCreatedAt(LocalDateTime.now());
        return reminderRepository.save(reminder);
    }

    public List<Reminder> getManagerRemindersBetween(User manager, java.time.LocalDate start, java.time.LocalDate end) {
        return reminderRepository.findByCreatedByAndDueDateBetweenOrderByDueDateAsc(manager, start, end);
    }

    public List<Reminder> getRemindersForManager(User manager) {
        return reminderRepository.findByCreatedByOrderByDueDateAsc(manager);
    }
}
