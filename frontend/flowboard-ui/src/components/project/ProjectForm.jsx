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
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Project Name
        </label>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ConcurDev"
          className="h-11 border-surface-strong bg-surface-soft text-slate-900"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description..."
          className="h-11 border-surface-strong bg-surface-soft text-slate-900"
        />
      </div>

      <Button type="submit" disabled={loading} className="h-11 w-full">
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}

export default ProjectForm;