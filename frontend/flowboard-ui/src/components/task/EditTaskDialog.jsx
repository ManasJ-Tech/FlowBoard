import { useState } from "react";
import { updateTask } from "@/services/taskService";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


function EditTaskDialog({ task, onUpdated }) {


  const [open, setOpen] = useState(false);


  const [title, setTitle] = useState(task.title);

  const [description, setDescription] = useState(
    task.description || ""
  );



  async function handleUpdate(e) {

    e.preventDefault();


    try {


      await updateTask(
        task.id,
        {
          title,
          description,
          projectId: task.project.id,
          assignedUserId:
            task.assignedUser?.id || null
        }
      );


      setOpen(false);

      onUpdated();


    } catch(error) {

      console.error(error);

    }

  }



  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >


      <DialogTrigger asChild>

        <button

          className="
          bg-blue-600
          text-white
          hover:bg-blue-700
          "

        >

          Edit Task

        </button>

      </DialogTrigger>



      <DialogContent>


        <DialogHeader>

          <DialogTitle>
            Edit Task
          </DialogTitle>

        </DialogHeader>



        <form

          onSubmit={handleUpdate}

          className="space-y-5"

        >



          <div className="space-y-2">

            <Label className="text-muted-custom">
              Task Title
            </Label>


            <Input

              className="bg-surface-soft text-slate-900 border-surface-strong"

              value={title}

              onChange={(e)=>
                setTitle(e.target.value)
              }

            />

          </div>




          <div className="space-y-2">

            <Label className="text-muted-custom">
              Description
            </Label>


            <Input

              className="bg-surface-soft text-slate-900 border-surface-strong"

              value={description}

              onChange={(e)=>
                setDescription(e.target.value)
              }

            />

          </div>




          <Button

            type="submit"

            className="
            w-full
            bg-blue-600
            text-white
            hover:bg-blue-700
            "

          >

            Save Changes

          </Button>



        </form>


      </DialogContent>


    </Dialog>

  );

}


export default EditTaskDialog;