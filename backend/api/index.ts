import { createApp } from "../src/app";

// Vercel serverless entrypoint. The Express app is exported as the handler so
// every request under the project routes into it (see vercel.json).
const app = createApp();

export default app;
