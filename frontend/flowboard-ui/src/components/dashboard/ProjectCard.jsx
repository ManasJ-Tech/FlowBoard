import { useNavigate } from "react-router-dom";
import { ArrowRight, FolderOpen } from "lucide-react";

function ProjectCard({ id, name, description }) {

  const navigate = useNavigate();

  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PR";

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      navigate(`/projects/${id}`);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/projects/${id}`)}
      onKeyDown={handleKeyDown}
      className="group flex cursor-pointer items-center justify-between gap-6 rounded-3xl border border-surface-strong bg-white p-5 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:border-primary hover:bg-surface-soft hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-lg font-bold text-primary">
          {initials}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm text-muted-custom">
            <FolderOpen size={16} />
            <span>Recent project</span>
          </div>

          <h3 className="mt-2 text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:text-primary">
            {name}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description || "No description available for this project."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ArrowRight className="text-slate-500 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
}

export default ProjectCard;