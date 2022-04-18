import express from "express";
import User from "../models/user";

const verifyAdminAccess = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.user) {
    res.status(403);
    return res.send("Can't perform this action.");
  }

  const user = await User.findOne({
    where: { id: req.user.user_id },
  });

  if (!user || !user.is_admin) {
    res.status(403);
    return res.send("Can't perform this action.");
  }

  return next();
};

export default verifyAdminAccess;
