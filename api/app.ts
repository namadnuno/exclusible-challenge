import express, { json } from "express";
import register from "./routes/register";
import login from "./routes/login";
import logout from "./routes/logout";
import auth from "./middleware/auth";

const app = express();

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  app.use(register);
  app.use(login);
  app.use(auth, logout);

  return app;
};

export default routes;
