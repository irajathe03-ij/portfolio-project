import axios from "axios";

const api = axios.create({
    baseURL:  "https://portfolio-project-o6nm.onrender.com/api",
});

export default api;