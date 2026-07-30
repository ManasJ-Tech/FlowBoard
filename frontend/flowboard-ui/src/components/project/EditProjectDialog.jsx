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


      <DialogTrigger asChild>
        <Button variant="default" size="sm">Edit</Button>
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