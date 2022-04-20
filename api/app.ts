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
import cors from "cors";

const app = express();

app.use(cors());

app.use(json());

const routes = () => {
  app.get("/", (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."');
  });

  initDocs(app);

  app.use("/register", register);
  app.use("/login", login);
  app.use("/logout", auth, logout);
  app.use("/me", auth, me);
  app.use("/spread", auth, spread);
  app.use("/users", auth, admin, users);

  return app;
};

export default routes;
