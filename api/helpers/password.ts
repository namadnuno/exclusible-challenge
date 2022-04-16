import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const isValidPassword = (
  passedPassword: string,
  hashedPassword: string
) => bcrypt.compareSync(passedPassword, hashedPassword);
