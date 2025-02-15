import axios from "axios";

const service = axios.create({
  baseURL: "https://ayna.onrender.com/api/users",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export default service;
