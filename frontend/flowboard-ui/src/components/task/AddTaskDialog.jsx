import { useEffect, useState } from "react";

import { createTask } from "@/services/taskService";
import { getTeamMembers } from "@/services/userService";

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


function AddTaskDialog({ projectId, onCreated }) {


    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [assignedUserId, setAssignedUserId] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [users, setUsers] = useState([]);



    useEffect(() => {

        async function loadUsers(){

            try{

                const data = await getTeamMembers();

                setUsers(data);

            }
            catch(error){

                console.error(error);

            }

        }


        loadUsers();


    }, []);





    async function handleSubmit(e){

        e.preventDefault();


        try{


            await createTask({

                title,

                description,

                projectId,

                assignedUserId:
                    assignedUserId
                    ? Number(assignedUserId)
                    : null
                    ,
                    dueDate: dueDate || null

            });



            setTitle("");

            setDescription("");

            setAssignedUserId("");
            setDueDate("");

            setOpen(false);


            onCreated();


        }
        catch(error){

            console.error(error);

        }

    }



    return (

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >



            <DialogTrigger asChild>
                <Button variant="default" size="sm">Add Task</Button>
            </DialogTrigger>





            <DialogContent>


                <DialogHeader>

                    <DialogTitle>
                        Create Task
                    </DialogTitle>

                </DialogHeader>





                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >





                    <div className="space-y-2">


                        <Label className="text-muted-custom">

                            Task Title

                        </Label>



                        <Input

                            value={title}

                            onChange={(e)=>
                                setTitle(e.target.value)
                            }

                            className="
                            bg-surface-soft
                            text-slate-900
                            border-surface-strong
                            "

                        />


                    </div>






                    <div className="space-y-2">


                        <Label className="text-muted-custom">

                            Description

                        </Label>



                        <Input

                            value={description}

                            onChange={(e)=>
                                setDescription(e.target.value)
                            }

                            className="
                            bg-surface-soft
                            text-slate-900
                            border-surface-strong
                            "

                        />


                    </div>






                    <div className="space-y-2">


                    <Label className="text-muted-custom">

                            Assign User

                        </Label>




                        <select


                            value={assignedUserId}

                            onChange={(e)=>
                                setAssignedUserId(e.target.value)
                            }


                            className="
                            w-full
                            rounded-lg
                            bg-surface-soft
                            border
                            border-surface-strong
                            px-3
                            py-2
                            text-slate-900
                            "

                        >



                            <option value="">

                                Select User

                            </option>




                            {
                                users.map((user)=>(

                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >

                                        {user.fullName}

                                    </option>

                                ))
                            }



                        </select>



                    </div>






                    <div className="space-y-2">
                        <Label className="text-muted-custom">Due Date</Label>
                        <Input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-surface-soft text-slate-900 border-surface-strong"
                        />
                    </div>

                    <Button type="submit" className="w-full">Create Task</Button>





                </form>


            </DialogContent>



        </Dialog>

    );

}


export default AddTaskDialog;