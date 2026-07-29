import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "@/services/projectService";

function Board() {
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
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Board</h1>
        <p className="text-muted-custom mt-2">Choose a project to open its live kanban board.</p>
      </div>

      {loading ? (
        <p className="text-muted-custom">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 text-muted-custom shadow-sm">
          No projects found. Create one from the Projects page first.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="rounded-xl border border-surface-strong bg-surface-soft p-5 transition hover:border-primary shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
              <p className="mt-2 text-muted-custom">{project.description}</p>
              <p className="mt-4 text-sm text-muted-custom">Open project board</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Board;
