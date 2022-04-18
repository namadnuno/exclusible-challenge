import app from "../../app";
import request from "supertest";

const api = request(app());

export default api;
