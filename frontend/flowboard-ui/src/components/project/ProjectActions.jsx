import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { deleteProject } from "@/services/projectService";


function ProjectActions({ id }) {

    const navigate = useNavigate();


    async function handleDelete() {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );


        if (!confirmDelete) {
            return;
        }


        try {

            await deleteProject(id);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

        }

    }


    return (
        <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={16} />
            <span className="ml-2">Delete</span>
        </Button>
    );
}


export default ProjectActions;