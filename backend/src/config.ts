import dotenv from "dotenv";

dotenv.config();

export const config = {
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "dev-insecure-change-me",
  jwtExpireDays: Number(process.env.JWT_EXPIRE_DAYS || 7),
  appUrl: process.env.APP_URL || "http://localhost:3000",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  llmProvider: (process.env.LLM_PROVIDER || "groq").toLowerCase(),
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-flash-latest",
  demoEmail: process.env.DEMO_EMAIL || "demo@resolvd.app",
  demoPassword: process.env.DEMO_PASSWORD || "demo1234",
  adminEmail: process.env.ADMIN_EMAIL || "admin@resolvd.app",
  dailySuggestLimit: Number(process.env.DAILY_SUGGEST_LIMIT || 80),
  port: Number(process.env.PORT || 8000),
};
