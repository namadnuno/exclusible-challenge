import express, { json } from "express";
import register from "./routes/register";
import login from "./routes/login";
import logout from "./routes/logout";
import auth from "./middleware/auth";
import users from "./routes/users";
import admin from "./middleware/admin";
import spread from "./routes/spread";
import initDocs from "./docs/init";
import me from "./routes/me";

const app = express();

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  initDocs(app);

  app.use(register);
  app.use(login);
  app.use(auth, logout);
  app.use(auth, me);
  app.use("/spread", auth, spread);
  app.use(auth, admin, users);

  return app;
};

export default routes;
