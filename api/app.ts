import express, { json } from "express";
import register from "./routes/register";

const app = express();

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  app.use(register);

  return app;
};

export default routes;
