import axios from "axios";


const API = "http://localhost:8080/api/tasks";


function getHeaders() {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

}



// Get tasks of a project

export async function getTasksByProject(projectId) {

    const response = await axios.get(
        `${API}/project/${projectId}`,
        getHeaders()
    );

    return response.data;

}



// Create task

export async function createTask(taskData) {

    const response = await axios.post(
        API,
        taskData,
        getHeaders()
    );

    return response.data;

}



// Update task status

export async function updateTaskStatus(id, status) {

    const response = await axios.put(
        `${API}/${id}/status`,
        {
            status: status
        },
        getHeaders()
    );

    return response.data;

}



// Update task

export async function updateTask(id, taskData) {

    const response = await axios.put(
        `${API}/${id}`,
        taskData,
        getHeaders()
    );

    return response.data;

}