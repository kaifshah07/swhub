import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { ensureInitialAdmin } from "./modules/admin/admin.bootstrap";

const startServer = async () => {
  await connectDatabase();
  await ensureInitialAdmin();

  app.listen(env.PORT, () => {
    console.log(`
====================================
🚀 Balmitra Backend Started
🌐 Port : ${env.PORT}
🌍 Mode : ${env.NODE_ENV}
====================================
`);
  });
};

startServer();
