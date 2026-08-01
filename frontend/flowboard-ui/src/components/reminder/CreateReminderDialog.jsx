import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ReminderForm from "./ReminderForm";
import { createReminder } from "@/services/reminderService";

function CreateReminderDialog({ onReminderCreated }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleCreate(reminder) {
    try {
      setLoading(true);
      await createReminder(reminder);
      if (onReminderCreated) onReminderCreated();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="md"
          className="min-w-[170px] rounded-full px-6 py-3 shadow-lg shadow-primary/10 transition hover:bg-primary/90"
        >
          Create Reminder
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-lg rounded-[32px] border border-slate-200 bg-white px-8 py-8 text-slate-900 shadow-[0_25px_60px_-25px_rgba(15,23,42,0.25)] ring-1 ring-slate-200/70">
        <DialogHeader className="space-y-3 border-b border-slate-200/70 pb-6">
          <DialogTitle className="text-2xl">Create Reminder</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Schedule a reminder for your project or task deadline.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-7">
          <ReminderForm onSubmit={handleCreate} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateReminderDialog;
