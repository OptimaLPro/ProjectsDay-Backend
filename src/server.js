import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { dbConnection } from "./connection/dbConnect.js";
import userRouter from "./routes/users.js";
import projectRouter from "./routes/projects.js";
import internshipRouter from "./routes/internships.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/internships", internshipRouter);

const PORT = process.env.PORT || 5000;

dbConnection(app, PORT);
