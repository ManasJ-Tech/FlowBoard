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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Reminder title</label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reminder title"
          className="h-12 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary/20"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Reminder description..."
          className="min-h-[7rem] w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-primary focus:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Due date</label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="h-12 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-primary/20"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-full bg-primary text-white shadow-lg shadow-primary/10 transition hover:bg-primary/90"
      >
        {loading ? "Saving..." : "Create Reminder"}
      </Button>
    </form>
  );
}

export default ReminderForm;
