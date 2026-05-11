import express, { Router } from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import { TodoModel } from "../models/todo-model.js";
import { auth } from "../auth-middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await TodoModel.findOne({ userId: req.user.id });
  return res.send(todos);
});

router.post("/", auth, async (req, res) => {
  const body = req.body;
  const name = body.name;
  const newTodo = await TodoModel.create({
    name,
    userId: req.user.id,
  });

  return res.send(newTodo);
});
router.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const todo = TodoModel.findOne({ _id: id, userId: req.user.id });
  if (!todo) {
    return res.status(404).send({ message: "Not found" });
  }
  return res.send(todo);
});
router.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const deletingItem = await TodoModel.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });
  if (!deletingItem) {
    return res.status(404).send({ message: "Not found" });
  }
  return res.send(deletingItem);
});

router.put("/:id", auth, async (req, res) => {
  const id = req.params.id;

  const { name, checked } = req.body;
  if (!name || checked !== undefined) {
    return res
      .status(404)
      .send({ message: "Body must have atleast name or checked" });
  }

  const updatedTodo = await TodoModel.findOneAndUpdate(
    { _id: id, userId: req.user.id },
    {
      ...(name !== undefined && { name }),
      ...(checked !== undefined && { checked }),
    },
    { new: true },
  );
  if (!updatedTodo) {
    return res.status(404).send({ message: "Not found" });
  }

  return res.send(updatedTodo);
});

export default router;
