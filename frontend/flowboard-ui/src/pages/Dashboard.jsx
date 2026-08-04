import { useEffect, useState } from "react";
import { Activity, CalendarDays } from "lucide-react";

import { getDashboard } from "@/services/dashboardService";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProjectCard from "@/components/dashboard/ProjectCard";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import CreateReminderDialog from "@/components/reminder/CreateReminderDialog";
import { getCurrentUser } from "@/services/userService";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  async function loadDashboard() {
    try {
      setLoading(true);
      const data = await getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();

    function onProjectCreatedEvent() {
      loadDashboard();
    }

    window.addEventListener("project:created", onProjectCreatedEvent);

    return () => window.removeEventListener("project:created", onProjectCreatedEvent);
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-surface text-slate-900">
      <DashboardHeader />

      <main className="flex-1 p-8">
<div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-muted-custom">
              Here's what's happening with your workspace today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {user?.role === "PROJECT_MANAGER" ? (
              <CreateProjectDialog onProjectCreated={loadDashboard} />
            ) : null}
            {user?.role === "PROJECT_MANAGER" ? (
              <CreateReminderDialog onReminderCreated={loadDashboard} />
            ) : null}
          </div>
        </div>

        <StatsGrid stats={dashboard} />

        <div className="mt-12 grid gap-6 xl:grid-cols-3 items-start">
          <div className="xl:col-span-2">
            <section>
              <div className="flex items-center justify-between">
                <h2 className="mb-6 text-2xl font-bold">Recent Projects</h2>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-muted-custom">Loading dashboard...</p>
                ) : !dashboard?.recentProjects?.length ? (
                  <p className="text-muted-custom">No recent projects available.</p>
                ) : (
                  (dashboard.recentProjects || []).slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      name={project.name}
                      description={project.description}
                    />
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="xl:col-span-1 flex flex-col gap-3">
            <h2 className="mb-0 text-2xl font-bold">Activity</h2>

            <div className="rounded-3xl border border-surface-strong bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                    <CalendarDays size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Upcoming Reminders</h2>
                    <p className="text-sm text-muted-custom">
                      Tasks due in the next 7 days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <p className="text-muted-custom">Loading reminders...</p>
                ) : dashboard?.upcomingReminders?.length ? (
                  dashboard.upcomingReminders.map((reminder, index) => (
                    <div key={index} className="rounded-2xl border border-surface-strong bg-surface p-4 shadow-sm overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                          <CalendarDays size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 truncate">{reminder.message}</p>
                          {reminder.description ? (
                            <p className="mt-1 text-sm text-slate-700 truncate line-clamp-2">{reminder.description}</p>
                          ) : null}
                          <p className="mt-2 text-xs text-muted-custom">Due: {reminder.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-custom">No upcoming reminders this week.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-surface-strong bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Activity Log</h2>
                    <p className="text-sm text-muted-custom">
                      Recent updates for your account.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 max-h-64 overflow-auto pr-2">
                {loading ? (
                  <p className="text-muted-custom">Loading activity...</p>
                ) : dashboard?.activityLog?.length ? (
                  dashboard.activityLog.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-2xl border border-surface-strong bg-surface p-4 shadow-sm">
                      <div className="mt-1 rounded-xl bg-primary/5 p-3 text-primary">
                        <Activity size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.message}</p>
                        <p className="mt-1 text-xs text-muted-custom">{item.timestamp ? new Date(item.timestamp).toLocaleString() : ''}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-custom">No recent activity yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;