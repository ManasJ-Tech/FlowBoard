import StatCard from "./StatCard";

function StatsGrid({ stats }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Projects"
        value={stats?.projectCount ?? "-"}
        subtitle={`${stats?.recentProjects?.length ?? 0} recent`}
        color="text-blue-500"
      />

      <StatCard
        title="Tasks"
        value={stats?.taskCount ?? "-"}
        subtitle={`${stats?.upcomingReminders?.length ?? 0} due soon`}
        color="text-green-500"
      />

      <StatCard
        title="Completed"
        value={stats?.completedTaskCount ?? "-"}
        subtitle="Resolved tasks"
        color="text-purple-500"
      />

      <StatCard
        title="Team Members"
        value={stats?.teamMemberCount ?? 0}
        subtitle="Active members"
        color="text-orange-500"
      />

    </div>
  );
}

export default StatsGrid;
