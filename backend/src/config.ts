import dotenv from "dotenv";

dotenv.config();

export const config = {
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-insecure-change-me",
  jwtExpireDays: Number(process.env.JWT_EXPIRE_DAYS || 7),
  appUrl: process.env.APP_URL || "http://localhost:3000",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  port: Number(process.env.PORT || 8000),
};
