import express from "express";
import User, {
  createUser,
  publicUser,
  PublicUserInstance,
} from "../models/user";
import { body, validationResult } from "express-validator";

const app = express();

export interface UsersCreateResponse {
  user: PublicUserInstance;
}

app.post(
  "/users",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await createUser(req.body);

    res.status(201);
    res.send({
      user,
    });
  }
);

app.put(
  "/users/:id",
  body("name").isLength({ min: 3 }),
  body("email").isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (!req.params || !req.params.id) {
      return res.status(403).send("Invalid URL");
    }

    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).send("Not Found.");
    }

    user.update({
      name: req.body.name,
      email: req.body.email,
    });

    res.status(200);

    res.send({
      user: publicUser(user),
    });
  }
);

app.get("/users", async (_req, res) => {
  res.send({ users: await User.findAll() });
});

app.get("/users/:id", async (req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(403).send("Invalid URL");
  }

  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).send("Not Found.");
  }

  res.send({ user });
});

app.delete("/users/:id", async (req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(403).send("Invalid URL");
  }

  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res.status(404).send("Not Found.");
  }

  user.destroy();

  res.status(204);
  res.send({ message: "Deleted" });
});

export default app;
