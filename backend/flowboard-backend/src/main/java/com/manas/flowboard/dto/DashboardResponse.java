package com.manas.flowboard.dto;

import java.util.List;

public class DashboardResponse {
    private Long projectCount;
    private Long taskCount;
    private Long completedTaskCount;
    private Long teamMemberCount;
    private List<DashboardProjectSummary> recentProjects;
    private List<DashboardActivityEntry> activityLog;
    private List<DashboardReminderEntry> upcomingReminders;

    public DashboardResponse() {
    }

    public Long getProjectCount() {
        return projectCount;
    }

    public void setProjectCount(Long projectCount) {
        this.projectCount = projectCount;
    }

    public Long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(Long taskCount) {
        this.taskCount = taskCount;
    }

    public Long getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(Long completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }

    public Long getTeamMemberCount() {
        return teamMemberCount;
    }

    public void setTeamMemberCount(Long teamMemberCount) {
        this.teamMemberCount = teamMemberCount;
    }

    public List<DashboardProjectSummary> getRecentProjects() {
        return recentProjects;
    }

    public void setRecentProjects(List<DashboardProjectSummary> recentProjects) {
        this.recentProjects = recentProjects;
    }

    public List<DashboardActivityEntry> getActivityLog() {
        return activityLog;
    }

    public void setActivityLog(List<DashboardActivityEntry> activityLog) {
        this.activityLog = activityLog;
    }

    public List<com.manas.flowboard.dto.DashboardReminderEntry> getUpcomingReminders() {
        return upcomingReminders;
    }

    public void setUpcomingReminders(List<com.manas.flowboard.dto.DashboardReminderEntry> upcomingReminders) {
        this.upcomingReminders = upcomingReminders;
    }
}
