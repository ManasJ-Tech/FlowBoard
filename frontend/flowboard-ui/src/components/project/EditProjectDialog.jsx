import { useState } from "react";
import { updateProject } from "@/services/projectService";

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


function EditProjectDialog({ project, onUpdated }) {

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const [open, setOpen] = useState(false);



  async function handleUpdate(e) {

    e.preventDefault();

    try {

      await updateProject(
        project.id,
        {
          name,
          description
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


      <DialogTrigger
        className="
        rounded-lg
        bg-blue-600
        px-5
        py-2
        text-white
        hover:bg-blue-700
        transition
        "
      >
        Edit Project
      </DialogTrigger>



      <DialogContent>


        <DialogHeader>

          <DialogTitle>
            Edit Project
          </DialogTitle>

        </DialogHeader>




        <form
          onSubmit={handleUpdate}
          className="space-y-5"
        >



          <div className="space-y-2">

            <Label>
              Project Name
            </Label>


            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          </div>





          <div className="space-y-2">

            <Label>
              Description
            </Label>


            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

          </div>





          <Button
            type="submit"
            className="w-full"
          >
            Save Changes
          </Button>




        </form>



      </DialogContent>



    </Dialog>

  );

}


export default EditProjectDialog;