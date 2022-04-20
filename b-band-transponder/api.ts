import axios from "axios";

const api = axios.create({
  baseURL: "http://api" + process.env.API_PORT,
});

export default api;
