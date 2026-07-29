import axios from "axios";

const API = "http://localhost:8080/api/projects";

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

function sortProjectsByRecent(projects) {
  return [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function getProjects() {
  const response = await axios.get(API, getHeaders());

  return sortProjectsByRecent(response.data);
}

export async function getProjectById(id) {

    const response = await axios.get(
        `http://localhost:8080/api/projects/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
}

export async function updateProject(id, projectData) {

    const response = await axios.put(
        `http://localhost:8080/api/projects/${id}`,
        projectData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
}



export async function deleteProject(id) {

    const response = await axios.delete(
        `http://localhost:8080/api/projects/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );

    return response.data;
}

export async function createProject(project) {
  const response = await axios.post(
    API,
    project,
    getHeaders()
  );

  return response.data;
}