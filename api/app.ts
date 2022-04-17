import express, { json } from "express";
import register from "./routes/register";
import login from "./routes/login";

const app = express();

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  app.use(register);
  app.use(login);

  return app;
};

export default routes;
