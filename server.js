require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { logger } = require("./src/config/logger");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await connectDB();
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });

    process.on("SIGINT", () => {
      logger.info("Received SIGINT, shutting down...");
      server.close(() => process.exit(0));
    });
  } catch (err) {
    logger.error("Failed to start server", { error: err?.message });
    process.exit(1);
  }
})();
