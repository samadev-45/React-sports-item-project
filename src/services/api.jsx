import axios from "axios";

const api = axios.create({
  baseURL: "https://sports-project-databases.onrender.com/",
});

export default api;