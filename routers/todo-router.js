import express, { Router } from "express";
import fs from "fs";
import { nanoid } from "nanoid";

const router = express.Router();

const todoData = fs.readFileSync("./data.json", "utf-8");

let todos = JSON.parse(todoData);

const todoUpdateDataFile = () => {
  fs.writeFileSync("./data.json", JSON.stringify(todos), "utf-8");
};

router.get("/", (req, res) => {
  return res.send(todos);
});

router.post("/", (req, res) => {
  const body = req.body;
  const name = body.name;
  const newTodo = {
    id: nanoid(),
    name: name,
    checked: false,
  };

  todos.push(newTodo);
  todoUpdateDataFile();
  return res.send(newTodo);
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((todo) => todo.id == id);
  if (!todo) {
    return res.status(404).send({ message: "Not found" });
  }
  todoUpdateDataFile();
  return res.send(todo);
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const deletingItem = todos.find((todo) => todo.id == id);
  if (!deletingItem) {
    return res.status(404).send({ message: "Not found" });
  }
  todos = todos.filter((todo) => todo.id != id);
  todoUpdateDataFile();
  return res.send(deletingItem);
});

router.put("/:id", (req, res) => {
  const id = req.params.id;

  const updatingItem = todos.find((todo) => todo.id == id);
  if (!updatingItem) {
    return res.status(404).send({ message: "Not found" });
  }
  const { name, checked } = req.body;
  if (!name || checked !== undefined) {
    return res
      .status(404)
      .send({ message: "Body must have atleast name or checked" });
  }
  const updatedTodo = {
    ...updatingItem,
    ...(name && { name }),
    ...(checked !== undefined && { checked }),
  };
  todos = todos.map((todo) => {
    if (todo.id == id) {
      return updatedTodo;
    }
    return todo;
  });
  todoUpdateDataFile();
  return res.send(updatedTodo);
});

// app.put("/:id", (req, res) => {
//   const id = req.params.id;
// });
export default router;
