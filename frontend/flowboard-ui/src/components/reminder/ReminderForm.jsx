import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ReminderForm({ onSubmit, loading }) {
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim() || !dueDate.trim()) {
      return;
    }

    onSubmit({
      message: message.trim(),
      description: description.trim(),
      dueDate: dueDate.trim(),
    });

    setMessage("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium">Reminder title</label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reminder title"
          className="h-11 border-surface-strong bg-surface-soft text-slate-900"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Reminder description..."
          className="h-28 w-full rounded-lg border border-surface-strong bg-surface-soft px-3 py-2 text-slate-900 outline-none transition focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Due date</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-11 border-surface-strong bg-surface-soft text-slate-900"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="h-11 w-full">
        {loading ? "Saving..." : "Create Reminder"}
      </Button>
    </form>
  );
}

export default ReminderForm;
