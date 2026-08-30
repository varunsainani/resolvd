import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "./config";

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: string, role: string): string {
  return jwt.sign({ sub: userId, role }, config.jwtSecret, {
    expiresIn: `${config.jwtExpireDays}d`,
  });
}
