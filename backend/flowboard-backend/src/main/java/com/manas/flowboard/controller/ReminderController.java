package com.manas.flowboard.controller;

import com.manas.flowboard.entity.Reminder;
import com.manas.flowboard.entity.User;
import com.manas.flowboard.repository.UserRepository;
import com.manas.flowboard.service.ReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;
    private final UserRepository userRepository;

    public ReminderController(ReminderService reminderService, UserRepository userRepository) {
        this.reminderService = reminderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(@RequestBody Reminder reminder, Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getRole() == null || !currentUser.getRole().name().equals("PROJECT_MANAGER")) {
            return ResponseEntity.status(403).build();
        }

        Reminder created = reminderService.createReminder(reminder, currentUser);

        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getReminders(Authentication authentication) {
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        // If manager, return their reminders; if team member, return manager's reminders
        if (currentUser.getRole() != null && currentUser.getRole().name().equals("PROJECT_MANAGER")) {
            // return all reminders for manager (no date filtering here)
            List<Reminder> list = reminderService.getRemindersForManager(currentUser);
            return ResponseEntity.ok(list);
        } else {
            if (currentUser.getManager() == null) return ResponseEntity.ok(List.of());
            List<Reminder> list = reminderService.getRemindersForManager(currentUser.getManager());
            return ResponseEntity.ok(list);
        }
    }
}
