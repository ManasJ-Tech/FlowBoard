import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ProjectForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });

    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Project Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ConcurDev"
          className="h-12 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary/20"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Description
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description..."
          className="h-12 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary/20"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-full bg-primary text-white shadow-lg shadow-primary/10 transition hover:bg-primary/90"
      >
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}

export default ProjectForm;