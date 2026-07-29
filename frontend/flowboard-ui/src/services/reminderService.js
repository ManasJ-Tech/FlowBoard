import axios from "axios";

const API = "http://localhost:8080/api/reminders";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function createReminder(reminder) {
  const response = await axios.post(API, reminder, getHeaders());
  return response.data;
}

export async function getReminders() {
  const response = await axios.get(API, getHeaders());
  return response.data;
}
