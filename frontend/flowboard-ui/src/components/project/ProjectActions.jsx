import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

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

        } catch(error) {

            console.error(error);

        }

    }



    return (

        <button
            onClick={handleDelete}
            className="
            flex items-center gap-2
            rounded-lg
            bg-red-600
            px-5
            py-2
            text-white
            hover:bg-red-700
            transition
            "
        >

            <Trash2 size={18}/>

            Delete Project

        </button>

    );
}


export default ProjectActions;