import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import cors from "cors";

import todoRouter from "./routers/todo-router.js";
import usersRouter from "./routers/users-router.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/todos", todoRouter);
app.use("/api/auth", usersRouter);

app.listen(5000, () => {
  console.log("App is running on http://localhost:5000");
});
