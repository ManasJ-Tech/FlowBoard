import { useDroppable } from "@dnd-kit/core";

import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";



function TaskColumn({

    id,

    title,

    tasks,

    projectId,

    onTaskCreated,

    canCreateTask = false

}) {



    const {
        setNodeRef

    } = useDroppable({

        id

    });





    return (


        <div

            ref={setNodeRef}

            className="
            flex-1
            min-h-[500px]
            rounded-2xl
            border
            border-surface-strong
            bg-surface-soft
            p-5
            "

        >





            <div

                className="
                mb-6
                flex
                items-center
                justify-between
                "

            >



                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-muted-custom">
                        {tasks.length} Tasks
                    </p>
                </div>








                {
                    title === "To Do" && canCreateTask && (

                        <AddTaskDialog

                            projectId={projectId}

                            onCreated={onTaskCreated}

                        />

                    )
                }



            </div>









            <div

                className="
                space-y-4
                min-h-[350px]
                "

            >





                {
                    tasks.map((task)=>(


                        <TaskCard

                            key={task.id}

                            task={task}

                            onUpdated={onTaskCreated}

                        />


                    ))
                }









                {
                    tasks.length === 0 && (


                        <div

                            className="
                            flex
                            h-32
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-dashed
                            border-surface-strong
                            "

                        >



                            <p

                                className="
                                text-sm
                                text-muted-custom
                                "

                            >

                                No tasks yet

                            </p>



                        </div>


                    )

                }




            </div>





        </div>


    );

}



export default TaskColumn;