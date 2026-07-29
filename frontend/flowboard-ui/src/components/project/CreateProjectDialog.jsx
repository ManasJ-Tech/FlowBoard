import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ProjectForm from "./ProjectForm";

import { createProject } from "@/services/projectService";


function CreateProjectDialog({ onProjectCreated }) {

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);



  async function handleCreate(project) {

    try {

      setLoading(true);


      const created = await createProject(project);

      // notify parent and any other listeners
      try {
        window.dispatchEvent(new CustomEvent("project:created", { detail: created }));
      } catch (e) {
        // older browsers may not support CustomEvent
        const evt = document.createEvent("CustomEvent");
        evt.initCustomEvent("project:created", true, true, created);
        window.dispatchEvent(evt);
      }

      if (onProjectCreated) onProjectCreated();

      setOpen(false);


    } 
    catch(error) {

      console.error(error);

    } 
    finally {

      setLoading(false);

    }

  }




  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >


      <DialogTrigger asChild>
        <Button variant="default" size="md">Create Project</Button>
      </DialogTrigger>



      <DialogContent className="border-surface-strong bg-surface text-slate-900">


        <DialogHeader>

          <DialogTitle>
            Create Project
          </DialogTitle>

        </DialogHeader>



        <ProjectForm

          onSubmit={handleCreate}

          loading={loading}

        />


      </DialogContent>


    </Dialog>

  );

}


export default CreateProjectDialog;