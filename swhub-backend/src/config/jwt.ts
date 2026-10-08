import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "./env";

const secret: Secret = env.JWT_SECRET;

const options: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};