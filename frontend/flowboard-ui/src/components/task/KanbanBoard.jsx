import { useCallback, useEffect, useState } from "react";

import {
    DndContext,
    DragOverlay,
    closestCorners
} from "@dnd-kit/core";

import { getCurrentUser } from "@/services/userService";

import TaskColumn from "./TaskColumn";

import {
    getTasksByProject,
    updateTaskStatus
} from "@/services/taskService";

import {
    connectSocket,
    disconnectSocket
} from "@/services/socketService";



function KanbanBoard({ projectId }) {


    const [tasks, setTasks] = useState([]);

    const [activeTask, setActiveTask] = useState(null);
    const [isManager, setIsManager] = useState(false);





    const loadTasks = useCallback(async () => {
        try {
            const data = await getTasksByProject(projectId);
            console.log("Kanban Tasks:", data);
            setTasks(data);
        } catch (error) {
            console.error(error);
        }
    }, [projectId]);








    useEffect(() => {
        void Promise.resolve().then(loadTasks);

        connectSocket(() => {
            console.log("Task update received");
            void Promise.resolve().then(loadTasks);
        });

        return () => {
            disconnectSocket();
        };
    }, [projectId, loadTasks]);

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getCurrentUser();
                setIsManager(currentUser?.role === "PROJECT_MANAGER");
            } catch (error) {
                console.error(error);
            }
        }

        loadUser();
    }, []);









    function handleDragStart(event) {


        const task = tasks.find(

            t => String(t.id) === String(event.active.id)

        );


        setActiveTask(task);


    }









    async function handleDragEnd(event) {


        setActiveTask(null);



        const {
            active,
            over

        } = event;





        if(!over) {

            return;

        }






        const taskId = Number(active.id);


        const newStatus = over.id;







        const task = tasks.find(

            t => t.id === taskId

        );







        if(!task) {

            return;

        }







        if(task.status === newStatus) {

            return;

        }







        try {


            await updateTaskStatus(

                taskId,

                newStatus

            );



            await loadTasks();



        }
        catch(error) {


            console.error(
                "Status update failed:",
                error
            );


        }


    }









    const todoTasks = tasks.filter(

        task => task.status === "TODO"

    );



    const progressTasks = tasks.filter(

        task => task.status === "IN_PROGRESS"

    );



    const doneTasks = tasks.filter(

        task => task.status === "DONE"

    );









    return (



        <DndContext


            collisionDetection={closestCorners}


            onDragStart={handleDragStart}


            onDragEnd={handleDragEnd}



        >





            <div

                className="
                mt-10
                flex
                gap-6
                "

            >





                <TaskColumn

                    id="TODO"

                    title="To Do"

                    tasks={todoTasks}

                    projectId={projectId}

                    onTaskCreated={loadTasks}

                    canCreateTask={isManager}

                />







                <TaskColumn

                    id="IN_PROGRESS"

                    title="In Progress"

                    tasks={progressTasks}

                    projectId={projectId}

                    onTaskCreated={loadTasks}

                />







                <TaskColumn

                    id="DONE"

                    title="Done"

                    tasks={doneTasks}

                    projectId={projectId}

                    onTaskCreated={loadTasks}

                />






            </div>








            <DragOverlay>


                {
                    activeTask && (


                        <div

                            className="
                            rounded-xl
                            border
                            border-blue-500
                            bg-surface
                            p-5
                            text-slate-900
                            shadow-xl
                            "

                        >

                            {activeTask.title}


                        </div>


                    )
                }



            </DragOverlay>





        </DndContext>


    );

}



export default KanbanBoard;