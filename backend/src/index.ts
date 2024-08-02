import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import discussionRoutes from "./routes/discussions";
import cookieParser from "cookie-parser";
const app = express();

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => {
    console.log("Mongo Connection Successful");
  })
  .catch(() => {
    "Mongo Connection Issues";
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/discussions", discussionRoutes);
app.listen(4000, () => {
  console.log("Port 4000 Activated!");
});
