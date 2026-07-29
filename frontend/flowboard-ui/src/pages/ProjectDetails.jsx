import KanbanBoard from "@/components/task/KanbanBoard";

import { getTasksByProject } from "@/services/taskService";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectById } from "@/services/projectService";

import ProjectActions from "@/components/project/ProjectActions";
import EditProjectDialog from "@/components/project/EditProjectDialog";


function ProjectDetails() {

  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadProject() {
    try {
      setLoading(true);
      setError(null);

      const data = await getProjectById(id);
      setProject(data || null);

      const t = await getTasksByProject(id);
      setTasks(t || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load project");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-surface text-slate-900">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-400">{error}</div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-muted-custom">Project not found.</div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-surface text-slate-900 p-8">
      <h1 className="text-4xl font-bold">{project.name}</h1>

      <p className="mt-4 text-muted-custom">{project.description}</p>

      <div className="mt-8 flex gap-4">
        <EditProjectDialog project={project} onUpdated={loadProject} />

        <ProjectActions id={project.id} />
      </div>

      <KanbanBoard projectId={project.id} />

      <div className="mt-8 rounded-xl border border-surface-strong bg-surface-soft p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Project Information</h2>

        <div className="mt-4 space-y-2 text-muted-custom">
          <p>Project ID: {project.id}</p>
          <p>Created At: {project.createdAt ? new Date(project.createdAt).toLocaleString() : "-"}</p>
          <p>
            Tasks: {tasks.length} (To Do: {tasks.filter((t) => t.status === "TODO").length}, In Progress: {tasks.filter((t) => t.status === "IN_PROGRESS").length}, Done: {tasks.filter((t) => t.status === "DONE").length})
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;