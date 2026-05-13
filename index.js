import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import todoRouter from "./routers/todo-router.js";
import usersRouter from "./routers/users-router.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", usersRouter);

app.listen(PORT, async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("App is running on http://localhost:" + PORT);
});
