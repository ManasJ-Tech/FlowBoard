import { useDraggable } from "@dnd-kit/core";

import EditTaskDialog from "@/components/task/EditTaskDialog";

import { updateTaskStatus } from "@/services/taskService";



function TaskCard({ task, onUpdated }) {



    const {

        attributes,

        listeners,

        setNodeRef,

        transform

    } = useDraggable({

        id: task.id

    });





    const style = transform ? {

        transform:
            `translate3d(${transform.x}px, ${transform.y}px, 0)`

    } : undefined;








    async function changeStatus(e) {


        try {


            await updateTaskStatus(

                task.id,

                e.target.value

            );


            onUpdated();



        }
        catch(error) {


            console.error(error);


        }


    }







    return (


        <div


            ref={setNodeRef}


            style={style}


            {...listeners}


            {...attributes}


            className="
            cursor-grab
            rounded-3xl
            border
            border-surface-strong
            bg-surface-soft
            p-5
            shadow-sm
            active:cursor-grabbing
            "


        >





            <h3

                className="
                text-lg
                font-semibold
                text-slate-900
                "

            >

                {task.title}


            </h3>







            <p

                className="
                mt-2
                text-sm
                text-muted-custom
                "

            >

                {task.description}


            </p>








            <p

                className="
                mt-3
                text-sm
                text-primary
                "

            >

                Assigned:


                <span

                    className="
                    ml-1
                    text-slate-700
                    "

                >

                    {
                        task.assignedUser

                        ?

                        task.assignedUser.fullName

                        :

                        "Unassigned"
                    }


                </span>


            </p>









            <select


                value={task.status}


                onChange={changeStatus}


                className="
                mt-4
                rounded-lg
                bg-surface-soft
                px-3
                py-2
                text-sm
                text-slate-900
                "

                onPointerDown={(e)=>e.stopPropagation()}


            >


                <option value="TODO">
                    To Do
                </option>


                <option value="IN_PROGRESS">
                    In Progress
                </option>


                <option value="DONE">
                    Done
                </option>


            </select>










            <div className="mt-4">


                <EditTaskDialog

                    task={task}

                    onUpdated={onUpdated}

                />


            </div>





        </div>


    );

}



export default TaskCard;