import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { updateTask } from "@/services/taskService";
import { getTeamMembers } from "@/services/userService";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


function EditTaskDialog({ task, onUpdated }) {

  const formatDateValue = (value) => {
    if (!value) return "";
    if (typeof value === "string") {
      return value.includes("T") ? value.split("T")[0] : value;
    }
    try {
      return new Date(value).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const resetForm = () => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setAssignedUserId(task.assignedUser?.id ? String(task.assignedUser.id) : "");
    setStatus(task.status || "TODO");
    setDueDate(formatDateValue(task.dueDate));
  };

  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [assignedUserId, setAssignedUserId] = useState(task.assignedUser?.id ? String(task.assignedUser.id) : "");
  const [status, setStatus] = useState(task.status || "TODO");
  const [dueDate, setDueDate] = useState(formatDateValue(task.dueDate));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTeamMembers();
        if (mounted) setUsers(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => (mounted = false);
  }, []);

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleUpdate(e) {
    e.preventDefault();
    setErrorMsg("");
    setSaving(true);

    try {
      await updateTask(
        task.id,
        {
          title,
          description,
          projectId: task.project.id,
          assignedUserId: assignedUserId ? Number(assignedUserId) : null,
          status: status,
          dueDate: dueDate || null,
        }
      );

      setOpen(false);
      onUpdated?.();
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || error.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button variant="default" size="sm" onPointerDown={(e) => e.stopPropagation()}>Edit</Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} onOpenAutoFocus={resetForm}>
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-3 right-3 text-muted-custom hover:text-slate-900"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-muted-custom">Task Title</Label>
            <Input
              className="bg-surface-soft text-slate-900 border-surface-strong"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-custom">Description</Label>
            <Input
              className="bg-surface-soft text-slate-900 border-surface-strong"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label className="text-muted-custom">Assign To</Label>
              <select
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                className="w-full rounded-lg bg-surface-soft border border-surface-strong px-3 py-2 text-slate-900"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={String(u.id)}>{u.fullName}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-custom">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg bg-surface-soft border border-surface-strong px-3 py-2 text-slate-900"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-custom">Due Date</Label>
              <Input
                type="date"
                value={dueDate || ""}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-surface-soft text-slate-900 border-surface-strong"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-sm text-red-500">{errorMsg}</div>
          )}

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>

      </DialogContent>
    </Dialog>
  );
}

export default EditTaskDialog;
