import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// import testCloudinaryRoute from "/cloudinary-test"
import routes from "./routes";
import path from "path";
import { env } from "./config/env";

const app = express();

// Security
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "https://balmitra-final.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("Blocked Origin:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },
    credentials: true,
  })
);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Compression
app.use(compression());

// Logger
app.use(morgan("dev"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Balmitra Backend API is Running 🚀",
  });
});

// app.use("/test-cloudinary", testCloudinaryRoute);

// API Routes
app.use("/api", routes);
app.use("/uploads",express.static(path.join(process.cwd(),"uploads")));
export default app;
