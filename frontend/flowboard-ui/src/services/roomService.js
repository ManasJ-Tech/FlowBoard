import axios from "axios";

const API_BASE = "http://localhost:8080/api/projects";

function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getRoomMessages(projectId) {
  const res = await axios.get(`${API_BASE}/${projectId}/room/messages`, getHeaders());
  return res.data;
}

export async function postRoomMessage(projectId, payload) {
  const res = await axios.post(`${API_BASE}/${projectId}/room/messages`, payload, getHeaders());
  return res.data;
}
