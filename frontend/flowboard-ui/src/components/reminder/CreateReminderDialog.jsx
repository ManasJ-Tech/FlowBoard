import { useState } from "react";

import {
  Dialog,
  DialogContent,
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
        <Button variant="default" size="md">Create Reminder</Button>
      </DialogTrigger>

      <DialogContent className="border-surface-strong bg-surface text-slate-900">
        <DialogHeader>
          <DialogTitle>Create Reminder</DialogTitle>
        </DialogHeader>

        <ReminderForm onSubmit={handleCreate} loading={loading} />
      </DialogContent>
    </Dialog>
  );
}

export default CreateReminderDialog;
