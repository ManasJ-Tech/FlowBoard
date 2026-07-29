import axios from "axios";

const API = "http://localhost:8080/api/dashboard";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getDashboard() {
  const response = await axios.get(API, getHeaders());
  return response.data;
}
