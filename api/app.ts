import express, { json } from "express";
import register from "./routes/register";
import login from "./routes/login";
import logout from "./routes/logout";
import auth from "./middleware/auth";
import users from "./routes/users";
import admin from "./middleware/admin";

const app = express();

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  app.use(register);
  app.use(login);
  app.use(auth, logout);
  app.use(auth, admin, users);

  return app;
};

export default routes;
