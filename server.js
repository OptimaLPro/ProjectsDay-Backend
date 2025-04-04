import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { dbConnection } from "./connection/dbConnect.js";
import userRouter from "./routes/auth.js";
import projectRouter from "./routes/projects.js";
import internshipRouter from "./routes/internships.js";
import instructorRouter from "./routes/instructors.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/projects", projectRouter);
app.use("/api/internships", internshipRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

dbConnection(app, PORT);
