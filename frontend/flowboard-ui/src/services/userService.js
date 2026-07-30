import axios from "axios";


const API = "http://localhost:8080/api/users";


function getHeaders(){

    return {
        headers:{
            Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
    };

}



export async function getUsers(){

    const response = await axios.get(
        API,
        getHeaders()
    );


    return response.data;

}

export async function getTeamMembers() {
    const response = await axios.get(
        `${API}/team`,
        getHeaders()
    );

    return response.data;
}

export async function getCurrentUser() {
    const response = await axios.get(
        `${API}/me`,
        getHeaders()
    );

    return response.data;

}

export async function getUserById(id) {
    const response = await axios.get(`${API}/${id}`, getHeaders());
    return response.data;
}