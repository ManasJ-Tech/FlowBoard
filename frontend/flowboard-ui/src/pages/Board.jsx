import { useEffect, useState } from "react";
import { getProjects } from "@/services/projectService";
import ProjectRoom from "@/components/project/ProjectRoom";

function Board() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

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
    <div className="flex gap-6">
      <div className="w-full md:w-1/2">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Meeting Room</h1>
          <p className="text-muted-custom mt-2">Select a project to open its discussion room. Messages are project-specific and real-time.</p>
        </div>

        {loading ? (
          <p className="text-muted-custom">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 text-muted-custom shadow-sm">
            No projects found. Create one from the Projects page first.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="cursor-pointer rounded-xl border border-surface-strong bg-surface-soft p-5 transition hover:border-primary shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-900">{project.name}</h2>
                <p className="mt-2 text-muted-custom">{project.description}</p>
                <p className="mt-4 text-sm text-muted-custom">Open discussion room</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/2">
        {selectedProject ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">{selectedProject.name}</h2>
                <p className="text-muted-custom">{selectedProject.description}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="px-3 py-1 rounded-md border">
                Close
              </button>
            </div>

            <ProjectRoom projectId={selectedProject.id} />
          </div>
        ) : (
          <div className="rounded-xl border border-surface-strong bg-surface-soft p-6 text-muted-custom shadow-sm">
            Select a project to view its meeting room messages.
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
