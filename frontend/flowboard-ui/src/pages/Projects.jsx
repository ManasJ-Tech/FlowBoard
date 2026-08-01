import { useEffect, useState } from "react";
import { getProjects } from "@/services/projectService";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import ProjectCard from "@/components/dashboard/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();

    function onProjectCreatedEvent() {
      loadProjects();
    }

    window.addEventListener("project:created", onProjectCreatedEvent);

    return () => window.removeEventListener("project:created", onProjectCreatedEvent);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-custom mt-2">Browse and manage your active projects.</p>
        </div>
        <CreateProjectDialog onProjectCreated={loadProjects} />
      </div>

      {loading ? (
        <p className="text-muted-custom">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-surface-strong bg-surface p-6 text-muted-custom">
          No projects yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              description={project.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
