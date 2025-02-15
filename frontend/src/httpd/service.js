import axios from "axios";

const service = axios.create({
  baseURL: "http://localhost:5000/api/users",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

export default service;
