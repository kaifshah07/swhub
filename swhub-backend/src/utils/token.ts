import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

const secret: Secret = env.JWT_SECRET;

const options: SignOptions = {
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};

export const createToken = (payload: object): string => {
  return jwt.sign(payload, secret, options);
};