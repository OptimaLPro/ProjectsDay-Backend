import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { dbConnection } from "./connection/dbConnect.js";
import authRoutes from "./routes/auth.js";
import instructorRouter from "./routes/instructors.js";
import internshipRouter from "./routes/internships.js";
import projectRouter from "./routes/projects.js";
import yearbookRouter from "./routes/yearbooks.js";
import awardRouter from "./routes/awards.js";
import homepageRouter from "./routes/homepage.js";
import { setupSwagger } from "./swagger.js";

const app = express();

const allowedOrigins = [
  "https://graduationday.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

app.get("/hello", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/projects", projectRouter);
app.use("/api/internships", internshipRouter);
app.use("/api/instructors", instructorRouter);
app.use("/api/auth", authRoutes);
app.use("/api/yearbooks", yearbookRouter);
app.use("/api/awards", awardRouter);
app.use("/api/homepage", homepageRouter);

const PORT = process.env.PORT || 5000;

dbConnection(app, PORT);
